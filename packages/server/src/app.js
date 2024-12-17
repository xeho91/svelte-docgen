/**
 * Related to {@link Hono} instance.
 * @module
 * @internal
 */

/**
 * @import { ParsedComponent } from "./schema.js";
 */

import { vValidator } from "@hono/valibot-validator";
import { createCacheStorage } from "@svelte-docgen/extractor";
import { Hono } from "hono";
import { parse, serialize } from "svelte-docgen";

import { BODY_SCHEMA } from "./schema.js";

/**
 * @internal
 * {@link Hono} instance.
 */
const APP = new Hono();

APP.post(
	"/",
	//
	vValidator("json", BODY_SCHEMA),
	async (ctx, _next) => {
		const body = ctx.req.valid("json");
		let { fields, filepath, source } = body;
		if (!source) {
			let module;
			const runtime_name = get_runtime_name();
			if (runtime_name === "bun") module = await import("./bun.js");
			if (runtime_name === "deno") module = await import("./deno.js");
			if (runtime_name === "node") module = await import("./node.js");
			if (!module) throw new Error("Unsupported runtime");
			const { read_file_sync } = module;
			source = read_file_sync(body.filepath);
		}
		const data = parse_source({ filepath, keys: fields, source });
		return ctx.json(serialize(data));
	},
);

/**
 * @internal
 * Cache storage for parsing source code of `*.svelte files.
 * @see {@link createCacheStorage}
 */
export const CACHE_STORAGE = createCacheStorage();

/**
 * Generic parameters for {@link parse_source}
 *
 * @template {keyof ParsedComponent} T
 * @typedef SourceParams
 * @prop {string} filepath
 * @prop {string} source
 * @prop {T[]} keys
 */

/**
 * @internal
 * Parse source code with `svelte-docgen` parser to return generated documentation data with handpicked object entries
 * (based on `keys`) by end-user.
 *
 * @template {keyof ParsedComponent} T
 * @param {SourceParams<T>} params
 * @returns {Pick<ParsedComponent, T>}
 */
function parse_source(params) {
	const { keys, filepath, source } = params;
	const parsed = parse(source, {
		// @ts-expect-error TODO: Perhaps is best to just accept string type?
		filepath,
		cache: CACHE_STORAGE,
	});
	// TODO: Move this feature to parser instead, we could speed up its job a little bit.
	return keys.reduce(
		(results, key) => {
			results[key] = parsed[key];
			return results;
		},
		/** @type {Pick<ParsedComponent, T>} */ ({}),
	);
}

/**
 * @internal
 * Get the supported JavaScript runtime name.
 *
 * @returns {"bun" | "deno" | "node"}
 */
function get_runtime_name() {
	if (typeof globalThis.Bun !== "undefined") return "bun";
	if (typeof globalThis.Deno !== "undefined") return "deno";
	if (
		typeof process !== "undefined" &&
		process.versions &&
		process.versions.node
	) {
		return "node";
	}
	throw new Error("Unsupported runtime.");
}

export { APP };
