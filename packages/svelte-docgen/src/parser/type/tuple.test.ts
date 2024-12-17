import { describe, it } from "vitest";

import { create_options } from "../../../tests/shared.js";
import type * as Doc from "../../doc/type.js";
import { parse } from "../mod.js";

describe("Tuple", () => {
	const { props } = parse(
		`
			<script lang="ts">
				type Letter = "a" | "b" | "c";
				type Num = 0 | 1 | 2;
				type Aliased = [string, boolean];
				interface Props {
					anonymous: [Letter, Num];
					strict: readonly [Letter, Num];
					empty: [];
					"really-empty": readonly [];
					aliased: Aliased;
				}
				let { ..._ }: Props = $props();
			</script>
		`,
		create_options("tuple.svelte"),
	);

	it("documents anonymous 'tuple'", ({ expect }) => {
		const anonymous = props.get("anonymous");
		expect(anonymous).toBeDefined();
		expect(anonymous?.type).toMatchInlineSnapshot(`
			{
			  "elements": [
			    {
			      "alias": "Letter",
			      "kind": "union",
			      "sources": Set {
			        "tuple.svelte",
			      },
			      "types": [
			        {
			          "kind": "literal",
			          "subkind": "string",
			          "value": "a",
			        },
			        {
			          "kind": "literal",
			          "subkind": "string",
			          "value": "b",
			        },
			        {
			          "kind": "literal",
			          "subkind": "string",
			          "value": "c",
			        },
			      ],
			    },
			    {
			      "alias": "Num",
			      "kind": "union",
			      "sources": Set {
			        "tuple.svelte",
			      },
			      "types": [
			        {
			          "kind": "literal",
			          "subkind": "number",
			          "value": 0,
			        },
			        {
			          "kind": "literal",
			          "subkind": "number",
			          "value": 1,
			        },
			        {
			          "kind": "literal",
			          "subkind": "number",
			          "value": 2,
			        },
			      ],
			    },
			  ],
			  "isReadonly": false,
			  "kind": "tuple",
			}
		`);
		expect(anonymous?.type.kind).toBe("tuple");
		expect((anonymous?.type as Doc.Tuple).isReadonly).toBe(false);
		expect((anonymous?.type as Doc.Tuple).elements.length).toBeGreaterThan(0);
	});

	it("recognizes 'readonly'", ({ expect }) => {
		const strict = props.get("strict");
		expect(strict).toBeDefined();
		expect(strict?.type).toMatchInlineSnapshot(`
			{
			  "elements": [
			    {
			      "alias": "Letter",
			      "kind": "union",
			      "sources": Set {
			        "tuple.svelte",
			      },
			      "types": [
			        {
			          "kind": "literal",
			          "subkind": "string",
			          "value": "a",
			        },
			        {
			          "kind": "literal",
			          "subkind": "string",
			          "value": "b",
			        },
			        {
			          "kind": "literal",
			          "subkind": "string",
			          "value": "c",
			        },
			      ],
			    },
			    {
			      "alias": "Num",
			      "kind": "union",
			      "sources": Set {
			        "tuple.svelte",
			      },
			      "types": [
			        {
			          "kind": "literal",
			          "subkind": "number",
			          "value": 0,
			        },
			        {
			          "kind": "literal",
			          "subkind": "number",
			          "value": 1,
			        },
			        {
			          "kind": "literal",
			          "subkind": "number",
			          "value": 2,
			        },
			      ],
			    },
			  ],
			  "isReadonly": true,
			  "kind": "tuple",
			}
		`);
		expect(strict?.type.kind).toBe("tuple");
		expect((strict?.type as Doc.Tuple).isReadonly).toBe(true);
		expect((strict?.type as Doc.Tuple).elements.length).toBeGreaterThan(0);
	});

	it("recognizes empty tuple", ({ expect }) => {
		const empty = props.get("empty");
		expect(empty).toBeDefined();
		expect(empty?.type).toMatchInlineSnapshot(`
			{
			  "elements": [],
			  "isReadonly": false,
			  "kind": "tuple",
			}
		`);
		expect(empty?.type.kind).toBe("tuple");
		expect((empty?.type as Doc.Tuple).isReadonly).toBe(false);
		expect((empty?.type as Doc.Tuple).elements).toHaveLength(0);
	});

	it("recognizes 'readonly' empty tuple", ({ expect }) => {
		const empty = props.get("really-empty");
		expect(empty).toBeDefined();
		expect(empty?.type).toMatchInlineSnapshot(`
			{
			  "elements": [],
			  "isReadonly": true,
			  "kind": "tuple",
			}
		`);
		expect(empty?.type.kind).toBe("tuple");
		expect((empty?.type as Doc.Tuple).isReadonly).toBe(true);
		expect((empty?.type as Doc.Tuple).elements).toHaveLength(0);
	});

	it("recognizes aliased tuple type", ({ expect }) => {
		const aliased = props.get("aliased");
		expect(aliased).toBeDefined();
		expect(aliased?.type).toMatchInlineSnapshot(`
			{
			  "alias": "Aliased",
			  "elements": [
			    {
			      "kind": "string",
			    },
			    {
			      "kind": "boolean",
			    },
			  ],
			  "isReadonly": false,
			  "kind": "tuple",
			  "sources": Set {
			    "tuple.svelte",
			  },
			}
		`);
		expect(aliased?.type.kind).toBe("tuple");
		expect((aliased?.type as Doc.Tuple).isReadonly).toBe(false);
		expect((aliased?.type as Doc.Tuple).alias).toBeDefined();
		expect((aliased?.type as Doc.Tuple).alias).toBe("Aliased");
		expect((aliased?.type as Doc.Tuple).sources).toBeDefined();
		expect((aliased?.type as Doc.Tuple).elements.length).toBeGreaterThan(0);
	});
});
