import { describe, it } from "vitest";

import { create_options } from "../tests/shared.js";
import { parse } from "./parser/mod.js";
import { deserialize, serialize } from "./serde.js";

describe("serialize", () => {
	const parsed = parse(
		`
			<script lang="ts">
				interface Props {
					some: any;
					name: string;
					disabled?: boolean;
					date: Date;
				}
				let { ..._ }: Props = $props();
			</script>
			`,
		create_options("serialize.svelte"),
	);
	const serialized = serialize(parsed);
	it("converts 'props' to array of tuples", ({ expect }) => {
		expect(serialized).toMatchInlineSnapshot();
	});
});

describe("deserialize", () => {
	it("revives 'props' as Map", ({ expect }) => {
		const parsed = parse(
			`
			<script lang="ts">
				interface Props {
					some: any;
					name: string;
					disabled?: boolean;
					date: Date;
				}
				let { ..._ }: Props = $props();
			</script>
			`,
			create_options("deserialize.svelte"),
		);
		const serialized = serialize(parsed);
		const deserialized = deserialize(serialized);
		expect(deserialized.props).toBeInstanceOf(Map);
		//
	});
});
