/**
 * @import { ParsedComponent } from "./parser/mod.js";
 */

import * as v from "valibot";

/**
 * @param {any} data
 * @param {Parameters<typeof JSON.stringify>[2]} [ident]
 * @returns {string}
 */
export function serialize(data, ident) {
	return JSON.stringify(
		data,
		(key, value) => {
			if (!key) return value;
			if (key) {
				if (value instanceof Map) return Iterator.from(value).toArray();
				if (value instanceof Set) return Iterator.from(value).toArray();
				return value;
			}
		},
		ident,
	);
}

/**
 * @param {string} stringified
 * @returns {Partial<ParsedComponent>}
 */
export function deserialize(stringified) {
	return JSON.parse(stringified, (key, value) => {
		// biome-ignore format: Prettier
		switch (key) {
			case "exports":
			case "events":
			case "members":
			case "props":
			case "slots": return is_mapable(value) ? new Map(value) : value;
			case "sources": return is_setable(value) ? new Set(value) : value;
			default: return value;
		}
	});
}

/**
 *
 * @param {unknown} input
 * @returns {input is Array<[string, unknown]>}
 */
function is_mapable(input) {
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
 *
 * @param {unknown} input
 * @returns {input is Array<[string]>}
 */
function is_setable(input) {
	return v.is(v.array(v.string()), input);
}
