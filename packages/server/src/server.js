/**
 * @import { BodySchema } from "./schema.js";
 */

import { deserialize } from "svelte-docgen";

import { APP } from "./app.js";

/**
 * Server options with sensible defaults.
 *
 * @typedef Options
 * @prop {number} [port=3000]
 */

/**
 * Extendable class for creating a server. Should not be used by end-user directly.
 */
export class Server {
	/** @type {number} */
	port;

	/** @param {Options} options */
	constructor(options) {
		this.port = options.port ?? 3000;
	}

	/**
	 * Create a `POST` request to the `@svelte-docgen/server`.
	 *
	 * @param {BodySchema} body
	 * @returns {Promise<Response>}
	 */
	async createRequest(body) {
		return await APP.request("/", {
			method: "POST",
			body: JSON.stringify(body),
			headers: new Headers({ "Content-Type": "application/json" }),
		});
	}

	/**
	 * @param {Response} res
	 * @returns {Promise<ReturnType<typeof deserialize>>}
	 */
	async handleResponse(res) {
		const data = await res.json();
		return deserialize(data);
	}
}
