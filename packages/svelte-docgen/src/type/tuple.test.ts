import { it } from "vitest";

import { OPTIONS, create_path_to_example_component } from "../../tests/shared.js";
import type { TupleDocumentation } from "../documentation.ts";
import { generate } from "../mod.js";

const filepath = create_path_to_example_component("data", "type", "tuple.svelte");
const generated = generate(filepath, OPTIONS);
const { props } = generated[1];

it("documents prop(s) with 'tuple' type kind", ({ expect }) => {
	const sample = props.get("sample");
	expect(sample).toBeDefined();
	expect((sample?.type as TupleDocumentation).isReadonly).toBe(false);
	expect(sample?.type).toMatchInlineSnapshot(`
		{
		  "elements": [
		    {
		      "alias": "Letter",
		      "kind": "union",
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
});

it("recognizes 'readonly'", ({ expect }) => {
	const strict = props.get("strict");
	expect(strict).toBeDefined();
	expect((strict?.type as TupleDocumentation).isReadonly).toBe(true);
	expect(strict?.type).toMatchInlineSnapshot(`
		{
		  "elements": [
		    {
		      "alias": "Letter",
		      "kind": "union",
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
});

it("recognizes empty tuple", ({ expect }) => {
	const empty = props.get("empty");
	expect(empty).toBeDefined();
	expect((empty?.type as TupleDocumentation).isReadonly).toBe(false);
	expect(empty?.type).toMatchInlineSnapshot(`
		{
		  "elements": [],
		  "isReadonly": false,
		  "kind": "tuple",
		}
	`);
});

it("recognizes 'readonly' empty tuple", ({ expect }) => {
	const empty = props.get("really-empty");
	expect(empty).toBeDefined();
	expect((empty?.type as TupleDocumentation).isReadonly).toBe(true);
	expect(empty?.type).toMatchInlineSnapshot(`
		{
		  "elements": [],
		  "isReadonly": true,
		  "kind": "tuple",
		}
	`);
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
	expect(aliased?.type.alias).toBeDefined();
});
