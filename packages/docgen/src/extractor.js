/**
 * @import { Options, SvelteFilepath } from "./util.js";
 */

import path from "node:path";

import ts from "typescript";

import { createCacheStorage } from "./cache.js";
import { Compiler } from "./compiler.js";
import { Parser } from "./parser.js";

export class Extractor {
	/** @type {SvelteFilepath} */
	filepath;
	/**
	 * @type {Options}
	 */
	options = {
		cache: createCacheStorage(),
		cwd: process.cwd(),
	};

	/** @type {Parser} */
	parser;
	/** @type {Compiler} */
	compiler;

	/** @type {Map<string, { symbol: ts.Symbol, type: ts.Type }>} */
	props = new Map();
	/** @type {Set<string>} */
	bindings = new Set();
	/** @type {Map<string, string>} */
	props_defaults = new Map();
	/**
	 * TODO: Add support for svelte v4
	 * @type {Set<string>}
	 */
	// events;

	/**
	 * @param {SvelteFilepath} filepath
	 * @param {Partial<Options>} options
	 */
	constructor(filepath, options) {
		this.filepath = filepath;
		this.options = { ...this.options, ...options };
		this.parser = new Parser(this.filepath);
		this.compiler = new Compiler(this.filepath, this.parser);
		this.#extract_props_and_bindings();
		this.#extract_props_defaults();
	}

	/** @returns {ReturnType<typeof createCacheStorage>} */
	get cache() {
		return this.options.cache;
	}

	/** @type {ts.Program | undefined} */
	#program;

	/** @returns {ts.Program} */
	get program() {
		if (this.#program) return this.#program;
		this.#program = this.#create_program();
		return this.#program;
	}

	/**
	 * @returns {ts.Program}
	 */
	#create_program() {
		this.cache.root_names.add(this.compiler.filepath);
		const program = ts.createProgram({
			rootNames: Array.from(this.cache.root_names),
			options: this.#get_ts_options(),
			host: this.#create_host(),
			oldProgram: this.cache.program,
		});
		return program;
	}

	/** @returns {ts.CompilerOptions} */
	#get_ts_options() {
		const cached = this.cache.get(this.filepath)?.options;
		if (cached) return cached;
		const options = this.#build_ts_options();
		this.cache.set(this.filepath, { options });
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
		}
		return this.#forced_ts_options;
	}

	/**
	 * @returns {string | undefined}
	 */
	#find_ts_config_path() {
		return (
			ts.findConfigFile(this.filepath, ts.sys.fileExists) ||
			ts.findConfigFile(this.filepath, ts.sys.fileExists, "jsconfig.json")
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
				if (this.cache.has(filepath)) return true;
				if (filepath === this.compiler.filepath) return true;
				return default_host.fileExists(filepath);
			},
			getSourceFile: (filepath, language_version, on_error) => {
				const without_tsx = filepath.replace(/.svelte.tsx$/, ".svelte");
				const last_modified = ts.sys.getModifiedTime?.(without_tsx);
				const cached = this.cache.get(filepath);
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
						this.parser.is_lang_typescript ? ts.ScriptKind.TS : ts.ScriptKind.JS,
					);
				} else {
					source = default_host.getSourceFile(filepath, language_version, on_error);
				}
				if (!source) throw new Error(`Source file was not found by program: ${filepath}`);
				this.cache.set(filepath, { source, last_modified });
				return source;
			},
			readFile: (filepath) => {
				const cached = this.cache.get(filepath);
				if (cached?.content) return cached.content;
				/** @type {string | undefined} */
				let content;
				if (filepath === this.compiler.filepath) {
					content = this.compiler.tsx.code;
				} else {
					content = default_host.readFile(filepath);
				}
				if (content) this.cache.set(filepath, { content });
				return content;
			},
			writeFile: () => {
				// Do nothing
			},
		};
		return {
			...default_host,
			...overridden_methods,
		};
	}

	/** @type {ts.TypeChecker | undefined} */
	#checker;

	/** @returns {ts.TypeChecker} */
	get checker() {
		if (this.#checker) return this.#checker;
		this.#checker = this.program.getTypeChecker();
		return this.#checker;
	}

	/** @type {ts.SourceFile | undefined} */
	#source_file;

	/** @returns {ts.SourceFile} */
	get source_file() {
		if (this.#source_file) return this.#source_file;
		const from_cache = this.cache.get(this.compiler.filepath)?.source;
		if (from_cache) return from_cache;
		const from_program = this.program.getSourceFile(this.compiler.filepath);
		// TODO: Document it
		if (!from_program)
			throw new Error(`Source file could not be found by TypeScript program: ${this.compiler.filepath}`);
		this.#source_file = this.cache.set(this.compiler.filepath, { source: from_program }).source;
		return from_program;
	}

	/** @type {ts.FunctionDeclaration | undefined} */
	#fn_render;

	/** @returns {ts.FunctionDeclaration} */
	get fn_render() {
		if (this.#fn_render) return this.#fn_render;
		this.#fn_render = this.#find_render_fn_declaration();
		return this.#fn_render;
	}

	/** @returns {ts.FunctionDeclaration} */
	#find_render_fn_declaration() {
		for (const statement of this.source_file.statements) {
			if (ts.isFunctionDeclaration(statement) && statement.name?.text === "render") {
				return statement;
			}
		}
		// TODO: Document it
		throw new Error("render not found");
	}

	/**
	 * The whole line statement, like:
	 * ```ts`
	 * let { ...props } = $props();
	 * ```
	 *
	 * @type {ts.VariableStatement | undefined}
	 */
	#stamenent_with_props_rune;

	/** @returns {ts.VariableStatement | undefined} */
	get statement_with_props_rune() {
		if (this.#stamenent_with_props_rune) return this.#stamenent_with_props_rune;
		this.#stamenent_with_props_rune = this.#find_statement_with_props_rune();
		return this.#stamenent_with_props_rune;
	}

	/** @returns {ts.VariableStatement | undefined} */
	#find_statement_with_props_rune() {
		for (const statement of this.fn_render.body?.statements || []) {
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
	#get_props_obj() {
		const declaration = this.statement_with_props_rune?.declarationList.declarations?.[0];
		if (declaration && ts.isObjectBindingPattern(declaration.name)) {
			return declaration.name;
		}
	}

	#extract_props_and_bindings() {
		const signature = this.checker.getSignatureFromDeclaration(this.fn_render);
		// TODO: Document it
		if (!signature) throw new Error("signature not found");
		const return_type = this.checker.getReturnTypeOfSignature(signature);
		const properties = return_type.getProperties();
		/** @type {{ props?: ts.Type, bindings?: ts.Type }} */
		// biome-ignore lint/style/useConst: Readability: mutation
		let results = {};
		// biome-ignore format: Prettier
		for (const prop of properties) {
			const name = prop.getName();
			// TODO: Add support for Svelte v4 - exports, slots, and events
			switch (name) {
				case "props":
				case "bindings": {
					results[name] = this.checker.getTypeOfSymbolAtLocation(prop, this.fn_render);
					continue;
				}
				default: continue;
			}
		}
		const { props, bindings } = results;
		// TODO: Document it
		if (!props) throw new Error("props not found");
		this.#extract_props(props);
		// TODO: Document it
		if (!bindings?.isUnion()) throw new Error("Bindings isn't an union type");
		this.#extract_bindings(bindings);
	}

	/** @param {ts.Type} type */
	#extract_props(type) {
		for (const symbol of type.getProperties()) {
			const name = symbol.getName();
			// TODO: Add support for Svelte v4
			if (name.startsWith("on:")) continue;
			const type = this.checker.getTypeOfSymbolAtLocation(symbol, this.source_file);
			this.props.set(name, { type, symbol });
		}
	}

	/** @param {ts.UnionType} union */
	#extract_bindings(union) {
		for (const type of union.types) {
			// TODO: Document it
			if (!type.isStringLiteral()) throw new Error("Expected bindings to be a union of string literal types");
			this.bindings.add(type.value);
		}
	}

	#extract_props_defaults() {
		for (const binding of this.#get_props_obj()?.elements ?? []) {
			if (binding.initializer) {
				const type = this.checker.getTypeAtLocation(binding.initializer);
				this.props_defaults.set(binding.name.getText(), this.checker.typeToString(type));
			}
		}
	}
}
