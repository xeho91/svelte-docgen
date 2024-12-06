/**
 * @import { Options } from "./options.js";
 * @import { Source, TSXFilepath } from "./util.js";
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
	 * @param {Source} source
	 * @param {Parser} parser
	 * @param {Options} options
	 */
	constructor(source, parser, options) {
		this.filepath = `${options.filepath}.tsx`;
		this.tsx = this.#compile_to_tsx(source, parser);
	}

	/**
	 * @param {Source} source
	 * @param {Parser} parser
	 * @returns {ReturnType<typeof svelte2tsx>}
	 */
	#compile_to_tsx(source, parser) {
		return svelte2tsx(source, {
			filename: this.filepath,
			isTsFile: parser.isLangTypeScript,
			mode: "dts",
			version: VERSION,
		});
	}
}
