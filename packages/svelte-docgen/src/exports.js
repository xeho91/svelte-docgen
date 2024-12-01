/**
 * @import { extract } from "@svelte-docgen/extractor";
 *
 * @import { TypeDocumentation } from "./shared.js";
 */

import { generate_type_documentation } from "./shared.js";

/**
 * @typedef {Record<string, TypeDocumentation>} ExportsDocumentation
 */

/**
 * @param {ReturnType<typeof extract>} extractor
 * @returns {ExportsDocumentation}
 */
export function generate_exports_documentation(extractor) {
	/** @type {ExportsDocumentation} */
	// biome-ignore lint/style/useConst: Readability - mutation
	let results = {};
	for (const [name, symbol] of extractor.exports) {
		results[name] = generate_type_documentation(symbol, extractor);
	}
	return results;
}
