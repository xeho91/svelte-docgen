import path from "node:path";
import url from "node:url";

const __filename = url.fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

import { type ViteDevServer, createServer } from "vite";
import { afterEach, beforeEach, describe, it } from "vitest";

import plugin from "./mod.js";

let VITE_DEV_SERVER: ViteDevServer;

beforeEach(async () => {
	VITE_DEV_SERVER = await createServer({
		root: path.join(__dirname, ".."),
		plugins: [await plugin()],
	});
});

describe("plugin", async () => {
	it("it should create a virtual file with revived serialized data", async ({ expect }) => {
		const docgen = await VITE_DEV_SERVER.ssrLoadModule("./examples/button.svelte?docgen");
		expect(docgen.default.isLegacy).toBe(false);
		expect(docgen.default.exports).toBeInstanceOf(Map);
		expect(docgen.default.exports.size).toBe(0);
		expect(docgen.default.props).toBeInstanceOf(Map);
		expect(docgen.default.props.size).toBe(443);
	});

	it("should handle both relative paths to importer and absolute paths from the project root", async ({ expect }) => {
		const expected = `\x00virtual:${path.resolve(__dirname, "../examples/button.svelte")}.docgen.js`
		// relative
		expect(
			(await VITE_DEV_SERVER.pluginContainer.resolveId("../examples/button.svelte?docgen", __filename))?.id
		).toBe(expected)
		// absolute
		expect(
			(await VITE_DEV_SERVER.pluginContainer.resolveId("/examples/button.svelte?docgen", __filename))?.id
		).toBe(expected);
	})
});

afterEach(async () => {
	await VITE_DEV_SERVER.close();
});
