/**
 * @import { extract } from "svelte-docgen-extractor";
 * @import ts from "typescript";
 */

/**
 * @typedef BaseDocumentation
 * @prop {string} description
 * @prop {Tag[]} tags
 */

/**
 * @typedef Tag
 * @prop {string} name
 * @prop {string} content
 */

/**
 * @typedef TypeDocumentation
 * @prop {string} [alias]
 * @prop {string} expanded
 */

/**
 * @param {ts.Symbol} symbol
 * @param {ReturnType<typeof extract>} extractor
 * @returns {TypeDocumentation}
 */
export function generate_type_documentation(symbol, extractor) {
	/** @type {TypeDocumentation} */
	// biome-ignore lint/style/useConst: Readability: mutation
	let results = {};
	const type = extractor.checker.getTypeOfSymbol(symbol);
	const alias = type.getSymbol();
	if (alias) results.alias = alias.name;
	results.expanded = extractor.checker.typeToString(type);
	return results;
}

/**
 *@param {string} stringified
 * @returns {ReturnType<typeof JSON.parse>}
 */
export function parse_stringified_type(stringified) {
	try {
		return JSON.parse(stringified);
	} catch {
		return stringified;
	}
}
