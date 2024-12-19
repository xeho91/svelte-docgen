/**
 * Related to {@link Hono} instance.
 * @module
 * @internal
 */

/**
 * @import { ParsedComponent } from "./schema.js";
 */

import { vValidator } from "@hono/valibot-validator";
import { Hono } from "hono";
import { createCacheStorage, parse, encode } from "svelte-docgen";

import { REQUEST_SCHEMA } from "./schema.js";

/**
 * @internal
 * {@link Hono} instance.
 */
const APP = new Hono();

APP.post(
	"/",
	//
	vValidator("json", REQUEST_SCHEMA),
	async (ctx, _next) => {
		const body = ctx.req.valid("json");
		let { keys, filepath, source } = body;
		if (!source) {
			let module;
			const runtime_name = get_runtime_name();
			if (runtime_name === "bun") module = await import("./bun/server.js");
			if (runtime_name === "deno") module = await import("./deno/server.js");
			if (runtime_name === "node") module = await import("./node/server.js");
			if (!module) throw new Error("Unsupported runtime");
			const { read_file_sync } = module;
			source = read_file_sync(body.filepath);
		}
		const parsed = parse(source, {
			// @ts-expect-error TODO: Perhaps is best to just accept string type?
			filepath,
			cache: CACHE_STORAGE,
		});
		return ctx.json(encode(parsed, { keys }));
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
