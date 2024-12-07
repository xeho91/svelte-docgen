import { describe, it } from "vitest";

import { create_options } from "../../tests/shared.ts";
import { parse } from "../parser/mod.js";
import { analyzeComponent } from "./component.js";

describe(analyzeComponent.name, () => {
	describe("getter .category", () => {
		it("extracts defined `@category` from component description", ({ expect }) => {
			const parsed = parse(
				`
			<!--
				@component
				@category Atom
			-->
			`,
				create_options("analyze-component-category.svelte"),
			);
			const { category } = analyzeComponent(parsed);
			expect(category).toBeDefined();
			expect(category).toBe("Atom");
		});
	});

	describe("getter .subcategory", () => {
		it("extracts defined `@subcategory` from component description", ({ expect }) => {
			const parsed = parse(
				`
				<!--
					@component
					@subcategory Native
				-->
				`,
				create_options("analyze-component-subcategory.svelte"),
			);
			const { subcategory } = analyzeComponent(parsed);
			expect(subcategory).toBeDefined();
			expect(subcategory).toBe("Native");
		});
	});

	describe("getter .props", () => {
		it("when component is legacy, modern event handlers are omitted", ({ expect }) => {
			const parsed = parse(
				`
				<script lang="ts">
					import type { HTMLButtonAttributes } from "svelte/elements";

					type $$Props = HTMLButtonAttributes;
					export let disabled: boolean | null | undefined = undefined;
				</script>

				<button {disabled}>Click me</button>
				`,
				create_options("analyze-component-props-legacy.svelte"),
			);
			const analyzer = analyzeComponent(parsed);
			const { props } = analyzer;
			expect(props.get("on:click")).toBeDefined();
			expect(props.get("onclick")).not.toBeDefined();
			expect(props.get("disabled")).toBeDefined();
		});

		it("when component is not legacy, legacy event handlers are omitted", ({ expect }) => {
			const parsed = parse(
				`
				<script lang="ts">
					import type { HTMLButtonAttributes } from "svelte/elements";

					interface Props extends HTMLButtonAttributes {}
					let { disabled }: Props = $props();
				</script>

				<button {disabled}>Click me</button>
				`,
				create_options("analyze-component-props-modern.svelte"),
			);
			const analyzer = analyzeComponent(parsed);
			const { props } = analyzer;
			expect(props.get("onclick")).toBeDefined();
			expect(props.get("on:click")).not.toBeDefined();
			expect(props.get("disabled")).toBeDefined();
		});
	});
});
