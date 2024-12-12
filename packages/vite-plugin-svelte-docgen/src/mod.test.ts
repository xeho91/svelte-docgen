import { createServer, type ViteDevServer } from "vite";
import { afterEach, beforeEach, describe, it } from "vitest";

import plugin from "./mod.js";

let VITE_DEV_SERVER: ViteDevServer;

beforeEach(async () => {
	VITE_DEV_SERVER = await createServer({
		plugins: [await plugin()],
	});
});

describe("plugin", async () => {
	it("it should create a virtual file with revived serialized data", async ({ expect }) => {
		const docgen = await VITE_DEV_SERVER.ssrLoadModule("virtual:./examples/button.docgen.js");
		expect(docgen.default.isLegacy).toBe(false);
		expect(docgen.default.exports).toBeInstanceOf(Map);
		expect(docgen.default.exports.size).toBe(0);
		expect(docgen.default.props).toBeInstanceOf(Map);
		expect(docgen.default.props.size).toBe(443);
	});
});

afterEach(async () => {
	await VITE_DEV_SERVER.close();
});
