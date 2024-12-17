import { describe, it } from "vitest";

import { create_options } from "../../../tests/shared.js";
import type * as Doc from "../../doc/type.js";
import { parse } from "../mod.js";

describe("Union", () => {
	const { props } = parse(
		`
			<script lang="ts">
				type Aliased = "red" | "green" | "blue";
				interface Props {
					color: "primary" | "secondary" | "tertiary";
					aliased: Aliased;
				}
				let { ..._ }: Props = $props();
			</script>
		`,
		create_options("union.svelte"),
	);

	it("documents anonymous `union`", ({ expect }) => {
		const anonymous = props.get("color");
		expect(anonymous).toBeDefined();
		expect(anonymous?.type).toMatchInlineSnapshot(`
			{
			  "kind": "union",
			  "types": [
			    {
			      "kind": "literal",
			      "subkind": "string",
			      "value": "primary",
			    },
			    {
			      "kind": "literal",
			      "subkind": "string",
			      "value": "secondary",
			    },
			    {
			      "kind": "literal",
			      "subkind": "string",
			      "value": "tertiary",
			    },
			  ],
			}
		`);
		expect(anonymous?.type.kind).toBe("union");
		expect((anonymous?.type as Doc.Union)?.alias).not.toBeDefined();
		expect((anonymous?.type as Doc.Union)?.sources).not.toBeDefined();
	});

	it("recognizes aliased union", ({ expect }) => {
		const aliased = props.get("aliased");
		expect(aliased).toBeDefined();
		expect(aliased?.type).toMatchInlineSnapshot(`
			{
			  "alias": "Aliased",
			  "kind": "union",
			  "sources": Set {
			    "union.svelte",
			  },
			  "types": [
			    {
			      "kind": "literal",
			      "subkind": "string",
			      "value": "red",
			    },
			    {
			      "kind": "literal",
			      "subkind": "string",
			      "value": "green",
			    },
			    {
			      "kind": "literal",
			      "subkind": "string",
			      "value": "blue",
			    },
			  ],
			}
		`);
		expect(aliased?.type.kind).toBe("union");
		expect((aliased?.type as Doc.Union)?.alias).toBe("Aliased");
		expect((aliased?.type as Doc.Union)?.sources).toBeDefined();
	});
});
