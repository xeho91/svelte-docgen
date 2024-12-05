import { it } from "vitest";

import { OPTIONS, create_path_to_example_component } from "../../tests/shared.js";
import { parse } from "../parser.js";

const filepath = create_path_to_example_component("data", "type", "constructible.svelte");
const parsed = parse(filepath, OPTIONS);
const { props } = parsed[1];

it("documents prop(s) with custom 'constructible' type - class", ({ expect }) => {
	const custom = props.get("custom");
	expect(custom).toBeDefined();
	expect(custom?.type).toMatchInlineSnapshot(`
		{
		  "constructors": [
		    [
		      {
		        "isOptional": false,
		        "name": "foo",
		        "type": {
		          "kind": "string",
		        },
		      },
		      {
		        "isOptional": true,
		        "name": "bar",
		        "type": {
		          "kind": "union",
		          "nonNullable": {
		            "kind": "number",
		          },
		          "types": [
		            {
		              "kind": "undefined",
		            },
		            {
		              "kind": "number",
		            },
		          ],
		        },
		      },
		      {
		        "isOptional": false,
		        "name": "baz",
		        "type": {
		          "kind": "string",
		        },
		      },
		    ],
		  ],
		  "kind": "constructible",
		  "name": "Custom",
		  "sources": [
		    <process-cwd>/packages/svelte-docgen/examples/data/type/constructible.svelte,
		  ],
		}
	`);
});

it("documents prop(s) with builtin 'constructible' type - Date", ({ expect }) => {
	const date = props.get("date");
	expect(date).toBeDefined();
	expect(date?.type).toMatchInlineSnapshot(`
		{
		  "constructors": [
		    [],
		    [
		      {
		        "isOptional": false,
		        "name": "value",
		        "type": {
		          "kind": "union",
		          "types": [
		            {
		              "kind": "string",
		            },
		            {
		              "kind": "number",
		            },
		          ],
		        },
		      },
		    ],
		    [
		      {
		        "isOptional": false,
		        "name": "year",
		        "type": {
		          "kind": "number",
		        },
		      },
		      {
		        "isOptional": false,
		        "name": "monthIndex",
		        "type": {
		          "kind": "number",
		        },
		      },
		      {
		        "isOptional": true,
		        "name": "date",
		        "type": {
		          "kind": "union",
		          "nonNullable": {
		            "kind": "number",
		          },
		          "types": [
		            {
		              "kind": "undefined",
		            },
		            {
		              "kind": "number",
		            },
		          ],
		        },
		      },
		      {
		        "isOptional": true,
		        "name": "hours",
		        "type": {
		          "kind": "union",
		          "nonNullable": {
		            "kind": "number",
		          },
		          "types": [
		            {
		              "kind": "undefined",
		            },
		            {
		              "kind": "number",
		            },
		          ],
		        },
		      },
		      {
		        "isOptional": true,
		        "name": "minutes",
		        "type": {
		          "kind": "union",
		          "nonNullable": {
		            "kind": "number",
		          },
		          "types": [
		            {
		              "kind": "undefined",
		            },
		            {
		              "kind": "number",
		            },
		          ],
		        },
		      },
		      {
		        "isOptional": true,
		        "name": "seconds",
		        "type": {
		          "kind": "union",
		          "nonNullable": {
		            "kind": "number",
		          },
		          "types": [
		            {
		              "kind": "undefined",
		            },
		            {
		              "kind": "number",
		            },
		          ],
		        },
		      },
		      {
		        "isOptional": true,
		        "name": "ms",
		        "type": {
		          "kind": "union",
		          "nonNullable": {
		            "kind": "number",
		          },
		          "types": [
		            {
		              "kind": "undefined",
		            },
		            {
		              "kind": "number",
		            },
		          ],
		        },
		      },
		    ],
		    [
		      {
		        "isOptional": false,
		        "name": "value",
		        "type": {
		          "kind": "union",
		          "types": [
		            {
		              "kind": "string",
		            },
		            {
		              "kind": "number",
		            },
		            {
		              "constructors": "self",
		              "kind": "constructible",
		              "name": "Date",
		              "sources": [
		                <process-cwd>/node_modules/.pnpm/typescript@5.6.3/node_modules/typescript/lib/lib.es5.d.ts,
		                <process-cwd>/node_modules/.pnpm/typescript@5.6.3/node_modules/typescript/lib/lib.es5.d.ts,
		                <process-cwd>/node_modules/.pnpm/typescript@5.6.3/node_modules/typescript/lib/lib.es5.d.ts,
		                <process-cwd>/node_modules/.pnpm/typescript@5.6.3/node_modules/typescript/lib/lib.es2015.symbol.wellknown.d.ts,
		                <process-cwd>/node_modules/.pnpm/typescript@5.6.3/node_modules/typescript/lib/lib.es2020.date.d.ts,
		              ],
		            },
		          ],
		        },
		      },
		    ],
		  ],
		  "kind": "constructible",
		  "name": "Date",
		  "sources": [
		    <process-cwd>/node_modules/.pnpm/typescript@5.6.3/node_modules/typescript/lib/lib.es5.d.ts,
		    <process-cwd>/node_modules/.pnpm/typescript@5.6.3/node_modules/typescript/lib/lib.es5.d.ts,
		    <process-cwd>/node_modules/.pnpm/typescript@5.6.3/node_modules/typescript/lib/lib.es5.d.ts,
		    <process-cwd>/node_modules/.pnpm/typescript@5.6.3/node_modules/typescript/lib/lib.es2015.symbol.wellknown.d.ts,
		    <process-cwd>/node_modules/.pnpm/typescript@5.6.3/node_modules/typescript/lib/lib.es2020.date.d.ts,
		  ],
		}
	`);
});

it("documents prop(s) with builtin 'constructible' type - Map", ({ expect }) => {
	const map = props.get("map");
	expect(map).toBeDefined();
	expect(map?.type).toMatchInlineSnapshot(`
		{
		  "constructors": [
		    [],
		    [
		      {
		        "isOptional": true,
		        "name": "entries",
		        "type": {
		          "kind": "union",
		          "nonNullable": {
		            "element": {
		              "elements": [
		                {
		                  "constraint": {
		                    "kind": "unknown",
		                  },
		                  "isConst": false,
		                  "kind": "type-parameter",
		                  "name": "K",
		                },
		                {
		                  "constraint": {
		                    "kind": "unknown",
		                  },
		                  "isConst": false,
		                  "kind": "type-parameter",
		                  "name": "V",
		                },
		              ],
		              "isReadonly": true,
		              "kind": "tuple",
		            },
		            "isReadonly": true,
		            "kind": "array",
		          },
		          "types": [
		            {
		              "kind": "undefined",
		            },
		            {
		              "kind": "null",
		            },
		            {
		              "element": {
		                "elements": [
		                  {
		                    "constraint": {
		                      "kind": "unknown",
		                    },
		                    "isConst": false,
		                    "kind": "type-parameter",
		                    "name": "K",
		                  },
		                  {
		                    "constraint": {
		                      "kind": "unknown",
		                    },
		                    "isConst": false,
		                    "kind": "type-parameter",
		                    "name": "V",
		                  },
		                ],
		                "isReadonly": true,
		                "kind": "tuple",
		              },
		              "isReadonly": true,
		              "kind": "array",
		            },
		          ],
		        },
		      },
		    ],
		    [],
		    [
		      {
		        "isOptional": true,
		        "name": "iterable",
		        "type": {
		          "kind": "union",
		          "nonNullable": {
		            "alias": "Iterable",
		            "kind": "interface",
		            "members": Map {
		              "__@iterator@19" => {
		                "isOptional": false,
		                "isReadonly": false,
		                "type": {
		                  "alias": "__@iterator@19",
		                  "calls": [
		                    {
		                      "parameters": [],
		                      "returns": {
		                        "constructors": [
		                          [],
		                        ],
		                        "kind": "constructible",
		                        "name": "Iterator",
		                        "sources": [
		                          <process-cwd>/node_modules/.pnpm/typescript@5.6.3/node_modules/typescript/lib/lib.es2015.iterable.d.ts,
		                          <process-cwd>/node_modules/.pnpm/typescript@5.6.3/node_modules/typescript/lib/lib.esnext.iterator.d.ts,
		                        ],
		                      },
		                    },
		                  ],
		                  "kind": "function",
		                },
		              },
		            },
		            "sources": [
		              <process-cwd>/node_modules/.pnpm/typescript@5.6.3/node_modules/typescript/lib/lib.es2015.iterable.d.ts,
		            ],
		          },
		          "types": [
		            {
		              "kind": "undefined",
		            },
		            {
		              "kind": "null",
		            },
		            {
		              "alias": "Iterable",
		              "kind": "interface",
		              "members": Map {
		                "__@iterator@19" => {
		                  "isOptional": false,
		                  "isReadonly": false,
		                  "type": {
		                    "alias": "__@iterator@19",
		                    "calls": [
		                      {
		                        "parameters": [],
		                        "returns": {
		                          "constructors": [
		                            [],
		                          ],
		                          "kind": "constructible",
		                          "name": "Iterator",
		                          "sources": [
		                            <process-cwd>/node_modules/.pnpm/typescript@5.6.3/node_modules/typescript/lib/lib.es2015.iterable.d.ts,
		                            <process-cwd>/node_modules/.pnpm/typescript@5.6.3/node_modules/typescript/lib/lib.esnext.iterator.d.ts,
		                          ],
		                        },
		                      },
		                    ],
		                    "kind": "function",
		                  },
		                },
		              },
		              "sources": [
		                <process-cwd>/node_modules/.pnpm/typescript@5.6.3/node_modules/typescript/lib/lib.es2015.iterable.d.ts,
		              ],
		            },
		          ],
		        },
		      },
		    ],
		  ],
		  "kind": "constructible",
		  "name": "Map",
		  "sources": [
		    <process-cwd>/node_modules/.pnpm/typescript@5.6.3/node_modules/typescript/lib/lib.es2015.collection.d.ts,
		    <process-cwd>/node_modules/.pnpm/typescript@5.6.3/node_modules/typescript/lib/lib.es2015.collection.d.ts,
		    <process-cwd>/node_modules/.pnpm/typescript@5.6.3/node_modules/typescript/lib/lib.es2015.iterable.d.ts,
		    <process-cwd>/node_modules/.pnpm/typescript@5.6.3/node_modules/typescript/lib/lib.es2015.symbol.wellknown.d.ts,
		  ],
		}
	`);
});

it("documents prop(s) with builtin 'constructible' type - Set", ({ expect }) => {
	const set = props.get("set");
	expect(set).toBeDefined();
	expect(set?.type).toMatchInlineSnapshot(`
		{
		  "constructors": [
		    [
		      {
		        "isOptional": true,
		        "name": "values",
		        "type": {
		          "kind": "union",
		          "nonNullable": {
		            "element": {
		              "constraint": {
		                "kind": "unknown",
		              },
		              "default": {
		                "kind": "any",
		              },
		              "isConst": false,
		              "kind": "type-parameter",
		              "name": "T",
		            },
		            "isReadonly": true,
		            "kind": "array",
		          },
		          "types": [
		            {
		              "kind": "undefined",
		            },
		            {
		              "kind": "null",
		            },
		            {
		              "element": {
		                "constraint": {
		                  "kind": "unknown",
		                },
		                "default": {
		                  "kind": "any",
		                },
		                "isConst": false,
		                "kind": "type-parameter",
		                "name": "T",
		              },
		              "isReadonly": true,
		              "kind": "array",
		            },
		          ],
		        },
		      },
		    ],
		    [
		      {
		        "isOptional": true,
		        "name": "iterable",
		        "type": {
		          "kind": "union",
		          "nonNullable": {
		            "alias": "Iterable",
		            "kind": "interface",
		            "members": Map {
		              "__@iterator@19" => {
		                "isOptional": false,
		                "isReadonly": false,
		                "type": {
		                  "alias": "__@iterator@19",
		                  "calls": [
		                    {
		                      "parameters": [],
		                      "returns": {
		                        "constructors": [
		                          [],
		                        ],
		                        "kind": "constructible",
		                        "name": "Iterator",
		                        "sources": [
		                          <process-cwd>/node_modules/.pnpm/typescript@5.6.3/node_modules/typescript/lib/lib.es2015.iterable.d.ts,
		                          <process-cwd>/node_modules/.pnpm/typescript@5.6.3/node_modules/typescript/lib/lib.esnext.iterator.d.ts,
		                        ],
		                      },
		                    },
		                  ],
		                  "kind": "function",
		                },
		              },
		            },
		            "sources": [
		              <process-cwd>/node_modules/.pnpm/typescript@5.6.3/node_modules/typescript/lib/lib.es2015.iterable.d.ts,
		            ],
		          },
		          "types": [
		            {
		              "kind": "undefined",
		            },
		            {
		              "kind": "null",
		            },
		            {
		              "alias": "Iterable",
		              "kind": "interface",
		              "members": Map {
		                "__@iterator@19" => {
		                  "isOptional": false,
		                  "isReadonly": false,
		                  "type": {
		                    "alias": "__@iterator@19",
		                    "calls": [
		                      {
		                        "parameters": [],
		                        "returns": {
		                          "constructors": [
		                            [],
		                          ],
		                          "kind": "constructible",
		                          "name": "Iterator",
		                          "sources": [
		                            <process-cwd>/node_modules/.pnpm/typescript@5.6.3/node_modules/typescript/lib/lib.es2015.iterable.d.ts,
		                            <process-cwd>/node_modules/.pnpm/typescript@5.6.3/node_modules/typescript/lib/lib.esnext.iterator.d.ts,
		                          ],
		                        },
		                      },
		                    ],
		                    "kind": "function",
		                  },
		                },
		              },
		              "sources": [
		                <process-cwd>/node_modules/.pnpm/typescript@5.6.3/node_modules/typescript/lib/lib.es2015.iterable.d.ts,
		              ],
		            },
		          ],
		        },
		      },
		    ],
		  ],
		  "kind": "constructible",
		  "name": "Set",
		  "sources": [
		    <process-cwd>/node_modules/.pnpm/typescript@5.6.3/node_modules/typescript/lib/lib.es2015.collection.d.ts,
		    <process-cwd>/node_modules/.pnpm/typescript@5.6.3/node_modules/typescript/lib/lib.es2015.collection.d.ts,
		    <process-cwd>/node_modules/.pnpm/typescript@5.6.3/node_modules/typescript/lib/lib.es2015.iterable.d.ts,
		    <process-cwd>/node_modules/.pnpm/typescript@5.6.3/node_modules/typescript/lib/lib.es2015.symbol.wellknown.d.ts,
		    <process-cwd>/node_modules/.pnpm/typescript@5.6.3/node_modules/typescript/lib/lib.esnext.collection.d.ts,
		  ],
		}
	`);
});
