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

	/**
	 * @param {string} filepath
	 * @returns {boolean}
	 */
	#is_filepath_from_svelte(filepath) {
		const { dir } = path.parse(filepath);
		return dir.endsWith(path.join(path.sep, "node_modules", "svelte", "types"));
	}

	/** @returns {boolean} */
	get isSnippet() {
		if (this.#prop.type.kind !== "function") return false;
		if (this.#prop.type.alias !== "Snippet") return false;
		return Boolean(this.#prop.type.sources?.some((f) => this.#is_filepath_from_svelte(f)));
	}
}
