import { describe, it } from "vitest";

import { create_options } from "../../../tests/shared.js";
import type * as Doc from "../../doc/type.js";
import { parse } from "../mod.js";

describe("TypeParam", () => {
	const { props } = parse(
		`
		<script lang="ts" generics="U, const C, R extends number, D = string">
			interface Props {
				unknown: U;
				constant: C;
				constraint: R;
				default: D;
			}
			let { ..._ }: Props = $props();
		</script>
		`,
		create_options("type-parameter.svelte"),
	);

	it("documents unknown 'type-parameter'", ({ expect }) => {
		const unknown = props.get("unknown");
		expect(unknown).toBeDefined();
		expect(unknown?.type).toMatchInlineSnapshot(`
			{
			  "constraint": {
			    "kind": "unknown",
			  },
			  "isConst": false,
			  "kind": "type-parameter",
			  "name": "U",
			}
		`);
		expect(unknown?.type.kind).toBe("type-parameter");
		expect((unknown?.type as Doc.TypeParam).isConst).toBe(false);
		expect((unknown?.type as Doc.TypeParam).constraint.kind).toBe("unknown");
		expect((unknown?.type as Doc.TypeParam).default).not.toBeDefined();
	});

	it("recognizes `const`", ({ expect }) => {
		const constant = props.get("constant");
		expect(constant).toBeDefined();
		expect(constant?.type).toMatchInlineSnapshot(`
			{
			  "constraint": {
			    "kind": "unknown",
			  },
			  "isConst": true,
			  "kind": "type-parameter",
			  "name": "C",
			}
		`);
		expect(constant?.type.kind).toBe("type-parameter");
		expect((constant?.type as Doc.TypeParam).isConst).toBe(true);
		expect((constant?.type as Doc.TypeParam).constraint.kind).toBe("unknown");
		expect((constant?.type as Doc.TypeParam).default).not.toBeDefined();
	});

	it("recognizes constraint", ({ expect }) => {
		const constraint = props.get("constraint");
		expect(constraint).toBeDefined();
		expect(constraint?.type).toMatchInlineSnapshot(`
			{
			  "constraint": {
			    "kind": "number",
			  },
			  "isConst": false,
			  "kind": "type-parameter",
			  "name": "R",
			}
		`);
		expect(constraint?.type.kind).toBe("type-parameter");
		expect((constraint?.type as Doc.TypeParam).isConst).toBe(false);
		expect((constraint?.type as Doc.TypeParam).constraint.kind).toBe("number");
		expect((constraint?.type as Doc.TypeParam).default).not.toBeDefined();
	});

	it("recognizes default", ({ expect }) => {
		const default_ = props.get("default");
		expect(default_).toBeDefined();
		expect(default_?.type).toMatchInlineSnapshot(`
			{
			  "constraint": {
			    "kind": "unknown",
			  },
			  "default": {
			    "kind": "string",
			  },
			  "isConst": false,
			  "kind": "type-parameter",
			  "name": "D",
			}
		`);
		expect(default_?.type.kind).toBe("type-parameter");
		expect((default_?.type as Doc.TypeParam).isConst).toBe(false);
		expect((default_?.type as Doc.TypeParam).constraint.kind).toBe("unknown");
		expect((default_?.type as Doc.TypeParam).default).toBeDefined();
		expect((default_?.type as Doc.TypeParam).default?.kind).toBe("string");
	});
});
