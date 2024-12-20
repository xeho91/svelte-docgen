/**
 * @import * as Doc from "../doc/type.ts";
 */

import path from "pathe";

class PropAnalyzer {
	/** @type {Doc.Prop} */
	#prop;

	/** @param {Doc.Prop} prop */
	constructor(prop) {
		this.#prop = prop;
	}

	/** @returns {boolean} */
	get isEventHandler() {
		if (this.#prop.type.kind !== "function") return false;
		if (!this.#prop.type.sources) return false;
		const is_type_from_svelte = Iterator.from(this.#prop.type.sources).some((f) => this.#is_source_from_svelte(f));
		if (!is_type_from_svelte) return false;
		return Boolean(this.#prop.type.alias?.endsWith("EventHandler"));
	}

	/** @returns {boolean} */
	get isExtendedBySvelte() {
		if (!this.#prop.isExtended || !this.#prop.sources) return false;
		return Iterator.from(this.#prop.sources).some((f) => this.#is_source_from_svelte(f));
	}

	/** @returns {boolean} */
	get isSnippet() {
		if (this.#prop.type.kind === "union" && this.#prop.type.nonNullable) {
			return this.#is_snippet(this.#prop.type.nonNullable);
		}
		return this.#is_snippet(this.#prop.type);
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
	 * @param {string} source
	 * @returns {boolean}
	 */
	#is_source_from_svelte(source) {
		const { dir } = path.parse(source);
		return (
			dir.endsWith(path.join(path.sep, "node_modules", "svelte", "types")) ||
			dir.endsWith(path.join(path.sep, "node_modules", "svelte"))
		);
	}

	/**
	 * @param {Doc.Type} type
	 * @returns {boolean}
	 */
	#is_snippet(type) {
		if (type.kind !== "function" || type.alias !== "Snippet") return false;
		if (!type.sources) return false;
		return Iterator.from(type.sources).some((f) => this.#is_source_from_svelte(f));
	}
}

/**
 * @typedef EventHandlerPropAnalysis
 * @prop {boolean} isExtendedBySvelte
 * @prop {false} isSnippet
 * @prop {true} isEventHandler
 */

/**
 * @typedef SnippetPropAnalysis
 * @prop {true} isExtendedBySvelte
 * @prop {true} isSnippet
 * @prop {() => Doc.Tuple} getSnippetParameters
 * @prop {false} isEventHandler
 */

/**
 * @typedef OtherPropAnalysis
 * @prop {boolean} isExtendedBySvelte
 * @prop {false} isSnippet
 * @prop {false} isEventHandler
 */

/**
 * @typedef {(EventHandlerPropAnalysis | SnippetPropAnalysis | OtherPropAnalysis)} PropAnalysis
 */

/**
 * @param {Doc.Prop} prop
 * @returns {PropAnalysis}
 */
export function analyzeProperty(prop) {
	// @ts-expect-error: WARN: Hard to type (cast), but should be fine from usage perspective
	return new PropAnalyzer(prop);
}
