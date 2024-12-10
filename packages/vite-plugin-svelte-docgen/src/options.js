/**
 * @import { SourceMapOptions } from "magic-string";
 */

import url from "node:url";

/**
 * User options for Vite's plugin.
 *
 * @typedef UserOptions
 * @prop {string} [componentPropertyKey] Set your own property key name to attach generated parsed output to.
 * @prop {URL | string} [cwd] Current working directory.
 * @prop {SourceMapOptions['hires']} [sourceMapHires] See {@link SourceMapOptions['hires']}.
 */

export class Options {
	/**
	 * @type {URL}
	 */
	cwd;
	/**
	 * @type {string}
	 */
	componentPropertyKey;
	/**
	 * @type {SourceMapOptions['hires']}
	 */
	sourceMapHires;

	/** @param {UserOptions} [user_options] */
	constructor(user_options) {
		this.sourceMapHires = user_options?.sourceMapHires;
		this.cwd = user_options?.cwd ? this.#parse_cwd(user_options.cwd) : url.pathToFileURL(process.cwd());
		this.componentPropertyKey = user_options?.componentPropertyKey ?? "__docgen";
	}

	/**
	 * @param {NonNullable<UserOptions["cwd"]>} input
	 * @returns {URL}
	 */
	#parse_cwd(input) {
		if (/** @type {typeof URL | string} */ (input) instanceof URL) return input;
		return URL.canParse(input) ? new URL(input) : url.pathToFileURL(input);
	}
}
