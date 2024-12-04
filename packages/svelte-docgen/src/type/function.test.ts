import { it } from "vitest";

import { OPTIONS, create_path_to_example_component } from "../../tests/shared.js";
import type { Doc } from "../documentation.js";
import { parse } from "../parser.js";

const filepath = create_path_to_example_component("data", "type", "function.svelte");
const parsed = parse(filepath, OPTIONS);
const { props } = parsed[1];

it("documents prop(s) with 'function' type - retuning void", ({ expect }) => {
	const void_ = props.get("void");
	expect(void_).toBeDefined();
	expect(void_?.type).toMatchInlineSnapshot(`
		{
		  "calls": [
		    {
		      "parameters": [],
		      "returns": {
		        "kind": "void",
		      },
		    },
		  ],
		  "kind": "function",
		}
	`);
});

it("documents return type other than 'void'", ({ expect }) => {
	const returning = props.get("returning");
	expect(returning).toBeDefined();
	expect(returning?.type).toMatchInlineSnapshot(`
		{
		  "calls": [
		    {
		      "parameters": [],
		      "returns": {
		        "kind": "string",
		      },
		    },
		  ],
		  "kind": "function",
		}
	`);
});

it("documents parameter(s) type if specified", ({ expect }) => {
	const parametized = props.get("parametized");
	expect(parametized).toBeDefined();
	expect(parametized?.type).toMatchInlineSnapshot(`
		{
		  "calls": [
		    {
		      "parameters": [
		        {
		          "isOptional": false,
		          "name": "foo",
		          "type": {
		            "kind": "string",
		          },
		        },
		        {
		          "isOptional": true,
		          "name": "bar",
		          "type": {
		            "kind": "union",
		            "nonNullable": {
		              "alias": "Baz",
		              "kind": "union",
		              "sources": [
		                "/Users/xeho91/Nextcloud/Projects/oss/svelte-docgen/packages/svelte-docgen/examples/data/type/function.svelte",
		              ],
		              "types": [
		                {
		                  "kind": "string",
		                },
		                {
		                  "kind": "number",
		                },
		              ],
		            },
		            "types": [
		              {
		                "kind": "undefined",
		              },
		              {
		                "kind": "string",
		              },
		              {
		                "kind": "number",
		              },
		            ],
		          },
		        },
		      ],
		      "returns": {
		        "kind": "boolean",
		      },
		    },
		  ],
		  "kind": "function",
		}
	`);

	const spreaded = props.get("spreaded");
	expect(spreaded).toBeDefined();
	expect(spreaded?.type).toMatchInlineSnapshot(`
		{
		  "calls": [
		    {
		      "parameters": [
		        {
		          "isOptional": false,
		          "name": "spread",
		          "type": {
		            "kind": "any",
		          },
		        },
		      ],
		      "returns": {
		        "kind": "null",
		      },
		    },
		  ],
		  "kind": "function",
		}
	`);
});

it("recognizes aliased type", ({ expect }) => {
	const aliased = props.get("aliased");
	expect(aliased).toBeDefined();
	expect(aliased?.type).toMatchInlineSnapshot(`
		{
		  "alias": "Aliased",
		  "calls": [
		    {
		      "parameters": [],
		      "returns": {
		        "kind": "void",
		      },
		    },
		  ],
		  "kind": "function",
		  "sources": [
		    "/Users/xeho91/Nextcloud/Projects/oss/svelte-docgen/packages/svelte-docgen/examples/data/type/function.svelte",
		  ],
		}
	`);
	expect((aliased?.type as Doc.Fn).alias).toBeDefined();
	expect((aliased?.type as Doc.Fn).alias).toBe("Aliased");
});
