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
export const REQUEST_SCHEMA = v.object({
	filepath: v.pipe(v.string(), v.endsWith(".svelte")),
	source: v.optional(v.string()),
	keys: v.optional(v.array(v.picklist(PARSED_COMPONENT_FIELDS))),
});

/**
 * A generic schema with improved TypeScript experience for hand-picking the keys of {@link ParsedComponent} data.
 * @template {keyof ParsedComponent} [T=keyof ParsedComponent]
 * @typedef RequestOptions
 * @prop {string} filepath Path to targetted `*.svelte` component file.
 * @prop {string} [source] Svelte component source code. You can read the component file by yourself, so the server will skip attempt to read the source - synchronously.
 * @prop {T[]} [keys]  Pick specific keys from the `ParsedComponent` to be generated.
 */
