import { it } from "vitest";

import { OPTIONS, create_path_to_example_component } from "../../tests/shared.js";
import { generate } from "../mod.js";

const filepath = create_path_to_example_component("data", "type", "undefined.svelte");
const generated = generate(filepath, OPTIONS);
const { props } = generated[1];

it("documents prop(s) with 'undefined' type kind", ({ expect }) => {
	const age = props.get("age");
	expect(age).toBeDefined();
	expect(age?.type).toMatchInlineSnapshot(`
		{
		  "kind": "undefined",
		}
	`);
});
