/**
 * @import { AST } from "svelte/compiler";
 */

/**
 * @typedef Tag
 * @prop {string} name
 * @prop {string} content
 */

export class ComponentDocExtractor {
	/** @type {AST.Comment} */
	node;
	/** @type {string | undefined} */
	description;
	/** @type {Tag[] | undefined} */
	tags;

	/** @param {AST.Comment} comment */
	constructor(comment) {
		this.node = comment;
		this.#parse();
	}

	/** @type {RegExp} */
	#regex = /(@)(\w+)(\s+(.*)?)?/s;
	/** @type {string | undefined} */
	#latest_tag;
	/** @type {string[]} */
	#latest_tag_content = [];

	#parse() {
		const [_, _at, tag, content] = this.#regex.exec(this.node.data) ?? [];
		this.#latest_tag = tag;
		for (const line of content.split("\n")) this.#parse_line(line);
		this.#wrap_latest_tag();
	}

	/** @param {string} line */
	#parse_line(line) {
		const trimmed = line.trim();
		if (trimmed.startsWith("@")) {
			this.#wrap_latest_tag();
			const [_, _at, tag, content] = this.#regex.exec(trimmed) ?? [];
			this.#latest_tag = tag;
			this.#latest_tag_content.push(content);
			// for (const line of content.split("\n")) this.#parse_line(line);
		} else this.#latest_tag_content.push(trimmed);
	}

	#wrap_latest_tag() {
		const content = this.#latest_tag_content.join("\n").trim();
		if (this.#latest_tag === "component") this.description = content;
		else if (this.#latest_tag) {
			if (!this.tags) this.tags = [];
			this.tags.push({ name: this.#latest_tag, content });
		}
		this.#latest_tag = undefined;
		this.#latest_tag_content = [];
	}
}
