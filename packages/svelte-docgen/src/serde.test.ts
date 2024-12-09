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
	const serialized = serialize(parsed, 2);
	it("converts 'props' to array of tuples", ({ expect }) => {
		expect(serialized).toMatchInlineSnapshot(
			`
			{
			  "exports": [],
			  "isLegacy": false,
			  "props": [
			    [
			      "some",
			      {
			        "tags": [],
			        "isBindable": false,
			        "isExtended": false,
			        "isOptional": false,
			        "type": {
			          "kind": "any"
			        }
			      }
			    ],
			    [
			      "name",
			      {
			        "tags": [],
			        "isBindable": false,
			        "isExtended": false,
			        "isOptional": false,
			        "type": {
			          "kind": "string"
			        }
			      }
			    ],
			    [
			      "disabled",
			      {
			        "tags": [],
			        "isBindable": false,
			        "isExtended": false,
			        "isOptional": true,
			        "type": {
			          "kind": "union",
			          "types": [
			            {
			              "kind": "undefined"
			            },
			            {
			              "kind": "literal",
			              "subkind": "boolean",
			              "value": false
			            },
			            {
			              "kind": "literal",
			              "subkind": "boolean",
			              "value": true
			            }
			          ],
			          "nonNullable": {
			            "kind": "boolean"
			          }
			        }
			      }
			    ],
			    [
			      "date",
			      {
			        "tags": [],
			        "isBindable": false,
			        "isExtended": false,
			        "isOptional": false,
			        "type": {
			          "kind": "constructible",
			          "name": "Date",
			          "constructors": [
			            [],
			            [
			              {
			                "name": "value",
			                "isOptional": false,
			                "type": {
			                  "kind": "union",
			                  "types": [
			                    {
			                      "kind": "string"
			                    },
			                    {
			                      "kind": "number"
			                    }
			                  ]
			                }
			              }
			            ],
			            [
			              {
			                "name": "year",
			                "isOptional": false,
			                "type": {
			                  "kind": "number"
			                }
			              },
			              {
			                "name": "monthIndex",
			                "isOptional": false,
			                "type": {
			                  "kind": "number"
			                }
			              },
			              {
			                "name": "date",
			                "isOptional": true,
			                "type": {
			                  "kind": "union",
			                  "types": [
			                    {
			                      "kind": "undefined"
			                    },
			                    {
			                      "kind": "number"
			                    }
			                  ],
			                  "nonNullable": {
			                    "kind": "number"
			                  }
			                }
			              },
			              {
			                "name": "hours",
			                "isOptional": true,
			                "type": {
			                  "kind": "union",
			                  "types": [
			                    {
			                      "kind": "undefined"
			                    },
			                    {
			                      "kind": "number"
			                    }
			                  ],
			                  "nonNullable": {
			                    "kind": "number"
			                  }
			                }
			              },
			              {
			                "name": "minutes",
			                "isOptional": true,
			                "type": {
			                  "kind": "union",
			                  "types": [
			                    {
			                      "kind": "undefined"
			                    },
			                    {
			                      "kind": "number"
			                    }
			                  ],
			                  "nonNullable": {
			                    "kind": "number"
			                  }
			                }
			              },
			              {
			                "name": "seconds",
			                "isOptional": true,
			                "type": {
			                  "kind": "union",
			                  "types": [
			                    {
			                      "kind": "undefined"
			                    },
			                    {
			                      "kind": "number"
			                    }
			                  ],
			                  "nonNullable": {
			                    "kind": "number"
			                  }
			                }
			              },
			              {
			                "name": "ms",
			                "isOptional": true,
			                "type": {
			                  "kind": "union",
			                  "types": [
			                    {
			                      "kind": "undefined"
			                    },
			                    {
			                      "kind": "number"
			                    }
			                  ],
			                  "nonNullable": {
			                    "kind": "number"
			                  }
			                }
			              }
			            ],
			            [
			              {
			                "name": "value",
			                "isOptional": false,
			                "type": {
			                  "kind": "union",
			                  "types": [
			                    {
			                      "kind": "string"
			                    },
			                    {
			                      "kind": "number"
			                    },
			                    {
			                      "kind": "constructible",
			                      "name": "Date",
			                      "constructors": "self",
			                      "sources": [
			                        "<process-cwd>/node_modules/.pnpm/typescript@5.7.2/node_modules/typescript/lib/lib.es5.d.ts",
			                        "<process-cwd>/node_modules/.pnpm/typescript@5.7.2/node_modules/typescript/lib/lib.es2015.symbol.wellknown.d.ts",
			                        "<process-cwd>/node_modules/.pnpm/typescript@5.7.2/node_modules/typescript/lib/lib.es2020.date.d.ts"
			                      ]
			                    }
			                  ]
			                }
			              }
			            ]
			          ],
			          "sources": [
			            "<process-cwd>/node_modules/.pnpm/typescript@5.7.2/node_modules/typescript/lib/lib.es5.d.ts",
			            "<process-cwd>/node_modules/.pnpm/typescript@5.7.2/node_modules/typescript/lib/lib.es2015.symbol.wellknown.d.ts",
			            "<process-cwd>/node_modules/.pnpm/typescript@5.7.2/node_modules/typescript/lib/lib.es2020.date.d.ts"
			          ]
			        }
			      }
			    ]
			  ]
			}
		`,
		);
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
