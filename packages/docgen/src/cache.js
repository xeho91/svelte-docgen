import ts from "typescript";

/**
 * @typedef {Object} Props
 * @prop {ts.Program} [program]
 */

/**
 * @typedef CachedFile
 * @prop {Date} [last_modified]
 * @prop {string} [content]
 * @prop {ts.SourceFile} [source]
 * @prop {ts.CompilerOptions} [options]
 */

export class Cache {
	/** @type {Map<string, CachedFile>} */
	#cached = new Map();
	/** @type {ts.Program | undefined} */
	program;
	/** @type {Set<string>} */
	root_names = new Set([require.resolve("svelte2tsx/svelte-shims-v4.d.ts")]);

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
		const last_modified = ts.sys.getModifiedTime?.(filepath);
		if (cached?.last_modified?.getTime() === last_modified?.getTime()) return cached;
	}

	/**
	 * @param {string} filepath
	 * @param {Partial<CachedFile>} updated
	 * @returns {CachedFile}
	 * */
	set(filepath, updated) {
		const cached = this.#cached.get(filepath);
		if (cached) return { ...cached, ...updated };
		this.#cached.set(filepath, updated);
		return updated;
	}
}

/** @returns {Cache} */
export const createCacheStorage = () => new Cache();
