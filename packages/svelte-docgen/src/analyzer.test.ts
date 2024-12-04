import { describe, it } from "vitest";

import { PropAnalyzer } from "./analyzer.js";
import { create_path_to_example_component, OPTIONS } from "../tests/shared.ts";
import { parse } from "./parser.js";

describe(PropAnalyzer.name, () => {
	describe(".isSnippet", () => {
		const filepath = create_path_to_example_component("data", "props", "snippet_type.svelte");
		const parsed = parse(filepath, OPTIONS);

		it("recognizes simple snippet without parameters", ({ expect }) => {
			const children = parsed[1].props.get("children");
			expect(children).toBeDefined();
			if (children) {
				const analyzer = new PropAnalyzer(children);
				expect(analyzer.isSnippet).toBe(true);
			}
		});

		it("recognizes snippet with parameter", ({ expect }) => {
			const header = parsed[1].props.get("header");
			expect(header).toBeDefined();
			if (header) {
				console.log({ header });
				const analyzer = new PropAnalyzer(header);
				expect(analyzer.isSnippet).toBe(true);
			}
		});
	});
});
