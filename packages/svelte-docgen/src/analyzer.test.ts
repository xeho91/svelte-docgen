import { describe, it } from "vitest";

import { PropAnalyzer } from "./analyzer.js";
import { create_path_to_example_component, OPTIONS } from "../tests/shared.ts";
import { parse } from "./parser.js";

describe(PropAnalyzer.name, () => {
	describe("getter .isSnippet & getSnippetParameters()", () => {
		const filepath = create_path_to_example_component("data", "props", "snippet_type.svelte");
		const parsed = parse(filepath, OPTIONS);
		const { props } = parsed[1];

		it("recognizes simple snippet without parameters", ({ expect }) => {
			const children = props.get("children");
			expect(children).toBeDefined();
			if (children) {
				const analyzer = new PropAnalyzer(children);
				expect(analyzer.isSnippet).toBe(true);
				expect(analyzer.getSnippetParameters().elements).toHaveLength(0);
			}
		});

		it("recognizes snippet with single parameter", ({ expect }) => {
			const header = props.get("header");
			expect(header).toBeDefined();
			if (header) {
				const analyzer = new PropAnalyzer(header);
				expect(analyzer.isSnippet).toBe(true);
				expect(analyzer.getSnippetParameters().elements).toHaveLength(1);
			}
		});

		it("recognizes snippet with multiple parameters", ({ expect }) => {
			const footer = props.get("footer");
			expect(footer).toBeDefined();
			if (footer) {
				const analyzer = new PropAnalyzer(footer);
				expect(analyzer.isSnippet).toBe(true);
				expect(analyzer.getSnippetParameters().elements).toHaveLength(2);
			}
		});

		it("returns false for non-snippet", ({ expect }) => {
			const whatever = props.get("whatever");
			expect(whatever).toBeDefined();
			if (whatever) {
				const analyzer = new PropAnalyzer(whatever);
				expect(analyzer.isSnippet).toBe(false);
			}
		});
	});

	describe("getter .isEventHandler", () => {
		const filepath = create_path_to_example_component("data", "props", "event_handler.svelte");
		const parsed = parse(filepath, OPTIONS);
		const { props } = parsed[1];

		it("recognizes event handler when using `<Name>EventHandler` type helper", ({ expect }) => {
			const onclick = props.get("onclick");
			expect(onclick).toBeDefined();
			if (onclick) {
				const analyzer = new PropAnalyzer(onclick);
				expect(analyzer.isEventHandler).toBe(true);
			}
		});

		it.fails("recognizes event handler when using `EventHandler` type helper", ({ expect }) => {
			const onkeydown = props.get("onkeydown");
			expect(onkeydown).toBeDefined();
			if (onkeydown) {
				const analyzer = new PropAnalyzer(onkeydown);
				expect(analyzer.isEventHandler).toBe(true);
			}
		});
	});
});
