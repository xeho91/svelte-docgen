/**
 * @import { extract } from "@svelte-docgen/extractor";
 */

import fs from "node:fs";
import path from "node:path";
import url from "node:url";

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

/**
 * @internal
 * Creates a Set with stringified **relative** paths of declaration file(s) where the type was declared.
 *
 * In order to make it relative, it trims out _root_ from the path. Also for security resons to prevent exposing the
 * full path to third-parties: https://github.com/svelte-docgen/svelte-docgen/issues/29
 *
 * It also trims `.tsx` extension for the filepaths with `*.svelte` - internally is appended to make it work with
 * TypeScript Compiler API {@link https://github.com/microsoft/TypeScript/wiki/Using-the-Compiler-API}.
 *
 * @param {ts.Declaration[]} declarations
 * @returns {Set<string>}
 */
export function get_sources(declarations) {
	return new Set(
		declarations.map((d) => {
			const filename = d.getSourceFile().fileName;
			const root_path_url = get_root_path_url();
			/* prettier-ignore */
			return filename
				.replace(".tsx", "")
				.replace(root_path_url.pathname, "");
		}),
	);
}

/**
 * @internal
 * Find the _root_ path of the project.
 * It covers monorepo case _(based on existence of `pnpm-workspace.yaml` or field `package.json#workspaces`)_.
 * Field `package.json#workspaces` is also case for: npm, yarn, Deno, and Bun.
 *
 * @returns {URL} URI with path of either monorepo root or a basename of nearest `package.json` file.
 * @throws {Error} If it cannot find nearest `package.json` file if project isn't a monorepo.
 */
function get_root_path_url() {
	let directory = path.resolve(process.cwd());
	const { root } = path.parse(directory);
	/** @type {string | undefined} */
	let package_json_filepath;
	while (directory && directory !== root) {
		try {
			const pnpm_workspace_filepath = path.join(directory, "pnpm-workspace.yaml");
			const stats = fs.statSync(pnpm_workspace_filepath, { throwIfNoEntry: false });
			if (stats?.isFile()) return url.pathToFileURL(directory);
		} catch {
			/** Is okay, do nothing. Check for other possibilities. */
		}
		try {
			package_json_filepath = path.join(directory, "package.json");
			const stats = fs.statSync(package_json_filepath, { throwIfNoEntry: false });
			if (stats?.isFile()) {
				const content = fs.readFileSync(package_json_filepath, "utf-8");
				if (JSON.parse(content).workspaces) return url.pathToFileURL(directory);
			}
		} catch {
			/** Is okay, do nothing. Check parent up. */
		}
		// NOTE: This goes root up
		directory = path.dirname(directory);
	}
	if (package_json_filepath) return url.pathToFileURL(path.dirname(package_json_filepath));
	// TODO: Document error
	throw new Error("Could not determine the the root path.");
}
