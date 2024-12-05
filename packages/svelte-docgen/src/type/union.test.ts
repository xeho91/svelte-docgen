import { it } from "vitest";

import { OPTIONS, create_path_to_example_component } from "../../tests/shared.js";
import type { Doc } from "../documentation.js";
import { parse } from "../parser.js";

const filepath = create_path_to_example_component("data", "type", "union.svelte");
const parsed = parse(filepath, OPTIONS);
const { props } = parsed[1];

it("documents prop(s) with 'union' type kind - string literals", ({ expect }) => {
	const color = props.get("color");
	expect(color).toBeDefined();
	expect(color?.type).toMatchInlineSnapshot(`
		{
		  "kind": "union",
		  "types": [
		    {
		      "kind": "literal",
		      "subkind": "string",
		      "value": "primary",
		    },
		    {
		      "kind": "literal",
		      "subkind": "string",
		      "value": "secondary",
		    },
		    {
		      "kind": "literal",
		      "subkind": "string",
		      "value": "tertiary",
		    },
		  ],
		}
	`);
});

it("documents prop(s) with 'union' type kind - number literals", ({ expect }) => {
	const step = props.get("step");
	expect(step).toBeDefined();
	expect(step?.type).toMatchInlineSnapshot(`
		{
		  "kind": "union",
		  "types": [
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
		    {
		      "kind": "literal",
		      "subkind": "number",
		      "value": 3,
		    },
		  ],
		}
	`);
});

it("documents prop(s) with 'union' type kind - mixed", ({ expect }) => {
	const mixed = props.get("mixed");
	expect(mixed).toBeDefined();
	expect(mixed?.type).toMatchInlineSnapshot(`
		{
		  "kind": "union",
		  "nonNullable": {
		    "kind": "union",
		    "types": [
		      {
		        "kind": "string",
		      },
		      {
		        "kind": "number",
		      },
		      {
		        "kind": "bigint",
		      },
		      {
		        "kind": "literal",
		        "subkind": "boolean",
		        "value": false,
		      },
		      {
		        "kind": "literal",
		        "subkind": "boolean",
		        "value": true,
		      },
		    ],
		  },
		  "types": [
		    {
		      "kind": "undefined",
		    },
		    {
		      "kind": "null",
		    },
		    {
		      "kind": "string",
		    },
		    {
		      "kind": "number",
		    },
		    {
		      "kind": "bigint",
		    },
		    {
		      "kind": "literal",
		      "subkind": "boolean",
		      "value": false,
		    },
		    {
		      "kind": "literal",
		      "subkind": "boolean",
		      "value": true,
		    },
		  ],
		}
	`);
});

it("recognizes aliased union type", ({ expect }) => {
	const aliased = props.get("aliased");
	expect(aliased).toBeDefined();
	expect(aliased?.type).toMatchInlineSnapshot(`
		{
		  "alias": "Aliased",
		  "kind": "union",
		  "sources": [
		    "/Users/xeho91/Nextcloud/Projects/oss/svelte-docgen/packages/svelte-docgen/examples/data/type/union.svelte",
		  ],
		  "types": [
		    {
		      "kind": "literal",
		      "subkind": "string",
		      "value": "red",
		    },
		    {
		      "kind": "literal",
		      "subkind": "string",
		      "value": "green",
		    },
		    {
		      "kind": "literal",
		      "subkind": "string",
		      "value": "blue",
		    },
		  ],
		}
	`);
	expect((aliased?.type as Doc.Union)?.alias).toBeDefined();
	expect((aliased?.type as Doc.Union)?.alias).toBe("Aliased");
});
