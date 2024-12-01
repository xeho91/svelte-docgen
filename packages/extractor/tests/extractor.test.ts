import { describe, it } from "vitest";

import { extract } from "../src/mod.js";
import { OPTIONS, create_path_to_example_component } from "./shared.js";

describe("Extractor", () => {
	describe("props", () => {
		it("returns empty map when no props are found", ({ expect }) => {
			const filepath = create_path_to_example_component("extractor", "props", "none.svelte");
			const extracted = extract(filepath, OPTIONS);
			expect(extracted.props).toHaveLength(0);
		});

		it("returns map with [name, type] when props rune is found", ({ expect }) => {
			const filepath = create_path_to_example_component("extractor", "props", "rune.svelte");
			const extracted = extract(filepath, OPTIONS);
			expect(extracted.props).toHaveLength(1);
			expect(extracted.props.get("disabled")).toBeDefined();
		});

		it("returns map with [name, type] when export lets are found", ({ expect }) => {
			const filepath = create_path_to_example_component("extractor", "props", "legacy-export-let.svelte");
			const extracted = extract(filepath, OPTIONS);
			expect(extracted.props).toHaveLength(3);
			expect(extracted.props.get("foo")).toBeDefined();
			expect(extracted.props.get("bar")).toBeDefined();
			expect(extracted.props.get("baz")).toBeDefined();
		});
	});

	describe("defaults", () => {
		it("returns empty map when no defaults for props are found", ({ expect }) => {
			const filepath = create_path_to_example_component("extractor", "defaults", "none.svelte");
			const extracted = extract(filepath, OPTIONS);
			expect(extracted.defaults).toHaveLength(0);
		});

		it("returns a map with [name, type] from destructuring `$props()` rune call", ({ expect }) => {
			const filepath = create_path_to_example_component("extractor", "defaults", "rune.svelte");
			const extracted = extract(filepath, OPTIONS);
			expect(extracted.defaults).toHaveLength(2);
			expect(extracted.defaults.get("id")?.getText()).toMatchInlineSnapshot(`""button-123""`);
			expect(extracted.defaults.get("onclick")?.getText()).toMatchInlineSnapshot(`"() => {}"`);
			expect(extracted.defaults.has("disabled")).toBe(false);
		});

		it("returns a map with [name, type] from gathering legacy `export let` syntax", ({ expect }) => {
			const filepath = create_path_to_example_component("extractor", "defaults", "legacy-let-export.svelte");
			const extracted = extract(filepath, OPTIONS);
			expect(extracted.defaults).toHaveLength(2);
			expect(extracted.defaults.get("id")?.getText()).toMatchInlineSnapshot(`"42"`);
			expect(extracted.defaults.get("name")?.getText()).toMatchInlineSnapshot(`""Chuck""`);
			expect(extracted.defaults.has("age")).toBe(false);
		});
	});

	describe("bindings", () => {
		it("returns empty set when no bindable props are found", ({ expect }) => {
			const filepath = create_path_to_example_component("extractor", "bindings", "none.svelte");
			const extracted = extract(filepath, OPTIONS);
			expect(extracted.bindings).toHaveLength(0);
		});

		it("returns set with names of bindable props", ({ expect }) => {
			const filepath = create_path_to_example_component("extractor", "bindings", "sample.svelte");
			const extracted = extract(filepath, OPTIONS);
			expect(extracted.bindings).toHaveLength(2);
			expect(extracted.bindings).toContain("value");
			expect(extracted.bindings).toContain("borderBoxSize");
		});
	});

	describe("slots", () => {
		it("returns empty map if no legacy slots are found", ({ expect }) => {
			const filepath = create_path_to_example_component("extractor", "slots", "none.svelte");
			const extracted = extract(filepath, OPTIONS);
			expect(extracted.slots).toHaveLength(0);
		});

		it("handles default slot with passed data", ({ expect }) => {
			const filepath = create_path_to_example_component("extractor", "slots", "default.svelte");
			const extracted = extract(filepath, OPTIONS);
			expect(extracted.slots).toHaveLength(1);
			expect(extracted.slots.get("default")).toBeDefined();
			expect(extracted.slots.get("default")).toHaveLength(0);
		});

		it("handles default slot without passed prop data", ({ expect }) => {
			const filepath = create_path_to_example_component("extractor", "slots", "passing-data.svelte");
			const extracted = extract(filepath, OPTIONS);
			expect(extracted.slots).toHaveLength(1);
			expect(extracted.slots.get("default")).toBeDefined();
			expect(extracted.slots.get("default")).toHaveLength(2);
		});

		it("handles multiple slots", ({ expect }) => {
			const filepath = create_path_to_example_component("extractor", "slots", "multiple.svelte");
			const extracted = extract(filepath, OPTIONS);
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

		it("covers fallback slot with no passed data", ({ expect }) => {
			const filepath = create_path_to_example_component("extractor", "slots", "fallback.svelte");
			const extracted = extract(filepath, OPTIONS);
			expect(extracted.slots).toHaveLength(1);
			expect(extracted.slots.get("default")).toBeDefined();
		});
	});

	describe("exports", () => {
		it("returns empty map if no legacy exports are found", ({ expect }) => {
			const filepath = create_path_to_example_component("extractor", "exports", "none.svelte");
			const extracted = extract(filepath, OPTIONS);
			expect(extracted.exports).toHaveLength(0);
		});

		it("returns filled map if legacy exports are found", ({ expect }) => {
			const filepath = create_path_to_example_component("extractor", "exports", "example.svelte");
			const extracted = extract(filepath, OPTIONS);
			expect(extracted.exports).toHaveLength(2);
			expect(extracted.exports.get("FOO")).toBeDefined();
			expect(extracted.exports.get("BAZ")).toBeDefined();
		});
	});

	describe("events", () => {
		it("returns empty map if no legacy custom events are found", ({ expect }) => {
			const filepath = create_path_to_example_component("extractor", "events", "none.svelte");
			const extracted = extract(filepath, OPTIONS);
			expect(extracted.events).toHaveLength(0);
		});

		it("returns filled map if legacy custom events are found", ({ expect }) => {
			const filepath = create_path_to_example_component("extractor", "events", "example.svelte");
			const extracted = extract(filepath, OPTIONS);
			expect(extracted.events).toHaveLength(2);
			expect(extracted.events.get("decrement")).toBeDefined();
			expect(extracted.events.get("increment")).toBeDefined();
		});
	});
});
