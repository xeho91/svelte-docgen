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
 * Serialize data as stringified JSON, so it can be used for e.g. RESTful API.
 *
 * @param {ParsedComponent} data
 * @param {Parameters<typeof JSON.stringify>[2]} [indent]
 * @returns {string}
 */
export function serialize(data, indent) {
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
		indent,
	);
}

/**
 * Revive stringified JSON data back to previous interface.
 *
 * @param {string} stringified
 * @returns {Partial<ParsedComponent>}
 */
export function deserialize(stringified) {
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
