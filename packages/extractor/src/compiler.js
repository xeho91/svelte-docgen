/**
 * @import { Options } from "./options.js";
 * @import { Parser } from "./parser.js";
 * @import { Source, TSXFilepath } from "./util.js";
 */

import { VERSION } from "svelte/compiler";
import { svelte2tsx } from "svelte2tsx";

export class Compiler {
	/** @type {ReturnType<typeof svelte2tsx>} */
	tsx;
	/** @type {TSXFilepath} */
	filepath;

	/**
	 * @param {Source} source
	 * @param {Parser} parser
	 * @param {Options} options
	 */
	constructor(source, parser, options) {
		this.filepath = `${options.filepath}.tsx`;
		this.tsx = this.#compile_to_tsx(source, parser, options.filepath);
	}

	/**
	 * @param {Source} source
	 * @param {Parser} parser
	 * @param {string} filepath
	 * @returns {ReturnType<typeof svelte2tsx>}
	 */
	#compile_to_tsx(source, parser, filepath) {
		return svelte2tsx(source, {
			filename: filepath,
			isTsFile: parser.isLangTypeScript,
			mode: "dts",
			version: VERSION,
		});
	}
}
