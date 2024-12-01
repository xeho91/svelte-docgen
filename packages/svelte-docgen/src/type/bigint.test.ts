import { it } from "vitest";

import { OPTIONS, create_path_to_example_component } from "../../tests/shared.js";
import { generate } from "../mod.js";

const filepath = create_path_to_example_component("data", "type", "bigint.svelte");
const generated = generate(filepath, OPTIONS);
const { props } = generated[1];

it("documents prop(s) with loose 'bigint' type", ({ expect }) => {
	const loose = props.get("loose");
	expect(loose).toBeDefined();
	expect(loose?.type).toMatchInlineSnapshot(`
		{
		  "kind": "bigint",
		}
	`);
});

it("documents prop(s) with literal 'bigint' type - positive number", ({ expect }) => {
	const positive = props.get("positive");
	expect(positive).toBeDefined();
	expect(positive?.type).toMatchInlineSnapshot(`
		{
		  "kind": "literal",
		  "subkind": "bigint",
		  "value": 1337n,
		}
	`);
});

it("documents prop(s) with literal 'bigint' type - negative number", ({ expect }) => {
	const negative = props.get("negative");
	expect(negative).toBeDefined();
	expect(negative?.type).toMatchInlineSnapshot(`
		{
		  "kind": "literal",
		  "subkind": "bigint",
		  "value": -666n,
		}
	`);
});
