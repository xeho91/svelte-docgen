import { it } from "vitest";

import { OPTIONS, create_path_to_example_component } from "../../tests/shared.js";
import type { Doc } from "../documentation.js";
import { parse } from "../parser.js";

const filepath = create_path_to_example_component("data", "type", "intersection.svelte");
const parsed = parse(filepath, OPTIONS);
const { props } = parsed[1];

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
	expect(aliased?.type).toMatchInlineSnapshot(`
		{
		  "alias": "Aliased",
		  "kind": "intersection",
		  "sources": [
		    <process-cwd>/packages/svelte-docgen/examples/data/type/intersection.svelte,
		  ],
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
	expect((aliased?.type as Doc.Intersection).alias).toBe("Aliased");
});
