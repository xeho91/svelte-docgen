import { describe, it } from "vitest";

import { PropExtractor } from "../src/prop.js";
import { DocumentationExtractor } from "../src/documentation.js";
import { Parser } from "../src/parser.js";
import { create_path_to_example_component } from "./util.js";
import { Extractor } from "../src/mod.js";

describe("DocumentationExtractor", () => {
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
			const extracted = new DocumentationExtractor(parsed.documentation_comment!);
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
			const extracted = new DocumentationExtractor(parsed.documentation_comment!);
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
			const extracted = new DocumentationExtractor(parsed.documentation_comment!);
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
			const extracted = new DocumentationExtractor(parsed.documentation_comment!);
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
			const extracted = new DocumentationExtractor(parsed.documentation_comment!);
			expect(extracted.tags).toHaveLength(0);
		});

		it("extracts an array of tags correctly", ({ expect }) => {
			const filepath = create_path_to_example_component("extractor", "documentation", "tags", "example.svelte");
			const parsed = new Parser(filepath);
			// biome-ignore lint/style/noNonNullAssertion: No need to add type guard
			const extracted = new DocumentationExtractor(parsed.documentation_comment!);
			expect(extracted.tags).toHaveLength(2);
			expect(extracted.tags).toContainEqual({
				name: "@category",
				description: "Atom",
			});
			expect(extracted.tags).toContainEqual({
				name: "@subcategory",
				description: "Semantic",
			});
		});

		it("complicated tag with multiple lines is parsed correctly", ({ expect }) => {
			const filepath = create_path_to_example_component("extractor", "documentation", "tags", "complex.svelte");
			const parsed = new Parser(filepath);
			// biome-ignore lint/style/noNonNullAssertion: No need to add type guard
			const extracted = new DocumentationExtractor(parsed.documentation_comment!);
			expect(extracted.tags).toHaveLength(1);
			const customTag = extracted.tags.find((tag) => tag.name === "@custom");
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

describe("PropExractor", () => {
	it("creates properties required for further transformation correctly", ({ expect }) => {
		const filepath = create_path_to_example_component("extractor", "props", "rune.svelte");
		const extracted = new Extractor(filepath);
		for (const [name, prop] of extracted.props) {
			expect(name).toBe("disabled");
			expect(prop).toBeInstanceOf(PropExtractor);
			expect(prop).toHaveProperty("symbol");
			expect(prop).toHaveProperty("type");
			expect(prop).toHaveProperty("declaration");
			expect(prop).toHaveProperty("source");
		}
	});
});

describe("Extractor", () => {
	describe("props", () => {
		it("returns empty map when no props are found", ({ expect }) => {
			const filepath = create_path_to_example_component("extractor", "props", "none.svelte");
			const extracted = new Extractor(filepath);
			expect(extracted.props).toHaveLength(0);
		});

		it("returns map with [name, type] when props rune is found", ({ expect }) => {
			const filepath = create_path_to_example_component("extractor", "props", "rune.svelte");
			const extracted = new Extractor(filepath);
			expect(extracted.props).toHaveLength(1);
			expect(extracted.props.get("disabled")).toBeDefined();
		});

		it("returns map with [name, type] when export lets are found", ({ expect }) => {
			const filepath = create_path_to_example_component("extractor", "props", "legacy-export-let.svelte");
			const extracted = new Extractor(filepath);
			expect(extracted.props).toHaveLength(3);
			expect(extracted.props.get("foo")).toBeDefined();
			expect(extracted.props.get("bar")).toBeDefined();
			expect(extracted.props.get("baz")).toBeDefined();
		});
	});

	describe("defaults", () => {
		it("returns empty map when no defaults for props are found", ({ expect }) => {
			const filepath = create_path_to_example_component("extractor", "defaults", "none.svelte");
			const extracted = new Extractor(filepath);
			expect(extracted.defaults).toHaveLength(0);
		});

		it("returns a map with [name, type] from destructuring `$props()` rune call", ({ expect }) => {
			const filepath = create_path_to_example_component("extractor", "defaults", "rune.svelte");
			const extracted = new Extractor(filepath);
			expect(extracted.defaults).toHaveLength(2);
			expect(extracted.defaults.get("id")?.isStringLiteral()).toBe(true);
			expect(extracted.defaults.get("onclick")?.getCallSignatures()).toHaveLength(1);
			expect(extracted.defaults.has("disabled")).toBe(false);
		});

		it("returns a map with [name, type] from gathering legacy `export let` syntax", ({ expect }) => {
			const filepath = create_path_to_example_component("extractor", "defaults", "legacy-let-export.svelte");
			const extracted = new Extractor(filepath);
			expect(extracted.defaults).toHaveLength(2);
			expect(extracted.defaults.get("id")?.isNumberLiteral()).toBe(true);
			expect(extracted.defaults.get("name")?.isStringLiteral()).toBe(true);
			expect(extracted.defaults.has("age")).toBe(false);
		});
	});

	describe("bindings", () => {
		it("returns empty set when no bindable props are found", ({ expect }) => {
			const filepath = create_path_to_example_component("extractor", "bindings", "none.svelte");
			const extracted = new Extractor(filepath);
			expect(extracted.bindings).toHaveLength(0);
		});

		it("returns set with names of bindable props", ({ expect }) => {
			const filepath = create_path_to_example_component("extractor", "bindings", "sample.svelte");
			const extracted = new Extractor(filepath);
			expect(extracted.bindings).toHaveLength(2);
			expect(extracted.bindings).toContain("value");
			expect(extracted.bindings).toContain("borderBoxSize");
		});
	});

	describe("slots", () => {
		it("returns empty map if no legacy slots are found", ({ expect }) => {
			const filepath = create_path_to_example_component("extractor", "slots", "none.svelte");
			const extracted = new Extractor(filepath);
			expect(extracted.slots).toHaveLength(0);
		});

		it("handles default slot with passed data", ({ expect }) => {
			const filepath = create_path_to_example_component("extractor", "slots", "default.svelte");
			const extracted = new Extractor(filepath);
			expect(extracted.slots).toHaveLength(1);
			expect(extracted.slots.get("default")).toBeDefined();
			expect(extracted.slots.get("default")).toHaveLength(0);
		});

		it("handles default slot without passed prop data", ({ expect }) => {
			const filepath = create_path_to_example_component("extractor", "slots", "passing-data.svelte");
			const extracted = new Extractor(filepath);
			expect(extracted.slots).toHaveLength(1);
			expect(extracted.slots.get("default")).toBeDefined();
			expect(extracted.slots.get("default")).toHaveLength(2);
		});

		it("handles mutliple slots", ({ expect }) => {
			const filepath = create_path_to_example_component("extractor", "slots", "multiple.svelte");
			const extracted = new Extractor(filepath);
			expect(extracted.slots).toHaveLength(4);
			expect(extracted.slots.get("header")).toBeDefined();
			expect(extracted.slots.get("header")).toHaveLength(1);
			expect(extracted.slots.get("header")?.get("title")).toBeDefined();
			expect(extracted.slots.get("default")).toBeDefined();
			expect(extracted.slots.get("default")).toHaveLength(0);
			expect(extracted.slots.get("buttons")).toBeDefined();
			expect(extracted.slots.get("buttons")).toHaveLength(1);
			expect(extracted.slots.get("buttons")?.get("clicked")).toBeDefined();
			expect(extracted.slots.get("footer")).toBeDefined();
			expect(extracted.slots.get("footer")).toHaveLength(1);
			expect(extracted.slots.get("footer")?.get("footnote")).toBeDefined();
		});
	});

	describe("exports", () => {
		it("returns empty map if no legacy exports are found", ({ expect }) => {
			const filepath = create_path_to_example_component("extractor", "exports", "none.svelte");
			const extracted = new Extractor(filepath);
			expect(extracted.exports).toHaveLength(0);
		});

		it("returns filled map if legacy exports are found", ({ expect }) => {
			const filepath = create_path_to_example_component("extractor", "exports", "example.svelte");
			const extracted = new Extractor(filepath);
			expect(extracted.exports).toHaveLength(2);
			expect(extracted.exports.get("FOO")).toBeDefined();
			expect(extracted.exports.get("BAZ")).toBeDefined();
		});
	});

	describe("events", () => {
		it("returns empty map if no legacy custom events are found", ({ expect }) => {
			const filepath = create_path_to_example_component("extractor", "events", "none.svelte");
			const extracted = new Extractor(filepath);
			expect(extracted.events).toHaveLength(0);
		});

		it("returns filled map if legacy custom events are found", ({ expect }) => {
			const filepath = create_path_to_example_component("extractor", "events", "example.svelte");
			const extracted = new Extractor(filepath);
			expect(extracted.events).toHaveLength(2);
			expect(extracted.events.get("decrement")).toBeDefined();
			expect(extracted.events.get("increment")).toBeDefined();
		});
	});
});
