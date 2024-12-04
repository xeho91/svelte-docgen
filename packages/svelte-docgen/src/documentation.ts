import type { TYPE_KINDS } from "./type.js";

export declare namespace Doc {
	interface Docable {
		description?: string;
		tags: Tag[];
	}

	interface Tag {
		name: string;
		content?: string;
	}

	interface Component extends Docable {}

	interface OptionalProp {
		default?: Type;
		isOptional: true;
	}
	interface RequiredProp {
		default?: never;
		isOptional: false;
	}
	type Prop = Docable & {
		default?: Type;
		isBindable: boolean;
		isOptional: boolean;
		type: Type;
		/** Where is this prop declared? Could be extended. */
		sources: string[];
	} & (OptionalProp | RequiredProp);

	type Events = Map<string, Type>;
	type Exports = Map<string, Type>;
	type Props = Map<string, Prop>;
	type Slots = Map<string, Props>;

	type TypeKind = typeof TYPE_KINDS extends Set<infer T> ? T : never;

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
		sources?: string[];
	}

	interface WithName {
		name: string;
		/**
		 * Where is this type declared?
		 */
		sources: string[];
	}

	interface BaseType {
		/** @see {@link TYPE_KINDS} */
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
		alias?: string;
	}
}
