// FIXME:
// Find a better workaround.
// Current issue: https://github.com/vitest-dev/vitest/issues/6953
// We want to remove it, for the cross-runtime compatibility.
// import module from "node:module";

import ts from "typescript";

// /**
//  * @param {string} specifier
//  * @returns {URL}
//  */
// function get_node_module_filepath(specifier) {
// 	if (typeof import.meta.resolve === "function") return new URL(import.meta.resolve(specifier));
// 	const require = module.createRequire(import.meta.url);
// 	return new URL(`file://${require.resolve(specifier)}`);
// }

/**
 * @returns {string[]}
 */
function create_default_root_names() {
	return [
		//
		////get_node_module_filepath("svelte2tsx/svelte-shims-v4.d.ts").pathname,
		"/svelte2tsx/svelte-shims-v4.d.ts",
	];
}

/**
 * @typedef CachedFile
 * @prop {Date} [last_modified]
 * @prop {string} [content]
 * @prop {ts.SourceFile} [source]
 * @prop {ts.CompilerOptions} [options]
 */

class Cache {
	/** @type {Map<string, CachedFile>} */
	#cached = new Map();
	/** @type {ts.Program | undefined} */
	program;
	/** @type {Set<string>} */
	root_names = new Set(create_default_root_names());
	/** @type {ts.System} */
	#system;

	/** @param {ts.System | undefined} system */
	constructor(system) {
		this.#system = system ?? ts.sys;
	}

	/**
	 * @param {string} filepath
	 * @returns {boolean}
	 */
	has(filepath) {
		return this.#cached.has(filepath);
	}

	/**
	 * @param {string} filepath
	 * @returns {CachedFile | undefined}
	 */
	get(filepath) {
		const cached = this.#cached.get(filepath);
		const last_modified = this.#system.getModifiedTime?.(filepath);
		if (cached?.last_modified?.getTime() === last_modified?.getTime()) return cached;
	}

	/**
	 * @param {string} filepath
	 */
	delete(filepath) {
		this.#cached.delete(filepath);
	}

	/**
	 * @param {string} filepath
	 * @param {Partial<CachedFile>} updated
	 * @returns {CachedFile}
	 * */
	set(filepath, updated) {
		const cached = this.#cached.get(filepath);
		if (cached) return { ...cached, ...updated };
		const last_modified = this.#system?.getModifiedTime?.(filepath);
		const value = { ...updated, last_modified };
		this.#cached.set(filepath, value);
		return value;
	}
}

/**
 * @param {ts.System} [system]
 * @returns {Cache}
 * */
export const createCacheStorage = (system) => new Cache(system);
