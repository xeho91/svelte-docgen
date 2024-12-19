/**
 * Convert parsed data structures into transferable formats.
 * And restore them back to their original form.
 * @module
 */

/**
 * @import { ParsedComponent } from "./parser/mod.js";
 */

import * as v from "valibot";

/**
 * @template {keyof ParsedComponent} T
 * @typedef EncodeOptions
 * @prop {Parameters<typeof JSON.stringify>[2]} [indent]
 * @prop {T[]} [keys] Pick data entries _(based on their keys name)_ you want to be encoded.
 */

/**
 * Encode data as stringified JSON, so it can be used for e.g. RESTful API.
 *
 * @template {keyof ParsedComponent} T
 * @param {Pick<ParsedComponent, T>} data
 * @param {Partial<EncodeOptions<T>>} [options]
 * @returns {string}
 */
export function encode(data, options = {}) {
	let prepared_data = data;
	if (options.keys) {
		// NOTE: This prevents `toJSON()` be called, because by default it would call all of the getters.
		prepared_data = options.keys.reduce(
			(results, key) => {
				results[key] = data[key];
				return results;
			},
			/** @type {ParsedComponent} */ ({}),
		);
	}
	return JSON.stringify(
		prepared_data,
		(key, value) => {
			if (!key) return value;
			if (key) {
				if (value instanceof Map) return Iterator.from(value).toArray();
				if (value instanceof Set) return Iterator.from(value).toArray();
				return value;
			}
		},
		options.indent,
	);
}

/**
 * Revive stringified JSON data back to previous interface.
 *
 * @template {keyof ParsedComponent} T
 * @param {string} stringified
 * @returns {Pick<ParsedComponent, T>}
 */
export function decode(stringified) {
	return JSON.parse(stringified, (key, value) => {
		switch (key) {
			case "exports":
			case "events":
			case "members":
			case "props":
			case "slots":
				return is_mappable(value) ? new Map(value) : value;
			case "sources":
				return is_setable(value) ? new Set(value) : value;
			default:
				return value;
		}
	});
}

/**
 *
 * @param {unknown} input
 * @returns {input is Array<[string, unknown]>}
 * @internal
 */
function is_mappable(input) {
	return v.is(
		v.array(
			v.tuple([
				// Key
				v.string(),
				// Value
				v.unknown(), // WARN: Might need to be more strict - expect bugs
			]),
		),
		input,
	);
}

/**
 * @param {unknown} input
 * @returns {input is Array<[string]>}
 * @internal
 */
function is_setable(input) {
	return v.is(v.array(v.string()), input);
}
