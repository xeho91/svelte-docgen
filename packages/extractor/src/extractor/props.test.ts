import { describe, it } from "vitest";

import { create_options } from "../../tests/shared.js";
import { extract } from "./mod.js";

describe("props", () => {
	it("returns empty map when no props are found", ({ expect }) => {
		const source = `
			<h1>No props</h1>
		`;
		const { props } = extract(source, create_options("no-props.svelte"));
		expect(props).toHaveLength(0);
	});

	it("handles rune `$props()`", ({ expect }) => {
		const source = `
			<script lang="ts">
				interface Props {
					disabled?: boolean;
				}
				let { disabled }: Props = $props();
			</script>
			<button {disabled}>Click me</button>
		`;
		const { props } = extract(source, create_options("props-rune.svelte"));
		expect(props).toHaveLength(1);
		expect(props.get("disabled")).toBeDefined();
	});

	it("handles legacy props", ({ expect }) => {
		const source = `
			<script lang="ts">
				export let foo: boolean;
				export let bar: number;
				export let baz: string;
			</script>
			<div class:foo></div>
			<button tabindex={bar}>Click me</button>
			<div class:baz></div>
		`;
		const { props } = extract(source, create_options("legacy-props.svelte"));
		expect(props).toHaveLength(3);
		expect(props.get("foo")).toBeDefined();
		expect(props.get("bar")).toBeDefined();
		expect(props.get("baz")).toBeDefined();
	});
});
