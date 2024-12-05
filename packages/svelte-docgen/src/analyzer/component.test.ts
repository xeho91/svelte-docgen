import { describe, it } from "vitest";

import { OPTIONS, create_path_to_example_component } from "../../tests/shared.ts";
import { parse } from "../parser.js";
import { analyzeComponent } from "./component.js";

describe(analyzeComponent.name, () => {
	describe("getter .category", () => {
		it("extracts defined `@category` from component description", ({ expect }) => {
			const filepath = create_path_to_example_component("data", "component", "tags", "with.svelte");
			const parsed = parse(filepath, OPTIONS)[1];
			const analyzer = analyzeComponent(parsed);
			expect(analyzer.category).toBeDefined();
			expect(analyzer.category).toBe("Atom");
		});
	});

	describe("getter .subcategory", () => {
		it("extracts defined `@subcategory` from component description", ({ expect }) => {
			const filepath = create_path_to_example_component("data", "component", "tags", "with.svelte");
			const parsed = parse(filepath, OPTIONS)[1];
			const analyzer = analyzeComponent(parsed);
			expect(analyzer.subcategory).toBeDefined();
			expect(analyzer.subcategory).toBe("Native");
		});
	});

	describe("getter .props", () => {
		it("when component is legacy, modern event handlers are omitted", ({ expect }) => {
			const filepath = create_path_to_example_component("data", "component", "legacy.svelte");
			const parsed = parse(filepath, OPTIONS)[1];
			const analyzer = analyzeComponent(parsed);
			const { props } = analyzer;
			expect(props.get("on:click")).toBeDefined();
			expect(props.get("onclick")).not.toBeDefined();
			expect(props.get("disabled")).toBeDefined();
		});

		it("when component is not legacy, legacy event handlers are omitted", ({ expect }) => {
			const filepath = create_path_to_example_component("data", "component", "modern.svelte");
			const parsed = parse(filepath, OPTIONS)[1];
			const analyzer = analyzeComponent(parsed);
			const { props } = analyzer;
			expect(props.get("onclick")).toBeDefined();
			expect(props.get("on:click")).not.toBeDefined();
			expect(props.get("disabled")).toBeDefined();
		});
	});
});
