import { describe, it } from "vitest";

import { Compiler } from "../src/compiler.js";
import { Parser } from "../src/parser";
import { create_path_to_example_component } from "./util.js";

describe("Compiler", () => {
	describe("filepath", () => {
		it("should add `.jsx` extension to the original Svelte filepath", ({ expect }) => {
			const filepath = create_path_to_example_component("compiler", "button.svelte");
			const compiled = new Compiler(filepath, new Parser(filepath));
			expect(compiled.filepath.endsWith(".tsx")).toBe(true);
		});
	});

	describe("tsx.code", () => {
		it("returns compiled code with `svelte2tsx`", ({ expect }) => {
			const filepath = create_path_to_example_component("compiler", "button.svelte");
			const compiled = new Compiler(filepath, new Parser(filepath));
			expect(compiled.tsx.code).toMatchInlineSnapshot(`
				"import { SvelteComponentTyped } from "svelte"



				type Props = HTMLButtonAttributes &  {
					disabled?: boolean;
					/**
					 * Is this the principal call to action on the page?
					 * @default false
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
					size: "small" | "medium" | "large";
					/**
					 * Content of the button
					 * @category content
					 */
					children: Snippet;
				};
				import type { Snippet } from "svelte";
				import type { HTMLButtonAttributes } from "svelte/elements";
				function render() {



				let {
					primary = false,
					backgroundColor,
					size = $bindable("medium"),
					children,
					disabled = $bindable(false),
					...buttonProps
				}: Props = $props();
				;
				async () => {



				  { svelteHTML.createElement("button", {       "type":\`button\`,"class":size,"style":backgroundColor ? \`background-color: \${backgroundColor}\` : "",...buttonProps,});primary;
					;__sveltets_2_ensureSnippet(children());
				 }


				};
				return { props: {} as any as Props, exports: {}, bindings: __sveltets_$$bindings('size', 'disabled'), slots: {}, events: {} }}
				/**
				 * Native button component
				 * @category Atom
				 * @subcategory Semantic
				 */
				const Button = __sveltets_2_fn_component(render());
				type Button = ReturnType<typeof Button>;
				export default Button;"
			`);
		});
	});
});
