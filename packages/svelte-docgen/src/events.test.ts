import { describe, it } from "vitest";

import { OPTIONS, create_path_to_example_component } from "../tests/shared.js";
import { parse } from "./parser.js";

describe("parse(filepath)[1].events", () => {
	it("returns empty map is component doesn't create custom events (legacy)", ({ expect }) => {
		const filepath = create_path_to_example_component("data", "events", "none.svelte");
		const parsed = parse(filepath, OPTIONS)[1];
		expect(parsed.events).toMatchInlineSnapshot("Map {}");
		expect(parsed.events.size).toBe(0);
	});

	it("returns map with available custom events (legacy) prefixed with `on:`", ({ expect }) => {
		const filepath = create_path_to_example_component("data", "events", "some.svelte");
		const parsed = parse(filepath, OPTIONS)[1];
		expect(parsed.events).toMatchInlineSnapshot(`
			Map {
			  "on:decrement" => {
			    "kind": "any",
			  },
			  "on:increment" => {
			    "kind": "any",
			  },
			}
		`);
		for (const key of parsed.events.keys()) {
			expect(key.startsWith("on:")).toBe(true);
		}
	});
});
