/**
 * @import { Doc } from "./documentation.ts";
 * @import { Extractor } from "./shared.js"
 */

import ts from "typescript";

import { is_symbol_optional, remove_tsx_extension } from "./shared.js";
import { get_type_documentation } from "./type.js";

// 	/** @returns {boolean} */
// 	get isEventHandler() {
// 		// NOTE: Event handler cannot be an union
// 		if (this.#non_nullable_symbol_type.isUnion()) return false;
// 		const call_signatures = this.#non_nullable_symbol_type.getCallSignatures();
// 		if (call_signatures.length !== 1) return false;
// 		const return_type = call_signatures[0].getReturnType();
// 		const has_void_flag = (return_type.getFlags() & ts.TypeFlags.Void) === 0;
// 		const alias = this.#symbol_type.aliasSymbol;
// 		const has_event_handler_in_alias = alias?.name.endsWith("EventHandler") ?? false;
// 		return has_void_flag && has_event_handler_in_alias;
// 	}

// 	/**
// 	 * @param {ts.Type} type
// 	 * @returns {boolean}
// 	 * */
// 	#is_type_from_svelte(type) {
// 		const declaration = type.getSymbol()?.getDeclarations()?.[0];
// 		const source = declaration?.getSourceFile();
// 		// TODO: Document error
// 		if (!source) throw new Error("Could not find source file");
// 		const { dir } = path.parse(source.fileName);
// 		return dir.endsWith(path.join(path.sep, "node_modules", "svelte", "types"));
// 	}
//
// 	/** @returns {boolean} */
// 	get isSnippet() {
// 		const symbol = this.#non_nullable_symbol_type.getSymbol();
// 		return symbol?.name === "Snippet" && this.#is_type_from_svelte(this.#non_nullable_symbol_type);
// 	}
//
// 	/**
// 	 * Snippet parameters
// 	 * @returns {typeof this['isSnippet'] extends true ? Doc.TypeDocumentation[] : never}
// 	 */
// 	get parameters() {
// 		// TODO: Document error
// 		if (!this.isSnippet) throw new Error();
// 		const tuple_type_parameters = /** @type {ts.TupleType} */ (this.#non_nullable_symbol_type).typeArguments?.[0];
// 		if (!tuple_type_parameters || !this.#extractor.checker.isTupleType(tuple_type_parameters)) {
// 			// TODO: Document error
// 			throw new Error("Not a tuple type");
// 		}
// 		// @ts-expect-error Not worth it?
// 		return Iterator.from(/** @type {ts.TupleType} */ (tuple_type_parameters).typeArguments ?? [])
// 			.map((type_argument) => get_type_documentation({ type: type_argument, extractor: this.#extractor }))
// 			.toArray();
// 	}

/**
 * @param {Extractor} extractor
 * @returns {Doc.Props}
 */
export function get_props_documentation(extractor) {
	return new Map(
		Iterator.from(extractor.props).map(([name, symbol]) => {
			return [name, get_prop_doc(symbol, extractor)];
		}),
	);
}

/**
 * @param {ts.Symbol} symbol
 * @param {Extractor} extractor
 * @returns {Doc.Prop}
 */
function get_prop_doc(symbol, extractor) {
	const type = extractor.checker.getTypeOfSymbol(symbol);
	/** @type {Doc.Prop} */
	// biome-ignore lint/style/useConst: Readability - mutation
	let results = {
		tags: get_prop_tags(symbol, extractor),
		isBindable: extractor.bindings.has(symbol.name) || symbol.name.startsWith("bind:"),
		isOptional: is_symbol_optional(symbol),
		type: get_type_documentation({ extractor, type }),
		sources: get_symbol_sources(symbol),
	};
	const description = get_prop_description(symbol, extractor);
	if (description) results.description = description;
	if (results.isOptional) {
		const initializer = extractor.defaults.get(symbol.name);
		if (initializer) {
			const default_type = extractor.checker.getTypeAtLocation(initializer);
			results.default = get_type_documentation({ extractor, type: default_type });
		}
	}
	return results;
}

/**
 * @param {ts.Symbol} symbol
 * @param {Extractor} extractor
 * @returns {string | undefined}
 */
function get_prop_description(symbol, extractor) {
	const description = symbol.getDocumentationComment(extractor.checker);
	// TODO: Why it would be an array? Overloads? How should we handle it?
	return description?.[0]?.text;
}

/**
 * @param {ts.Symbol} symbol
 * @param {Extractor} extractor
 * @returns {Doc.Tag[]}
 */
function get_prop_tags(symbol, extractor) {
	return symbol.getJsDocTags(extractor.checker).map((t) => {
		/** @type {Doc.Tag} */
		// biome-ignore lint/style/useConst: Readability - mutation
		let results = { name: t.name };
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
function get_symbol_sources(symbol) {
	return symbol.getDeclarations()?.map((d) => remove_tsx_extension(d.getSourceFile().fileName)) ?? [];
}
