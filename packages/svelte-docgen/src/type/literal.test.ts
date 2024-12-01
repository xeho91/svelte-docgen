import { it } from "vitest";

import { generate } from "../mod.js";
import { OPTIONS, create_path_to_example_component } from "../../tests/shared.js";

const filepath = create_path_to_example_component("data", "type", "literal.svelte");
const generated = generate(filepath, OPTIONS);
const { props } = generated[1];

it("recognizes prop(s) with 'literal' type - bigint", ({ expect }) => {
	const bigintish = props.get("bigintish");
	expect(bigintish).toBeDefined();
	expect(bigintish?.type).toMatchInlineSnapshot(`
		{
		  "kind": "literal",
		  "subkind": "bigint",
		  "value": 1n,
		}
	`);
});

it("recognizes prop(s) with 'literal' type - boolean", ({ expect }) => {
	const booleanish = props.get("booleanish");
	expect(booleanish).toBeDefined();
	expect(booleanish?.type).toMatchInlineSnapshot(`
		{
		  "kind": "literal",
		  "subkind": "boolean",
		  "value": true,
		}
	`);
});

it("recognizes prop(s) with 'literal' type - number", ({ expect }) => {
	const numberish = props.get("numberish");
	expect(numberish).toBeDefined();
	expect(numberish?.type).toMatchInlineSnapshot(`
		{
		  "kind": "literal",
		  "subkind": "number",
		  "value": 1337,
		}
	`);
});

it("recognizes prop(s) with 'literal' type - string", ({ expect }) => {
	const stringish = props.get("stringish");
	expect(stringish).toBeDefined();
	expect(stringish?.type).toMatchInlineSnapshot(`
		{
		  "kind": "literal",
		  "subkind": "string",
		  "value": "awesome",
		}
	`);
});
