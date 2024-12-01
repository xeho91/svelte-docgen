import { it } from "vitest";

import { OPTIONS, create_path_to_example_component } from "../../tests/shared.js";
import { generate } from "../mod.js";

const filepath = create_path_to_example_component("data", "type", "string.svelte");
const generated = generate(filepath, OPTIONS);
const { props } = generated[1];

it("recognizes prop(s) with loose 'string' type", ({ expect }) => {
	const loose = props.get("loose");
	expect(loose).toBeDefined();
	expect(loose?.type).toMatchInlineSnapshot(`
		{
		  "kind": "string",
		}
	`);
});

it("recognizes prop(s) with literal 'string' type", ({ expect }) => {
	const literal = props.get("literal");
	expect(literal).toBeDefined();
	expect(literal?.type).toMatchInlineSnapshot(`
		{
		  "kind": "literal",
		  "subkind": "string",
		  "value": "awesome",
		}
	`);
});
