import { describe, it } from "vitest";

import { generate } from "../src/mod.js";
import { OPTIONS, create_path_to_example_component } from "./shared.js";
import type { ArrayTypeDocumentation } from "../src/type.js";

describe("generate(filepath)[1].props", () => {
	it("returns empty map if component doesn't have any props", ({ expect }) => {
		const filepath = create_path_to_example_component("data", "props", "none.svelte");
		const generated = generate(filepath, OPTIONS);
		const { props } = generated[1];
		expect(props.size).toBe(0);
	});

	it("it recognizes props with `$bindable()` rune", ({ expect }) => {
		const filepath = create_path_to_example_component("data", "props", "bindable.svelte");
		const generated = generate(filepath, OPTIONS);
		const { props } = generated[1];
		expect(props.size).toBe(3);
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

	it("it recognizes optional props and their defaults", ({ expect }) => {
		const filepath = create_path_to_example_component("data", "props", "optional.svelte");
		const generated = generate(filepath, OPTIONS);
		const { props } = generated[1];
		expect(props.size).toBe(3);
		const name = props.get("name");
		expect(name).toBeDefined();
		expect(name?.isOptional).toBe(true);
		expect(name?.default).toBeUndefined();
		const id = props.get("id");
		expect(id).toBeDefined();
		expect(id?.isOptional).toBe(false);
		expect(() => id?.default).toThrowErrorMatchingInlineSnapshot("[Error]");
		const location = props.get("location");
		expect(location).toBeDefined();
		expect(location?.isOptional).toBe(true);
		expect(location?.default).toBe("terminal");
	});

	it("it recognizes snippet props", ({ expect }) => {
		const filepath = create_path_to_example_component("data", "props", "snipp.svelte");
		const generated = generate(filepath, OPTIONS);
		const { props } = generated[1];
		expect(props.size).toBe(3);
		const header = props.get("header");
		expect(header).toBeDefined();
		expect(header?.isSnippet).toBe(true);
		expect(header?.isOptional).toBe(true);
		expect(header?.default).toBeUndefined();
		if (header?.isSnippet) {
			expect(header.parameters).toHaveLength(1);
			expect(header.parameters).toMatchInlineSnapshot(`
				[
				  {
				    "kind": "string",
				  },
				]
			`);
		}
		const children = props.get("children");
		expect(children).toBeDefined();
		expect(children?.isSnippet).toBe(true);
		expect(children?.isOptional).toBe(false);
		expect(() => children?.default).toThrowErrorMatchingInlineSnapshot("[Error]");
		if (children?.isSnippet) {
			expect(children.parameters).toHaveLength(0);
		}
		const footer = props.get("footer");
		expect(footer).toBeDefined();
		expect(footer?.isSnippet).toBe(true);
		expect(footer?.isOptional).toBe(true);
		expect(footer?.default).toMatchInlineSnapshot(
			`"(color: Color, year: number) => { '{@render ...} must be called with a Snippet': "import type { Snippet } from 'svelte'"; } & unique symbol"`,
		);
		if (footer?.isSnippet) {
			expect(footer.parameters).toHaveLength(2);
			expect(footer.parameters).toMatchInlineSnapshot(`
				[
				  {
				    "kind": "union",
				    "members": [
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
				  },
				  {
				    "kind": "number",
				  },
				]
			`);
		}
	});

	it("it documents props with 'any' type", ({ expect }) => {
		const filepath = create_path_to_example_component("data", "props", "any.svelte");
		const generated = generate(filepath, OPTIONS);
		const { props } = generated[1];
		expect(props.size).toBe(1);
		const love = props.get("love");
		expect(love).toBeDefined();
		expect(love?.type).toMatchInlineSnapshot(`
			{
			  "kind": "any",
			}
		`);
	});

	it("it documents props with 'array' type kind", ({ expect }) => {
		const filepath = create_path_to_example_component("data", "props", "array.svelte");
		const generated = generate(filepath, OPTIONS);
		const { props } = generated[1];
		expect(props.size).toBe(2);
		const letters = props.get("letters");
		expect(letters).toBeDefined();
		expect((letters?.type as ArrayTypeDocumentation).isReadonly).toBe(false);
		expect(letters?.type).toMatchInlineSnapshot(`
			{
			  "element": {
			    "kind": "union",
			    "members": [
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
			  "isReadonly": false,
			  "kind": "array",
			}
		`);
		const numbers = props.get("numbers");
		expect(numbers).toBeDefined();
		expect((numbers?.type as ArrayTypeDocumentation).isReadonly).toBe(true);
		expect(numbers?.type).toMatchInlineSnapshot(`
			{
			  "element": {
			    "kind": "union",
			    "members": [
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
			  "isReadonly": true,
			  "kind": "array",
			}
		`);
	});

	it("it documents props with 'bigint' type", ({ expect }) => {
		const filepath = create_path_to_example_component("data", "props", "bigint.svelte");
		const generated = generate(filepath, OPTIONS);
		const { props } = generated[1];
		expect(props.size).toBe(3);
		const loose = props.get("loose");
		expect(loose).toBeDefined();
		expect(loose?.type).toMatchInlineSnapshot(`
			{
			  "kind": "bigint",
			}
		`);
		const positive = props.get("positive");
		expect(positive).toBeDefined();
		expect(positive?.type).toMatchInlineSnapshot(`
			{
			  "kind": "literal",
			  "subkind": "bigint",
			  "value": 1337n,
			}
		`);
		const negative = props.get("negative");
		expect(negative).toBeDefined();
		expect(negative?.type).toMatchInlineSnapshot(`
			{
			  "kind": "literal",
			  "subkind": "bigint",
			  "value": -666n,
			}
		`);
	});

	it("it documents props with 'boolean' type", ({ expect }) => {
		const filepath = create_path_to_example_component("data", "props", "boolean.svelte");
		const generated = generate(filepath, OPTIONS);
		const { props } = generated[1];
		expect(props.size).toBe(3);
		const loose = props.get("loose");
		expect(loose).toBeDefined();
		expect(loose?.type).toMatchInlineSnapshot(`
			{
			  "kind": "boolean",
			}
		`);
		const truthy = props.get("truthy");
		expect(truthy).toBeDefined();
		expect(truthy?.type).toMatchInlineSnapshot(`
			{
			  "kind": "literal",
			  "subkind": "boolean",
			  "value": true,
			}
		`);
		const falsy = props.get("falsy");
		expect(falsy).toBeDefined();
		expect(falsy?.type).toMatchInlineSnapshot(`
			{
			  "kind": "literal",
			  "subkind": "boolean",
			  "value": false,
			}
		`);
	});

	it("it documents props with 'literal' type", ({ expect }) => {
		const filepath = create_path_to_example_component("data", "props", "literal.svelte");
		const generated = generate(filepath, OPTIONS);
		const { props } = generated[1];
		expect(props.size).toBe(4);
		const bigintish = props.get("bigintish");
		expect(bigintish).toBeDefined();
		expect(bigintish?.type).toMatchInlineSnapshot(`
			{
			  "kind": "literal",
			  "subkind": "bigint",
			  "value": 1n,
			}
		`);
		const booleanish = props.get("booleanish");
		expect(booleanish).toBeDefined();
		expect(booleanish?.type).toMatchInlineSnapshot(`
			{
			  "kind": "literal",
			  "subkind": "boolean",
			  "value": true,
			}
		`);
		const numberish = props.get("numberish");
		expect(numberish).toBeDefined();
		expect(numberish?.type).toMatchInlineSnapshot(`
			{
			  "kind": "literal",
			  "subkind": "number",
			  "value": 1337,
			}
		`);
		const stringish = props.get("stringish");
		expect(stringish).toBeDefined();
		expect(stringish?.type).toMatchInlineSnapshot(`
			{
			  "kind": "literal",
			  "subkind": "string",
			  "value": "awesome",
			}
		`);
	});

	it("it documents props with 'never' type", ({ expect }) => {
		const filepath = create_path_to_example_component("data", "props", "never.svelte");
		const generated = generate(filepath, OPTIONS);
		const { props } = generated[1];
		expect(props.size).toBe(1);
		const giveup = props.get("giveup");
		expect(giveup).toBeDefined();
		expect(giveup?.type).toMatchInlineSnapshot(`
			{
			  "kind": "never",
			}
		`);
	});

	it("it documents props with 'object' type kind", ({ expect }) => {
		const filepath = create_path_to_example_component("data", "props", "object.svelte");
		const generated = generate(filepath, OPTIONS);
		const { props } = generated[1];
		expect(props.size).toBe(1);
		const data = props.get("data");
		expect(data).toBeDefined();
		expect(data?.type).toMatchInlineSnapshot(`
			{
			  "isReadonly": false,
			  "kind": "object",
			  "properties": Map {
			    "foo" => {
			      "kind": "string",
			    },
			    "bar" => {
			      "kind": "number",
			    },
			  },
			}
		`);
	});

	it("it documents prop with 'union' type kind", ({ expect }) => {
		const filepath = create_path_to_example_component("data", "props", "union.svelte");
		const generated = generate(filepath, OPTIONS);
		const { props } = generated[1];
		expect(props.size).toBe(3);
		const color = props.get("color");
		expect(color).toBeDefined();
		expect(color?.type).toMatchInlineSnapshot(`
			{
			  "kind": "union",
			  "members": [
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
		const step = props.get("step");
		expect(step).toBeDefined();
		expect(step?.type).toMatchInlineSnapshot(`
			{
			  "kind": "union",
			  "members": [
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
			    {
			      "kind": "literal",
			      "subkind": "number",
			      "value": 3,
			    },
			  ],
			}
		`);
		const mixed = props.get("mixed");
		expect(mixed).toBeDefined();
		expect(mixed?.type).toMatchInlineSnapshot(`
			{
			  "kind": "union",
			  "members": [
			    {
			      "kind": "undefined",
			    },
			    {
			      "kind": "null",
			    },
			    {
			      "kind": "string",
			    },
			    {
			      "kind": "number",
			    },
			    {
			      "kind": "bigint",
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
			}
		`);
	});

	it("it documents props with 'unknown' type", ({ expect }) => {
		const filepath = create_path_to_example_component("data", "props", "unknown.svelte");
		const generated = generate(filepath, OPTIONS);
		const { props } = generated[1];
		expect(props.size).toBe(1);
		const meaning_of_life = props.get("meaning-of-life");
		expect(meaning_of_life).toBeDefined();
		expect(meaning_of_life?.type).toMatchInlineSnapshot(`
			{
			  "kind": "unknown",
			}
		`);
	});

	it("it documents prop with 'void' type kind", ({ expect }) => {
		const filepath = create_path_to_example_component("data", "props", "void.svelte");
		const generated = generate(filepath, OPTIONS);
		const { props } = generated[1];
		expect(props.size).toBe(1);
		const myunderstanding = props.get("myunderstanding");
		expect(myunderstanding).toBeDefined();
		expect(myunderstanding?.type).toMatchInlineSnapshot(`
			{
			  "kind": "void",
			}
		`);
	});
});
