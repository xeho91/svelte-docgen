/**
 * @import { Fields, ParsedComponent } from "./schema.js";
 */

import { parse } from "svelte-docgen";

import { CACHE_STORAGE } from "./cache.js";

/**
 * @template {Fields} T
 * @typedef SourceParams
 * @prop {string} filepath
 * @prop {string} source
 * @prop {T[]} fields;
 */

/**
 * @template {Fields} T
 * @param {SourceParams<T>} params
 * @returns {Pick<ParsedComponent, T>}
 * */
export function parse_source(params) {
	const { fields, filepath, source } = params;
	const parsed = parse(source, {
		// @ts-expect-error TODO: Perhaps is best to just accept string type?
		filepath,
		cache: CACHE_STORAGE,
	});
	return fields.reduce((results, key) => {
		results[key] = parsed[key];
		return results;
	}, /** @type {Pick<ParsedComponent, T>} */ ({}));
}
