import { describe, it } from "vitest";

import { generate } from "../src/mod.js";
import { OPTIONS, create_path_to_example_component } from "./shared.js";

describe("generate(filepath)[1].slots", () => {
	it("returns empty object is component doesn't include slots (legacy)", ({ expect }) => {
		const filepath = create_path_to_example_component("data", "slots", "none.svelte");
		const generated = generate(filepath, OPTIONS);
		const slots = generated[1].slots;
		expect(slots).toMatchInlineSnapshot("{}");
	});

	it("returns object wtih available slots (legacy)", ({ expect }) => {
		const filepath = create_path_to_example_component("data", "slots", "some.svelte");
		const generated = generate(filepath, OPTIONS);
		const slots = generated[1].slots;
		expect(slots).toMatchInlineSnapshot(`
			{
			  "default": {},
			  "footer": {},
			  "header": {
			    "title": {
			      "expanded": "string",
			    },
			  },
			}
		`);
		const keys = Object.keys(slots);
		expect(keys).toHaveLength(3);
		expect(slots).toHaveProperty("header");
		expect(slots.header).toHaveProperty("title");
		expect(slots.header.title).toStrictEqual({ expanded: "string" });
	});
});
