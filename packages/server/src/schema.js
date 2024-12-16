/**
 * @import { parse } from "svelte-docgen";
 * */

import * as v from "valibot";

/** @typedef {ReturnType<typeof parse>} ParsedComponent */
/** @typedef {keyof ParsedComponent} Fields */

const FIELDS = /** @type {Fields[]} */ (["description", "isLegacy", "events", "exports", "props", "slots", "tags"]);

export const BODY_SCHEMA = v.object({
	filepath: v.pipe(v.string(), v.endsWith(".svelte")),
	source: v.optional(v.string()),
	fields: v.array(v.picklist(FIELDS)),
});

/** @typedef {v.InferInput<typeof BODY_SCHEMA>} BodySchema */
