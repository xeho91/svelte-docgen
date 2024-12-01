import { it } from "vitest";

import { generate } from "../mod.js";
import { OPTIONS, create_path_to_example_component } from "../../tests/shared.js";

const filepath = create_path_to_example_component("data", "type", "never.svelte");
const generated = generate(filepath, OPTIONS);
const { props } = generated[1];

it("documents prop(s) with 'never' type kind", ({ expect }) => {
	const giveup = props.get("giveup");
	expect(giveup).toBeDefined();
	expect(giveup?.type).toMatchInlineSnapshot(`
		{
		  "kind": "never",
		}
	`);
});
