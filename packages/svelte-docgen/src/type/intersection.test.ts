import { it } from "vitest";

import { generate } from "../mod.js";
import { OPTIONS, create_path_to_example_component } from "../../tests/shared.js";
import type { IntersectionDocumentation } from "../documentation.js";

const filepath = create_path_to_example_component("data", "type", "intersection.svelte");
const generated = generate(filepath, OPTIONS);
const { props } = generated[1];

it("documents anonymous", ({ expect }) => {
	const anonymous = props.get("anonymous");
	expect(anonymous).toBeDefined();
	expect(anonymous?.type).toMatchInlineSnapshot(`
		{
		  "kind": "intersection",
		  "types": [
		    {
		      "kind": "string",
		    },
		    {
		      "kind": "object",
		    },
		  ],
		}
	`);
});

it("documents aliased", ({ expect }) => {
	const aliased = props.get("aliased");
	expect(aliased).toBeDefined();
	expect((aliased?.type as IntersectionDocumentation).alias).toBe("Aliased");
	expect(aliased?.type).toMatchInlineSnapshot(`
		{
		  "alias": "Aliased",
		  "kind": "intersection",
		  "types": [
		    {
		      "kind": "number",
		    },
		    {
		      "kind": "object",
		    },
		  ],
		}
	`);
});
