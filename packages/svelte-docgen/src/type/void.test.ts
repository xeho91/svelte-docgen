import { it } from "vitest";

import { generate } from "../mod.js";
import { OPTIONS, create_path_to_example_component } from "../../tests/shared.js";

const filepath = create_path_to_example_component("data", "type", "void.svelte");
const generated = generate(filepath, OPTIONS);
const { props } = generated[1];

it("documents prop(s) with 'void' type kind", ({ expect }) => {
	const myunderstanding = props.get("myunderstanding");
	expect(myunderstanding).toBeDefined();
	expect(myunderstanding?.type).toMatchInlineSnapshot(`
		{
		  "kind": "void",
		}
	`);
});
