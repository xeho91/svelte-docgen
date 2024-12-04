import type ts from "typescript";

import type { Extractor, parse_stringified_type } from "./shared.js";
import type { TYPE_KINDS } from "./type.js";

export declare namespace Doc {
	interface Base {
		description?: string;
		tags: Tag[];
	}

	interface Tag {
		name: string;
		content?: string;
	}

	interface Component extends Base {}

	interface OptionalProp {
		default?: Type;
		isOptional: true;
	}
	interface RequiredProp {
		default?: never;
		isOptional: false;
	}
	type Prop = Base & {
		default?: Type;
		isBindable: boolean;
		isOptional: boolean;
		type: Type;
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
		| FunctionType
		| Interface
		| Intersection
		| Literal
		| Tuple
		| TypeParameter
		| Union;

	export interface BaseType {
		kind: TypeKind;
	}

	interface ArrayType {
		kind: "array";
		isReadonly: boolean;
		element: Type;
	}

	interface Constructible {
		kind: "constructible";
		name: string;
		constructors: Array<FunctionParameter[]> | "self";
	}

	interface OptionalFunctionParameter {
		isOptional: true;
		default?: ReturnType<typeof parse_stringified_type>;
	}
	interface RequiredFunctionParameter {
		isOptional: false;
		default?: never;
	}
	type FunctionParameter = {
		name: string;
		isOptional: boolean;
		default?: ReturnType<typeof parse_stringified_type>;
		type: Type;
	} & (OptionalFunctionParameter | RequiredFunctionParameter);

	interface FunctionCall {
		parameters: (FunctionParameter | "self")[];
		returns: Type;
	}
	interface FunctionType {
		kind: "function";
		calls: FunctionCall[];
	}

	interface Interface {
		kind: "interface";
		name: string;
		members: Map<string, Member>;
	}

	interface Intersection {
		kind: "intersection";
		types: Type[];
		alias?: string;
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

	interface ObjectType {
		kind: "object";
		members?: Map<string, Member>;
	}

	interface Tuple {
		kind: "tuple";
		isReadonly: boolean;
		elements: Type[];
		alias?: string;
	}

	interface TypeParameter {
		kind: "type-parameter";
		name: string;
		isConst: boolean;
		constraint: Type;
		default?: Type;
	}

	interface Union {
		kind: "union";
		types: Type[];
		alias?: string;
	}
}

/**
 * @internal
 */
export interface GetTypeParams<T extends ts.Type = ts.Type> {
	type: T;
	extractor: Extractor;
	self?: string;
}
