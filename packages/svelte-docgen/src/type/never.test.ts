import { it } from "vitest";

import { OPTIONS, create_path_to_example_component } from "../../tests/shared.js";
import { parse } from "../parser.js";

const filepath = create_path_to_example_component("data", "type", "never.svelte");
const parsed = parse(filepath, OPTIONS);
const { props } = parsed[1];

it("documents prop(s) with 'never' type kind", ({ expect }) => {
	const giveup = props.get("giveup");
	expect(giveup).toBeDefined();
	expect(giveup?.type).toMatchInlineSnapshot(`
		{
		  "kind": "never",
		}
	`);
});
