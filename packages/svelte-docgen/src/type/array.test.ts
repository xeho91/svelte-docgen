import { it } from "vitest";

import { generate } from "../mod.js";
import { OPTIONS, create_path_to_example_component } from "../../tests/shared.js";
import type { ArrayDocumentation } from "../documentation.ts";

const filepath = create_path_to_example_component("data", "type", "array.svelte");
const generated = generate(filepath, OPTIONS);
const { props } = generated[1];

it("documents prop(s) with 'array' type kind", ({ expect }) => {
	const letters = props.get("letters");
	expect(letters).toBeDefined();
	expect((letters?.type as ArrayDocumentation).isReadonly).toBe(false);
	expect(letters?.type).toMatchInlineSnapshot(`
		{
		  "element": {
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
		  "isReadonly": false,
		  "kind": "array",
		}
	`);
});

it("recognizes 'readonly'", ({ expect }) => {
	const numbers = props.get("numbers");
	expect(numbers).toBeDefined();
	expect((numbers?.type as ArrayDocumentation).isReadonly).toBe(true);
	expect(numbers?.type).toMatchInlineSnapshot(`
		{
		  "element": {
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
		  "isReadonly": true,
		  "kind": "array",
		}
	`);
});
