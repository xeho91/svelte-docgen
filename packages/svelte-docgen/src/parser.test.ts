import { describe, it } from "vitest";

import { OPTIONS, create_path_to_example_component } from "../tests/shared.js";
import { parse } from "./parser.js";

describe("parse", () => {
	it("returns an tuple of two items [filepath, data]", ({ expect }) => {
		const filepath = create_path_to_example_component("components", "button.svelte");
		const parsed = parse(filepath, OPTIONS);
		expect(parsed).toHaveLength(2);
		expect(parsed[0]).toBe(filepath);
		expect(parsed[1]).toBeTypeOf("object");
	});
});
