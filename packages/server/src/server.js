/**
 * @import { BodySchema } from "./schema.js";
 */

import { deserialize } from "svelte-docgen";

import { APP } from "./app.js";


/**
 * @typedef Options
 * @prop {number} [port=3000]
 */

export class Server {
	/** @type {number} */
	port;

	/** @param {Options} options */
	constructor(options) {
		this.port = options.port ?? 3000;
	}

	/**
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
