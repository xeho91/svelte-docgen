import { it } from "vitest";

import { OPTIONS, create_path_to_example_component } from "../../tests/shared.js";
import type { Doc } from "../documentation.ts";
import { parse } from "../parser.js";

const filepath = create_path_to_example_component("data", "type", "tuple.svelte");
const parsed = parse(filepath, OPTIONS);
const { props } = parsed[1];

it("documents prop(s) with 'tuple' type kind", ({ expect }) => {
	const sample = props.get("sample");
	expect(sample).toBeDefined();
	expect(sample?.type).toMatchInlineSnapshot(`
		{
		  "elements": [
		    {
		      "alias": "Letter",
		      "kind": "union",
		      "sources": [
		        "/Users/xeho91/Nextcloud/Projects/oss/svelte-docgen/packages/svelte-docgen/examples/data/type/tuple.svelte",
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
		    {
		      "alias": "Num",
		      "kind": "union",
		      "sources": [
		        "/Users/xeho91/Nextcloud/Projects/oss/svelte-docgen/packages/svelte-docgen/examples/data/type/tuple.svelte",
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
		  ],
		  "isReadonly": false,
		  "kind": "tuple",
		}
	`);
	expect((sample?.type as Doc.Tuple).isReadonly).toBe(false);
});

it("recognizes 'readonly'", ({ expect }) => {
	const strict = props.get("strict");
	expect(strict).toBeDefined();
	expect(strict?.type).toMatchInlineSnapshot(`
		{
		  "elements": [
		    {
		      "alias": "Letter",
		      "kind": "union",
		      "sources": [
		        "/Users/xeho91/Nextcloud/Projects/oss/svelte-docgen/packages/svelte-docgen/examples/data/type/tuple.svelte",
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
		    {
		      "alias": "Num",
		      "kind": "union",
		      "sources": [
		        "/Users/xeho91/Nextcloud/Projects/oss/svelte-docgen/packages/svelte-docgen/examples/data/type/tuple.svelte",
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
		  ],
		  "isReadonly": true,
		  "kind": "tuple",
		}
	`);
	expect((strict?.type as Doc.Tuple).isReadonly).toBe(true);
});

it("recognizes empty tuple", ({ expect }) => {
	const empty = props.get("empty");
	expect(empty).toBeDefined();
	expect(empty?.type).toMatchInlineSnapshot(`
		{
		  "elements": [],
		  "isReadonly": false,
		  "kind": "tuple",
		}
	`);
	expect((empty?.type as Doc.Tuple).isReadonly).toBe(false);
});

it("recognizes 'readonly' empty tuple", ({ expect }) => {
	const empty = props.get("really-empty");
	expect(empty).toBeDefined();
	expect(empty?.type).toMatchInlineSnapshot(`
		{
		  "elements": [],
		  "isReadonly": true,
		  "kind": "tuple",
		}
	`);
	expect((empty?.type as Doc.Tuple).isReadonly).toBe(true);
});

it("recognizes aliased tuple type", ({ expect }) => {
	const aliased = props.get("aliased");
	expect(aliased).toBeDefined();
	expect(aliased?.type).toMatchInlineSnapshot(`
		{
		  "alias": "Aliased",
		  "elements": [
		    {
		      "kind": "string",
		    },
		    {
		      "kind": "boolean",
		    },
		  ],
		  "isReadonly": false,
		  "kind": "tuple",
		}
	`);
	expect((aliased?.type as Doc.Tuple).alias).toBeDefined();
	expect((aliased?.type as Doc.Tuple).alias).toBe("Aliased");
});
