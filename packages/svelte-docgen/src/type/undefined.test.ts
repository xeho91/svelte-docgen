import { it } from "vitest";

import { OPTIONS, create_path_to_example_component } from "../../tests/shared.js";
import { parse } from "../parser.js";

const filepath = create_path_to_example_component("data", "type", "undefined.svelte");
const parsed = parse(filepath, OPTIONS);
const { props } = parsed[1];

it("documents prop(s) with 'undefined' type kind", ({ expect }) => {
	const age = props.get("age");
	expect(age).toBeDefined();
	expect(age?.type).toMatchInlineSnapshot(`
		{
		  "kind": "undefined",
		}
	`);
});
