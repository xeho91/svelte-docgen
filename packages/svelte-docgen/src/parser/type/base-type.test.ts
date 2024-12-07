import { describe, it } from "vitest";

import { create_options } from "../../../tests/shared.js";
import { parse } from "../mod.js";

describe("BaseType", () => {
	const { props } = parse(
		`
		<script lang="ts">
			interface Props {
				love: any;
				friends: bigint,
				lucky: boolean,
				giveup: never,
				balance: null,
				kids: number,
				data: object,
				facts: {},
				name: string,
				unique: symbol,
				age: undefined,
				"meaning-of-life": unknown,
				"my-understanding": void,
			}
			let { ..._ }: Props = $props();
		</script>
		`,
		create_options("base-type.svelte"),
	);

	it("documents `any`", ({ expect }) => {
		const love = props.get("love");
		expect(love).toBeDefined();
		expect(love?.type).toMatchInlineSnapshot(`
			{
			  "kind": "any",
			}
		`);
	});

	it("documents loose `bigint`", ({ expect }) => {
		const friends = props.get("friends");
		expect(friends).toBeDefined();
		expect(friends?.type).toMatchInlineSnapshot(`
			{
			  "kind": "bigint",
			}
		`);
	});

	it("documents loose `boolean`", ({ expect }) => {
		const lucky = props.get("lucky");
		expect(lucky).toBeDefined();
		expect(lucky?.type).toMatchInlineSnapshot(`
			{
			  "kind": "boolean",
			}
		`);
	});

	it("documents `never`", ({ expect }) => {
		const giveup = props.get("giveup");
		expect(giveup).toBeDefined();
		expect(giveup?.type).toMatchInlineSnapshot(`
			{
			  "kind": "never",
			}
		`);
	});

	it("documents `null`", ({ expect }) => {
		const balance = props.get("balance");
		expect(balance).toBeDefined();
		expect(balance?.type).toMatchInlineSnapshot(`
			{
			  "kind": "null",
			}
		`);
	});

	it("documents loose `number`", ({ expect }) => {
		const kids = props.get("kids");
		expect(kids).toBeDefined();
		expect(kids?.type).toMatchInlineSnapshot(`
			{
			  "kind": "number",
			}
		`);
	});

	it("documents loose 'object'", ({ expect }) => {
		const data = props.get("data");
		expect(data).toBeDefined();
		expect(data?.type).toMatchInlineSnapshot(`
			{
			  "kind": "object",
			}
		`);
	});

	it("recognizes `{}` as loose object", ({ expect }) => {
		const facts = props.get("facts");
		expect(facts).toBeDefined();
		expect(facts?.type).toMatchInlineSnapshot(`
			{
			  "kind": "object",
			}
		`);
	});

	it("documents loose `string`", ({ expect }) => {
		const name = props.get("name");
		expect(name).toBeDefined();
		expect(name?.type).toMatchInlineSnapshot(`
			{
			  "kind": "string",
			}
		`);
	});

	it("documents loose `symbol`", ({ expect }) => {
		const unique = props.get("unique");
		expect(unique).toBeDefined();
		expect(unique?.type).toMatchInlineSnapshot(`
			{
			  "kind": "symbol",
			}
		`);
	});

	it("documents `undefined`", ({ expect }) => {
		const age = props.get("age");
		expect(age).toBeDefined();
		expect(age?.type).toMatchInlineSnapshot(`
			{
			  "kind": "undefined",
			}
		`);
	});

	it("documents `unknown`", ({ expect }) => {
		const meaning_of_life = props.get("meaning-of-life");
		expect(meaning_of_life).toBeDefined();
		expect(meaning_of_life?.type).toMatchInlineSnapshot(`
			{
			  "kind": "unknown",
			}
		`);
	});

	it("documents `void`", ({ expect }) => {
		const meaning_of_life = props.get("my-understanding");
		expect(meaning_of_life).toBeDefined();
		expect(meaning_of_life?.type).toMatchInlineSnapshot(`
			{
			  "kind": "void",
			}
		`);
	});
});
