/**
 * @import { extract } from "svelte-docgen-extractor";
 */

import ts from "typescript";

export const TYPE_KINDS = new Set(
	/** @type {const} */ ([
		"any", // ✅
		"array", // ✅
		"bigint", // ✅
		"boolean", // ✅
		"class",
		"enum",
		"function",
		"interface",
		"intersection",
		"literal", // ✅
		"never", // ✅
		"null",
		"number",
		"object", // ✅
		"string",
		"symbol",
		"tuple",
		"type-parameter",
		"undefined",
		"union", // ✅
		"unknown", // ✅
		"void", // ✅
	]),
);
/** @typedef {typeof TYPE_KINDS extends Set<infer T> ? T : never} TypeKind */

/**
 * @param {ts.Type} type
 * @param {ReturnType<typeof extract>} extractor
 * @returns {TypeKind}
 */
function get_type_kind(type, extractor) {
	const { flags } = type;
	if (flags & ts.TypeFlags.Any) return "any";
	if (flags & ts.TypeFlags.Unknown) return "unknown";
	if (flags & ts.TypeFlags.String) return "string";
	if (flags & ts.TypeFlags.Number) return "number";
	if (flags & ts.TypeFlags.Boolean) return "boolean";
	if (flags & ts.TypeFlags.Enum) return "enum";
	if (flags & ts.TypeFlags.BigInt) return "bigint";
	if (flags & ts.TypeFlags.ESSymbol) return "symbol";
	if (flags & ts.TypeFlags.Void) return "void";
	if (flags & ts.TypeFlags.Undefined) return "undefined";
	if (flags & ts.TypeFlags.Null) return "null";
	if (flags & ts.TypeFlags.Never) return "never";
	if (extractor.checker.isArrayType(type)) return "array";
	if (extractor.checker.isTupleType(type)) return "tuple";
	if (type.isClassOrInterface()) return type.symbol?.flags & ts.SymbolFlags.Class ? "class" : "interface";
	if (type.isUnion()) return "union";
	if (type.isIntersection()) return "intersection";
	if (type.getCallSignatures().length) return "function";
	if (type.isLiteral() || flags & ts.TypeFlags.BooleanLiteral) return "literal";
	if (type.isTypeParameter()) return "type-parameter";
	if (flags & ts.TypeFlags.Object) return "object";
	return "unknown";
}

/**
 * @typedef BaseTypeDocumentation
 * @prop {TypeKind} kind
 */

/**
 * @typedef ArrayTypeDocumentation
 * @prop {"array"} kind
 * @prop {boolean} isReadonly
 * @prop {TypeDocumentation} element
 */

/**
 * @param {ts.Type} type
 * @param {ReturnType<typeof extract>} extractor
 * @returns {ArrayTypeDocumentation}
 */
function get_array_type_documentation(type, extractor) {
	// TODO: Document error
	if (!extractor.checker.isArrayType(type))
		throw new Error(`Expected union type, got ${extractor.checker.typeToString(type)}`);
	const index_info = extractor.checker.getIndexInfoOfType(type, ts.IndexKind.Number);
	// TODO: Document error
	if (!index_info) throw new Error(`Could not get index info of type ${extractor.checker.typeToString(type)}`);
	const { isReadonly } = index_info;
	return { kind: "array", isReadonly, element: get_type_documentation(index_info.type, extractor) };
}

/**
 * @typedef LiteralBigIntTypeDocumentation
 * @prop {"literal"} kind
 * @prop {"bigint"} subkind
 * @prop {bigint} value
 */

/**
 * @typedef LiteralBooleanTypeDocumentation
 * @prop {"literal"} kind
 * @prop {"boolean"} subkind
 * @prop {boolean} value
 */

/**
 * @typedef LiteralNumberTypeDocumentation
 * @prop {"literal"} kind
 * @prop {"number"} subkind
 * @prop {number} value
 */

/**
 * @typedef LiteralStringTypeDocumentation
 * @prop {"literal"} kind
 * @prop {"string"} subkind
 * @prop {string} value
 */

/**
 * @typedef {LiteralBigIntTypeDocumentation | LiteralBooleanTypeDocumentation | LiteralNumberTypeDocumentation | LiteralStringTypeDocumentation} LiteralTypeDocumentation
 */

/**
 * @param {ts.Type} type
 * @param {ReturnType<typeof extract>} extractor
 * @returns {LiteralTypeDocumentation}
 */
function get_literal_type_documentation(type, extractor) {
	const kind = "literal";
	if (type.isLiteral()) {
		if (type.isStringLiteral()) return { kind, subkind: "string", value: type.value };
		if (type.isNumberLiteral()) return { kind, subkind: "number", value: type.value };
		if (
			type.flags & ts.TypeFlags.BigIntLiteral &&
			typeof type.value !== "string" &&
			typeof type.value !== "number"
		) {
			const value = BigInt(type.value.negative ? `-${type.value.base10Value}` : type.value.base10Value);
			return { kind, subkind: "bigint", value };
		}
	}
	if (type.flags & ts.TypeFlags.BooleanLiteral && "intrinsicName" in type) {
		return { kind, subkind: "boolean", value: type.intrinsicName === "true" };
	}
	// TODO: Document error
	throw new Error(`Unknown literal type: ${extractor.checker.typeToString(type)}`);
}

/**
 * @typedef ObjectTypeDocumentation
 * @prop {"object"} kind
 * @prop {boolean} isReadonly
 * @prop {Map<string, TypeDocumentation>} properties
 */

/**
 * @param {ts.ObjectType} type
 * @param {ReturnType<typeof extract>} extractor
 * @returns {ObjectTypeDocumentation}
 */
function get_object_type_documentation(type, extractor) {
	/** @type {Map<string, TypeDocumentation>} */
	// biome-ignore lint/style/useConst: Readability - mutation
	let properties = new Map();
	for (const property of type.getProperties()) {
		const name = property.name;
		const type = extractor.checker.getTypeOfSymbol(property);
		properties.set(name, get_type_documentation(type, extractor));
	}
	return { kind: "object", isReadonly: false, properties };
}

/**
 * @typedef UnionTypeDocumentation
 * @prop {"union"} kind
 * @prop {TypeDocumentation[]} members
 */

/**
 * @param {ts.Type} type
 * @param {ReturnType<typeof extract>} extractor
 * @returns {UnionTypeDocumentation}
 */
function get_union_type_documentation(type, extractor) {
	// TODO: Document error
	if (!type.isUnion()) throw new Error(`Expected union type, got ${extractor.checker.typeToString(type)}`);
	const members = type.types.map((m) => get_type_documentation(m, extractor));
	return { kind: "union", members };
}

/**
 * @typedef {BaseTypeDocumentation | ArrayTypeDocumentation | LiteralTypeDocumentation | UnionTypeDocumentation} TypeDocumentation
 */

/**
 * @param {ts.Type} type
 * @param {ReturnType<typeof extract>} extractor
 * @returns {TypeDocumentation}
 */
export function get_type_documentation(type, extractor) {
	const kind = get_type_kind(type, extractor);
	// biome-ignore format: Prettier
	switch (kind) {
		case "array": return get_array_type_documentation(type, extractor);
		// case "interface": return get_object_type_documentation(type, extractor, "interface");
		case "literal": return get_literal_type_documentation(type, extractor);
		case "object": return get_object_type_documentation(/** @type {ts.ObjectType} */ (type), extractor);
		case "union": return get_union_type_documentation(type, extractor);
		default: return { kind };
	}
}
