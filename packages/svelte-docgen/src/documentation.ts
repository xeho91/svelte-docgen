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
		| FunctionType
		| Interface
		| Intersection
		| Literal
		| Tuple
		| TypeParameter
		| Union;

	export interface BaseType {
		/** @see {@link TYPE_KINDS} */
		kind: TypeKind;
		/**
		 * Where is this type declared?
		 */
		sources?: string[];
	}

	interface ArrayType extends BaseType {
		kind: "array";
		isReadonly: boolean;
		element: Type;
	}

	interface Constructible extends BaseType {
		kind: "constructible";
		name: string;
		constructors: Array<FunctionParameter[]> | "self";
	}

	interface OptionalFunctionParameter {
		isOptional: true;
		default?: Type;
	}
	interface RequiredFunctionParameter {
		isOptional: false;
		default?: never;
	}
	type FunctionParameter = {
		name: string;
		isOptional: boolean;
		default?: Type;
		type: Type;
	} & (OptionalFunctionParameter | RequiredFunctionParameter);

	interface FunctionCall {
		parameters: (FunctionParameter | "self")[];
		returns: Type;
	}
	interface FunctionType extends BaseType {
		kind: "function";
		calls: FunctionCall[];
		alias?: string;
	}

	interface Interface extends BaseType {
		kind: "interface";
		name: string;
		members: Map<string, Member>;
	}

	interface Intersection extends BaseType {
		kind: "intersection";
		types: Type[];
		alias?: string;
	}

	interface LiteralBigInt extends BaseType {
		kind: "literal";
		subkind: "bigint";
		value: bigint;
	}
	interface LiteralBoolean extends BaseType {
		kind: "literal";
		subkind: "boolean";
		value: boolean;
	}
	interface LiteralNumber extends BaseType {
		kind: "literal";
		subkind: "number";
		value: number;
	}
	interface LiteralString extends BaseType {
		kind: "literal";
		subkind: "string";
		value: string;
	}
	interface LiteralSymbol extends BaseType {
		kind: "literal";
		subkind: "symbol";
	}
	type Literal = LiteralBigInt | LiteralBoolean | LiteralNumber | LiteralString | LiteralSymbol;

	interface Member {
		isOptional: boolean;
		isReadonly: boolean;
		type: Type;
	}

	interface ObjectType extends BaseType {
		kind: "object";
		members?: Map<string, Member>;
	}

	interface Tuple extends BaseType {
		kind: "tuple";
		isReadonly: boolean;
		elements: Type[];
		alias?: string;
	}

	interface TypeParameter extends BaseType {
		kind: "type-parameter";
		name: string;
		isConst: boolean;
		constraint: Type;
		default?: Type;
	}

	interface Union extends BaseType {
		kind: "union";
		types: Type[];
		alias?: string;
	}
}
