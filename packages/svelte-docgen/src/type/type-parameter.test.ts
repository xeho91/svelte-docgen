import { it } from "vitest";

import { OPTIONS, create_path_to_example_component } from "../../tests/shared.js";
import { generate } from "../mod.js";

const filepath = create_path_to_example_component("data", "type", "type-parameter.svelte");
const generated = generate(filepath, OPTIONS);
const { props } = generated[1];

it("documents prop(s) with 'type-parameter' type kind - unknown", ({ expect }) => {
	const unknown = props.get("unknown");
	expect(unknown).toBeDefined();
	expect(unknown?.type).toMatchInlineSnapshot(`
		{
		  "constraint": {
		    "kind": "unknown",
		  },
		  "isConst": false,
		  "kind": "type-parameter",
		  "name": "U",
		}
	`);
});

it("recognizes `const`", ({ expect }) => {
	const with_const = props.get("constant");
	expect(with_const).toBeDefined();
	expect(with_const?.type).toMatchInlineSnapshot(`
		{
		  "constraint": {
		    "kind": "unknown",
		  },
		  "isConst": true,
		  "kind": "type-parameter",
		  "name": "C",
		}
	`);
});

it("recognizes constraint", ({ expect }) => {
	const constraint = props.get("constraint");
	expect(constraint).toBeDefined();
	expect(constraint?.type).toMatchInlineSnapshot(`
		{
		  "constraint": {
		    "kind": "number",
		  },
		  "isConst": false,
		  "kind": "type-parameter",
		  "name": "R",
		}
	`);
});

it("recognizes `default`", ({ expect }) => {
	const default_ = props.get("default");
	expect(default_).toBeDefined();
	expect(default_?.type).toMatchInlineSnapshot(`
		{
		  "constraint": {
		    "kind": "unknown",
		  },
		  "default": {
		    "kind": "string",
		  },
		  "isConst": false,
		  "kind": "type-parameter",
		  "name": "D",
		}
	`);
});
