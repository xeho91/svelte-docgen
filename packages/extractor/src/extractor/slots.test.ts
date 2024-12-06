import { describe, it } from "vitest";

import { extract } from "./mod.js";
import { create_options } from "../../tests/shared.js";

describe("slots", () => {
	it("returns empty map if no legacy slots are found", ({ expect }) => {
		const source = `
			<h1>No slots</h1>
		`;
		const { slots } = extract(source, create_options("no-slots.svelte"));
		expect(slots).toHaveLength(0);
	});

	it("handles default slot with no props", ({ expect }) => {
		const source = `
			<slot />
		`;
		const { slots } = extract(source, create_options("default-slot.svelte"));
		expect(slots).toHaveLength(1);
		const default_ = slots.get("default");
		expect(default_).toBeDefined();
		expect(default_).toHaveLength(0);
	});

	it("handles default slot with props", ({ expect }) => {
		const source = `
			<script>
				/** @type {number} */
				let number_value = 123;
				let string_value = "abc";
			</script>
			<div>
				<slot number={number_value} string={string_value}></slot>
			</div>
		`;
		const { slots } = extract(source, create_options("slot-with-props.svelte"));
		expect(slots).toHaveLength(1);
		expect(slots.get("default")).toBeDefined();
		expect(slots.get("default")).toHaveLength(2);
	});

	it("handles multiple slots", ({ expect }) => {
		const source = `
			<script>
				/** @type {string} */
				let title = "Header";
				/** @type {string} */
				let footnote = "This is a footnote";
				/** @type {number} */
				let clicked = 0;
			</script>
			<div>
				<slot name="header" {title}></slot>
				<slot>Fallback</slot>
				<slot name="buttons" {clicked}></slot>
				<slot name="footer" {footnote}></slot>
			</div>
		`;
		const { slots } = extract(source, create_options("multiple-slots.svelte"));
		expect(slots).toHaveLength(4);
		const header = slots.get("header");
		expect(header).toBeDefined();
		expect(header).toHaveLength(1);
		expect(header?.get("title")).toBeDefined();
		const default_ = slots.get("default");
		expect(default_).toBeDefined();
		expect(default_).toHaveLength(0);
		const buttons = slots.get("buttons");
		expect(buttons).toBeDefined();
		expect(buttons).toHaveLength(1);
		expect(buttons?.get("clicked")).toBeDefined();
		const footer = slots.get("footer");
		expect(footer).toBeDefined();
		expect(footer).toHaveLength(1);
		expect(footer?.get("footnote")).toBeDefined();
	});

	it("handles fallback slot", ({ expect }) => {
		const source = `
			<slot>
				This will be rendered if no slotted content is provided
			</slot>
		`;
		const { slots } = extract(source, create_options("fallback-slot.svelte"));
		expect(slots).toHaveLength(1);
		expect(slots.get("default")).toBeDefined();
	});
});
