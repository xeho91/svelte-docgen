import { describe, it } from "vitest";

import { OPTIONS, create_path_to_example_component } from "../tests/shared.js";
import { parse } from "./parser.js";

describe("parse(filepath)[1].exports", () => {
	it("returns empty map if component doesn't have any exports", ({ expect }) => {
		const filepath = create_path_to_example_component("data", "exports", "none.svelte");
		const parsed = parse(filepath, OPTIONS)[1];
		expect(parsed.exports).toMatchInlineSnapshot("Map {}");
		expect(parsed.exports.size).toBe(0);
	});

	// FIXME: Tracking issue: https://github.com/xeho91/svelte-docgen/issues/4
	it.fails("returns filled object when component has defined some in module script", ({ expect }) => {
		const filepath = create_path_to_example_component("data", "exports", "some.svelte");
		const parsed = parse(filepath, OPTIONS)[1];
		expect(parsed.exports).toMatchInlineSnapshot("Map {}");
		expect(parsed.exports.size).toBe(2);
	});

	it("returns empty object has define some exports in instance tag (legacy)", ({ expect }) => {
		const filepath = create_path_to_example_component("data", "exports", "legacy.svelte");
		const parsed = parse(filepath, OPTIONS)[1];
		expect(parsed.exports).toMatchInlineSnapshot(`
			Map {
			  "ID" => {
			    "kind": "literal",
			    "subkind": "string",
			    "value": "not-really-unique",
			  },
			  "DEFAULT_DESCRIPTION" => {
			    "kind": "literal",
			    "subkind": "string",
			    "value": "Very boring one.",
			  },
			}
		`);
	});
});
