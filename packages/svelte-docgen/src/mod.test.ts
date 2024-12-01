import { describe, it } from "vitest";

import { generate } from "./mod.js";
import { OPTIONS, create_path_to_example_component } from "../tests/shared.js";

describe("generate", () => {
	it("returns an tuple of two items [filepath, data]", ({ expect }) => {
		const filepath = create_path_to_example_component("components", "button.svelte");
		const [filepath_, data] = generate(filepath, OPTIONS);
		expect(filepath_).toBe(filepath);
		// TODO: Add test for data
	});
});
