import { it } from "vitest";

import { generate } from "../mod.js";
import { OPTIONS, create_path_to_example_component } from "../../tests/shared.js";

const filepath = create_path_to_example_component("data", "type", "any.svelte");
const generated = generate(filepath, OPTIONS);
const { props } = generated[1];

it("documents prop(s) with 'any' type", ({ expect }) => {
	const love = props.get("love");
	expect(love).toBeDefined();
	expect(love?.type).toMatchInlineSnapshot(`
		{
		  "kind": "any",
		}
	`);
});
