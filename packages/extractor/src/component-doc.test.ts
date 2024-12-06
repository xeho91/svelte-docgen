import { describe, it } from "vitest";

import { ComponentDocExtractor } from "./component-doc.js";
import { Parser } from "./parser.js";
import { create_path_to_example_component } from "../tests/shared.js";

describe(ComponentDocExtractor.name, () => {
	describe("description", () => {
		it("returns empty string when no description is found", ({ expect }) => {
			const filepath = create_path_to_example_component(
				"extractor",
				"documentation",
				"description",
				"empty.svelte",
			);
			const parsed = new Parser(filepath);
			// biome-ignore lint/style/noNonNullAssertion: No need to add type guard
			const extracted = new ComponentDocExtractor(parsed.documentation_comment!);
			expect(extracted.description).toBeDefined();
			expect(extracted.description).toBe("");
		});

		it("extracts description correctly after `@component` tag", ({ expect }) => {
			const filepath = create_path_to_example_component(
				"extractor",
				"documentation",
				"description",
				"with-tags.svelte",
			);
			const parsed = new Parser(filepath);
			// biome-ignore lint/style/noNonNullAssertion: No need to add type guard
			const extracted = new ComponentDocExtractor(parsed.documentation_comment!);
			expect(extracted.description).toBeDefined();
			expect(extracted.description).toMatchInlineSnapshot(`"Native button component description"`);
		});

		it("removes leading and trailing whitespaces", ({ expect }) => {
			const filepath = create_path_to_example_component(
				"extractor",
				"documentation",
				"description",
				"whitespaced.svelte",
			);
			const parsed = new Parser(filepath);
			// biome-ignore lint/style/noNonNullAssertion: No need to add type guard
			const extracted = new ComponentDocExtractor(parsed.documentation_comment!);
			expect(extracted.description).toBeDefined();
			expect(extracted.description).toMatchInlineSnapshot(
				`"Leading an trailing whitespaces from description are removed."`,
			);
		});

		it("extracts with multiple lines correctly", ({ expect }) => {
			const filepath = create_path_to_example_component(
				"extractor",
				"documentation",
				"description",
				"multiple-lines.svelte",
			);
			const parsed = new Parser(filepath);
			// biome-ignore lint/style/noNonNullAssertion: No need to add type guard
			const extracted = new ComponentDocExtractor(parsed.documentation_comment!);
			expect(extracted.description).toBeDefined();
			expect(extracted.description).toMatchInlineSnapshot(`
				"This is first paragraph.


				This is second paragraph.



				This is third paragraph.


				---

				This is footnote;"
			`);
		});
	});

	describe("tags", () => {
		it("returns empty array when no other tags other than `@component` are found", ({ expect }) => {
			const filepath = create_path_to_example_component("extractor", "documentation", "tags", "no-tags.svelte");
			const parsed = new Parser(filepath);
			// biome-ignore lint/style/noNonNullAssertion: No need to add type guard
			const extracted = new ComponentDocExtractor(parsed.documentation_comment!);
			expect(extracted.tags).toHaveLength(0);
		});

		it("extracts an array of tags correctly", ({ expect }) => {
			const filepath = create_path_to_example_component("extractor", "documentation", "tags", "example.svelte");
			const parsed = new Parser(filepath);
			// biome-ignore lint/style/noNonNullAssertion: No need to add type guard
			const extracted = new ComponentDocExtractor(parsed.documentation_comment!);
			expect(extracted.tags).toHaveLength(2);
			expect(extracted.tags).toContainEqual({
				name: "category",
				description: "Atom",
			});
			expect(extracted.tags).toContainEqual({
				name: "subcategory",
				description: "Semantic",
			});
		});

		it("complicated tag with multiple lines is parsed correctly", ({ expect }) => {
			const filepath = create_path_to_example_component("extractor", "documentation", "tags", "complex.svelte");
			const parsed = new Parser(filepath);
			// biome-ignore lint/style/noNonNullAssertion: No need to add type guard
			const extracted = new ComponentDocExtractor(parsed.documentation_comment!);
			expect(extracted.tags).toHaveLength(1);
			const customTag = extracted.tags.find((tag) => tag.name === "custom");
			expect(customTag?.description).toMatchInlineSnapshot(`
				"Very complex tag with {@link https://example.com}
				and multi-line {@link https://example.com}.

				It also should ignore markdownlint syntax unless some of lines starts with \`@\`.

				## Some heading

				Some text.

				---

				## Another heading

				Some [text].

				| Tables | Are | Cool |
				| ------ | --- | ---- |
				|        |     |      |

				[text]: https://example.com"
			`);
		});
	});
});
