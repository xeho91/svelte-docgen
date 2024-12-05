import { describe, it } from "vitest";

import { analyzeProperty } from "./analyzer.js";
import { create_path_to_example_component, OPTIONS } from "../tests/shared.ts";
import { parse } from "./parser.js";

describe(analyzeProperty.name, () => {
	describe("getter .isEventHandler", () => {
		const filepath = create_path_to_example_component("data", "props", "event_handler.svelte");
		const parsed = parse(filepath, OPTIONS);
		const { props } = parsed[1];

		it("recognizes event handler when using `<Name>EventHandler` type helper", ({ expect }) => {
			const onclick = props.get("onclick");
			expect(onclick).toBeDefined();
			if (onclick) {
				const analyzer = analyzeProperty(onclick);
				expect(analyzer.isEventHandler).toBe(true);
			}
		});

		it.fails("recognizes event handler when using `EventHandler` type helper", ({ expect }) => {
			const onkeydown = props.get("onkeydown");
			expect(onkeydown).toBeDefined();
			if (onkeydown) {
				const analyzer = analyzeProperty(onkeydown);
				expect(analyzer.isEventHandler).toBe(true);
			}
		});
	});

	describe("getter .isExtendedBySvelte", () => {
		const filepath = create_path_to_example_component("data", "props", "extended.svelte");
		const parsed = parse(filepath, OPTIONS);
		const { props } = parsed[1];

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
		const filepath = create_path_to_example_component("data", "props", "snippet_type.svelte");
		const parsed = parse(filepath, OPTIONS);
		const { props } = parsed[1];

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
