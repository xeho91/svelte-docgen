import { describe, it } from "vitest";

import { OPTIONS, create_path_to_example_component } from "../tests/shared.js";
import { parse } from "./parser.js";

describe("parse(filepath)[1].props", () => {
	it("returns empty map if component doesn't have any props", ({ expect }) => {
		const filepath = create_path_to_example_component("data", "props", "none.svelte");
		const parsed = parse(filepath, OPTIONS)[1];
		const { props } = parsed;
		expect(props.size).toBe(0);
		expect(props).toMatchInlineSnapshot("Map {}");
		expect(props.size).toBe(0);
	});

	it("recognizes props with `$bindable()` rune", ({ expect }) => {
		const filepath = create_path_to_example_component("data", "props", "bindable.svelte");
		const parsed = parse(filepath, OPTIONS)[1];
		const { props } = parsed;
		expect(props).toMatchInlineSnapshot(`
			Map {
			  "value" => {
			    "default": {
			      "kind": "literal",
			      "subkind": "number",
			      "value": 0,
			    },
			    "isBindable": true,
			    "isExtended": false,
			    "isOptional": true,
			    "tags": [],
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
			  "group" => {
			    "default": {
			      "element": {
			        "kind": "string",
			      },
			      "isReadonly": false,
			      "kind": "array",
			    },
			    "isBindable": true,
			    "isExtended": false,
			    "isOptional": true,
			    "tags": [],
			    "type": {
			      "kind": "union",
			      "nonNullable": {
			        "element": {
			          "kind": "string",
			        },
			        "isReadonly": false,
			        "kind": "array",
			      },
			      "types": [
			        {
			          "kind": "undefined",
			        },
			        {
			          "element": {
			            "kind": "string",
			          },
			          "isReadonly": false,
			          "kind": "array",
			        },
			      ],
			    },
			  },
			  "disabled" => {
			    "isBindable": false,
			    "isExtended": false,
			    "isOptional": true,
			    "tags": [],
			    "type": {
			      "kind": "union",
			      "nonNullable": {
			        "kind": "boolean",
			      },
			      "types": [
			        {
			          "kind": "undefined",
			        },
			        {
			          "kind": "literal",
			          "subkind": "boolean",
			          "value": false,
			        },
			        {
			          "kind": "literal",
			          "subkind": "boolean",
			          "value": true,
			        },
			      ],
			    },
			  },
			}
		`);
		const value = props.get("value");
		expect(value).toBeDefined();
		expect(value?.isBindable).toBe(true);
		const group = props.get("group");
		expect(group).toBeDefined();
		expect(group?.isBindable).toBe(true);
		const disabled = props.get("disabled");
		expect(disabled).toBeDefined();
		expect(disabled?.isBindable).toBe(false);
	});

	it("recognizes optional props and their defaults", ({ expect }) => {
		const filepath = create_path_to_example_component("data", "props", "optional.svelte");
		const parsed = parse(filepath, OPTIONS)[1];
		const { props } = parsed;
		expect(props).toMatchInlineSnapshot(`
			Map {
			  "name" => {
			    "isBindable": false,
			    "isExtended": false,
			    "isOptional": true,
			    "tags": [],
			    "type": {
			      "kind": "union",
			      "nonNullable": {
			        "kind": "string",
			      },
			      "types": [
			        {
			          "kind": "undefined",
			        },
			        {
			          "kind": "string",
			        },
			      ],
			    },
			  },
			  "id" => {
			    "isBindable": false,
			    "isExtended": false,
			    "isOptional": false,
			    "tags": [],
			    "type": {
			      "kind": "number",
			    },
			  },
			  "location" => {
			    "default": {
			      "kind": "literal",
			      "subkind": "string",
			      "value": "terminal",
			    },
			    "isBindable": false,
			    "isExtended": false,
			    "isOptional": true,
			    "tags": [],
			    "type": {
			      "kind": "union",
			      "nonNullable": {
			        "kind": "string",
			      },
			      "types": [
			        {
			          "kind": "undefined",
			        },
			        {
			          "kind": "string",
			        },
			      ],
			    },
			  },
			}
		`);
		const name = props.get("name");
		expect(name).toBeDefined();
		expect(name?.isOptional).toBe(true);
		expect(name?.default).toBeUndefined();
		const id = props.get("id");
		expect(id).toBeDefined();
		expect(id?.isOptional).toBe(false);
		expect(id?.default).not.toBeDefined();
		const location = props.get("location");
		expect(location).toBeDefined();
		expect(location?.isOptional).toBe(true);
		expect(location?.default).toMatchInlineSnapshot(`
			{
			  "kind": "literal",
			  "subkind": "string",
			  "value": "terminal",
			}
		`);
	});

	it("non-extended props are recognizes and doesn't have `sources` property", ({ expect }) => {
		const filepath = create_path_to_example_component("data", "props", "extended.svelte");
		const parsed = parse(filepath, OPTIONS)[1];
		const { props } = parsed;
		expect(props.size).toBeGreaterThan(1);
		expect(props.size).toMatchInlineSnapshot("442");
		const custom = props.get("custom");
		expect(custom).toBeDefined();
		expect(custom).toMatchInlineSnapshot(`
			{
			  "isBindable": false,
			  "isExtended": false,
			  "isOptional": false,
			  "tags": [],
			  "type": {
			    "kind": "string",
			  },
			}
		`);
		expect(custom?.isExtended).toBe(false);
		expect(custom?.sources).not.toBeDefined();
	});

	it("includes extended props and recognizes their sources", ({ expect }) => {
		const filepath = create_path_to_example_component("data", "props", "extended.svelte");
		const parsed = parse(filepath, OPTIONS)[1];
		const { props } = parsed;
		const disabled = props.get("disabled");
		expect(disabled).toBeDefined();
		expect(disabled).toMatchInlineSnapshot(`
			{
			  "isBindable": false,
			  "isExtended": true,
			  "isOptional": true,
			  "sources": [
			    <process-cwd>/node_modules/.pnpm/svelte@5.2.0/node_modules/svelte/elements.d.ts,
			  ],
			  "tags": [],
			  "type": {
			    "kind": "union",
			    "nonNullable": {
			      "kind": "boolean",
			    },
			    "types": [
			      {
			        "kind": "undefined",
			      },
			      {
			        "kind": "null",
			      },
			      {
			        "kind": "literal",
			        "subkind": "boolean",
			        "value": false,
			      },
			      {
			        "kind": "literal",
			        "subkind": "boolean",
			        "value": true,
			      },
			    ],
			  },
			}
		`);
		expect(disabled?.isExtended).toBe(true);
		expect(disabled?.sources).toMatchInlineSnapshot(`
			[
			  <process-cwd>/node_modules/.pnpm/svelte@5.2.0/node_modules/svelte/elements.d.ts,
			]
		`);
		if (disabled?.isExtended) {
			expect(disabled?.sources?.some((s) => s.endsWith("/svelte/elements.d.ts")));
		}
	});
});
