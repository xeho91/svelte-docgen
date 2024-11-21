/**
 * @import { Cache } from "./cache.js";
 */

/**
 * Original Svelte filepath
 * @typedef {`${string}.svelte`} SvelteFilepath
 */

/**
 * Compiled with {@link svelte2tsx} Svelte **virtual** filepath
 * @typedef {`${SvelteFilepath}.tsx`} TSXFilepath
 */

/**
 * @typedef Options
 * @prop {string} cwd
 * @prop {Cache} cache
 * TODO: Document it
 */

/**
 * @param {string} filepath
 * @returns {asserts filepath is SvelteFilepath}
 */
export function validate_filepath(filepath) {
	if (!filepath.endsWith(".svelte")) {
		// TODO: Document it
		throw new Error("Filepath must be a svelte file");
	}
}
