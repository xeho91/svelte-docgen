/**
 * @import { extract } from "svelte-docgen-extractor";
 */

import ts from "typescript";

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

/**
 * @param {ts.Type} type
 * @returns {type is ts.ObjectType}
 */
export const is_object_type = (type) =>
	(type.flags & ts.TypeFlags.Object || type.flags & ts.TypeFlags.NonPrimitive) !== 0;

/**
 * @param {ts.Type} type
 * @returns {type is ts.TypeReference}
 */
export const is_type_reference = (type) => is_object_type(type) && (type.objectFlags & ts.ObjectFlags.Reference) !== 0;

/**
 * @param {ts.Type} type
 * @returns {type is ts.TupleType}
 */
export const is_tuple_type = (type) => is_object_type(type) && (type.objectFlags & ts.ObjectFlags.Tuple) !== 0;

/**
 * @param {ts.Symbol} symbol
 * @returns {boolean}
 */
export const is_symbol_optional = (symbol) => (symbol.flags & ts.SymbolFlags.Optional) !== 0;
