import { describe, it } from "vitest";

import { PropAnalyzer } from "./analyzer.js";
import { create_path_to_example_component, OPTIONS } from "../tests/shared.ts";
import { parse } from "./parser.js";

const filepath = create_path_to_example_component("data", "props", "snippet_type.svelte");
const parsed = parse(filepath, OPTIONS);

describe(PropAnalyzer.name, () => {
	describe("getter .isSnippet & getSnippetParameters()", () => {
		it("recognizes simple snippet without parameters", ({ expect }) => {
			const children = parsed[1].props.get("children");
			expect(children).toBeDefined();
			if (children) {
				const analyzer = new PropAnalyzer(children);
				expect(analyzer.isSnippet).toBe(true);
				expect(analyzer.getSnippetParameters().elements).toHaveLength(0);
			}
		});

		it("recognizes snippet with single parameter", ({ expect }) => {
			const header = parsed[1].props.get("header");
			expect(header).toBeDefined();
			if (header) {
				const analyzer = new PropAnalyzer(header);
				expect(analyzer.isSnippet).toBe(true);
				expect(analyzer.getSnippetParameters().elements).toHaveLength(1);
			}
		});

		it("recognizes snippet with multiple parameters", ({ expect }) => {
			const footer = parsed[1].props.get("footer");
			expect(footer).toBeDefined();
			if (footer) {
				const analyzer = new PropAnalyzer(footer);
				expect(analyzer.isSnippet).toBe(true);
				expect(analyzer.getSnippetParameters().elements).toHaveLength(2);
			}
		});

		it("returns false for non-snippet", ({ expect }) => {
			const whatever = parsed[1].props.get("whatever");
			expect(whatever).toBeDefined();
			if (whatever) {
				const analyzer = new PropAnalyzer(whatever);
				expect(analyzer.isSnippet).toBe(false);
			}
		});
	});
});
