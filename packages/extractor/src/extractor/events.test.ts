import { describe, it } from "vitest";

import { extract } from "./mod.js";
import { create_options } from "../../tests/shared.js";

describe("events", () => {
	it("returns empty map if no legacy custom events are found", ({ expect }) => {
		const source = `
			<script>
				// No legacy custom events were defined
			</script>
		`;
		const { events } = extract(source, create_options("no-events.svelte"));
		expect(events).toHaveLength(0);
	});

	it("returns filled map if legacy custom events are found", ({ expect }) => {
		const source = `
			<script lang="ts">
				import { createEventDispatcher } from "svelte";
				const dispatch = createEventDispatcher<{
					decrement: number;
					increment: number;
				}>();
			</script>
			<button on:click={() => dispatch('decrement', 1)}>decrement</button>
			<button on:click={() => dispatch('increment', 1)}>increment</button>
		`;
		const { events } = extract(source, create_options("legacy-events.svelte"));
		expect(events).toHaveLength(2);
		expect(events.get("decrement")).toBeDefined();
		expect(events.get("increment")).toBeDefined();
	});
});
