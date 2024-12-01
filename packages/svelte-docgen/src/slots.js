/**
 * @import { extract } from "@svelte-docgen/extractor";
 *
 * @import { TypeDocumentation } from "./shared.js";
 */

import { generate_type_documentation } from "./shared.js";

/**
 * @typedef {Record<string, SlotPropDocumentation>} SlotsDocumentation
 */

/**
 * @typedef {Record<string, TypeDocumentation>} SlotPropDocumentation
 */

/**
 * @param {ReturnType<typeof extract>} extractor
 * @returns {SlotsDocumentation}
 */
export function generate_slots_documentation(extractor) {
	/** @type {SlotsDocumentation} */
	// biome-ignore lint/style/useConst: Readability - mutation
	let results = {};
	for (const [name, props] of extractor.slots) {
		results[name] = {};
		for (const [prop_name, prop_type] of props) {
			results[name][prop_name] = generate_type_documentation(prop_type, extractor);
		}
	}
	return results;
}
