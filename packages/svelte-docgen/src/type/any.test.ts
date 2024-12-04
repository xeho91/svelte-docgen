import { it } from "vitest";

import { OPTIONS, create_path_to_example_component } from "../../tests/shared.js";
import { parse } from "../parser.js";

const filepath = create_path_to_example_component("data", "type", "any.svelte");
const parsed = parse(filepath, OPTIONS);
const { props } = parsed[1];

it("documents prop(s) with 'any' type", ({ expect }) => {
	const love = props.get("love");
	expect(love).toBeDefined();
	expect(love?.type).toMatchInlineSnapshot(`
		{
		  "kind": "any",
		}
	`);
});
