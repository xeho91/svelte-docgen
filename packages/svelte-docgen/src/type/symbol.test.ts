import { it } from "vitest";

import { OPTIONS, create_path_to_example_component } from "../../tests/shared.js";
import { generate } from "../mod.js";

const filepath = create_path_to_example_component("data", "type", "symbol_type.svelte");
const generated = generate(filepath, OPTIONS);
const { props } = generated[1];

it("recognizes prop(s) with loose 'symbol' type kind", ({ expect }) => {
	const loose = props.get("loose");
	expect(loose).toBeDefined();
	expect(loose?.type).toMatchInlineSnapshot(`
		{
		  "kind": "symbol",
		}
	`);
});

it("recognizes prop(s) with literal 'symbol' type", ({ expect }) => {
	const unique = props.get("unique");
	expect(unique).toBeDefined();
	expect(unique?.type).toMatchInlineSnapshot(`
		{
		  "kind": "literal",
		  "subkind": "symbol",
		}
	`);
});
