/**
 * @import { SvelteFilepath, TSXFilepath } from "./util.js";
 */

import { VERSION } from "svelte/compiler";
import { svelte2tsx } from "svelte2tsx";

import { Parser } from "./parser";

export class Compiler {
	/** @type {ReturnType<typeof svelte2tsx>} */
	tsx;
	/** @type {TSXFilepath} */
	filepath;

	/**
	 * @param {SvelteFilepath} filepath
	 * @param {Parser} parser
	 */
	constructor(filepath, parser) {
		this.filepath = `${filepath}.tsx`;
		this.tsx = this.#compile_to_tsx(parser);
	}

	/**
	 * @param {Parser} parser
	 * @returns {ReturnType<typeof svelte2tsx>}
	 */
	#compile_to_tsx(parser) {
		return svelte2tsx(parser.code, {
			filename: this.filepath,
			isTsFile: parser.is_lang_typescript,
			mode: "dts",
			version: VERSION,
		});
	}
}
