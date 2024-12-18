import path from "node:path";
import url from "node:url";

import { describe, it } from "vitest";

import { createServer } from "./mod.js";
import { NodeServer } from "./server.js";

const __filename = url.fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

describe("createServer", () => {
	it("creates instance of NodeServer", ({ expect }) => {
		expect(createServer()).toBeInstanceOf(NodeServer);
	});
});

describe("NodeServer", () => {
	describe("start()", () => {
		it("creates instance of server - is running", ({ expect }) => {
			const server = createServer();
			server.start();
			expect(server.instance).toBeDefined();
			server.shutdown();
		});
	});

	describe("request()", () => {
		it("returns parsed docgen data on valid request", async ({ expect }) => {
			const server = createServer();
			server.start();
			const data = await server.request({
				filepath: path.join(__dirname, "..", "..", "examples", "test.svelte"),
			});
			expect(data).toMatchInlineSnapshot(`{}`);
			server.shutdown();
		});
	});

	describe("shutdown()", () => {
		it("shutdowns the server instance", ({ expect }) => {
			const server = createServer();
			server.start();
			server.shutdown();
			expect(server.instance).not.toBeDefined();
		});
	});
});
