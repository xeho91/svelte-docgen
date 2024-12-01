import { it } from "vitest";

import { generate } from "../mod.js";
import { OPTIONS, create_path_to_example_component } from "../../tests/shared.js";

const filepath = create_path_to_example_component("data", "type", "unknown.svelte");
const generated = generate(filepath, OPTIONS);
const { props } = generated[1];

it("documents prop(s) with 'unknown' type", ({ expect }) => {
	const meaning_of_life = props.get("meaning-of-life");
	expect(meaning_of_life).toBeDefined();
	expect(meaning_of_life?.type).toMatchInlineSnapshot(`
		{
		  "kind": "unknown",
		}
	`);
});
