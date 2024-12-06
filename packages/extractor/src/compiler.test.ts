import { describe, it } from "vitest";

import { Compiler } from "../src/compiler.js";
import { Parser } from "../src/parser.js";
import { OPTIONS } from "../tests/shared.js";

const EXAMPLE = `
	<!--
	@component Native button component
	@category Atom
	@subcategory Semantic
	-->

	<script lang="ts">
		import type { Snippet } from "svelte";
		import type { HTMLButtonAttributes } from "svelte/elements";

		interface Props extends HTMLButtonAttributes { }
		let { ..._ }: Props = $props();
	</script>
`;

describe(Compiler.name, () => {
	describe("filepath", () => {
		it("should add `.tsx` extension to the original Svelte filepath", ({ expect }) => {
			const { filepath } = new Compiler(EXAMPLE, new Parser(EXAMPLE), OPTIONS);
			expect(filepath).toMatchInlineSnapshot(`"1733463615337-21vy75zb.svelte.tsx"`);
			expect(filepath.endsWith(".tsx")).toBe(true);
		});
	});

	describe("tsx.code", () => {
		it("returns compiled code with `svelte2tsx`", ({ expect }) => {
			const { tsx } = new Compiler(EXAMPLE, new Parser(EXAMPLE), OPTIONS);
			expect(tsx.code).toMatchInlineSnapshot(`
				"import { SvelteComponentTyped } from "svelte"

				;
				import type { Snippet } from "svelte";
				import type { HTMLButtonAttributes } from "svelte/elements";
				;

						interface Props extends HTMLButtonAttributes { };function render() {




						let { ..._ }: Props = $props();
					;
				async () => {



				};
				return { props: {} as any as Props, exports: {}, bindings: __sveltets_$$bindings(''), slots: {}, events: {} }}
				/**
				 * Native button component
				 * @category Atom
				 * @subcategory Semantic
				 */
				const E61voirf = __sveltets_2_fn_component(render());
				type E61voirf = ReturnType<typeof E61voirf>;
				export default E61voirf;"
			`);
		});
	});
});
