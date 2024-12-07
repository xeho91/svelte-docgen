import { describe, it } from "vitest";

import { create_options } from "../../../tests/shared.js";
import type { Doc } from "../../doc/type.js";
import { parse } from "../mod.js";

describe("Literal", () => {
	describe("LiteralBigInt", () => {
		const { props } = parse(
			`
			<script lang="ts">
				interface Props {
					positive: 1337n;
					negative: -666n;
				}
				let { ..._ }: Props = $props();
			</script>
			`,
			create_options("literal-bigint.svelte"),
		);

		it("documents 'literal' type -  with negative number", ({ expect }) => {
			const negative = props.get("negative");
			expect(negative).toBeDefined();
			expect(negative?.type).toMatchInlineSnapshot(`
				{
				  "kind": "literal",
				  "subkind": "bigint",
				  "value": -666n,
				}
			`);
			expect((negative?.type as Doc.LiteralBigInt)?.value).toBe(-666n);
		});

		it("documents 'literal' type - with positive number", ({ expect }) => {
			const positive = props.get("positive");
			expect(positive).toBeDefined();
			expect(positive?.type).toMatchInlineSnapshot(`
				{
				  "kind": "literal",
				  "subkind": "bigint",
				  "value": 1337n,
				}
			`);
			expect((positive?.type as Doc.LiteralBigInt)?.value).toBe(1337n);
		});
	});

	describe("LiteralBoolean", () => {
		const { props } = parse(
			`
			<script lang="ts">
				interface Props {
					truthy: true;
					falsy: false;
				}
				let { ..._ }: Props = $props();
			</script>
			`,
			create_options("literal-boolean.svelte"),
		);

		it("documents 'literal' type - true", ({ expect }) => {
			const truthy = props.get("truthy");
			expect(truthy).toBeDefined();
			expect(truthy?.type).toMatchInlineSnapshot(`
				{
				  "kind": "literal",
				  "subkind": "boolean",
				  "value": true,
				}
			`);
			expect((truthy?.type as Doc.LiteralBoolean)?.value).toBe(true);
		});

		it("documents 'literal' type - false", ({ expect }) => {
			const falsy = props.get("falsy");
			expect(falsy).toBeDefined();
			expect(falsy?.type).toMatchInlineSnapshot(`
				{
				  "kind": "literal",
				  "subkind": "boolean",
				  "value": false,
				}
			`);
			expect((falsy?.type as Doc.LiteralBoolean)?.value).toBe(false);
		});
	});

	describe("LiteralNumber", () => {
		const { props } = parse(
			`
			<script lang="ts">
				interface Props {
					leet: 1337;
				}
				let { ..._ }: Props = $props();
			</script>
			`,
			create_options("literal-number.svelte"),
		);

		it("documents 'literal' type - number", ({ expect }) => {
			const leet = props.get("leet");
			expect(leet).toBeDefined();
			expect(leet?.type).toMatchInlineSnapshot(`
				{
				  "kind": "literal",
				  "subkind": "number",
				  "value": 1337,
				}
			`);
			expect((leet?.type as Doc.LiteralNumber)?.value).toBe(1337);
		});
	});

	describe("LiteralString", () => {
		const { props } = parse(
			`
			<script lang="ts">
				interface Props {
					package: "svelte-docgen";
				}
				let { ..._ }: Props = $props();
			</script>
			`,
			create_options("literal-string.svelte"),
		);

		it("documents 'literal' type - string", ({ expect }) => {
			const pkg = props.get("package");
			expect(pkg).toBeDefined();
			expect(pkg?.type).toMatchInlineSnapshot(`
				{
				  "kind": "literal",
				  "subkind": "string",
				  "value": "svelte-docgen",
				}
			`);
			expect((pkg?.type as Doc.LiteralString)?.value).toBe("svelte-docgen");
		});
	});

	describe("LiteralSymbol", () => {
		const { props } = parse(
			`
			<script lang="ts">
				interface Props {
					reality: unique symbol;
				}
				let { ..._ }: Props = $props();
			</script>
			`,
			create_options("literal-symbol.svelte"),
		);

		it("documents 'literal' type - symbol", ({ expect }) => {
			const reality = props.get("reality");
			expect(reality).toBeDefined();
			expect(reality?.type).toMatchInlineSnapshot(`
				{
				  "kind": "symbol",
				}
			`);
		});
	});
});
