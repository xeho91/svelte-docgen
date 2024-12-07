import { describe, it } from "vitest";

import { create_options } from "../../tests/shared.js";
import { parse } from "../mod.js";

describe("exports", () => {
	it("returns empty map if component doesn't have any exports", ({ expect }) => {
		const { exports } = parse(
			`
				<h1>This component doesn't have any exports</h1>
			`,
			create_options("no-exports.svelte"),
		);
		expect(exports).toMatchInlineSnapshot("Map {}");
		expect(exports.size).toBe(0);
	});

	// FIXME: Tracking issue: https://github.com/xeho91/svelte-docgen/issues/4
	it.fails("returns filled object when component has defined some in module script", ({ expect }) => {
		const { exports } = parse(
			`
			<script module>
				export const DEFAULT_NAME = "John";
				export const DEFAULT_LAST_NAME = "Doe";
			</script>
			`,
			create_options("module-exports.svelte"),
		);
		expect(exports).toMatchInlineSnapshot("Map {}");
		expect(exports.size).toBe(2);
	});

	it("returns empty object has define some exports in instance tag (legacy)", ({ expect }) => {
		const { exports } = parse(
			`
			<script>
				export const ID = "not-really-unique";
				export const DEFAULT_DESCRIPTION = "Very boring one.";
			</script>
			`,
			create_options("instance-legacy-exports.svelte"),
		);
		expect(exports).toMatchInlineSnapshot(`
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
