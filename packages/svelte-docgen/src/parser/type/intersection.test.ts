import { describe, it } from "vitest";

import { create_options } from "../../../tests/shared.js";
import type * as Doc from "../../doc/type.js";
import { parse } from "../mod.js";

describe("Intersection", () => {
	const { props } = parse(
		`
			<script lang="ts">
				type Aliased = number & {};
				interface Props {
					anonymous: string & {};
					aliased: Aliased;
				}
				let { ..._ }: Props = $props();
			</script>
		`,
		create_options("intersection.svelte"),
	);

	it("documents anonmous 'intersection'", ({ expect }) => {
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
		expect((anonymous?.type as Doc.Intersection).alias).not.toBeDefined();
		expect((anonymous?.type as Doc.Intersection).types.length).toBeGreaterThan(0);
		expect((anonymous?.type as Doc.Intersection).sources).not.toBeDefined();
	});

	it("recognizes aliased", ({ expect }) => {
		const aliased = props.get("aliased");
		expect(aliased).toBeDefined();
		expect(aliased?.type).toMatchInlineSnapshot(`
			{
			  "alias": "Aliased",
			  "kind": "intersection",
			  "sources": Set {
			    "intersection.svelte",
			  },
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
		expect((aliased?.type as Doc.Intersection).types.length).toBeGreaterThan(0);
		expect((aliased?.type as Doc.Intersection).alias).toBe("Aliased");
		expect((aliased?.type as Doc.Intersection).sources).toBeDefined();
	});
});
