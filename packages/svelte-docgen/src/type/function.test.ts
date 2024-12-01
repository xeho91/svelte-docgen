import { it } from "vitest";

import { OPTIONS, create_path_to_example_component } from "../../tests/shared.js";
import { generate } from "../mod.js";

const filepath = create_path_to_example_component("data", "type", "function.svelte");
const generated = generate(filepath, OPTIONS);
const { props } = generated[1];

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
