import { it } from "vitest";

import { OPTIONS, create_path_to_example_component } from "../../tests/shared.js";
import { parse } from "../parser.js";

const filepath = create_path_to_example_component("data", "type", "void.svelte");
const parsed = parse(filepath, OPTIONS);
const { props } = parsed[1];

it("documents prop(s) with 'void' type kind", ({ expect }) => {
	const myunderstanding = props.get("myunderstanding");
	expect(myunderstanding).toBeDefined();
	expect(myunderstanding?.type).toMatchInlineSnapshot(`
		{
		  "kind": "void",
		}
	`);
});
