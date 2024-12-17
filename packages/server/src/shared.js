/**
 * @import { Fields, ParsedComponent } from "./schema.js";
 */

import { createCacheStorage } from "@svelte-docgen/extractor";
import { parse } from "svelte-docgen";

export const CACHE_STORAGE = createCacheStorage();

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

/**
 * @internal
 * Supported runtime name.
 * @typedef {"bun" | "deno" | "node"} RuntimeName
 */
/**
 * @internal
 * Get the supported JavaScript runtime name.
 * @returns {RuntimeName}
 */
export function get_runtime_name() {
	if (typeof globalThis.Bun !== "undefined") return "bun";
	if (typeof globalThis.Deno !== "undefined") return "deno";
	if (typeof process !== "undefined" && process.versions && process.versions.node) {
		return "node";
	}
	throw new Error("Unsupported runtime.");
}
