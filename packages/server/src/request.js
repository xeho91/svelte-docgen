/**
 * @import { BodySchema } from "./schema.js";
 */

import { APP } from "./app.js";

/**
 * @param {BodySchema} body
 * @returns {Promise<Response>}
 */
export async function create_request(body) {
	return APP.request("/", {
		method: "POST",
		body: JSON.stringify(body),
		headers: new Headers({ "Content-Type": "application/json" }),
	});
}
