/**
 * @import { AST } from "svelte/compiler";
 *
 * @import { Options, SvelteFilepath } from "./util.js";
 */

import path from "node:path";

import ts from "typescript";

import { Extractor } from "./extractor.js";

export class Analyzer {
	/** @type {Extractor} */
	#extractor;

	/**
	 * @param {SvelteFilepath} filepath
	 * @param {Partial<Options>} options
	 */
	constructor(filepath, options) {
		this.#extractor = new Extractor(filepath, options);
	}

	build() {
		let documentation;
		const comment = this.#extractor.parser.documentation_comment;
		if (comment) documentation = new DocumentationAnalysis(comment).build();
		/** @type {Map<string, ReturnType<PropAnalysis['build']>>} */
		// biome-ignore lint/style/useConst: Readability: mutation
		let props = new Map();
		for (const [name, data] of this.#extractor.props) {
			props.set(name, new PropAnalysis(this.#extractor, data.symbol, data.type).build());
		}
		return {
			filepath: this.#extractor.filepath,
			documentation,
			props,
		};
	}
}

/**
 * @typedef DocumentationTag
 * @prop {string} name
 * @prop {string} description
 */

class DocumentationAnalysis {
	/** @type {AST.Comment} */
	node;
	/** @type {string | undefined} */
	description;
	/** @type {DocumentationTag[]} */
	tags = [];

	/** @type {string | undefined} */
	#latest_tag;
	/** @type {string[]} */
	#latest_tag_content = [];

	/** @param {AST.Comment} comment */
	constructor(comment) {
		this.node = comment;
		this.#parse();
	}

	#regex = /(@\w+)\s+(.*)?/s;

	#parse() {
		const [_, tag, content] = this.#regex.exec(this.node.data) ?? [];
		this.#latest_tag = tag;
		for (const line of content.split("\n")) this.#parse_line(line);
		this.#wrap_latest_tag();
	}

	/** @param {string} line */
	#parse_line(line) {
		const trimmed = line.trim();
		if (trimmed.startsWith("@")) {
			this.#wrap_latest_tag();
			const [_, tag, content] = this.#regex.exec(trimmed) ?? [];
			this.#latest_tag = tag;
			for (const line of content.split("\n")) this.#parse_line(line);
		} else this.#latest_tag_content.push(trimmed);
	}

	#wrap_latest_tag() {
		const description = this.#latest_tag_content.join("\n").trim();
		if (this.#latest_tag === "@component") this.description = description;
		else if (this.#latest_tag) this.tags.push({ name: this.#latest_tag, description });
		this.#latest_tag = undefined;
		this.#latest_tag_content = [];
	}

	build() {
		return {
			description: this.description,
			tags: this.tags,
		};
	}
}

class PropAnalysis {
	/** @type {Extractor} */
	#extractor;
	/** @type {ts.Symbol} */
	symbol;
	/** @type {ts.Type} */
	type;

	/**
	 * @param {Extractor} extractor
	 * @param {ts.Symbol} symbol
	 * @param {ts.Type} type
	 * */
	constructor(extractor, symbol, type) {
		this.#extractor = extractor;
		this.symbol = symbol;
		this.type = type;
	}

	/** @returns {string | undefined} */
	get alias() {
		return this.type.getSymbol()?.name;
	}

	/** @returns {ts.Declaration} */
	get declaration() {
		const declaration = this.type.getSymbol()?.getDeclarations()?.[0] || this.symbol.getDeclarations()?.[0];
		if (!declaration) throw new Error("Declaration not found");
		return declaration;
	}

	/** @returns {ts.SourceFile} */
	get source() {
		return this.declaration.getSourceFile();
	}

	/** @returns {boolean} */
	get isOptional() {
		return (this.symbol.getFlags() & ts.SymbolFlags.Optional) !== 0;
	}

	/**
	 * @returns {string | undefined}
	 */
	get default() {
		if (!this.isOptional) return undefined;
		const from_props = this.#extractor.props_defaults.get(this.symbol.name);
		if (from_props) return from_props;
		return this.symbol.getJsDocTags().find((tag) => tag.name === "default")?.text?.[0].text;
	}

	/** @returns {boolean} */
	get isBindable() {
		return this.#extractor.bindings.has(this.symbol.name) || this.symbol.name.startsWith("bind:");
	}

	/** @returns {boolean} */
	get isFromSvelte() {
		const { dir } = path.parse(this.source.fileName);
		return dir.endsWith("/node_modules/svelte");
	}

	/** @returns {boolean} */
	get isSnippet() {
		return this.alias === "Snippet" && this.isFromSvelte;
	}

	build() {
		const {
			//
			alias,
			isOptional,
			default: default_,
			isBindable,
			isFromSvelte,
			isSnippet,
			source,
			declaration,
			type,
			symbol,
		} = this;
		return /** @type {const} */ ({
			alias,
			isOptional,
			default: default_,
			isBindable,
			isFromSvelte,
			isSnippet,
			source,
			declaration,
			type,
			symbol,
		});
	}

	/** @returns {string} */
	toString() {
		return this.#extractor.checker.typeToString(this.type);
	}
}
