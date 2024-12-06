/**
 * @import { AST } from "svelte/compiler";
 *
 * @import { Source } from "./util.js";
 */

import { parse } from "svelte/compiler";

export class Parser {
	/** @type {AST.Root} */
	ast;
	/**
	 * Root comment with `@component` tag.
	 * @type {AST.Comment | undefined}
	 */
	componentComment;
	/** @type {boolean} */
	is_lang_typescript;
	/** @type {boolean} */
	has_legacy_syntax;

	/** @param {Source} source */
	constructor(source) {
		this.ast = this.#parse_code(source);
		this.componentComment = this.#extract_description();
		this.is_lang_typescript = this.#read_script_instance_lang_attribute();
		this.has_legacy_syntax = this.#determine_legacy_syntax();
	}

	/**
	 * @param {Source} code
	 * @returns {AST.Root}
	 */
	#parse_code(code) {
		return parse(code, { modern: true });
	}

	/** @returns {AST.Comment | undefined} */
	#extract_description() {
		const regex = /^\s*@component/;
		for (const node of this.ast.fragment.nodes) {
			if (node.type === "Comment" && regex.test(node.data)) return node;
		}
	}

	/** @returns {boolean} */
	#read_script_instance_lang_attribute() {
		const lang = this.ast.instance?.attributes.find((a) => a.name === "lang");
		if (lang?.type === "Attribute" && Array.isArray(lang.value) && lang.value[0].type === "Text") {
			return lang.value[0].data === "ts" || lang.value[0].data === "typescript";
		}
		return false;
	}

	/** @returns {boolean} */
	#determine_legacy_syntax() {
		for (const statement of this.ast.instance?.content.body ?? []) {
			if (
				statement.type === "ExportNamedDeclaration" &&
				statement.declaration?.type === "VariableDeclaration" &&
				statement.declaration.kind === "let"
			) {
				return true;
			}
			if (
				statement.type === "LabeledStatement" &&
				statement.label.type === "Identifier" &&
				statement.label.name === "$"
			) {
				return true;
			}
		}
		for (const node of this.ast.fragment.nodes) {
			if (
				node.type === "SlotElement" ||
				node.type === "SvelteComponent" ||
				node.type === "SvelteFragment" ||
				node.type === "SvelteSelf"
			) {
				return true;
			}
		}
		return false;
	}
}
