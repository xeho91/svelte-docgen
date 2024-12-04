import { it } from "vitest";

import { OPTIONS, create_path_to_example_component } from "../../tests/shared.js";
import { parse } from "../parser.js";

const filepath = create_path_to_example_component("data", "type", "object.svelte");
const parsed = parse(filepath, OPTIONS);
const { props } = parsed[1];

it("documents prop(s) with loose 'object' type kind", ({ expect }) => {
	const data = props.get("data");
	expect(data).toBeDefined();
	expect(data?.type).toMatchInlineSnapshot(`
		{
		  "kind": "object",
		}
	`);
});

it("recognizes {}", ({ expect }) => {
	const unknown = props.get("unknown");
	expect(unknown).toBeDefined();
	expect(unknown?.type).toMatchInlineSnapshot(`
		{
		  "kind": "object",
		}
	`);
});
