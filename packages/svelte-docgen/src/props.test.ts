import { describe, it } from "vitest";

import { OPTIONS, create_path_to_example_component } from "../tests/shared.js";
import { generate } from "./mod.js";
describe("generate(filepath)[1].props", () => {
	it("returns empty map if component doesn't have any props", ({ expect }) => {
		const filepath = create_path_to_example_component("data", "props", "none.svelte");
		const generated = generate(filepath, OPTIONS);
		const { props } = generated[1];
		expect(props.size).toBe(0);
	});

	it("recognizes props with `$bindable()` rune", ({ expect }) => {
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

	it("recognizes optional props and their defaults", ({ expect }) => {
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

	it("recognizes snippet props", ({ expect }) => {
		const filepath = create_path_to_example_component("data", "props", "snippet_type.svelte");
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
				    "alias": "Color",
				    "kind": "union",
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
				  },
				  {
				    "kind": "number",
				  },
				]
			`);
		}
	});
});
