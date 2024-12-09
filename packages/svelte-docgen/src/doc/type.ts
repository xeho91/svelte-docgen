import type { extract } from "@svelte-docgen/extractor";

import type { TypeKind } from "./kind.js";

export declare namespace Doc {
	type Tag = NonNullable<ReturnType<typeof extract>["tags"]>[number];

	interface Docable {
		description?: string;
		tags?: Tag[];
	}

	interface OptionalProp {
		default?: Type;
		isOptional: true;
	}
	interface RequiredProp {
		default?: never;
		isOptional: false;
	}
	interface LocalProp {
		isExtended: false;
		sources?: never;
	}
	interface ExtendedProp {
		isExtended: true;
		/** Where is this extended prop declared? */
		sources?: Set<string>;
	}
	type Prop = Docable & {
		isBindable: boolean;
		type: Type;
	} & (OptionalProp | RequiredProp) &
		(LocalProp | ExtendedProp);

	type Events = Map<string, Type>;
	type Exports = Map<string, Type>;
	type Props = Map<string, Prop>;
	type Slots = Map<string, Props>;

	type Type =
		| BaseType
		| ArrayType
		| Constructible
		| Fn
		| Interface
		| Intersection
		| Literal
		| Tuple
		| TypeParam
		| Union;

	interface WithAlias {
		alias?: string;
		/**
		 * Where is this type declared?
		 */
		sources?: Set<string>;
	}

	interface WithName {
		name: string;
		/**
		 * Where is this type declared?
		 */
		sources: Set<string>;
	}

	interface BaseType {
		/** @see {@link TypeKind} */
		kind: Exclude<
			TypeKind,
			| "array"
			| "constructible"
			| "function"
			| "interface"
			| "intersection"
			| "literal"
			| "tuple"
			| "type-parameter"
			| "union"
		>;
	}

	interface ArrayType {
		kind: "array";
		isReadonly: boolean;
		element: Type;
	}

	interface Constructible extends WithName {
		kind: "constructible";
		name: string;
		constructors: Array<FnParam[]> | "self";
	}

	interface OptionalFnParam {
		isOptional: true;
		default?: Type;
	}
	interface RequiredFnParam {
		isOptional: false;
		default?: never;
	}
	type FnParam = {
		name: string;
		isOptional: boolean;
		default?: Type;
		type: Type;
	} & (OptionalFnParam | RequiredFnParam);

	interface FnCall {
		parameters: (FnParam | "self")[];
		returns: Type;
	}
	interface Fn extends WithAlias {
		kind: "function";
		calls: FnCall[];
	}

	interface Interface extends WithAlias {
		kind: "interface";
		members: Map<string, Member>;
	}

	interface Intersection extends WithAlias {
		kind: "intersection";
		types: Type[];
	}

	interface LiteralBigInt {
		kind: "literal";
		subkind: "bigint";
		value: bigint;
	}
	interface LiteralBoolean {
		kind: "literal";
		subkind: "boolean";
		value: boolean;
	}
	interface LiteralNumber {
		kind: "literal";
		subkind: "number";
		value: number;
	}
	interface LiteralString {
		kind: "literal";
		subkind: "string";
		value: string;
	}
	interface LiteralSymbol {
		kind: "literal";
		subkind: "symbol";
	}
	type Literal = LiteralBigInt | LiteralBoolean | LiteralNumber | LiteralString | LiteralSymbol;

	interface Member {
		isOptional: boolean;
		isReadonly: boolean;
		type: Type;
	}

	interface Tuple extends WithAlias {
		kind: "tuple";
		isReadonly: boolean;
		elements: Type[];
	}

	interface TypeParam {
		kind: "type-parameter";
		name: string;
		isConst: boolean;
		constraint: Type;
		default?: Type;
	}

	interface Union extends WithAlias {
		kind: "union";
		types: Type[];
		nonNullable?: Type;
	}
}
