import { describe, it } from "vitest";

import { Parser } from "../src/parser.js";

describe(Parser.name, () => {
	describe("componentComment", () => {
		it("extracts `Comment` (html) AST node with starting `@component` correctly", ({ expect }) => {
			const { componentComment } = new Parser(`
				<!--
					@component
					This is an example component description.
				-->

				<script>
				let { name } = $props();
				</script>

				<h1>Hello {name}!</h1>
			`);
			expect(componentComment).not.toBeUndefined();
			expect(componentComment).toMatchInlineSnapshot(`
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
			const { componentComment } = new Parser(`
				<script>
				let { name } = $props();
				</script>

				<!--
					@component
					This is an example component description.
				-->

				<h1>Hello {name}!</h1>
			`);
			expect(componentComment).not.toBeUndefined();
			expect(componentComment).toMatchInlineSnapshot(`
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
			const { componentComment } = new Parser(`
				<!--
					@component
					FIRST
				-->

				<script>
				let { name } = $props();
				</script>

				<h1>Hello {name}!</h1>

				<!--
					@component
					SECOND
				-->
			`);
			expect(componentComment).not.toBeUndefined();
			expect(componentComment).toMatchInlineSnapshot(`
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
			const { componentComment } = new Parser(`
				<!--
					This is an example comment
				-->
				<script>
				let { name } = $props();
				</script>

				<h1>Hello {name}!</h1>
				description
			`);
			expect(componentComment).toBeUndefined();
		});
	});

	describe("isLangTypeScript", () => {
		it('returns `true` when the script tag (instance) has `lang="ts"`', ({ expect }) => {
			const { isLangTypeScript } = new Parser(`
				<script lang="ts">
					// Test
				</script>
			`);
			expect(isLangTypeScript).toBe(true);
		});

		it('returns `true` when the script tag (instance) has `lang="typescript"`', ({ expect }) => {
			const { isLangTypeScript } = new Parser(`
				<script lang="typescript">
					// Test
				</script>
			`);
			expect(isLangTypeScript).toBe(true);
		});

		it("returns `false` when the script tag (instance) doesnt have `lang` attribute", ({ expect }) => {
			const { isLangTypeScript } = new Parser(`
				<script>
					// Test
				</script>
			`);
			expect(isLangTypeScript).toBe(false);
		});

		it("returns `false` when no script tag (instance) is found", ({ expect }) => {
			const { isLangTypeScript } = new Parser(`
				<h1>Hello world!</h1>
			`);
			expect(isLangTypeScript).toBe(false);
		});
	});
});
