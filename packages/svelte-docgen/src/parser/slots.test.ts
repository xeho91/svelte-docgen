import { describe, it } from "vitest";

import { create_options } from "../../tests/shared.js";
import { parse } from "../mod.js";

describe("slots", () => {
	it("returns empty map if component doesn't include slots (legacy)", ({ expect }) => {
		const { slots } = parse(
			`
				<script>
					let a = 1;
					let b = 2;
					$: sum = a + b;
				</script>
				<h1>This component doesn't have any slots</h1>
			`,
			create_options("no-slots.svelte"),
		);
		expect(slots).toMatchInlineSnapshot("Map {}");
		expect(slots.size).toBe(0);
	});

	it("returns map wtih available slots (legacy)", ({ expect }) => {
		const { slots, isLegacy } = parse(
			`
			<script>
				/** @type {string} */
				export let title;
			</script>

			<slot name="header" {title} />
			<slot>Fallback body</slot>
			<footer>
				<slot name="footer">
					<p>
						Created in 2024.<br>
						<small>For testing purposes.</small>
					</p>
				</slot>
			</footer>
			`,
			create_options("slots.svelte"),
		);
		expect(slots).toMatchInlineSnapshot(`
			Map {
			  "header" => Map {
			    "title" => {
			      "isBindable": false,
			      "isExtended": false,
			      "isOptional": false,
			      "tags": [],
			      "type": {
			        "kind": "string",
			      },
			    },
			  },
			  "default" => Map {},
			  "footer" => Map {},
			}
		`);
		expect(slots.size).toBeGreaterThan(0);
		expect(isLegacy).toBe(true);
		if (isLegacy) {
			const header = slots.get("header");
			expect(header).toBeDefined();
			const title = header?.get("title");
			expect(title).toBeDefined();
			expect(title).toMatchInlineSnapshot(`
				{
				  "isBindable": false,
				  "isExtended": false,
				  "isOptional": false,
				  "tags": [],
				  "type": {
				    "kind": "string",
				  },
				}
			`);
		}
	});
});
