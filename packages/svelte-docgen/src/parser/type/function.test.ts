import { describe, it } from "vitest";

import { create_options } from "../../../tests/shared.js";
import type { Doc } from "../../doc/type.js";
import { parse } from "../mod.js";

describe("Fn", () => {
	const { props } = parse(
		`
			<script lang="ts">
				type Baz = string | number;
				type Aliased = () => void;
				interface Props {
					void: () => void;
					returning: () => string;
					parametized: (foo: string, bar?: Baz) => boolean;
					spreaded: (...spread: any) => null;
					aliased: Aliased;
				}
				let { ..._ }: Props = $props();
			</script>
		`,
		create_options("function.svelte"),
	);

	it("documents 'function' - retuning void", ({ expect }) => {
		const void_ = props.get("void");
		expect(void_).toBeDefined();
		expect(void_?.type).toMatchInlineSnapshot(`
			{
			  "calls": [
			    {
			      "parameters": [],
			      "returns": {
			        "kind": "void",
			      },
			    },
			  ],
			  "kind": "function",
			}
		`);
		expect(void_?.type.kind).toBe("function");
	});

	it("recognizes return type other than 'void'", ({ expect }) => {
		const returning = props.get("returning");
		expect(returning).toBeDefined();
		expect(returning?.type).toMatchInlineSnapshot(`
			{
			  "calls": [
			    {
			      "parameters": [],
			      "returns": {
			        "kind": "string",
			      },
			    },
			  ],
			  "kind": "function",
			}
		`);
		expect(returning?.type.kind).toBe("function");
	});

	it("documents parameter(s) type if specified", ({ expect }) => {
		const parametized = props.get("parametized");
		expect(parametized).toBeDefined();
		expect(parametized?.type).toMatchInlineSnapshot(`
			{
			  "calls": [
			    {
			      "parameters": [
			        {
			          "isOptional": false,
			          "name": "foo",
			          "type": {
			            "kind": "string",
			          },
			        },
			        {
			          "isOptional": true,
			          "name": "bar",
			          "type": {
			            "kind": "union",
			            "nonNullable": {
			              "alias": "Baz",
			              "kind": "union",
			              "sources": Set {
			                "function.svelte",
			              },
			              "types": [
			                {
			                  "kind": "string",
			                },
			                {
			                  "kind": "number",
			                },
			              ],
			            },
			            "types": [
			              {
			                "kind": "undefined",
			              },
			              {
			                "kind": "string",
			              },
			              {
			                "kind": "number",
			              },
			            ],
			          },
			        },
			      ],
			      "returns": {
			        "kind": "boolean",
			      },
			    },
			  ],
			  "kind": "function",
			}
		`);
		expect(parametized?.type.kind).toBe("function");

		const spreaded = props.get("spreaded");
		expect(spreaded).toBeDefined();
		expect(spreaded?.type).toMatchInlineSnapshot(`
			{
			  "calls": [
			    {
			      "parameters": [
			        {
			          "isOptional": false,
			          "name": "spread",
			          "type": {
			            "kind": "any",
			          },
			        },
			      ],
			      "returns": {
			        "kind": "null",
			      },
			    },
			  ],
			  "kind": "function",
			}
		`);
		expect(spreaded?.type.kind).toBe("function");
	});

	it("recognizes aliased type", ({ expect }) => {
		const aliased = props.get("aliased");
		expect(aliased).toBeDefined();
		expect(aliased?.type).toMatchInlineSnapshot(`
			{
			  "alias": "Aliased",
			  "calls": [
			    {
			      "parameters": [],
			      "returns": {
			        "kind": "void",
			      },
			    },
			  ],
			  "kind": "function",
			  "sources": Set {
			    "function.svelte",
			  },
			}
		`);
		expect(aliased?.type.kind).toBe("function");
		expect((aliased?.type as Doc.Fn).alias).toBeDefined();
		expect((aliased?.type as Doc.Fn).alias).toBe("Aliased");
		expect((aliased?.type as Doc.Fn).sources).toBeDefined();
	});
});
