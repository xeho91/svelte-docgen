/**
 * @import { extract } from "svelte-docgen-extractor";
 *
 * @import { TypeDocumentation } from "./shared.js";
 */

import { generate_type_documentation } from "./shared.js";

/**
 * @typedef {Record<string, TypeDocumentation>} EventsDocumentation
 */

/**
 * @param {ReturnType<typeof extract>} extractor
 * @returns {EventsDocumentation}
 */
export function generate_events_documentation(extractor) {
	/** @type {EventsDocumentation} */
	// biome-ignore lint/style/useConst: Readability: mutation
	let events = {};
	for (const [name, symbol] of extractor.events) {
		events[`on:${name}`] = generate_type_documentation(symbol, extractor);
	}
	return events;
}
