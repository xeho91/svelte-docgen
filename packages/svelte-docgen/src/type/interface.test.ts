import { it } from "vitest";

import { OPTIONS, create_path_to_example_component } from "../../tests/shared.js";
import type { Doc } from "../documentation.js";
import { parse } from "../parser.js";

const filepath = create_path_to_example_component("data", "type", "interface.svelte");
const parsed = parse(filepath, OPTIONS);
const { props } = parsed[1];

it("recognizes anonymous (unnamed) interface", ({ expect }) => {
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
		  "sources": [
		    <process-cwd>/packages/svelte-docgen/examples/data/type/interface.svelte,
		  ],
		}
	`);
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
		  "sources": [
		    <process-cwd>/packages/svelte-docgen/examples/data/type/interface.svelte,
		  ],
		}
	`);
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
		  "sources": [
		    <process-cwd>/packages/svelte-docgen/examples/data/type/interface.svelte,
		  ],
		}
	`);
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
		  "sources": [
		    <process-cwd>/packages/svelte-docgen/examples/data/type/interface.svelte,
		  ],
		}
	`);
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
		  "sources": [
		    <process-cwd>/packages/svelte-docgen/examples/data/type/interface.svelte,
		  ],
		}
	`);
	expect((empty_type?.type as Doc.Interface)?.alias).toBe("EmptyType");
	expect((empty_type?.type as Doc.Interface)?.members?.size).toBe(0);
});

it("understands type which is an alias to interface only", ({ expect }) => {
	const aliased = props.get("aliased");
	expect(aliased).toBeDefined();
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
		  "sources": [
		    <process-cwd>/packages/svelte-docgen/examples/data/type/interface.svelte,
		  ],
		}
	`);
	expect((aliased?.type as Doc.Interface)?.alias).toBe("A");
});
