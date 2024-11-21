import { describe, it } from "vitest";

import { create_path_to_example_component } from "./util.js";
import { Parser } from "../src/parser.js";

describe("Parser", () => {
	describe("documentation_comment", () => {
		it("extracts `Comment` (html) AST node with starting `@component` correctly", ({ expect }) => {
			const filepath = create_path_to_example_component("parser", "documentation_comment", "top.svelte");
			const parsed = new Parser(filepath);
			expect(parsed.documentation_comment).not.toBeUndefined();
			expect(parsed.documentation_comment).toMatchInlineSnapshot(`
				{
				  "data": "
					@component
					This is an example component description.
				",
				  "end": 63,
				  "start": 0,
				  "type": "Comment",
				}
			`);
		});

		it("it doesn't matter if the comment is at the very top or somewhere else in the fragment", ({ expect }) => {
			const filepath = create_path_to_example_component("parser", "documentation_comment", "anywhere.svelte");
			const parsed = new Parser(filepath);
			expect(parsed.documentation_comment).not.toBeUndefined();
			expect(parsed.documentation_comment).toMatchInlineSnapshot(`
				{
				  "data": "
					@component
					This is an example component description.
				",
				  "end": 108,
				  "start": 45,
				  "type": "Comment",
				}
			`);
		});

		it("the first comment with `@component` tag is the one that is returned", ({ expect }) => {
			const filepath = create_path_to_example_component("parser", "documentation_comment", "duplications.svelte");
			const parsed = new Parser(filepath);
			expect(parsed.documentation_comment).not.toBeUndefined();
			expect(parsed.documentation_comment).toMatchInlineSnapshot(`
				{
				  "data": "
					@component
					FIRST
				",
				  "end": 27,
				  "start": 0,
				  "type": "Comment",
				}
			`);
		});

		it("returns `undefined` when no comment with `@component` is found", ({ expect }) => {
			const filepath = create_path_to_example_component("parser", "documentation_comment", "without-tag.svelte");
			const parsed = new Parser(filepath);
			expect(parsed.documentation_comment).toBeUndefined();
		});
	});

	describe("is_lang_typescript", () => {
		it('returns `true` when the script tag (instance) has `lang="ts"`', ({ expect }) => {
			const filepath = create_path_to_example_component("parser", "is_lang_typescript", "with-ts.svelte");
			const parsed = new Parser(filepath);
			expect(parsed.is_lang_typescript).toBe(true);
		});

		it('returns `true` when the script tag (instance) has `lang="typescript"`', ({ expect }) => {
			const filepath = create_path_to_example_component("parser", "is_lang_typescript", "with-typescript.svelte");
			const parsed = new Parser(filepath);
			expect(parsed.is_lang_typescript).toBe(true);
		});

		it("returns `false` when the script tag (instance) doesnt have `lang` attribute", ({ expect }) => {
			const filepath = create_path_to_example_component("parser", "is_lang_typescript", "without.svelte");
			const parsed = new Parser(filepath);
			expect(parsed.is_lang_typescript).toBe(false);
		});

		it("returns `false` when no script tag (instance) is found", ({ expect }) => {
			const filepath = create_path_to_example_component("parser", "is_lang_typescript", "no-script.svelte");
			const parsed = new Parser(filepath);
			expect(parsed.is_lang_typescript).toBe(false);
		});
	});
});
