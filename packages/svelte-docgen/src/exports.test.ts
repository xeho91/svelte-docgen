import { describe, it } from "vitest";

import { generate } from "./mod.js";
import { OPTIONS, create_path_to_example_component } from "../tests/shared.js";

describe("generate(filepath)[1].exports", () => {
	it("returns empty object if component doesn't have any exports", ({ expect }) => {
		const filepath = create_path_to_example_component("data", "exports", "none.svelte");
		const generated = generate(filepath, OPTIONS);
		const exports = generated[1].exports;
		expect(exports).toMatchInlineSnapshot("{}");
	});

	// FIXME: Tracking issue: https://github.com/xeho91/svelte-docgen/issues/4
	it.fails("returns filled object when component has defined some in module script", ({ expect }) => {
		const filepath = create_path_to_example_component("data", "exports", "some.svelte");
		const generated = generate(filepath, OPTIONS);
		const exports = generated[1].exports;
		// expect(exports).toMatchInlineSnapshot(`{}`);
		const keys = Object.keys(exports);
		expect(keys).toHaveLength(2);
	});

	it("returns empty object has define some exports in instance tag (legacy)", ({ expect }) => {
		const filepath = create_path_to_example_component("data", "exports", "legacy.svelte");
		const generated = generate(filepath, OPTIONS);
		const exports = generated[1].exports;
		expect(exports).toMatchInlineSnapshot(`
			{
			  "DEFAULT_DESCRIPTION": {
			    "expanded": ""Very boring one."",
			  },
			  "ID": {
			    "expanded": ""not-really-unique"",
			  },
			}
		`);
	});
});
