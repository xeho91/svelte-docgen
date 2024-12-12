import { describe, it } from "vitest";

import { create_options } from "../../tests/shared.js";
import { extract } from "./mod.js";

describe("bindings", () => {
	it("returns empty set when no bindable props are found", ({ expect }) => {
		const source = `
			<script lang="ts">
				interface Props {
					id: string;
				}
				let { id }: Props = $props();
			</script>
			<input {id} type="text" />
		`;
		const { bindings } = extract(source, create_options("no-bindings.svelte"));
		expect(bindings).toHaveLength(0);
	});

	it("returns set with name of a single bindable prop", ({ expect }) => {
		const source = `
			<script lang="ts">
				interface Props {
					id: string;
					value?: string;
				}
				let {
					id,
					value = $bindable(),
				}: Props = $props();
			</script>
			<input {id} bind:value />
		`;
		const { bindings } = extract(source, create_options("single-bindings.svelte"));
		expect(bindings).toHaveLength(1);
		expect(bindings).toContain("value");
	});

	it("returns set with names of multiple bindable props", ({ expect }) => {
		const source = `
			<script lang="ts">
				interface Props {
					id: string;
					value?: string;
					borderBoxSize?: ResizeObserverSize[];
				}
				let {
					id,
					borderBoxSize = $bindable(),
					value = $bindable(),
				}: Props = $props();
			</script>
			<input {id} bind:value bind:borderBoxSize />
		`;
		const { bindings } = extract(source, create_options("multiple-bindings.svelte"));
		expect(bindings).toHaveLength(2);
		expect(bindings).toContain("value");
		expect(bindings).toContain("borderBoxSize");
	});
});
