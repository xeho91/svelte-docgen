import type { extract } from "@svelte-docgen/extractor";
import type ts from "typescript";

import type { parse_stringified_type } from "./shared.js";
import type { TYPE_KINDS } from "./type.js";

export type TypeKind = typeof TYPE_KINDS extends Set<infer T> ? T : never;

export interface GetTypeParams<T extends ts.Type = ts.Type> {
	type: T;
	extractor: ReturnType<typeof extract>;
	self?: string;
}

export type TypeDocumentation =
	| BaseTypeDocumentation
	| ArrayDocumentation
	| ConstructibleDocumentation
	| FunctionDocumentation
	| InterfaceDocumentation
	| IntersectionDocumentation
	| LiteralDocumentation
	| TupleDocumentation
	| TypeParameterDocumentation
	| UnionDocumentation;

export interface BaseTypeDocumentation {
	kind: TypeKind;
}

export interface ArrayDocumentation {
	kind: "array";
	isReadonly: boolean;
	element: TypeDocumentation;
}

export interface ConstructibleDocumentation {
	kind: "constructible";
	name: string;
	constructors: Array<FunctionParameterDocumentation[]> | "self";
}

interface OptionalFunctionParameter {
	isOptional: true;
	default?: ReturnType<typeof parse_stringified_type>;
}
interface RequiredFunctionParameter {
	isOptional: false;
	default?: never;
}
interface FunctionParameter {
	name: string;
	isOptional: boolean;
	default?: ReturnType<typeof parse_stringified_type>;
	type: TypeDocumentation;
}
export type FunctionParameterDocumentation = OptionalFunctionParameter | RequiredFunctionParameter | FunctionParameter;
export interface FunctionCallDocumentation {
	parameters: (FunctionParameterDocumentation | "self")[];
	returns: TypeDocumentation;
}
export interface FunctionDocumentation {
	kind: "function";
	calls: FunctionCallDocumentation[];
}

export interface InterfaceDocumentation {
	kind: "interface";
	name: string;
	members: Map<string, MemberDocumentation>;
}

export interface IntersectionDocumentation {
	kind: "intersection";
	types: TypeDocumentation[];
	alias?: string;
}

export interface LiteralBigIntDocumentation {
	kind: "literal";
	subkind: "bigint";
	value: bigint;
}
export interface LiteralBooleanDocumentation {
	kind: "literal";
	subkind: "boolean";
	value: boolean;
}
export interface LiteralNumberDocumentation {
	kind: "literal";
	subkind: "number";
	value: number;
}
export interface LiteralStringDocumentation {
	kind: "literal";
	subkind: "string";
	value: string;
}
export interface LiteralSymbolDocumentation {
	kind: "literal";
	subkind: "symbol";
}
export type LiteralDocumentation =
	| LiteralBigIntDocumentation
	| LiteralBooleanDocumentation
	| LiteralNumberDocumentation
	| LiteralStringDocumentation
	| LiteralSymbolDocumentation;

export interface MemberDocumentation {
	isOptional: boolean;
	isReadonly: boolean;
	type: TypeDocumentation;
}

export interface ObjectTypeDocumentation {
	kind: "object";
	members?: Map<string, MemberDocumentation>;
}

export interface TupleDocumentation {
	kind: "tuple";
	isReadonly: boolean;
	elements: TypeDocumentation[];
	alias?: string;
}

export interface TypeParameterDocumentation {
	kind: "type-parameter";
	name: string;
	isConst: boolean;
	constraint: TypeDocumentation;
	default?: TypeDocumentation;
}

export interface UnionDocumentation {
	kind: "union";
	types: TypeDocumentation[];
	alias?: string;
}
