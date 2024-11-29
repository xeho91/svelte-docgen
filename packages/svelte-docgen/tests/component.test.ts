import { describe, it } from "vitest";

import { generate } from "../src/mod.js";
import { OPTIONS, create_path_to_example_component } from "./shared.js";

describe("generate(filepath)[1].component", () => {
	describe("description", () => {
		it("returns empty string if no root comment is found", ({ expect }) => {
			const filepath = create_path_to_example_component("data", "component", "description", "without.svelte");
			const generated = generate(filepath, OPTIONS);
			expect(generated[1].component.description).toMatchInlineSnapshot(`""`);
		});

		it("extracts from HTML comment at the root with `@component` tag", ({ expect }) => {
			const filepath = create_path_to_example_component("data", "component", "description", "with.svelte");
			const generated = generate(filepath, OPTIONS);
			expect(generated[1].component.description).toMatchInlineSnapshot(
				`"This is a description that should be extracted."`,
			);
		});

		it("ignores HTML comment at the root without `@component` tag", ({ expect }) => {
			const filepath = create_path_to_example_component("data", "component", "description", "no-tag.svelte");
			const generated = generate(filepath, OPTIONS);
			expect(generated[1].component.description).toMatchInlineSnapshot(`""`);
		});

		it("ignores HTML comment that is NOT at the root (nested)", ({ expect }) => {
			const filepath = create_path_to_example_component("data", "component", "description", "nested.svelte");
			const generated = generate(filepath, OPTIONS);
			expect(generated[1].component.description).toMatchInlineSnapshot(`""`);
		});
	});

	describe("tags", () => {
		it("returns an empty array if no other tags than `@component` are found", ({ expect }) => {
			const filepath = create_path_to_example_component("data", "component", "tags", "without.svelte");
			const generated = generate(filepath, OPTIONS);
			expect(generated[1].component.tags).toMatchInlineSnapshot("[]");
		});

		it("returns an array if other tags than `@component` are found", ({ expect }) => {
			const filepath = create_path_to_example_component("data", "component", "tags", "with.svelte");
			const generated = generate(filepath, OPTIONS);
			expect(generated[1].component.tags).toMatchInlineSnapshot(`
				[
				  {
				    "content": "Atom",
				    "name": "category",
				  },
				  {
				    "content": "Native",
				    "name": "subcategory",
				  },
				  {
				    "content": "\`\`\`svelte
				<script>
				import MyComponent from "./MyComponent.svelte";
				</script>

				<MyComponent />
				\`\`\`",
				    "name": "example",
				  },
				]
			`);
			expect(generated[1].component.tags).toHaveLength(3);
			expect(generated[1].component.tags).toContainEqual({
				content: "Atom",
				name: "category",
			});
			expect(generated[1].component.tags).toContainEqual({
				content: "Native",
				name: "subcategory",
			});
		});

		it("tags can be repeated multiple times", ({ expect }) => {
			const filepath = create_path_to_example_component("data", "component", "tags", "duplicate.svelte");
			const generated = generate(filepath, OPTIONS);
			expect(generated[1].component.tags).toMatchInlineSnapshot(`
				[
				  {
				    "content": "Atom",
				    "name": "category",
				  },
				  {
				    "content": "Native",
				    "name": "subcategory",
				  },
				  {
				    "content": "\`\`\`svelte
				<script>
				import MyComponent from "./MyComponent.svelte";
				</script>

				<MyComponent />
				\`\`\`",
				    "name": "example",
				  },
				  {
				    "content": "\`\`\`svelte
				<script>
				import Component from "./Component.svelte";
				</script>

				<Component name="Unknown" />
				\`\`\`",
				    "name": "example",
				  },
				]
			`);
			expect(generated[1].component.tags).toHaveLength(4);
			expect(generated[1].component.tags).toContainEqual({
				content: "Atom",
				name: "category",
			});
			expect(generated[1].component.tags).toContainEqual({
				content: "Native",
				name: "subcategory",
			});
		});
	});
});
