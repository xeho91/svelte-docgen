import { it } from "vitest";

import { OPTIONS, create_path_to_example_component } from "../../tests/shared.js";
import { parse } from "../parser.js";
import type { Doc } from "../documentation.js";

const filepath = create_path_to_example_component("data", "type", "literal.svelte");
const parsed = parse(filepath, OPTIONS);
const { props } = parsed[1];

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
	expect((bigintish?.type as Doc.LiteralBigInt)?.value).toBe(1n);
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
	expect((booleanish?.type as Doc.LiteralBoolean)?.value).toBe(true);
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
	expect((numberish?.type as Doc.LiteralNumber)?.value).toBe(1337);
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
	expect((stringish?.type as Doc.LiteralString)?.value).toBe("awesome");
});
