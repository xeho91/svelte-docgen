import { describe, it } from "vitest";

import { OPTIONS, create_path_to_example_component } from "../tests/shared.js";
import { parse } from "./parser.js";

describe("parse(filepath)[1].props", () => {
	it("returns empty map if component doesn't have any props", ({ expect }) => {
		const filepath = create_path_to_example_component("data", "props", "none.svelte");
		const parsed = parse(filepath, OPTIONS)[1];
		expect(parsed.props.size).toBe(0);
		expect(parsed.props).toMatchInlineSnapshot("Map {}");
		expect(parsed.props.size).toBe(0);
	});

	it("recognizes props with `$bindable()` rune", ({ expect }) => {
		const filepath = create_path_to_example_component("data", "props", "bindable.svelte");
		const parsed = parse(filepath, OPTIONS)[1];
		expect(parsed.props).toMatchInlineSnapshot(`
			Map {
			  "value" => {
			    "default": {
			      "kind": "literal",
			      "subkind": "number",
			      "value": 0,
			    },
			    "isBindable": true,
			    "isOptional": true,
			    "sources": [
			      "/Users/xeho91/Nextcloud/Projects/oss/svelte-docgen/packages/svelte-docgen/examples/data/props/bindable.svelte",
			    ],
			    "tags": [],
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
			  "group" => {
			    "default": {
			      "element": {
			        "kind": "string",
			      },
			      "isReadonly": false,
			      "kind": "array",
			    },
			    "isBindable": true,
			    "isOptional": true,
			    "sources": [
			      "/Users/xeho91/Nextcloud/Projects/oss/svelte-docgen/packages/svelte-docgen/examples/data/props/bindable.svelte",
			    ],
			    "tags": [],
			    "type": {
			      "kind": "union",
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
			    "isOptional": true,
			    "sources": [
			      "/Users/xeho91/Nextcloud/Projects/oss/svelte-docgen/packages/svelte-docgen/examples/data/props/bindable.svelte",
			    ],
			    "tags": [],
			    "type": {
			      "kind": "union",
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
		const value = parsed.props.get("value");
		expect(value).toBeDefined();
		expect(value?.isBindable).toBe(true);
		const group = parsed.props.get("group");
		expect(group).toBeDefined();
		expect(group?.isBindable).toBe(true);
		const disabled = parsed.props.get("disabled");
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
			    "isOptional": true,
			    "sources": [
			      "/Users/xeho91/Nextcloud/Projects/oss/svelte-docgen/packages/svelte-docgen/examples/data/props/optional.svelte",
			    ],
			    "tags": [],
			    "type": {
			      "kind": "union",
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
			    "isOptional": false,
			    "sources": [
			      "/Users/xeho91/Nextcloud/Projects/oss/svelte-docgen/packages/svelte-docgen/examples/data/props/optional.svelte",
			    ],
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
			    "isOptional": true,
			    "sources": [
			      "/Users/xeho91/Nextcloud/Projects/oss/svelte-docgen/packages/svelte-docgen/examples/data/props/optional.svelte",
			    ],
			    "tags": [],
			    "type": {
			      "kind": "union",
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

	it("includes extended props and recognizes their sources", ({ expect }) => {
		const filepath = create_path_to_example_component("data", "props", "extended.svelte");
		const parsed = parse(filepath, OPTIONS)[1];
		const { props } = parsed;
		expect(props.size).toBeGreaterThan(1);
		expect(props.size).toMatchInlineSnapshot("441");
		const custom = props.get("custom");
		expect(custom).toBeDefined();
		expect(custom).toMatchInlineSnapshot(`
			{
			  "isBindable": false,
			  "isOptional": false,
			  "sources": [
			    "/Users/xeho91/Nextcloud/Projects/oss/svelte-docgen/packages/svelte-docgen/examples/data/props/extended.svelte",
			  ],
			  "tags": [],
			  "type": {
			    "kind": "string",
			  },
			}
		`);
		expect(custom?.sources).toMatchInlineSnapshot(`
			[
			  "/Users/xeho91/Nextcloud/Projects/oss/svelte-docgen/packages/svelte-docgen/examples/data/props/extended.svelte",
			]
		`);
		expect(custom?.sources.some((s) => s.endsWith("extended.svelte"))).toBe(true);
		const disabled = props.get("disabled");
		expect(disabled).toBeDefined();
		expect(disabled).toMatchInlineSnapshot(`
			{
			  "isBindable": false,
			  "isOptional": true,
			  "sources": [
			    "/Users/xeho91/Nextcloud/Projects/oss/svelte-docgen/node_modules/.pnpm/svelte@5.2.0/node_modules/svelte/elements.d.ts",
			  ],
			  "tags": [],
			  "type": {
			    "kind": "union",
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
		expect(disabled?.sources).toMatchInlineSnapshot(`
			[
			  "/Users/xeho91/Nextcloud/Projects/oss/svelte-docgen/node_modules/.pnpm/svelte@5.2.0/node_modules/svelte/elements.d.ts",
			]
		`);
		expect(disabled?.sources.some((s) => s.endsWith("/svelte/elements.d.ts")));
	});

	// it("recognizes snippet props", ({ expect }) => {
	// 	const filepath = create_path_to_example_component("data", "props", "snippet_type.svelte");
	// 	const parsed = parse(filepath, OPTIONS);
	// 	const { props } = parsed[1];
	// 	expect(props.size).toBe(3);
	// 	const header = props.get("header");
	// 	expect(header).toBeDefined();
	// 	expect(header?.isSnippet).toBe(true);
	// 	expect(header?.isOptional).toBe(true);
	// 	expect(header?.default).toBeUndefined();
	// 	if (header?.isSnippet) {
	// 		expect(header.parameters).toHaveLength(1);
	// 		expect(header.parameters).toMatchInlineSnapshot(`
	// 			[
	// 			  {
	// 			    "kind": "string",
	// 			  },
	// 			]
	// 		`);
	// 	}
	// 	const children = props.get("children");
	// 	expect(children).toBeDefined();
	// 	expect(children?.isSnippet).toBe(true);
	// 	expect(children?.isOptional).toBe(false);
	// 	expect(() => children?.default).toThrowErrorMatchingInlineSnapshot("[Error]");
	// 	if (children?.isSnippet) {
	// 		expect(children.parameters).toHaveLength(0);
	// 	}
	// 	const footer = props.get("footer");
	// 	expect(footer).toBeDefined();
	// 	expect(footer?.isSnippet).toBe(true);
	// 	expect(footer?.isOptional).toBe(true);
	// 	expect(footer?.default).toMatchInlineSnapshot(
	// 		`"(color: Color, year: number) => { '{@render ...} must be called with a Snippet': "import type { Snippet } from 'svelte'"; } & unique symbol"`,
	// 	);
	// 	if (footer?.isSnippet) {
	// 		expect(footer.parameters).toHaveLength(2);
	// 		expect(footer.parameters).toMatchInlineSnapshot(`
	// 			[
	// 			  {
	// 			    "alias": "Color",
	// 			    "kind": "union",
	// 			    "types": [
	// 			      {
	// 			        "kind": "literal",
	// 			        "subkind": "string",
	// 			        "value": "red",
	// 			      },
	// 			      {
	// 			        "kind": "literal",
	// 			        "subkind": "string",
	// 			        "value": "green",
	// 			      },
	// 			      {
	// 			        "kind": "literal",
	// 			        "subkind": "string",
	// 			        "value": "blue",
	// 			      },
	// 			    ],
	// 			  },
	// 			  {
	// 			    "kind": "number",
	// 			  },
	// 			]
	// 		`);
	// 	}
	// });
});
