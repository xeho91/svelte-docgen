import { it } from "vitest";

import { generate } from "../mod.js";
import { OPTIONS, create_path_to_example_component } from "../../tests/shared.js";

const filepath = create_path_to_example_component("data", "type", "constructible.svelte");
const generated = generate(filepath, OPTIONS);
const { props } = generated[1];

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
		            },
		          ],
		        },
		      },
		    ],
		  ],
		  "kind": "constructible",
		  "name": "Date",
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
		          "types": [
		            {
		              "kind": "undefined",
		            },
		            {
		              "kind": "null",
		            },
		            {
		              "kind": "interface",
		              "members": Map {
		                "__@iterator@19" => {
		                  "isOptional": false,
		                  "isReadonly": false,
		                  "type": {
		                    "calls": [
		                      {
		                        "parameters": [],
		                        "returns": {
		                          "constructors": [
		                            [],
		                          ],
		                          "kind": "constructible",
		                          "name": "Iterator",
		                        },
		                      },
		                    ],
		                    "kind": "function",
		                  },
		                },
		              },
		              "name": "Iterable",
		            },
		          ],
		        },
		      },
		    ],
		  ],
		  "kind": "constructible",
		  "name": "Map",
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
		          "types": [
		            {
		              "kind": "undefined",
		            },
		            {
		              "kind": "null",
		            },
		            {
		              "kind": "interface",
		              "members": Map {
		                "__@iterator@19" => {
		                  "isOptional": false,
		                  "isReadonly": false,
		                  "type": {
		                    "calls": [
		                      {
		                        "parameters": [],
		                        "returns": {
		                          "constructors": [
		                            [],
		                          ],
		                          "kind": "constructible",
		                          "name": "Iterator",
		                        },
		                      },
		                    ],
		                    "kind": "function",
		                  },
		                },
		              },
		              "name": "Iterable",
		            },
		          ],
		        },
		      },
		    ],
		  ],
		  "kind": "constructible",
		  "name": "Set",
		}
	`);
});
