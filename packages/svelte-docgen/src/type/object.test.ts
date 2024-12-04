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

it("documents members when provided an anonymous interface", ({ expect }) => {
	const anonymous = props.get("anonymous");
	expect(anonymous).toBeDefined();
	expect(anonymous?.type).toMatchInlineSnapshot(`
		{
		  "kind": "interface",
		  "members": Map {
		    "x" => {
		      "isOptional": false,
		      "isReadonly": false,
		      "type": {
		        "kind": "number",
		      },
		    },
		    "y" => {
		      "isOptional": true,
		      "isReadonly": false,
		      "type": {
		        "kind": "union",
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
		  },
		  "name": "__type",
		}
	`);
});

it("documents readonly members", ({ expect }) => {
	const strict = props.get("strict");
	expect(strict).toBeDefined();
	expect(strict?.type).toMatchInlineSnapshot(`
		{
		  "kind": "interface",
		  "members": Map {
		    "foo" => {
		      "isOptional": false,
		      "isReadonly": true,
		      "type": {
		        "kind": "string",
		      },
		    },
		    "bar" => {
		      "isOptional": false,
		      "isReadonly": true,
		      "type": {
		        "kind": "number",
		      },
		    },
		  },
		  "name": "__type",
		}
	`);
});
