import { it } from "vitest";

import { generate } from "../mod.js";
import { OPTIONS, create_path_to_example_component } from "../../tests/shared.js";

const filepath = create_path_to_example_component("data", "type", "interface.svelte");
const generated = generate(filepath, OPTIONS);
const { props } = generated[1];

it("documents prop(s) with 'interface' type kind", ({ expect }) => {
	const a = props.get("a");
	expect(a).toBeDefined();
	expect(a?.type).toMatchInlineSnapshot(`
		{
		  "kind": "interface",
		  "members": Map {
		    "name" => {
		      "isOptional": false,
		      "isReadonly": false,
		      "type": {
		        "kind": "string",
		      },
		    },
		    "age" => {
		      "isOptional": true,
		      "isReadonly": false,
		      "type": {
		        "kind": "union",
		        "types": [
		          {
		            "kind": "undefined",
		          },
		          {
		            "kind": "number",
		          },
		        ],
		      },
		    },
		    "moo" => {
		      "isOptional": false,
		      "isReadonly": false,
		      "type": {
		        "calls": [
		          {
		            "parameters": [],
		            "returns": {
		              "kind": "void",
		            },
		          },
		        ],
		        "kind": "function",
		      },
		    },
		  },
		  "name": "A",
		}
	`);
});

it("recognizes 'readonly' members", ({ expect }) => {
	const b = props.get("b");
	expect(b).toBeDefined();
	expect(b?.type).toMatchInlineSnapshot(`
		{
		  "kind": "interface",
		  "members": Map {
		    "x" => {
		      "isOptional": false,
		      "isReadonly": true,
		      "type": {
		        "kind": "number",
		      },
		    },
		    "y" => {
		      "isOptional": false,
		      "isReadonly": true,
		      "type": {
		        "kind": "number",
		      },
		    },
		  },
		  "name": "B",
		}
	`);
});
