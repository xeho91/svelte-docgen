import { it } from "vitest";

import { OPTIONS, create_path_to_example_component } from "../../tests/shared.js";
import { parse } from "../parser.js";
import type { Doc } from "../documentation.js";

const filepath = create_path_to_example_component("data", "type", "number.svelte");
const parsed = parse(filepath, OPTIONS);
const { props } = parsed[1];

it("recognizes prop(s) with loose 'number' type", ({ expect }) => {
	const loose = props.get("loose");
	expect(loose).toBeDefined();
	expect(loose?.type).toMatchInlineSnapshot(`
		{
		  "kind": "number",
		}
	`);
});

it("recognizes prop(s) with literal 'number' type", ({ expect }) => {
	const literal = props.get("literal");
	expect(literal).toBeDefined();
	expect(literal?.type).toMatchInlineSnapshot(`
		{
		  "kind": "literal",
		  "subkind": "number",
		  "value": 1337,
		}
	`);
	expect((literal?.type as Doc.LiteralNumber).value).toBe(1337);
});
