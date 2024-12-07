import { describe, it } from "vitest";

import { create_options } from "../../tests/shared.ts";
import { parse } from "../parser/mod.js";

describe("description", () => {
	it("returns undefined if no root comment is found", ({ expect }) => {
		const { description } = parse(
			`
				<h1>No comment with description</h1>
			`,
			create_options("parser-component-description-none.svelte"),
		);
		expect(description).not.toBeDefined();
	});

	it("extracts from HTML comment at the root with `@component` tag", ({ expect }) => {
		const { description } = parse(
			`
			<!--
				@component This is a description that should be extracted.
			-->
			`,
			create_options("parser-component-description-some.svelte"),
		);
		expect(description).toBeDefined();
		expect(description).toMatchInlineSnapshot(`"This is a description that should be extracted."`);
	});

	it("ignores HTML comment at the root without `@component` tag", ({ expect }) => {
		const { description } = parse(
			`
			<!--
				This is a description without \`@component\` tag, it should be ignored.
			-->
			`,
			create_options("parser-component-description-ignored.svelte"),
		);
		expect(description).not.toBeDefined();
	});

	it("ignores HTML comment that is NOT at the root (nested)", ({ expect }) => {
		const { description } = parse(
			`
			<div>
				<!--
					@component
					This is a description that should NOT be extracted, because it not at the root.
				-->
			</div>
			`,
			create_options("parser-component-description-no-root.svelte"),
		);
		expect(description).not.toBeDefined();
	});
});

describe("tags", () => {
	it("returns an empty array if no other tags than `@component` are found", ({ expect }) => {
		const { tags } = parse(
			`
			<!--
				@component This comment doesn't have any other tags.
			-->
			`,
			create_options("parser-component-tags-none.svelte"),
		);
		expect(tags).not.toBeDefined();
	});

	it("returns an array if other tags than `@component` are found", ({ expect }) => {
		const { tags } = parse(
			`
			<!--
				@component Some tags.
				@category Atom
				@subcategory Native
			-->
			`,
			create_options("parser-component-tags-some.svelte"),
		);
		expect(tags).toBeDefined();
		expect(tags).toContainEqual({
			content: "Atom",
			name: "category",
		});
		expect(tags).toContainEqual({
			content: "Native",
			name: "subcategory",
		});
	});

	it("tags can be repeated multiple times", ({ expect }) => {
		const { tags } = parse(
			`
			<!--
				@component
				This one component have some example tags. This time with multiple \`@example\`.

				@category Atom
				@subcategory Native

				@example

				\`\`\`svelte
				<script>
					import MyComponent from "./MyComponent.svelte";
				</script>

				<MyComponent />
				\`\`\`

				@example

				\`\`\`svelte
				<script>
					import Component from "./Component.svelte";
				</script>

				<Component name="Unknown" />
				\`\`\`
			-->
			`,
			create_options("parser-component-tags-repetive.svelte"),
		);
		expect(tags).toBeDefined();
		expect(tags?.filter((t) => t.name === "example")).toHaveLength(2);
	});
});
