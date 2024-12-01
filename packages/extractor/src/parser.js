/**
 * @import { AST } from "svelte/compiler";
 *
 * @import { SvelteFilepath } from "./util.js";
 */

import fs from "node:fs";

import { parse } from "svelte/compiler";

export class Parser {
	/** @type {string} */
	code;
	/** @type {AST.Root} */
	ast;
	/** @type {AST.Comment | undefined} */
	documentation_comment;
	/** @type {boolean} */
	is_lang_typescript;
	/** @type {boolean} */
	has_legacy_syntax;

	/** @param {SvelteFilepath} filepath */
	constructor(filepath) {
		this.code = this.#read_file(filepath);
		this.ast = this.#parse_code();
		this.documentation_comment = this.#extract_description();
		this.is_lang_typescript = this.#read_script_instance_lang_attribute();
		this.has_legacy_syntax = this.#determine_legacy_syntax();
	}

	/**
	 * @param {SvelteFilepath} filepath
	 * @returns {string}
	 */
	#read_file(filepath) {
		return fs.readFileSync(filepath, "utf-8");
	}

	/** @returns {AST.Root} */
	#parse_code() {
		return parse(this.code, { modern: true });
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
