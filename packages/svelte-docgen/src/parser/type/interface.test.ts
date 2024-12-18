import { describe, it } from "vitest";

import { create_options } from "../../../tests/shared.js";
import type * as Doc from "../../doc/type.js";
import { parse } from "../mod.js";

describe("Interface", () => {
	const { props } = parse(
		`
			<script lang="ts">
				interface A {
					name: string;
					age?: number;
					moo: () => void;
				}
				interface B {
					readonly x: number;
					readonly y: number;
				}
				type AsType = {
					ugly: true;
				};
				interface Empty {}
				type EmptyType = {};
				type Aliased = A;
				interface Props {
					anonymous: { name: "Guy"; surname: "Fawkes" };
					a: A;
					b: B;
					"as-type": AsType;
					"empty-aliased": Empty;
					"empty-type": EmptyType;
					aliased: Aliased;
				}
				let { ..._ }: Props = $props();
			</script>
		`,
		create_options("interface.svelte"),
	);

	it("documents anonymous `interface`", ({ expect }) => {
		const anonymous = props.get("anonymous");
		expect(anonymous).toBeDefined();
		expect(anonymous?.type).toMatchInlineSnapshot(`
			{
			  "kind": "interface",
			  "members": Map {
			    "name" => {
			      "isOptional": false,
			      "isReadonly": false,
			      "type": {
			        "kind": "literal",
			        "subkind": "string",
			        "value": "Guy",
			      },
			    },
			    "surname" => {
			      "isOptional": false,
			      "isReadonly": false,
			      "type": {
			        "kind": "literal",
			        "subkind": "string",
			        "value": "Fawkes",
			      },
			    },
			  },
			}
		`);
		expect(anonymous?.type.kind).toBe("interface");
		expect((anonymous?.type as Doc.Interface)?.alias).not.toBeDefined();
	});

	it("recognizes aliased interface", ({ expect }) => {
		const a = props.get("a");
		expect(a).toBeDefined();
		expect(a?.type).toMatchInlineSnapshot(`
			{
			  "alias": "A",
			  "kind": "interface",
			  "members": Map {
			    "name" => {
			      "isOptional": false,
			      "isReadonly": false,
			      "type": {
			        "kind": "string",
			      },
			    },
			    "age" => {
			      "isOptional": true,
			      "isReadonly": false,
			      "type": {
			        "kind": "union",
			        "nonNullable": {
			          "kind": "number",
			        },
			        "types": [
			          {
			            "kind": "undefined",
			          },
			          {
			            "kind": "number",
			          },
			        ],
			      },
			    },
			    "moo" => {
			      "isOptional": false,
			      "isReadonly": false,
			      "type": {
			        "calls": [
			          {
			            "parameters": [],
			            "returns": {
			              "kind": "void",
			            },
			          },
			        ],
			        "kind": "function",
			      },
			    },
			  },
			  "sources": Set {
			    "interface.svelte",
			  },
			}
		`);
		expect(a?.type.kind).toBe("interface");
		expect((a?.type as Doc.Interface)?.alias).toBe("A");
	});

	it("recognizes 'readonly' members", ({ expect }) => {
		const b = props.get("b");
		expect(b).toBeDefined();
		expect(b?.type).toMatchInlineSnapshot(`
			{
			  "alias": "B",
			  "kind": "interface",
			  "members": Map {
			    "x" => {
			      "isOptional": false,
			      "isReadonly": true,
			      "type": {
			        "kind": "number",
			      },
			    },
			    "y" => {
			      "isOptional": false,
			      "isReadonly": true,
			      "type": {
			        "kind": "number",
			      },
			    },
			  },
			  "sources": Set {
			    "interface.svelte",
			  },
			}
		`);
		expect(b?.type.kind).toBe("interface");
		expect((b?.type as Doc.Interface)?.alias).toBe("B");
	});

	it("recognizes types which contains anonymous interface only", ({ expect }) => {
		const as_type = props.get("as-type");
		expect(as_type).toBeDefined();
		expect(as_type?.type).toMatchInlineSnapshot(`
			{
			  "alias": "AsType",
			  "kind": "interface",
			  "members": Map {
			    "ugly" => {
			      "isOptional": false,
			      "isReadonly": false,
			      "type": {
			        "kind": "literal",
			        "subkind": "boolean",
			        "value": true,
			      },
			    },
			  },
			  "sources": Set {
			    "interface.svelte",
			  },
			}
		`);
		expect(as_type?.type.kind).toBe("interface");
		expect((as_type?.type as Doc.Interface)?.alias).toBe("AsType");
	});

	it("recognizes empty aliased interface", ({ expect }) => {
		const empty_aliased = props.get("empty-aliased");
		expect(empty_aliased).toBeDefined();
		expect(empty_aliased?.type).toMatchInlineSnapshot(`
			{
			  "alias": "Empty",
			  "kind": "interface",
			  "members": Map {},
			  "sources": Set {
			    "interface.svelte",
			  },
			}
		`);
		expect(empty_aliased?.type.kind).toBe("interface");
		expect((empty_aliased?.type as Doc.Interface)?.alias).toBe("Empty");
		expect((empty_aliased?.type as Doc.Interface)?.members?.size).toBe(0);
	});

	it("recognizes empty aliased interface as type", ({ expect }) => {
		const empty_type = props.get("empty-type");
		expect(empty_type).toBeDefined();
		expect(empty_type?.type).toMatchInlineSnapshot(`
			{
			  "alias": "EmptyType",
			  "kind": "interface",
			  "members": Map {},
			  "sources": Set {
			    "interface.svelte",
			  },
			}
		`);
		expect(empty_type?.type.kind).toBe("interface");
		expect((empty_type?.type as Doc.Interface)?.alias).toBe("EmptyType");
		expect((empty_type?.type as Doc.Interface)?.members?.size).toBe(0);
	});

	it("understands type which is an alias to interface only", ({ expect }) => {
		const aliased = props.get("aliased");
		expect(aliased).toBeDefined();
		expect(aliased?.type.kind).toBe("interface");
		expect(aliased?.type).toMatchInlineSnapshot(`
			{
			  "alias": "A",
			  "kind": "interface",
			  "members": Map {
			    "name" => {
			      "isOptional": false,
			      "isReadonly": false,
			      "type": {
			        "kind": "string",
			      },
			    },
			    "age" => {
			      "isOptional": true,
			      "isReadonly": false,
			      "type": {
			        "kind": "union",
			        "nonNullable": {
			          "kind": "number",
			        },
			        "types": [
			          {
			            "kind": "undefined",
			          },
			          {
			            "kind": "number",
			          },
			        ],
			      },
			    },
			    "moo" => {
			      "isOptional": false,
			      "isReadonly": false,
			      "type": {
			        "calls": [
			          {
			            "parameters": [],
			            "returns": {
			              "kind": "void",
			            },
			          },
			        ],
			        "kind": "function",
			      },
			    },
			  },
			  "sources": Set {
			    "interface.svelte",
			  },
			}
		`);
		expect((aliased?.type as Doc.Interface)?.alias).toBe("A");
	});
});
