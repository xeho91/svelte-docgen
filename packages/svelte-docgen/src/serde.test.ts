import { describe, it } from "vitest";

import { deserialize, serialize } from "./serde.js";

describe("serialize", () => {
	it("converts 'props' | 'events' | 'exports' | 'slots' keys to array of tuples [key, value]", ({ expect }) => {
		const sample_map = new Map([
			["item1", { value: 1 }],
			["item2", { value: 2 }],
		]);
		const data = {
			props: sample_map,
			events: sample_map,
			exports: sample_map,
			slots: sample_map,
		};
		expect(serialize(data, 2)).toMatchInlineSnapshot(`
			"{
			  "props": [
			    [
			      "item1",
			      {
			        "value": 1
			      }
			    ],
			    [
			      "item2",
			      {
			        "value": 2
			      }
			    ]
			  ],
			  "events": [
			    [
			      "item1",
			      {
			        "value": 1
			      }
			    ],
			    [
			      "item2",
			      {
			        "value": 2
			      }
			    ]
			  ],
			  "exports": [
			    [
			      "item1",
			      {
			        "value": 1
			      }
			    ],
			    [
			      "item2",
			      {
			        "value": 2
			      }
			    ]
			  ],
			  "slots": [
			    [
			      "item1",
			      {
			        "value": 1
			      }
			    ],
			    [
			      "item2",
			      {
			        "value": 2
			      }
			    ]
			  ]
			}"
		`);
	});
});

describe("deserialize", () => {
	it("revives 'events' | 'exports' | 'props' | 'slots' keys as Map", ({ expect }) => {
		const sample_map = new Map([
			["item1", { value: 1 }],
			["item2", { value: 2 }],
		]);
		const data = {
			props: sample_map,
			events: sample_map,
			exports: sample_map,
			slots: sample_map,
		};
		const stringified = serialize(data, 2);
		const deserialized = deserialize(stringified);
		expect(deserialized).toMatchInlineSnapshot(`
			{
			  "events": Map {
			    "item1" => {
			      "value": 1,
			    },
			    "item2" => {
			      "value": 2,
			    },
			  },
			  "exports": Map {
			    "item1" => {
			      "value": 1,
			    },
			    "item2" => {
			      "value": 2,
			    },
			  },
			  "props": Map {
			    "item1" => {
			      "value": 1,
			    },
			    "item2" => {
			      "value": 2,
			    },
			  },
			  "slots": Map {
			    "item1" => {
			      "value": 1,
			    },
			    "item2" => {
			      "value": 2,
			    },
			  },
			}
		`);
		expect(deserialized.props).toBeInstanceOf(Map);
		expect(deserialized.events).toBeInstanceOf(Map);
		expect(deserialized.exports).toBeInstanceOf(Map);
		expect(deserialized.slots).toBeInstanceOf(Map);
	});
});
