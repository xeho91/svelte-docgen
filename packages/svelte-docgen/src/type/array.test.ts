import { it } from "vitest";

import { OPTIONS, create_path_to_example_component } from "../../tests/shared.js";
import type { Doc } from "../documentation.ts";
import { parse } from "../parser.js";

const filepath = create_path_to_example_component("data", "type", "array.svelte");
const parsed = parse(filepath, OPTIONS);
const { props } = parsed[1];

it("documents prop(s) with 'array' type kind", ({ expect }) => {
	const letters = props.get("letters");
	expect(letters).toBeDefined();
	expect(letters?.type).toMatchInlineSnapshot(`
		{
		  "element": {
		    "alias": "Letter",
		    "kind": "union",
		    "sources": [
		      "/Users/xeho91/Nextcloud/Projects/oss/svelte-docgen/packages/svelte-docgen/examples/data/type/array.svelte",
		    ],
		    "types": [
		      {
		        "kind": "literal",
		        "subkind": "string",
		        "value": "a",
		      },
		      {
		        "kind": "literal",
		        "subkind": "string",
		        "value": "b",
		      },
		      {
		        "kind": "literal",
		        "subkind": "string",
		        "value": "c",
		      },
		    ],
		  },
		  "isReadonly": false,
		  "kind": "array",
		}
	`);
	expect((letters?.type as Doc.ArrayType).isReadonly).toBe(false);
});

it("recognizes 'readonly'", ({ expect }) => {
	const numbers = props.get("numbers");
	expect(numbers).toBeDefined();
	expect(numbers?.type).toMatchInlineSnapshot(`
		{
		  "element": {
		    "alias": "Num",
		    "kind": "union",
		    "sources": [
		      "/Users/xeho91/Nextcloud/Projects/oss/svelte-docgen/packages/svelte-docgen/examples/data/type/array.svelte",
		    ],
		    "types": [
		      {
		        "kind": "literal",
		        "subkind": "number",
		        "value": 0,
		      },
		      {
		        "kind": "literal",
		        "subkind": "number",
		        "value": 1,
		      },
		      {
		        "kind": "literal",
		        "subkind": "number",
		        "value": 2,
		      },
		    ],
		  },
		  "isReadonly": true,
		  "kind": "array",
		}
	`);
	expect((numbers?.type as Doc.ArrayType).isReadonly).toBe(true);
});
