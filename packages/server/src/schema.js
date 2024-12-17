/**
 * Schemas for the RESTful API requests.
 * @module
 * @internal
 */

/**
 * @import { parse } from "svelte-docgen";
 */

import * as v from "valibot";

/**
 * @internal
 * Re-created, because we don't export this type from `"svelte-docgen" package`.
 * @see {@link parse}
 * @typedef {ReturnType<typeof parse>} ParsedComponent
 */

/**
 * @internal
 * Array with keyof ParsedComponent. Assigned to separate variable for ease of reusability / readabality.
 */
const PARSED_COMPONENT_FIELDS = /** @type {(keyof ParsedComponent)[]} */ ([
	"description",
	"isLegacy",
	"events",
	"exports",
	"props",
	"slots",
	"tags",
]);

/**
 * @internal
 * Array with keyof ParsedComponent. Assigned to separate variable for ease of reusability / readabality.
 */
export const BODY_SCHEMA = v.object({
	filepath: v.pipe(v.string(), v.endsWith(".svelte")),
	source: v.optional(v.string()),
	fields: v.array(v.picklist(PARSED_COMPONENT_FIELDS)),
});

/**
 * A generic schema with improved TypeScript experience for hand-picking the keys of {@link ParsedComponent} data.
 * @template {keyof ParsedComponent} T
 * @typedef BodySchema
 * @prop {string} filepath
 * @prop {string} [source]
 * @prop {T[]} keys
 */
