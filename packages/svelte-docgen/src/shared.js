/**
 * @import { extract } from "@svelte-docgen/extractor";
 */

import ts from "typescript";

/**
 * @internal
 * @typedef {ReturnType<typeof extract>} Extractor
 */

/**
 * @internal
 * @param {string} stringified
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
 * @internal
 * @param {ts.Type} type
 * @returns {type is ts.ObjectType}
 */
export function is_object_type(type) {
	return (type.flags & ts.TypeFlags.Object || type.flags & ts.TypeFlags.NonPrimitive) !== 0;
}

/**
 * @internal
 * @param {ts.Type} type
 * @returns {type is ts.TypeReference}
 */
export function is_type_reference(type) {
	return is_object_type(type) && (type.objectFlags & ts.ObjectFlags.Reference) !== 0;
}

/**
 * @internal
 * @param {ts.Type} type
 * @returns {type is ts.TupleType}
 */
export function is_tuple_type(type) {
	return is_object_type(type) && (type.objectFlags & ts.ObjectFlags.Tuple) !== 0;
}

/**
 * @internal
 * @param {ts.Symbol} symbol
 * @returns {boolean}
 */
export function is_symbol_optional(symbol) {
	return (symbol.flags & ts.SymbolFlags.Optional) !== 0;
}

/**
 * @internal
 * @param {string} source
 * @returns {string}
 */
export function remove_tsx_extension(source) {
	return source.replace(/\.tsx$/, "");
}

/**
 * @internal
 * @param {ts.Type} type
 * @returns {ts.Symbol}
 */
export function get_type_symbol(type) {
	const symbol = type.getSymbol();
	if (symbol) return symbol;
	// TODO: Document error
	throw new Error("Could not get symbol of type");
}

/**
 * @internal
 * @template {ts.Type} [T=ts.Type]
 * @typedef GetTypeParams
 * @prop {T} type
 * @prop {Extractor} extractor
 * @prop {string} [self]
 */

/**
 * @internal
 * @param {ts.Type} type
 * @param {Extractor} extractor
 * @returns {readonly ts.Signature[]}
 */
export function get_construct_signatures(type, extractor) {
	const symbol = get_type_symbol(type);
	const symbol_type = extractor.checker.getTypeOfSymbol(symbol);
	return extractor.checker.getSignaturesOfType(symbol_type, ts.SignatureKind.Construct);
}

/**
 * @internal
 * @param {ts.TypeParameter} type
 * @returns {boolean}
 */
export function is_const_type_param(type) {
	const symbol = type.symbol;
	const declarations = symbol.getDeclarations();
	// TODO: Document error
	if (!declarations || declarations.length === 0)
		throw new Error(`Could not get declarations of type parameter ${symbol.name}`);
	return declarations.some((declaration) => {
		const modifiers = ts.getCombinedModifierFlags(declaration);
		return (modifiers & ts.ModifierFlags.Const) !== 0;
	});
}

/**
 * @internal
 * @param {ts.Symbol} symbol
 * @returns {boolean}
 */
export function is_symbol_readonly(symbol) {
	const declarations = symbol.getDeclarations();
	if (!declarations || declarations.length === 0) return false;
	return declarations.some((d) => {
		const modifiers = ts.getCombinedModifierFlags(d);
		return (modifiers & ts.ModifierFlags.Readonly) !== 0;
	});
}
