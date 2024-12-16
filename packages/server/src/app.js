import { Hono } from "hono";
import { vValidator } from "@hono/valibot-validator";

import { BODY_SCHEMA } from "./schema.js";
import { parse_source, serialize_data } from "./shared.js";

const APP = new Hono();

APP.post(
	"/",
	//
	vValidator("json", BODY_SCHEMA),
	async (ctx, _next) => {
		const body = ctx.req.valid("json");
		let { fields, filepath, source } = body;
		if (!source) {
			if (typeof globalThis.Bun !== "undefined") {
				const { read_filepath_source_with_bun } = await import("./bun.js");
				source = read_filepath_source_with_bun(body.filepath);
			}
			if (typeof globalThis.Deno !== "undefined") {
				const { read_filepath_source_with_deno } = await import("./deno.js");
				source = read_filepath_source_with_deno(body.filepath);
			}
			if (typeof process !== "undefined" && process.versions && process.versions.node) {
				const { read_filepath_source_with_node } = await import("./node.js");
				source = read_filepath_source_with_node(body.filepath);
			} else {
				// TODO: Document error & add more runtimes (Deno, Bun) support
				throw new Error("Unsupported runtime");
			}
		}
		const data = parse_source({ filepath, fields, source });
		return ctx.json(serialize_data(data));
	},
);

export { APP };
