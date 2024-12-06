import { describe, it } from "vitest";

import { Parser } from "../src/parser.js";

describe(Parser.name, () => {
	describe("getter .componentComment", () => {
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
				  "end": 80,
				  "start": 5,
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
				  "end": 137,
				  "start": 62,
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
				  "end": 44,
				  "start": 5,
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

	describe("getter .isLangTypeScript", () => {
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

	describe("getter .hasLegacySyntax", () => {
		it("returns `false` when no legacy syntax is used", ({ expect }) => {
			const { hasLegacySyntax } = new Parser(`
				<script lang="ts">
					import { ButtonHTMLAttributes } from "svelte/element";

					interface Props extends ButtonHTMLAttributes {}
					let { ..._ }: Props = $props();
				</script>
			`);
			expect(hasLegacySyntax).toBe(false);
		});

		it("returns `true` when legacy `export let` component props was found", ({ expect }) => {
			const { hasLegacySyntax } = new Parser(`
				<script lang="ts">
					export let disabled = false;
				</script>
			`);
			expect(hasLegacySyntax).toBe(true);
		});

		it("returns `true` when legacy `$:` reactivity was found in instance script tag", ({ expect }) => {
			const { hasLegacySyntax } = new Parser(`
				<script lang="ts">
					let a = 1;
					let b = 2;
					$: sum = a + b;
				</script>
			`);
			expect(hasLegacySyntax).toBe(true);
		});

		it("returns `true` when legacy `<slot />` elements were found", ({ expect }) => {
			const { hasLegacySyntax } = new Parser(`
				<slot />
			`);
			expect(hasLegacySyntax).toBe(true);
		});

		it("returns `true` when legacy `<svelte:component>` element was found", ({ expect }) => {
			const { hasLegacySyntax } = new Parser(`
				<svelte:component this={Button} />
			`);
			expect(hasLegacySyntax).toBe(true);
		});

		it("returns `true` when legacy `<svelte:component>` element was found", ({ expect }) => {
			const { hasLegacySyntax } = new Parser(`
				<svelte:component this={MyComponent} />
			`);
			expect(hasLegacySyntax).toBe(true);
		});

		it("returns `true` when legacy `<svelte:fragment>` element was found", ({ expect }) => {
			const { hasLegacySyntax } = new Parser(`
				<Widget>
					<h1 slot="header">Hello</h1>
					<svelte:fragment slot="footer">
						<p>All rights reserved.</p>
						<p>Copyright (c) 2019 Svelte Industries</p>
					</svelte:fragment>
				</Widget>
			`);
			expect(hasLegacySyntax).toBe(true);
		});

		it("returns `true` when legacy `<svelte:self>` element was found", ({ expect }) => {
			const { hasLegacySyntax } = new Parser(`
				{#if count > 0}
					<p>counting down... {count}</p>
					<svelte:self count={count - 1} />
				{:else}
					<p>lift-off!</p>
				{/if}
			`);
			expect(hasLegacySyntax).toBe(true);
		});
	});
});
