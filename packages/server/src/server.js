/**
 * Extendable class for creating a HTTP server for a specific runtime.
 * @module
 * @internal
 */

/**
 * @import { BodySchema, ParsedComponent } from "./schema.js";
 */

import { deserialize } from "svelte-docgen";

import { APP } from "./app.js";

/**
 * Server options with sensible defaults.
 *
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
	 * Create a `POST` request to the `@svelte-docgen/server`, with response handling and data deserialization.
	 *
	 * @template {keyof ParsedComponent} T
	 * @param {BodySchema<T>} body
	 * @returns {Promise<Pick<ParsedComponent, T>>}
	 */
	async request(body) {
		const response = await APP.request("/", {
			method: "POST",
			body: JSON.stringify(body),
			headers: new Headers({ "Content-Type": "application/json" }),
		});
		const data = await response.json();
		return deserialize(data);
	}
}
