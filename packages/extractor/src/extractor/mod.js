/**
 * @import { Tag } from "./component-doc.js";
 * @import { Source } from "../util.js";
 */

import path from "node:path";

import ts from "typescript";

import { createCacheStorage } from "../cache.js";
import { Compiler } from "../compiler.js";
import { Options } from "../options.js";
import { Parser } from "../parser.js";
import { ComponentDocExtractor } from "./component-doc.js";

class Extractor {
	/** @type {Source} */
	source;
	/** @type {Options} */
	#options;
	/** @type {Parser} */
	parser;
	/** @type {Compiler} */
	compiler;

	/**
	 * @param {Source} source
	 * @param {Options} options
	 */
	constructor(source, options) {
		this.source = source;
		this.#options = new Options(options);
		this.parser = new Parser(this.source);
		this.compiler = new Compiler(this.source, this.parser, this.#options);
	}

	/** @returns {string | undefined} */
	get description() {
		return this.#component_doc_extractor?.description;
	}

	/** @returns {Tag[] | undefined} */
	get tags() {
		return this.#component_doc_extractor?.tags;
	}

	/** @returns {ComponentDocExtractor | undefined} */
	get documentation() {
		if (this.parser.componentComment) return new ComponentDocExtractor(this.parser.componentComment);
		return undefined;
	}

	/** @returns {Map<string, ts.Symbol>} */
	get props() {
		const { props } = this.#extracted_from_render_fn;
		// TODO: Document error
		if (!props) throw new Error("props not found");
		return new Map(Iterator.from(props.getProperties()).map((p) => [p.name, p]));
	}

	/** @returns {Map<string, ts.BindingElement>} */
	get defaults() {
		// biome-ignore lint/style/useConst: Readability: mutation
		let results = new Map();
		if (this.#props_obj) {
			for (const binding of this.#props_obj?.elements ?? []) {
				if (!binding.initializer) continue;
				const name = binding.name.getText();
				results.set(name, binding.initializer);
			}
		} else {
			// TODO: Remove when Svelte drops support for legacy export let (v4)
			for (const statement of this.#fn_render.body?.statements ?? []) {
				if (ts.isVariableStatement(statement) && (statement.flags & ts.NodeFlags.Let) === 0) {
					const first_item = statement.declarationList.declarations[0];
					if (!first_item) continue;
					if (!first_item.initializer) continue;
					const name = first_item.name.getText();
					results.set(name, first_item.initializer);
				}
			}
		}
		return results;
	}

	/** @returns {Set<string>} */
	get bindings() {
		// biome-ignore lint/style/useConst: Readability: mutation
		let results = new Set();
		const { bindings } = this.#extracted_from_render_fn;
		// TODO: Document error
		if (!bindings) throw new Error("bindings not found");
		// If in legacy mode, 'bindings' is a string type
		if (bindings.flags & ts.TypeFlags.String) {
			return results;
		}
		// If there is a single binding
		if (bindings.isStringLiteral()) {
			// NOTE: No bindings, is empty
			if (bindings.value === "") {
				return results;
			}
			results.add(bindings.value);
			return results;
		}
		// If there are multiple bindings
		// TODO: Document error
		if (!bindings?.isUnion()) throw new Error("bindings is not an union");
		for (const type of bindings.types) {
			// TODO: Document error
			if (!type.isStringLiteral()) throw new Error("Expected bindings to be a union of string literal types");
			results.add(type.value);
		}
		return results;
	}

	/**
	 * @returns {Map<string, Map<string, ts.Symbol>>}
	 * TODO: Remove when Svelte stops support for legacy slots (v4)
	 */
	get slots() {
		const { slots } = this.#extracted_from_render_fn;
		// TODO: Document error
		if (!slots) throw new Error("slots not found");
		return new Map(
			Iterator.from(
				slots.getProperties().map((s) => {
					const type = this.checker.getTypeOfSymbolAtLocation(s, this.#source_file);
					const props = new Map(Iterator.from(type.getProperties().map((p) => [p.name, p])));
					return [s.name, props];
				}),
			),
		);
	}

	/**
	 * @returns {Map<string, ts.Symbol>}
	 * TODO: Remove when Svelte stops support for legacy exports from instance script (v4)
	 */
	get exports() {
		const { exports } = this.#extracted_from_render_fn;
		// TODO: Document error
		if (!exports) throw new Error("exports not found");
		return new Map(Iterator.from(exports.getProperties()).map((e) => [e.name, e]));
	}

	/**
	 * @returns {Map<string, ts.Symbol>}
	 * TODO: Remove when Svelte stops support for legacy custom events (v4)
	 */
	get events() {
		const { events } = this.#extracted_from_render_fn;
		// TODO: Document error
		if (!events) throw new Error("events not found");
		return new Map(Iterator.from(events.getProperties()).map((e) => [e.name, e]));
	}

	/** @returns {ReturnType<typeof createCacheStorage>} */
	get #cache() {
		return this.#options.cache;
	}

	/** @type {ComponentDocExtractor | undefined} */
	#cached_component_doc_extractor;
	/** @type {ComponentDocExtractor | undefined} */
	get #component_doc_extractor() {
		if (this.#cached_component_doc_extractor) return this.#cached_component_doc_extractor;
		if (!this.parser.componentComment) return undefined;
		this.#cached_component_doc_extractor = new ComponentDocExtractor(this.parser.componentComment);
		return this.#cached_component_doc_extractor;
	}

	/** @type {ts.Program | undefined} */
	#cached_program;
	/** @returns {ts.Program} */
	get #program() {
		if (this.#cached_program) return this.#cached_program;
		this.#cached_program = this.#create_program();
		return this.#cached_program;
	}

	/**
	 * @returns {ts.Program}
	 */
	#create_program() {
		this.#cache.root_names.add(this.compiler.filepath);
		const program = ts.createProgram({
			rootNames: Array.from(this.#cache.root_names),
			options: this.#get_ts_options(),
			host: this.#create_host(),
			oldProgram: this.#cache.program,
		});
		return program;
	}

	/** @returns {ts.CompilerOptions} */
	#get_ts_options() {
		const cached = this.#cache.get(this.source)?.options;
		if (cached) return cached;
		const options = this.#build_ts_options();
		this.#cache.set(this.source, { options });
		return options;
	}

	/** @type {ts.CompilerOptions} */
	#forced_ts_options = {
		allowJs: true,
		checkJs: true,
		noEmit: true,
		skipDefaultLibCheck: true,
		skipLibCheck: true,
		sourceMap: false,
		strict: true,
	};

	/** @returns {ts.CompilerOptions} */
	#build_ts_options() {
		const configpath = this.#find_ts_config_path();
		if (configpath) {
			const config_file = ts.readConfigFile(configpath, ts.sys.readFile);
			const parsed = ts.parseJsonConfigFileContent(
				config_file.config,
				ts.sys,
				path.dirname(configpath),
				undefined,
				configpath,
				undefined,
				[
					{
						extension: "svelte",
						isMixedContent: true,
						scriptKind: ts.ScriptKind.Deferred,
					},
				],
			);
			return {
				...parsed.options,
				...this.#forced_ts_options,
			};
			// TODO: Create a warning when tsconfig.json `compilerOptions.lib` doesn't include DOM
		}
		return this.#forced_ts_options;
	}

	/**
	 * @returns {string | undefined}
	 */
	#find_ts_config_path() {
		return (
			ts.findConfigFile(this.source, ts.sys.fileExists) ||
			ts.findConfigFile(this.source, ts.sys.fileExists, "jsconfig.json")
		);
	}

	/**
	 * @returns {ts.CompilerHost}
	 */
	#create_host() {
		const default_host = ts.createCompilerHost(this.#get_ts_options());
		/** @type {Partial<ts.CompilerHost>} */
		const overridden_methods = {
			fileExists: (filepath) => {
				if (this.#cache.has(filepath)) return true;
				if (filepath === this.compiler.filepath) return true;
				return default_host.fileExists(filepath);
			},
			getSourceFile: (filepath, language_version, on_error) => {
				const cached = this.#cache.get(filepath);
				if (cached?.source) return cached.source;
				/** @type {ts.SourceFile | undefined} */
				let source;
				if (filepath === this.compiler.filepath) {
					const content = this.compiler.tsx.code;
					source = ts.createSourceFile(
						this.compiler.filepath,
						content,
						language_version,
						true,
						// Set to 'JS' to enable TypeScript to parse JSDoc.
						this.parser.isLangTypeScript ? ts.ScriptKind.TS : ts.ScriptKind.JS,
					);
				} else {
					source = default_host.getSourceFile(filepath, language_version, on_error);
				}
				if (!source) throw new Error(`Source file was not found by program: ${filepath}`);
				this.#cache.set(filepath, { source });
				return source;
			},
			readFile: (filepath) => {
				const cached = this.#cache.get(filepath);
				if (cached?.content) return cached.content;
				/** @type {string | undefined} */
				let content;
				if (filepath === this.compiler.filepath) content = this.compiler.tsx.code;
				else content = default_host.readFile(filepath);
				if (content) this.#cache.set(filepath, { content });
				return content;
			},
			writeFile: () => {
				/* WARN: Do absolutely nothing! */
			},
		};
		return {
			...default_host,
			...overridden_methods,
		};
	}

	/** @type {ts.TypeChecker | undefined} */
	#cached_checker;
	/** @returns {ts.TypeChecker} */
	get checker() {
		if (this.#cached_checker) return this.#cached_checker;
		this.#cached_checker = this.#program.getTypeChecker();
		return this.#cached_checker;
	}

	/** @type {ts.SourceFile | undefined} */
	#cached_source_file;
	/** @returns {ts.SourceFile} */
	get #source_file() {
		if (this.#cached_source_file) return this.#cached_source_file;
		const from_cache = this.#cache.get(this.compiler.filepath)?.source;
		if (from_cache) return from_cache;
		const from_program = this.#program.getSourceFile(this.compiler.filepath);
		//O TODO: Document it
		if (!from_program)
			throw new Error(`Source file could not be found by TypeScript program: ${this.compiler.filepath}`);
		this.#cached_source_file = this.#cache.set(this.compiler.filepath, {
			source: from_program,
		}).source;
		return from_program;
	}

	/** @type {ts.FunctionDeclaration | undefined} */
	#cached_fn_render;
	/** @rDeturns {ts.FunctionDeclaration} */
	get #fn_render() {
		if (this.#cached_fn_render) return this.#cached_fn_render;
		this.#cached_fn_render = this.#find_render_fn_declaration();
		return this.#cached_fn_render;
	}
	/** @returns {ts.FunctionDeclaration} */
	#find_render_fn_declaration() {
		for (const statement of this.#source_file.statements) {
			if (ts.isFunctionDeclaration(statement) && statement.name?.text === "render") {
				return statement;
			}
		}
		// TODO: Document error
		throw new Error("render fn not found");
	}

	/**
	 * The whole line statement, like:
	 * ```ts`
	 * let { ...props } = $props();
	 * ```
	 *
	 * @type {ts.VariableStatement | undefined}
	 */
	#cached_stamenent_with_props_rune;
	/** @returns {ts.VariableStatement | undefined} */
	get #statement_with_props_rune() {
		if (this.#cached_stamenent_with_props_rune) return this.#cached_stamenent_with_props_rune;
		this.#cached_stamenent_with_props_rune = this.#find_statement_with_props_rune();
		return this.#cached_stamenent_with_props_rune;
	}

	/** @returns {ts.VariableStatement | undefined} */
	#find_statement_with_props_rune() {
		for (const statement of this.#fn_render.body?.statements || []) {
			if (ts.isVariableStatement(statement)) {
				const initializer = statement.declarationList.declarations[0]?.initializer;
				if (
					initializer &&
					ts.isCallExpression(initializer) &&
					ts.isIdentifier(initializer.expression) &&
					initializer.expression.text === "$props"
				) {
					return statement;
				}
			}
		}
	}

	/** @returns {ts.ObjectBindingPattern | undefined} */
	get #props_obj() {
		const declaration = this.#statement_with_props_rune?.declarationList.declarations?.[0];
		if (declaration && ts.isObjectBindingPattern(declaration.name)) return declaration.name;
		return undefined;
	}

	/** @typedef {"props" | "bindings" | "slots" | "exports" | "events"} RenderFnKey */
	/** @type {{ [key in RenderFnKey]?: ts.Type } | undefined} */
	#cached_extracted_from_render_fn;
	/** @returns {{ [key in RenderFnKey]?: ts.Type }} */
	get #extracted_from_render_fn() {
		if (this.#cached_extracted_from_render_fn) return this.#cached_extracted_from_render_fn;
		const signature = this.checker.getSignatureFromDeclaration(this.#fn_render);
		// TODO: Document error
		if (!signature) throw new Error("signature not found");
		const return_type = this.checker.getReturnTypeOfSignature(signature);
		const properties = return_type.getProperties();
		this.#cached_extracted_from_render_fn = {};
		for (const prop of properties) {
			const name = prop.getName();
			// TODO: Add support for Svelte v4 - exports, slots, and events
			switch (name) {
				case "props":
				case "bindings":
				case "slots":
				case "exports":
				case "events": {
					this.#cached_extracted_from_render_fn[name] = this.checker.getTypeOfSymbolAtLocation(
						prop,
						this.#fn_render,
					);
					continue;
				}
				default:
					continue;
			}
		}
		return this.#cached_extracted_from_render_fn;
	}
}

/**
 * @param {string} source
 * @param {ConstructorParameters<typeof Options>[0]} user_options
 * @returns {Extractor}
 */
export function extract(source, user_options) {
	return new Extractor(source, new Options(user_options));
}
