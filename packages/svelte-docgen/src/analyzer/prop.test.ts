import path from "node:path";
import url from "node:url";

import { describe, it } from "vitest";

import { create_options } from "../../tests/shared.ts";
import { parse } from "../parser/mod.js";
import { analyzeProperty } from "./prop.js";

const __filename = url.fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

describe(analyzeProperty.name, () => {
	describe("getter .isEventHandler", () => {
		const { props } = parse(
			`
			<script lang="ts">
				import type { EventHandler, MouseEventHandler } from "svelte/elements";

				interface Props {
					onclick: MouseEventHandler<HTMLDivElement>;
					onkeydown: EventHandler<KeyboardEvent, HTMLDivElement>;
				}
				let { ..._ }: Props = $props();
			</script>
			`,
			create_options("analyze-property-event-handler.svelte"),
		);

		it("recognizes event handler when using `<Name>EventHandler` type helper", ({ expect }) => {
			const onclick = props.get("onclick");
			expect(onclick).toBeDefined();
			if (onclick) {
				const analyzer = analyzeProperty(onclick);
				expect(analyzer.isEventHandler).toBe(true);
			}
		});

		it("recognizes event handler when using `EventHandler` type helper", ({ expect }) => {
			const onkeydown = props.get("onkeydown");
			if (onkeydown) {
				const analyzer = analyzeProperty(onkeydown);
				expect(analyzer.isEventHandler).toBe(true);
			}
		});
	});

	describe("getter .isExtendedBySvelte", () => {
		const { props } = parse(
			`
			<script lang="ts">
				import type { HTMLButtonAttributes } from "svelte/elements";
				import type { CustomProps } from "${path.join(__dirname, "..", "..", "tests", "custom-extended.ts")}";

				interface Props extends HTMLButtonAttributes, CustomProps {}
				let { ..._ }: Props = $props();
			</script>
			`,
			create_options("analyze-property-extended-by-svelte.svelte"),
		);

		it("recognizes prop extended by Svelte", ({ expect }) => {
			const aria_hidden = props.get("aria-hidden");
			expect(aria_hidden).toBeDefined();
			if (aria_hidden) {
				const analyzer = analyzeProperty(aria_hidden);
				expect(analyzer.isExtendedBySvelte).toBe(true);
			}
		});

		it("recognizes not extended by Svelte prop", ({ expect }) => {
			const custom = props.get("exported");
			expect(custom).toBeDefined();
			expect(custom?.isExtended).toBe(true);
			if (custom) {
				const analyzer = analyzeProperty(custom);
				expect(analyzer.isExtendedBySvelte).toBe(false);
			}
		});
	});

	describe("getter .isSnippet & getSnippetParameters()", () => {
		const { props } = parse(
			`
			<script lang="ts">
				import type { Snippet } from "svelte";

				type Color = "red" | "green" | "blue";
				interface Props {
					header?: Snippet<[string]>;
					children: Snippet;
					footer?: Snippet<[Color, number]>;
					whatever: any;
				}
				let { footer = default_footer }: Props = $props();
				const color = "red" satisfies Color;
			</script>

			{#snippet default_footer(color: Color, year: number)}
				<p class:color>{\`Copyright © \${year}\`}</p>
			{/snippet}

			{@render footer(color, new Date().getFullYear())}
			`,
			create_options("analyze-property-snippet.svelte"),
		);

		it("recognizes simple snippet without parameters", ({ expect }) => {
			const children = props.get("children");
			expect(children).toBeDefined();
			if (children) {
				const analyzer = analyzeProperty(children);
				expect(analyzer.isSnippet).toBe(true);
				if (analyzer.isSnippet) {
					expect(analyzer.getSnippetParameters().elements).toHaveLength(0);
				}
			}
		});

		it("recognizes snippet with single parameter", ({ expect }) => {
			const header = props.get("header");
			expect(header).toBeDefined();
			if (header) {
				const analyzer = analyzeProperty(header);
				expect(analyzer.isSnippet).toBe(true);
				if (analyzer.isSnippet) {
					expect(analyzer.getSnippetParameters().elements).toHaveLength(1);
				}
			}
		});

		it("recognizes snippet with multiple parameters", ({ expect }) => {
			const footer = props.get("footer");
			expect(footer).toBeDefined();
			if (footer) {
				const analyzer = analyzeProperty(footer);
				expect(analyzer.isSnippet).toBe(true);
				if (analyzer.isSnippet) {
					expect(analyzer.getSnippetParameters().elements).toHaveLength(2);
				}
			}
		});

		it("returns false for non-snippet", ({ expect }) => {
			const whatever = props.get("whatever");
			expect(whatever).toBeDefined();
			if (whatever) {
				const analyzer = analyzeProperty(whatever);
				expect(analyzer.isSnippet).toBe(false);
			}
		});
	});
});
