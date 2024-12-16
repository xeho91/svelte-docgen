/**
 * @import { Fields, Parsed } from "./schema.js";
 */

import * as devalue from "devalue";
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
 * @returns {Pick<Parsed, T>}
 * */
export function parse_source(params) {
	const { fields, filepath, source } = params;
	const parsed = parse(source, {
		// @ts-expect-error TODO: Perhaps is best to just accept string type?
		filepath,
		cache: CACHE_STORAGE,
	});
	return fields.reduce(
		(results, key) => {
			results[key] = parsed[key];
			return results;
		},
		/** @type {Pick<Parsed, T>} */ ({}),
	);
}

/** @param {ReturnType<typeof parse_source>} data */
export function serialize_data(data) {
	return devalue.stringify(data);
}

/**
 * @template {Fields} T
 * @param {string} stringified
 * @returns {Pick<Parsed, T>}
 */
export function deserialize_data(stringified) {
	return devalue.parse(stringified);
}
