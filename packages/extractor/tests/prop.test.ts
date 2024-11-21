import { describe, it } from "vitest";

import { extract } from "../src/mod.js";
import { PropExtractor } from "../src/prop.js";
import { OPTIONS, create_path_to_example_component } from "./shared.js";

describe("PropExractor", () => {
	it("creates properties required for further transformation correctly", ({ expect }) => {
		const filepath = create_path_to_example_component("extractor", "props", "rune.svelte");
		const extracted = extract(filepath, OPTIONS);
		for (const [name, prop] of extracted.props) {
			expect(name).toBe("disabled");
			expect(prop).toBeInstanceOf(PropExtractor);
			expect(prop).toHaveProperty("symbol");
			expect(prop).toHaveProperty("type");
			expect(prop).toHaveProperty("declaration");
			expect(prop).toHaveProperty("source");
		}
	});
});
