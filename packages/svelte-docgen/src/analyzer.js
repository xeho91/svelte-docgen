/**
 * @import { Doc } from "./documentation.ts";
 */

import path from "node:path";

export class PropAnalyzer {
	/** @type {Doc.Prop} */
	#prop;

	/** @param {Doc.Prop} prop */
	constructor(prop) {
		this.#prop = prop;
	}

	/** @returns {boolean} */
	get isSnippet() {
		if (this.#prop.type.kind === "union" && this.#prop.type.nonNullable) {
			return this.#is_snippet_type(this.#prop.type.nonNullable);
		}
		return this.#is_snippet_type(this.#prop.type);
	}

	/** @returns {ReturnType<typeof this.isSnippet> extends true ? Doc.Tuple : never} */
	getSnippetParameters() {
		const fn = this.#snippet_fn;
		// WARN: We don't expect that it can be overloaded
		const call = fn.calls[0];
		// TODO: Document error
		if (!call) throw new Error("");
		const params = call.parameters[0];
		if (params === "self") throw new Error("Self-referencing snippet is not supported");
		// NOTE: Parameters is always a single item and tuple
		if (params.type.kind !== "tuple") throw new Error("Not a tuple");
		return params.type;
	}

	/** @returns {Doc.Fn} */
	get #snippet_fn() {
		// TODO: Document error
		if (!this.isSnippet) throw new Error("Not a snippet");
		if (this.#prop.type.kind === "union") return /** @type {Doc.Fn} */ (this.#prop.type.nonNullable);
		if (this.#prop.type.kind === "function") return this.#prop.type;
		// TODO:: Document error
		throw new Error("Unreachable");
	}

	/**
	 * @param {string} filepath
	 * @returns {boolean}
	 */
	#is_filepath_from_svelte(filepath) {
		const { dir } = path.parse(filepath);
		return dir.endsWith(path.join(path.sep, "node_modules", "svelte", "types"));
	}

	/**
	 * @param {Doc.Type} type
	 * @returns {boolean}
	 */
	#is_snippet_type(type) {
		if (type.kind !== "function" || type.alias !== "Snippet") return false;
		return Boolean(type.sources?.some((f) => this.#is_filepath_from_svelte(f)));
	}
}
