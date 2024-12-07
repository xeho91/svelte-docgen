import { describe, it } from "vitest";

import { create_options } from "../../tests/shared.js";
import { extract } from "./mod.js";

describe("exports", () => {
	it("returns empty map if no legacy exports are found", ({ expect }) => {
		const source = `
			<script>
				// Nothing was exported from instance script (supported in v4)
			</script>
		`;
		const { exports } = extract(source, create_options("no-exports.svelte"));
		expect(exports).toHaveLength(0);
	});

	it("returns filled map if legacy exports are found", ({ expect }) => {
		const source = `
			<script lang="ts">
				export const FOO = "BAR";
				export const BAZ = {
					foo: "bar",
					baz: "qux",
				} as const;
			</script>
		`;
		const { exports } = extract(source, create_options("legacy-exports.svelte"));
		expect(exports).toHaveLength(2);
		expect(exports.get("FOO")).toBeDefined();
		expect(exports.get("BAZ")).toBeDefined();
	});
});
