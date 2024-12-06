/**
 * @import * as JS_AST from "estree";
 * @import { AST as SVELTE_AST } from "svelte/compiler";
 * @import { Context } from "zimmerframe";
 *
 * @import { Source } from "./util.js";
 */

import { parse } from "svelte/compiler";
import { walk } from "zimmerframe";

export class Parser {
	/** @type {SVELTE_AST.Root} */
	ast;
	/**
	 * Root comment with `@component` tag.
	 * @type {SVELTE_AST.Comment | undefined}
	 */
	componentComment;
	/** @type {boolean} */
	isLangTypeScript;
	/** @type {boolean} */
	hasLegacySyntax;

	/** @param {Source} source */
	constructor(source) {
		this.ast = this.#parse_code(source);
		this.componentComment = this.#extract_description();
		this.isLangTypeScript = this.#read_script_instance_lang_attribute();
		this.hasLegacySyntax = this.#determine_legacy_syntax();
	}

	/**
	 * @param {Source} code
	 * @returns {SVELTE_AST.Root}
	 */
	#parse_code(code) {
		return parse(code, { modern: true });
	}

	/** @returns {SVELTE_AST.Comment | undefined} */
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
		let found = false;
		/** @param {Context<JS_AST.BaseNode | SVELTE_AST.BaseNode, null>} ctx */
		const stop = (ctx) => {
			found = true;
			ctx.stop();
		};
		walk(/** @type {JS_AST.BaseNode | SVELTE_AST.BaseNode} */ (this.ast), null, {
			// @ts-expect-error: WARN: Type incompatibility between `@types/estree` and `SVELTE_AST`
			ExportNamedDeclaration(/** @type {JS_AST.ExportNamedDeclaration} */ node, ctx) {
				if (node.declaration?.type === "VariableDeclaration" && node.declaration?.kind === "let") {
					stop(ctx);
				}
			},
			// @ts-expect-error: WARN: Type incompatibility between `@types/estree` and `SVELTE_AST`
			LabeledStatement(/** @type {JS_AST.LabeledStatement} */ node, ctx) {
				if (node.label.type === "Identifier" && node.label.name === "$") {
					stop(ctx);
				}
			},
			SlotElement(_, ctx) {
				stop(ctx);
			},
			SvelteComponent(_, ctx) {
				stop(ctx);
			},
			SvelteFragment(_, ctx) {
				stop(ctx);
			},
			SvelteSelf(_, ctx) {
				stop(ctx);
			},
		});
		return found;
	}
}
