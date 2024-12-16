import path from "node:path";
import url from "node:url";

const __filename = url.fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

import { describe, it } from "vitest";

import { APP } from "./app.js";
import type { BodySchema } from "./schema.js";

describe("POST /", () => {
	it("returns 200 on a valid request", async ({ expect }) => {
		const filepath = url.pathToFileURL(path.join(__dirname, "..", "examples", "test.svelte"));
		const body = {
			filepath: filepath.toJSON(),
			fields: ["description", "props"],
		} satisfies BodySchema;
		const response = await APP.request("/", {
			method: "POST",
			body: JSON.stringify(body),
			headers: new Headers({ "Content-Type": "application/json" }),
		});

		expect(response.status).toBe(200);
		const res_body = await response.json();
		expect(res_body).toMatchSnapshot();
	});

	describe("returns 400 on an invalid request", () => {
		it("when filepath was not provided", async ({ expect }) => {
			const body = {
				fields: ["description", "props"],
			};
			const ressponse = await APP.request("/", {
				method: "POST",
				body: JSON.stringify(body),
				headers: new Headers({ "Content-Type": "application/json" }),
			});

			expect(ressponse.status).toBe(400);
			const res_body = await ressponse.json();
			expect(res_body).toMatchInlineSnapshot(`
				{
					"issues": [
					{
						"expected": "string",
						"kind": "schema",
						"message": "Invalid type: Expected string but received undefined",
						"path": [
						{
							"input": {
							"fields": [
								"description",
								"props",
							],
							},
							"key": "filepath",
							"origin": "value",
							"type": "object",
						},
						],
						"received": "undefined",
						"type": "string",
					},
					],
					"output": {
					"fields": [
						"description",
						"props",
					],
					},
					"success": false,
					"typed": false,
				}
			`);
		});
	});
});
