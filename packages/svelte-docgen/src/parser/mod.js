/**
 * @import { Doc } from "../doc/type.ts";
 * @import { UserOptions } from "../options.js";
 */

import { extract } from "@svelte-docgen/extractor";
import ts from "typescript";

import { get_type_kind } from "../doc/kind.js";
import { Options } from "../options.js";
import {
	get_construct_signatures,
	get_type_symbol,
	is_const_type_param,
	is_symbol_optional,
	is_symbol_readonly,
	is_tuple_type,
	is_type_reference,
	remove_tsx_extension,
} from "../shared.js";

class Parser {
	/** @type {ReturnType<typeof extract>} */
	#extractor;
	/** @type {Options} */
	#options;

	/**
	 * @param {string} source
	 * @param {Options} options
	 */
	constructor(source, options) {
		this.#options = options;
		this.#extractor = extract(source, this.#options);
	}

	/** @type {ts.TypeChecker} */
	get #checker() {
		return this.#extractor.checker;
	}

	/** @returns {Doc.Component['description']} */
	get description() {
		return this.#extractor.description;
	}

	/** @returns {Doc.Component['tags']} */
	get tags() {
		return this.#extractor.tags;
	}

	/** @type {boolean | undefined} */
	#cached_is_legacy;
	/** @returns {boolean} */
	get isLegacy() {
		if (typeof this.#cached_is_legacy === "boolean") return this.#cached_is_legacy;
		this.#cached_is_legacy = this.#extractor.parser.hasLegacySyntax;
		return this.#cached_is_legacy;
	}

	/** @returns {Doc.Events} */
	get events() {
		// TODO: Document error
		if (!this.isLegacy) throw new Error();
		return new Map(
			Iterator.from(this.#extractor.events).map(([name, symbol]) => {
				return [`on:${name}`, this.#get_type_doc(this.#checker.getTypeOfSymbol(symbol))];
			}),
		);
	}

	/** @returns {Doc.Exports} */
	get exports() {
		return new Map(
			Iterator.from(this.#extractor.exports).map(([name, symbol]) => {
				return [name, this.#get_type_doc(this.#checker.getTypeOfSymbol(symbol))];
			}),
		);
	}

	/** @returns {Doc.Props} */
	get props() {
		return new Map(
			Iterator.from(this.#extractor.props).map(([name, symbol]) => {
				return [name, this.#get_prop_doc(symbol)];
			}),
		);
	}

	/** @returns {Doc.Slots} */
	get slots() {
		// TODO: Document error
		if (!this.isLegacy) throw new Error();
		return new Map(
			Iterator.from(this.#extractor.slots).map(([name, props]) => {
				const documented_props = new Map(
					Iterator.from(props).map(([name, prop]) => [name, this.#get_prop_doc(prop)]),
				);
				return [name, documented_props];
			}),
		);
	}

	/**
	 * @param {ts.Type} type
	 * @returns {Doc.Type}
	 */
	#get_type_doc(type) {
		const kind = get_type_kind({ type, extractor: this.#extractor });
		// biome-ignore format: Prettier
		switch (kind) {
			case "array": return this.#get_array_doc(type);
			case "constructible": return this.#get_constructible_doc(type);
			case "function": return this.#get_function_doc(type);
			case "interface": return this.#get_interface_doc(type);
			case "intersection": return this.#get_intersection_doc(type);
			case "literal": return this.#get_literal_doc(type);
			case "tuple": return this.#get_tuple_doc(type);
			case "type-parameter": return this.#get_type_param_doc(type);
			case "union": return this.#get_union_doc(type);
			default: return { kind };
		}
	}

	/**
	 * @param {ts.Symbol} symbol
	 * @returns {Doc.Prop}
	 */
	#get_prop_doc(symbol) {
		const type = this.#checker.getTypeOfSymbol(symbol);
		const sources = this.#get_symbol_sources(symbol);
		/** @type {Doc.Prop} */
		// biome-ignore lint/style/useConst: Readability - mutation
		let results = {
			tags: this.#get_prop_tags(symbol),
			isBindable: this.#extractor.bindings.has(symbol.name) || symbol.name.startsWith("bind:"),
			isExtended: sources ? Iterator.from(sources).some((f) => f !== this.#options.filepath) : false,
			isOptional: is_symbol_optional(symbol),
			type: this.#get_type_doc(type),
		};
		const description = this.#get_prop_description(symbol);
		if (description) results.description = description;
		if (results.isOptional) {
			const initializer = this.#extractor.defaults.get(symbol.name);
			if (initializer) {
				const default_type = this.#checker.getTypeAtLocation(initializer);
				results.default = this.#get_type_doc(default_type);
			}
		}
		if (results.isExtended && sources) results.sources = sources;
		return results;
	}

	/**
	 * @param {ts.Symbol} symbol
	 * @returns {string | undefined}
	 */
	#get_prop_description(symbol) {
		const description = symbol.getDocumentationComment(this.#checker);
		// TODO: Why it would be an array? Overloads? How should we handle it?
		return description?.[0]?.text;
	}

	/**
	 * @param {ts.Symbol} symbol
	 * @returns {Doc.Tag[]}
	 */
	#get_prop_tags(symbol) {
		return symbol.getJsDocTags(this.#checker).map((t) => {
			/** @type {Doc.Tag} */
			// biome-ignore lint/style/useConst: Readability - mutation
			let results = { name: t.name, content: "" };
			// TODO: Why it would be an array? Overloads? How should we handle it?
			const content = t.text?.[0]?.text;
			if (content) results.content = content;
			return results;
		});
	}

	/**
	 * @param {ts.Symbol} symbol
	 * @returns {Doc.Prop["sources"]}
	 */
	#get_symbol_sources(symbol) {
		return new Set(symbol.getDeclarations()?.map((d) => remove_tsx_extension(d.getSourceFile().fileName)) ?? []);
	}

	/**
	 * @param {ts.Type} type
	 * @returns {Doc.ArrayType}
	 */
	#get_array_doc(type) {
		const index_info = this.#checker.getIndexInfoOfType(type, ts.IndexKind.Number);
		// TODO: Document error
		if (!index_info) throw new Error(`Could not get index info of type ${this.#checker.typeToString(type)}`);
		const { isReadonly } = index_info;
		return {
			kind: "array",
			isReadonly,
			element: this.#get_type_doc(index_info.type),
		};
	}

	/** @type{string | undefined} */
	#self;

	/**
	 * @param {ts.Type} type
	 * @returns {Doc.Constructible}
	 */
	#get_constructible_doc(type) {
		const symbol = get_type_symbol(type);
		const name = this.#checker.getFullyQualifiedName(symbol);
		const sources = this.#get_type_sources(type);
		// TODO: Document error
		if (!sources) throw new Error();
		if (this.#self === name) return { kind: "constructible", name, constructors: "self", sources };
		/** @type {Doc.Constructible['constructors']} */
		const constructors = get_construct_signatures(type, this.#extractor).map((s) => {
			return s.getParameters().map((p) => {
				this.#self = name;
				return this.#get_fn_param_doc(p);
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
	 * @param {ts.Type} type
	 * @returns {Doc.Interface}
	 */
	#get_interface_doc(type) {
		/** @type {Doc.Interface['members']} */
		const members = new Map(Iterator.from(type.getProperties()).map((p) => [p.name, this.#get_member_doc(p)]));
		/** @type {Doc.Interface} */
		// biome-ignore lint/style/useConst: Readability - mutation
		let results = {
			kind: "interface",
			members,
		};
		const alias = type.aliasSymbol?.name ?? this.#checker.getFullyQualifiedName(type.symbol);
		if (alias && alias !== "__type") {
			results.alias = alias;
			const sources = this.#get_type_sources(type);
			if (sources) results.sources = sources;
		}
		return results;
	}

	/**
	 * @param {ts.Symbol} symbol
	 * @returns {Doc.Member}
	 */
	#get_member_doc(symbol) {
		const type = this.#checker.getTypeOfSymbol(symbol);
		return {
			isOptional: is_symbol_optional(symbol),
			isReadonly: is_symbol_readonly(symbol),
			type: this.#get_type_doc(type),
		};
	}

	/**
	 * @param {ts.Type} type
	 * @returns {Doc.Intersection}
	 */
	#get_intersection_doc(type) {
		// TOOD: Document error
		if (!type.isIntersection())
			throw new Error(`Expected intersection type, got ${this.#checker.typeToString(type)}`);
		const types = type.types.map((t) => this.#get_type_doc(t));
		/** @type {Doc.Intersection} */
		// biome-ignore lint/style/useConst: Readability - mutation
		let results = { kind: "intersection", types };
		if (type.aliasSymbol) results.alias = type.aliasSymbol.name;
		const source = this.#get_type_sources(type);
		if (source) results.sources = source;
		return results;
	}

	/**
	 * @param  {ts.Symbol} symbol
	 * @returns {Doc.FnParam}
	 */
	#get_fn_param_doc(symbol) {
		if (!symbol.valueDeclaration || !ts.isParameter(symbol.valueDeclaration)) {
			// TODO: Document error
			throw new Error("Not a parameter");
		}
		const type = this.#checker.getTypeOfSymbol(symbol);
		const isOptional = symbol.valueDeclaration.questionToken !== undefined;
		/** @type {Doc.FnParam} */
		// biome-ignore lint/style/useConst: Readability - mutation
		let data = {
			name: symbol.name,
			isOptional,
			type: this.#get_type_doc(type),
		};
		if (data.isOptional && symbol.valueDeclaration.initializer) {
			const default_ = this.#checker.getTypeAtLocation(symbol.valueDeclaration.initializer);
			data.default = this.#get_type_doc(default_);
		}
		return data;
	}

	/**
	 * @param {ts.Type} type
	 * @returns {Doc.Fn}
	 */
	#get_function_doc(type) {
		const calls = type.getCallSignatures().map((s) => {
			return {
				parameters: s.getParameters().map((p) => this.#get_fn_param_doc(p)),
				returns: this.#get_type_doc(s.getReturnType()),
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
			if (symbol && symbol.name !== "__type") results.alias = symbol.name;
			if (type.aliasSymbol && type.aliasSymbol.name !== "__type") results.alias = type.aliasSymbol.name;
		}
		const sources = this.#get_type_sources(type);
		// NOTE: Alias is needed, because the symbol is defined and named as "__type"
		if (sources && results.alias) results.sources = sources;
		return results;
	}

	/**
	 * @param {ts.Type} type
	 * @returns {Doc.WithAlias['sources'] | Doc.WithName["sources"]}
	 */
	#get_type_sources(type) {
		/** @type {ts.Symbol | undefined} */
		let symbol = type.getSymbol();
		if (!symbol || symbol.name === "__type") symbol = type.aliasSymbol;
		if (symbol) {
			const declared_type = this.#checker.getDeclaredTypeOfSymbol(symbol);
			const declared_type_symbol = declared_type.getSymbol() || declared_type.aliasSymbol;
			if (declared_type_symbol) {
				return new Set(
					Iterator.from(declared_type_symbol.getDeclarations() ?? []).map((d) =>
						remove_tsx_extension(d.getSourceFile().fileName),
					),
				);
			}
		}
	}

	/**
	 * @param {ts.Type} type
	 * @returns {Doc.Literal}
	 */
	#get_literal_doc(type) {
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
		throw new Error(`Unknown literal type: ${this.#checker.typeToString(type)}`);
	}

	/**
	 * @param {ts.Type} type
	 * @returns {Doc.Tuple}
	 */
	#get_tuple_doc(type) {
		// TODO: Document error
		if (!is_type_reference(type))
			throw new Error(`Expected type reference, got ${this.#checker.typeToString(type)}`);
		// TODO: Document error
		if (!is_tuple_type(type.target))
			throw new Error(`Expected tuple type, got ${this.#checker.typeToString(type)}`);
		const isReadonly = type.target.readonly;
		const elements = this.#checker.getTypeArguments(type).map((t) => this.#get_type_doc(t));
		/** @type {Doc.Tuple} */
		// biome-ignore lint/style/useConst: Readability - mutation
		let results = {
			kind: "tuple",
			isReadonly,
			elements,
		};
		if (type.aliasSymbol) {
			results.alias = type.aliasSymbol.name;
			const sources = this.#get_type_sources(type);
			if (sources) results.sources = sources;
		}
		return results;
	}

	/**
	 * @param {ts.Type} type
	 * @returns {Doc.TypeParam}
	 */
	#get_type_param_doc(type) {
		// TODO: Document error
		if (!type.isTypeParameter())
			throw new Error(`Expected type parameter, got ${this.#checker.typeToString(type)}`);
		const constraint = type.getConstraint();
		/** @type {Doc.TypeParam} */
		// biome-ignore lint/style/useConst: Readability - mutation
		let results = {
			kind: "type-parameter",
			name: type.symbol.name,
			constraint: constraint ? this.#get_type_doc(constraint) : { kind: "unknown" },
			isConst: is_const_type_param(type),
		};
		const default_ = type.getDefault();
		if (default_) results.default = this.#get_type_doc(default_);
		return results;
	}

	/**
	 * @param {ts.Type} type
	 * @returns {Doc.Union}
	 */
	#get_union_doc(type) {
		// TODO: Document error
		if (!type.isUnion()) throw new Error(`Expected union type, got ${this.#checker.typeToString(type)}`);
		const types = type.types.map((t) => this.#get_type_doc(t));
		/** @type {Doc.Union} */
		// biome-ignore lint/style/useConst: Readability - mutation
		let results = {
			kind: "union",
			types,
		};
		if (type.aliasSymbol) results.alias = type.aliasSymbol.name;
		const sources = this.#get_type_sources(type);
		if (sources) results.sources = sources;
		const nonNullable = type.getNonNullableType();
		if (nonNullable !== type) results.nonNullable = this.#get_type_doc(nonNullable);
		return results;
	}
}

/**
 * @typedef LegacyComponent
 * @prop {true} isLegacy
 * @prop {Doc.Component['description']} description
 * @prop {Doc.Component['tags']} tags
 * @prop {Doc.Props} props
 * @prop {Doc.Exports} exports
 * @prop {Doc.Events} events
 * @prop {Doc.Slots} slots
 */

/**
 * @typedef ModernComponent
 * @prop {false} isLegacy
 * @prop {Doc.Component['description']} description
 * @prop {Doc.Component['tags']} tags
 * @prop {Doc.Props} props
 * @prop {Doc.Exports} exports
 * @prop {never} events
 * @prop {never} slots
 */

/** @typedef {LegacyComponent | ModernComponent} ParsedComponent */

/**
 * @param {string} source
 * @param {UserOptions} user_options
 * @returns {ParsedComponent}
 */
export function parse(source, user_options = {}) {
	// @ts-expect-error WARN: Didn't want to use type casting here
	return new Parser(source, new Options(user_options));
}
