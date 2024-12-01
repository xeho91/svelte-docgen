/**
 * @import { extract } from "svelte-docgen-extractor";
 *
 * @import { BaseDocumentation } from "./shared.js";
 * @import { TypeDocumentation } from "./type.js";
 */

import path from "node:path";

import ts from "typescript";

import { is_symbol_optional, parse_stringified_type } from "./shared.js";
import { get_type_documentation } from "./type.js";

export class PropDocumentation {
	/** @type {ts.Symbol} */
	#symbol;
	/** @type {ReturnType<typeof extract>} */
	#extractor;

	/**
	 * @param {ts.Symbol} symbol
	 * @param {ReturnType<typeof extract>} extractor
	 */
	constructor(symbol, extractor) {
		this.#symbol = symbol;
		this.#extractor = extractor;
	}

	/** @returns {boolean} */
	get isOptional() {
		return is_symbol_optional(this.#symbol);
	}

	/**
	 * @returns {this['isOptional'] extends true ? ReturnType<typeof parse_stringified_type> | undefined : never}
	 *  TODO: Should we read JSDoc tag `@default`?
	 */
	get default() {
		// TODO: Document error
		if (!this.isOptional) throw new Error();
		const initializer = this.#extractor.defaults.get(this.#symbol.name);
		// @ts-expect-error Not worth it?
		if (!initializer) return undefined;
		const type = this.#extractor.checker.getTypeAtLocation(initializer);
		const stringified = this.#extractor.checker.typeToString(type);
		return parse_stringified_type(stringified);
	}

	/** @returns {boolean} */
	get isBindable() {
		return this.#extractor.bindings.has(this.#symbol.name) || this.#symbol.name.startsWith("bind:");
	}

	/** @returns {boolean} */
	get isEventHandler() {
		// NOTE: Event handler cannot be an union
		if (this.#non_nullable_symbol_type.isUnion()) return false;
		const call_signatures = this.#non_nullable_symbol_type.getCallSignatures();
		if (call_signatures.length !== 1) return false;
		const return_type = call_signatures[0].getReturnType();
		const has_void_flag = (return_type.getFlags() & ts.TypeFlags.Void) === 0;
		const alias = this.#symbol_type.aliasSymbol;
		const has_event_handler_in_alias = alias?.name.endsWith("EventHandler") ?? false;
		return has_void_flag && has_event_handler_in_alias;
	}

	/**
	 * @param {ts.Type} type
	 * @returns {boolean}
	 * */
	#is_type_from_svelte(type) {
		const declaration = type.getSymbol()?.getDeclarations()?.[0];
		const source = declaration?.getSourceFile();
		// TODO: Document error
		if (!source) throw new Error("Could not find source file");
		const { dir } = path.parse(source.fileName);
		return dir.endsWith(path.join(path.sep, "node_modules", "svelte", "types"));
	}

	/** @returns {boolean} */
	get isSnippet() {
		const symbol = this.#non_nullable_symbol_type.getSymbol();
		return symbol?.name === "Snippet" && this.#is_type_from_svelte(this.#non_nullable_symbol_type);
	}

	/**
	 * Snippet parameters
	 * @returns {typeof this['isSnippet'] extends true ? TypeDocumentation[] : never}
	 */
	get parameters() {
		// TODO: Document error
		if (!this.isSnippet) throw new Error();
		const tuple_type_parameters = /** @type {ts.TupleType} */ (this.#non_nullable_symbol_type).typeArguments?.[0];
		if (!tuple_type_parameters || !this.#extractor.checker.isTupleType(tuple_type_parameters)) {
			// TODO: Document error
			throw new Error("Not a tuple type");
		}
		// @ts-expect-error Not worth it?
		return Iterator.from(/** @type {ts.TupleType} */ (tuple_type_parameters).typeArguments ?? [])
			.map((type_argument) => get_type_documentation({ type: type_argument, extractor: this.#extractor }))
			.toArray();
	}

	/** @returns {TypeDocumentation} */
	get type() {
		return get_type_documentation({ type: this.#symbol_type, extractor: this.#extractor });
	}

	/**
	 * @returns {BaseDocumentation['description']}
	 */
	get description() {
		const comment = this.#symbol.getDocumentationComment(this.#extractor.checker);
		return comment[0]?.text ?? "";
	}

	/**
	 * @returns {BaseDocumentation['tags']}
	 */
	get tags() {
		const tags = this.#symbol.getJsDocTags(this.#extractor.checker);
		return tags.map((tag) => ({
			name: tag.name,
			content: tag.text?.[0]?.text ?? "",
		}));
	}

	/** @type {ts.Type | undefined} */
	#cached_symbol_type;
	/** @returns {ts.Type} */
	get #symbol_type() {
		if (this.#cached_symbol_type) return this.#cached_symbol_type;
		this.#cached_symbol_type = this.#extractor.checker.getTypeOfSymbol(this.#symbol);
		return this.#cached_symbol_type;
	}

	/** @type {ts.Type | undefined} */
	#cached_non_nullable_symbol_type;
	/** @returns {ts.Type} */
	get #non_nullable_symbol_type() {
		if (this.#cached_non_nullable_symbol_type) return this.#cached_non_nullable_symbol_type;
		this.#cached_non_nullable_symbol_type = this.#extractor.checker.getNonNullableType(this.#symbol_type);
		return this.#cached_non_nullable_symbol_type;
	}
}

/**
 * @param {ReturnType<typeof extract>} extractor
 * @returns {Map<string, PropDocumentation>}
 */
export function generate_props_documentation(extractor) {
	/** @type {Map<string, PropDocumentation>} */
	// biome-ignore lint/style/useConst: Readability - mutation
	let results = new Map();
	for (const [name, symbol] of extractor.props) results.set(name, new PropDocumentation(symbol, extractor));
	return results;
}
