import { describe, it } from "vitest";

import { generate } from "./mod.js";
import { OPTIONS, create_path_to_example_component } from "../tests/shared.js";

describe("generate(filepath)[1].events", () => {
	it("returns empty object is component doesn't create custom events (legacy)", ({ expect }) => {
		const filepath = create_path_to_example_component("data", "events", "none.svelte");
		const generated = generate(filepath, OPTIONS);
		expect(generated[1].events).toMatchInlineSnapshot("{}");
	});

	it("returns object with available custom events (legacy) prefixed with `on:`", ({ expect }) => {
		const filepath = create_path_to_example_component("data", "events", "some.svelte");
		const generated = generate(filepath, OPTIONS);
		expect(generated[1].events).toMatchInlineSnapshot(`
			{
			  "on:decrement": {
			    "expanded": "CustomEvent<Typings[Key]>",
			  },
			  "on:increment": {
			    "expanded": "CustomEvent<Typings[Key]>",
			  },
			}
		`);
		const keys = Object.keys(generated[1].events);
		expect(keys).toHaveLength(2);
		expect(keys.every((name) => name.startsWith("on:"))).toBe(true);
	});
});
