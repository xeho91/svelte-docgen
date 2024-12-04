/**
 * @import { Doc } from "./documentation.ts";
 * @import { Extractor } from "./shared.js"
 */

import ts from "typescript";

import { is_object_type, is_tuple_type, is_type_reference, remove_tsx_extension } from "./shared.js";

/**
 * @internal
 * @template {ts.Type} [T=ts.Type]
 * @typedef GetTypeParams
 * @prop {T} type
 * @prop {Extractor} extractor
 * @prop {string} [self]
 */

/**
 * @param {ts.Type} type
 * @returns {ts.Symbol}
 */
function get_type_symbol(type) {
	const symbol = type.getSymbol();
	if (symbol) return symbol;
	// TODO: Document error
	throw new Error("Could not get symbol of type");
}

/**
 * @param {ts.Type} type
 * @param {Extractor} extractor
 * @returns {readonly ts.Signature[]}
 */
function get_construct_signatures(type, extractor) {
	const symbol = get_type_symbol(type);
	const symbol_type = extractor.checker.getTypeOfSymbol(symbol);
	return extractor.checker.getSignaturesOfType(symbol_type, ts.SignatureKind.Construct);
}

/**
 * @param {ts.Type} type
 * @param {Extractor} extractor
 * @returns {boolean}
 */
function is_constructible(type, extractor) {
	return get_construct_signatures(type, extractor).length > 0;
}

export const TYPE_KINDS = new Set(
	/** @type {const} */ ([
		"any",
		"array",
		"bigint",
		"boolean",
		"constructible",
		"function",
		"interface",
		"intersection",
		"literal",
		"never",
		"null",
		"number",
		"object",
		"string",
		"symbol",
		"tuple",
		"type-parameter",
		"undefined",
		"union",
		"unknown",
		"void",
	]),
);

/**
 * @param {ts.Type} type
 * @returns {boolean}
 */
function is_type_interface_only(type) {
	if (!type.symbol) return false;
	const declarations = type.symbol.getDeclarations() ?? [];
	if (!declarations[0]) return false;
	const declaration_kind = declarations[0].kind;
	return (declaration_kind & ts.SyntaxKind.TypeLiteral) !== 0;
}

/**
 * @param {GetTypeParams} params
 * @returns {Doc.TypeKind}
 */
function get_type_kind(params) {
	const { type, extractor } = params;
	const { flags } = params.type;
	// WARN: Order is important for performance - do NOT sort
	if (flags & ts.TypeFlags.Any) return "any";
	if (flags & ts.TypeFlags.Never) return "never";
	if (flags & ts.TypeFlags.Null) return "null";
	if (flags & ts.TypeFlags.Undefined) return "undefined";
	if (flags & ts.TypeFlags.Unknown) return "unknown";
	if (flags & ts.TypeFlags.Void) return "void";
	if (flags & ts.TypeFlags.BigIntLiteral) return "literal";
	if (flags & ts.TypeFlags.BooleanLiteral) return "literal";
	if (flags & ts.TypeFlags.NumberLiteral) return "literal";
	if (flags & ts.TypeFlags.StringLiteral) return "literal";
	if (flags & ts.TypeFlags.UniqueESSymbol) return "literal";
	if (flags & ts.TypeFlags.BigInt) return "bigint";
	if (flags & ts.TypeFlags.Boolean) return "boolean";
	if (flags & ts.TypeFlags.Number) return "number";
	if (flags & ts.TypeFlags.String) return "string";
	if (flags & ts.TypeFlags.ESSymbol) return "symbol";
	if (flags & ts.TypeFlags.ESSymbolLike) return "symbol";
	if (extractor.checker.isTupleType(type)) return "tuple";
	if (type.isIntersection()) return "intersection";
	if (type.isUnion()) return "union";
	if (extractor.checker.isArrayType(type)) return "array";
	if (type.isClass()) return "constructible";
	if (type.isClassOrInterface()) return is_constructible(type, extractor) ? "constructible" : "interface";
	if (type.getCallSignatures().length > 0) return "function";
	if (type.isTypeParameter()) return "type-parameter";
	// WARN: Must be last
	if (is_object_type(type)) {
		// FIXME: Sometimes the constructible type is not recognized with `ts.Type.isClassOrInterface()` - e.g. `Map` - don't know why.
		if ("symbol" in type && is_constructible(type, extractor)) return "constructible";
		if (is_type_interface_only(type)) return "interface";
		return "object";
	}
	// TODO: Document error
	throw new Error(`Unknown type kind: ${extractor.checker.typeToString(type)}`);
}

/**
 * @param {GetTypeParams} params
 * @returns {Doc.ArrayType}
 */
function get_array_doc(params) {
	const { type, extractor } = params;
	const index_info = extractor.checker.getIndexInfoOfType(type, ts.IndexKind.Number);
	// TODO: Document error
	if (!index_info) throw new Error(`Could not get index info of type ${extractor.checker.typeToString(type)}`);
	const { isReadonly } = index_info;
	return {
		kind: "array",
		isReadonly,
		element: get_type_doc({ type: index_info.type, extractor }),
	};
}

/**
 * @param {GetTypeParams} params
 * @returns {Doc.Constructible}
 */
function get_constructible_doc(params) {
	const { type, extractor, self } = params;
	const symbol = get_type_symbol(type);
	const name = extractor.checker.getFullyQualifiedName(symbol);
	const sources = get_type_sources(params);
	// TODO: Document error
	if (!sources) throw new Error();
	if (self === name) return { kind: "constructible", name, constructors: "self", sources };
	/** @type {Doc.Constructible['constructors']} */
	const constructors = get_construct_signatures(type, extractor).map((s) => {
		return s.getParameters().map((p) => {
			return get_fn_param_doc({ parameter: p, extractor, self: name });
		});
	});
	return {
		kind: "constructible",
		name,
		constructors,
		sources,
	};
}

/**
 * @param {GetTypeParams} params
 * @returns {Doc.Fn}
 */
function get_function_doc(params) {
	const { type, extractor, self } = params;
	const calls = type.getCallSignatures().map((s) => {
		return {
			parameters: s.getParameters().map((p) => get_fn_param_doc({ parameter: p, extractor, self })),
			returns: get_type_doc({ type: s.getReturnType(), extractor, self }),
		};
	});
	/** @type {Doc.Fn} */
	// biome-ignore lint/style/useConst: Readability - mutation
	let results = {
		kind: "function",
		calls,
	};
	const symbol = type.getSymbol();
	if (symbol || type.aliasSymbol) {
		if (symbol) results.alias = symbol.name;
		if (type.aliasSymbol) results.alias = type.aliasSymbol.name;
	}
	const sources = get_type_sources(params);
	// NOTE: Alias is needed, because the symbol is defined and named as "__type"
	if (sources && results.alias) results.sources = sources;
	return results;
}

/**
 * @param {ts.Symbol} symbol
 * @param {GetTypeParams} params
 * @returns {Doc.Member}
 */
function get_member_doc(symbol, params) {
	const { extractor } = params;
	const type = extractor.checker.getTypeOfSymbol(symbol);
	return {
		isOptional: is_symbol_optional(symbol),
		isReadonly: is_symbol_readonly(symbol),
		type: get_type_doc({ ...params, type }),
	};
}

/**
 * @param {GetTypeParams} params
 * @returns {Doc.Interface}
 */
function get_interface_doc(params) {
	const { type, extractor } = params;
	/** @type {Doc.Interface['members']} */
	const members = new Map(
		Iterator.from(type.getProperties()).map((p) => {
			return [p.name, get_member_doc(p, params)];
		}),
	);
	/** @type {Doc.Interface} */
	// biome-ignore lint/style/useConst: Readability - mutation
	let results = {
		kind: "interface",
		members,
	};
	const alias = type.aliasSymbol?.name ?? extractor.checker.getFullyQualifiedName(type.symbol);
	if (alias && alias !== "__type") {
		results.alias = alias;
		const sources = get_type_sources(params);
		if (sources) results.sources = sources;
	}
	return results;
}
/**
 * @param {GetTypeParams} params
 * @returns {Doc.Intersection}
 */
function get_intersection_doc(params) {
	const { type, extractor } = params;
	// TOOD: Document error
	if (!type.isIntersection())
		throw new Error(`Expected intersection type, got ${extractor.checker.typeToString(type)}`);
	const types = type.types.map((t) => get_type_doc({ type: t, extractor }));
	/** @type {Doc.Intersection} */
	// biome-ignore lint/style/useConst: Readability - mutation
	let results = { kind: "intersection", types };
	if (type.aliasSymbol) results.alias = type.aliasSymbol.name;
	const source = get_type_sources(params);
	if (source) results.sources = source;
	return results;
}

/**
 * @param {ts.Symbol} symbol
 * @returns {boolean}
 */
function is_symbol_optional(symbol) {
	if (
		symbol.valueDeclaration &&
		(ts.isParameter(symbol.valueDeclaration) || ts.isPropertySignature(symbol.valueDeclaration))
	) {
		return symbol.valueDeclaration.questionToken !== undefined;
	}
	return false;
}

/**
 * @param {ts.Symbol} symbol
 * @returns {boolean}
 */
function is_symbol_readonly(symbol) {
	const declarations = symbol.getDeclarations();
	if (!declarations || declarations.length === 0) return false;
	return declarations.some((d) => {
		const modifiers = ts.getCombinedModifierFlags(d);
		return (modifiers & ts.ModifierFlags.Readonly) !== 0;
	});
}

/**
 * @param  {{ parameter: ts.Symbol, extractor: Extractor, self?: string }} params
 * @returns {Doc.FnParam}
 */
function get_fn_param_doc(params) {
	const { parameter, extractor, self } = params;
	if (!parameter.valueDeclaration || !ts.isParameter(parameter.valueDeclaration)) {
		// TODO: Document error
		throw new Error("Not a parameter");
	}
	const type = extractor.checker.getTypeOfSymbol(parameter);
	const isOptional = parameter.valueDeclaration.questionToken !== undefined;
	/** @type {Doc.FnParam} */
	// biome-ignore lint/style/useConst: Readability - mutation
	let data = {
		name: parameter.name,
		isOptional,
		type: get_type_doc({ type, extractor, self }),
	};
	if (data.isOptional && parameter.valueDeclaration.initializer) {
		const default_type = extractor.checker.getTypeAtLocation(parameter.valueDeclaration.initializer);
		data.default = get_type_doc({ type: default_type, extractor, self });
	}
	return data;
}

/**
 * @param {GetTypeParams} params
 * @returns {Doc.Literal}
 */
function get_literal_doc(params) {
	const { type, extractor } = params;
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
	if (type.flags & ts.TypeFlags.UniqueESSymbol) {
		return { kind, subkind: "symbol" };
	}
	// TODO: Document error
	throw new Error(`Unknown literal type: ${extractor.checker.typeToString(type)}`);
}

/**
 * @param {GetTypeParams} params
 * @returns {Doc.Tuple}
 */
function get_tuple_doc(params) {
	const { type, extractor } = params;
	// TODO: Document error
	if (!is_type_reference(type))
		throw new Error(`Expected type reference, got ${extractor.checker.typeToString(type)}`);
	// TODO: Document error
	if (!is_tuple_type(type.target))
		throw new Error(`Expected tuple type, got ${extractor.checker.typeToString(type)}`);
	const isReadonly = type.target.readonly;
	const elements = extractor.checker.getTypeArguments(type).map((t) => {
		return get_type_doc({ type: t, extractor });
	});
	/** @type {Doc.Tuple} */
	// biome-ignore lint/style/useConst: Readability - mutation
	let results = {
		kind: "tuple",
		isReadonly,
		elements,
	};
	if (type.aliasSymbol) results.alias = type.aliasSymbol.name;
	return results;
}

/**
 * @param {GetTypeParams} params
 * @returns {Doc.TypeParam}
 */
function get_type_param_doc(params) {
	const { type, extractor } = params;
	// TODO: Document error
	if (!type.isTypeParameter())
		throw new Error(`Expected type parameter, got ${extractor.checker.typeToString(type)}`);
	const constraint = type.getConstraint();
	/** @type {Doc.TypeParam} */
	// biome-ignore lint/style/useConst: Readability - mutation
	let results = {
		kind: "type-parameter",
		name: type.symbol.name,
		constraint: constraint ? get_type_doc({ ...params, type: constraint }) : { kind: "unknown" },
		isConst: is_const_type_param(type),
	};
	const def = type.getDefault();
	if (def) results.default = get_type_doc({ ...params, type: def });
	return results;
}

/**
 * @param {ts.TypeParameter} type
 * @returns {boolean}
 */
function is_const_type_param(type) {
	const symbol = type.symbol;
	const declarations = symbol.getDeclarations();
	if (!declarations || declarations.length === 0)
		throw new Error(`Could not get declarations of type parameter ${symbol.name}`);
	return declarations.some((declaration) => {
		const modifiers = ts.getCombinedModifierFlags(declaration);
		return (modifiers & ts.ModifierFlags.Const) !== 0;
	});
}

/**
 * @param {GetTypeParams} params
 * @returns {Doc.Union}
 */
function get_union_doc(params) {
	const { type, extractor } = params;
	// TODO: Document error
	if (!type.isUnion()) throw new Error(`Expected union type, got ${extractor.checker.typeToString(type)}`);
	const types = type.types.map((m) => get_type_doc({ ...params, type: m }));
	/** @type {Doc.Union} */
	// biome-ignore lint/style/useConst: Readability - mutation
	let results = {
		kind: "union",
		types,
	};
	if (type.aliasSymbol) results.alias = type.aliasSymbol.name;
	const source = get_type_sources(params);
	if (source) results.sources = source;
	const nonNullable = type.getNonNullableType();
	if (nonNullable !== type) results.nonNullable = get_type_doc({ ...params, type: nonNullable });
	return results;
}

/**
 * @param {GetTypeParams} params
 * @returns {Doc.Type}
 */
export function get_type_doc(params) {
	const kind = get_type_kind(params);
	// biome-ignore format: Prettier
	switch (kind) {
		case "array": return get_array_doc(params);
		case "constructible": return get_constructible_doc(params);
		case "function": return get_function_doc(params);
		case "interface": return get_interface_doc(params);
		case "intersection": return get_intersection_doc(params);
		case "literal": return get_literal_doc(params);
		case "tuple": return get_tuple_doc(params);
		case "type-parameter": return get_type_param_doc(params);
		case "union": return get_union_doc(params);
		default: return { kind };
	}
}

/**
 * @param {GetTypeParams} params
 * @returns {Doc.WithAlias['sources'] | Doc.WithName["sources"]}
 */
function get_type_sources(params) {
	const { type, extractor } = params;
	const symbol = type.getSymbol() || type.aliasSymbol;
	if (symbol) {
		const declared_type = extractor.checker.getDeclaredTypeOfSymbol(symbol);
		const declared_type_symbol = declared_type.getSymbol();
		if (declared_type_symbol) {
			return Iterator.from(declared_type_symbol.getDeclarations() ?? [])
				.map((d) => remove_tsx_extension(d.getSourceFile().fileName))
				.toArray();
		}
	}
}
