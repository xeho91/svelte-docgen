import { describe, it } from "vitest";

import { Parser } from "../parser.js";
import { ComponentDocExtractor } from "./component-doc.js";

describe(ComponentDocExtractor.name, () => {
	describe("description", () => {
		it("returns empty string when no description is found, but other tags are present", ({ expect }) => {
			const { componentComment } = new Parser(`
				<!--
				@component
				@category Atom
				@subcategory Semantic
				-->
			`);
			expect(componentComment).toBeDefined();
			if (componentComment) {
				const { description } = new ComponentDocExtractor(componentComment);
				expect(description).toBeDefined();
				expect(description).toBe("");
			}
		});

		it("extracts description correctly after `@component` tag", ({ expect }) => {
			const { componentComment } = new Parser(`
				<!--
				@component Native button component description
				@category Atom
				@subcategory Semantic
				-->
			`);
			expect(componentComment).toBeDefined();
			if (componentComment) {
				const { description } = new ComponentDocExtractor(componentComment);
				expect(description).toBeDefined();
				expect(description).toMatchInlineSnapshot(`"Native button component description"`);
			}
		});

		it("removes leading and trailing whitespaces", ({ expect }) => {
			const { componentComment } = new Parser(`
				<!--
				@component


				Leading an trailing whitespaces from description are removed.


				@category Atom
				@subcategory Semantic
				-->
			`);
			expect(componentComment).toBeDefined();
			if (componentComment) {
				const { description } = new ComponentDocExtractor(componentComment);
				expect(description).toBeDefined();
				expect(description).toMatchInlineSnapshot(
					`"Leading an trailing whitespaces from description are removed."`,
				);
			}
		});

		it("extracts with multiple lines correctly", ({ expect }) => {
			const { componentComment } = new Parser(`
				<!--
				@component


				This is first paragraph.


				This is second paragraph.



				This is third paragraph.


				---

				This is footnote;


				@category Atom
				@subcategory Semantic
				-->
			`);
			expect(componentComment).toBeDefined();
			if (componentComment) {
				const { description } = new ComponentDocExtractor(componentComment);
				expect(description).toBeDefined();
				expect(description).toMatchInlineSnapshot(`
					"This is first paragraph.


					This is second paragraph.



					This is third paragraph.


					---

					This is footnote;"
				`);
			}
		});

		describe("tags", () => {
			it("returns undefined when no other tags other than `@component` are found", ({ expect }) => {
				const { componentComment } = new Parser(`
					<!--
					@component Some description
					-->
				`);
				expect(componentComment).toBeDefined();
				if (componentComment) {
					const { tags } = new ComponentDocExtractor(componentComment);
					expect(tags).not.toBeDefined();
				}
			});

			it("extracts an array of tags correctly", ({ expect }) => {
				const { componentComment } = new Parser(`
					<!--
					@component Some description
					@category Atom
					@subcategory Semantic
					-->
				`);
				expect(componentComment).toBeDefined();
				if (componentComment) {
					const { tags } = new ComponentDocExtractor(componentComment);
					expect(tags).toHaveLength(2);
					expect(tags).toContainEqual({
						name: "category",
						content: "Atom",
					});
					expect(tags).toContainEqual({
						name: "subcategory",
						content: "Semantic",
					});
				}
			});

			it("complicated tag with multiple lines is parsed correctly", ({ expect }) => {
				const { componentComment } = new Parser(`
					<!--
					@component Some description
					@custom
					Very complex tag with {@link https://example.com}
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

					[text]: https://example.com
					-->
				`);
				expect(componentComment).toBeDefined();
				if (componentComment) {
					const { tags } = new ComponentDocExtractor(componentComment);
					expect(tags).toHaveLength(1);
					const customTag = tags?.find((tag) => tag.name === "custom");
					expect(customTag).toBeDefined();
					expect(customTag?.content).toMatchInlineSnapshot(`
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
				}
			});
		});
	});
});
