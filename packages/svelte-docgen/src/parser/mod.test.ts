import { describe, it } from "vitest";

import { create_options } from "../../tests/shared.js";
import { parse } from "../mod.js";

describe("parse", () => {
	it("throws error on accessing legacy events or slots on modern component documentation", ({ expect }) => {
		const parsed = parse(
			`
			<!--
				@component Native button component
				@category Atom
				@subcategory Semantic
			-->

			<script module>
				export const ID = "example-button";
			</script>

			<script lang="ts">
				import type { Snippet } from "svelte";
				import type { MouseEventHandler } from "svelte/elements";

				interface Props {
					disabled?: boolean;
					/**
					 * Is this the principal call to action on the page?
					 * @category design
					 */
					primary?: boolean;
					/**
					 * What background color to use
					 */
					backgroundColor?: string;
					/**
					 * How large should the button be?
					 */
					size?: "small" | "medium" | "large";
					/**
					 * Content of the button
					 * @category content
					 */
					children: Snippet;
					onclick: MouseEventHandler<HTMLButtonElement>,
				}
				let {
					primary = false,
					backgroundColor,
					size = $bindable("medium"),
					children,
					disabled = $bindable(false),
					onclick = () => {},
					...buttonProps
				}: Props = $props();
			</script>

			<button
				id={ID}
				type="button"
				class:primary
				class={size}
				style={backgroundColor ? \`background-color: \${backgroundColor}\` : ""}
				{onclick}
				{...buttonProps}
			>
				{@render children()}
			</button>
			`,
			create_options("example.svelte"),
		);
		expect(parsed.isLegacy).toBe(false);
		expect(() => parsed.events).toThrowErrorMatchingInlineSnapshot("[Error]");
		expect(() => parsed.slots).toThrowErrorMatchingInlineSnapshot("[Error]");
	});
});
