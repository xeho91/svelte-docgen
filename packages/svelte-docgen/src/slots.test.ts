import { describe, it } from "vitest";

import { OPTIONS, create_path_to_example_component } from "../tests/shared.js";
import { parse } from "./parser.js";

describe("parse(filepath)[1].slots", () => {
	it("returns empty map if component doesn't include slots (legacy)", ({ expect }) => {
		const filepath = create_path_to_example_component("data", "slots", "none.svelte");
		const parsed = parse(filepath, OPTIONS)[1];
		expect(parsed.slots).toMatchInlineSnapshot("Map {}");
	});

	it("returns map wtih available slots (legacy)", ({ expect }) => {
		const filepath = create_path_to_example_component("data", "slots", "some.svelte");
		const parsed = parse(filepath, OPTIONS)[1];
		expect(parsed.slots).toMatchInlineSnapshot(`
			Map {
			  "header" => Map {
			    "title" => {
			      "kind": "string",
			    },
			  },
			  "default" => Map {},
			  "footer" => Map {},
			}
		`);
		expect(parsed.isLegacy).toBe(true);
		if (parsed.isLegacy) {
			const header = parsed.slots.get("header");
			expect(header).toBeDefined();
			const title = header?.get("title");
			expect(title).toBeDefined();
			expect(title).toMatchInlineSnapshot(`
				{
				  "kind": "string",
				}
			`);
		}
	});
});
