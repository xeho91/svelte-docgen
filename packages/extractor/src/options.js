/**
 * @import { SvelteFilepath } from "./util.js";
 */

import { createCacheStorage } from "./cache.js";

/** @typedef {Partial<Options> & { filepath?: SvelteFilepath | (string & {}) }} UserOptions */

export class Options {
	/** @type {ReturnType<typeof createCacheStorage>} */
	cache;
	/** @type {SvelteFilepath} */
	filepath;

	/** @param {UserOptions} user_options */
	constructor(user_options) {
		this.cache = user_options.cache ?? createCacheStorage();
		if (user_options.filepath) {
			const filepath = this.#parse_filepath(user_options.filepath);
			this.#validate_filepath(filepath);
			this.filepath = filepath;
		} else this.filepath = this.#random_filepath;
	}

	/**
	 * NOTE:
	 * User could pass a filepath as URI _(starting with "file://" protocol)_.
	 * In this case we're interested only in pathname, because TypeScript doesn't handle URI.
	 *
	 * @param {string} filepath
	 * @returns {string}
	 */
	#parse_filepath(filepath) {
		if (URL.canParse(filepath)) return new URL(filepath).pathname;
		return filepath;
	}

	/**
	 * @param {string} filepath
	 * @returns {asserts filepath is SvelteFilepath}
	 */
	#validate_filepath(filepath) {
		if (!filepath.endsWith(".svelte")) {
			// TODO: Document it
			throw new Error("Filepath must be a svelte file");
		}
	}

	/** @returns {SvelteFilepath} */
	get #random_filepath() {
		const random_str = `${Date.now()}-${Math.random().toString(36).substring(2, 10)}`;
		return `${random_str}.svelte`;
	}
}
