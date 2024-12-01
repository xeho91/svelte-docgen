import { it } from "vitest";

import { OPTIONS, create_path_to_example_component } from "../../tests/shared.js";
import { generate } from "../mod.js";

const filepath = create_path_to_example_component("data", "type", "null.svelte");
const generated = generate(filepath, OPTIONS);
const { props } = generated[1];

it("documents prop(s) with 'null' type", ({ expect }) => {
	const balance = props.get("balance");
	expect(balance).toBeDefined();
	expect(balance?.type).toMatchInlineSnapshot(`
		{
		  "kind": "null",
		}
	`);
});
