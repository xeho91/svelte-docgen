/**
 * Extendable class for creating a HTTP server for a supported JavaScript runtime.
 * @module
 * @internal
 */

/**
 * @import { RequestOptions, ParsedComponent } from "./schema.js";
 */

import { decode } from "svelte-docgen";

import { APP } from "./app.js";

export class Server {
	/**
	 * Create a `POST` request to the `@svelte-docgen/server`, with response handling and data deserialization.
	 *
	 * @template {keyof ParsedComponent} T
	 * @param {RequestOptions<T>} options {@link RequestOptions}
	 * @returns {Promise<Pick<ParsedComponent, T>>}
	 */
	async request(options) {
		// TODO: Add a fail-safe error or other solution when `this.instance` - created by sub-classes is undefined.
		// End-user will likely need to be informed about running `this.start()` method first.
		const response = await APP.request("/", {
			method: "POST",
			body: JSON.stringify(options),
			headers: new Headers({ "Content-Type": "application/json" }),
		});
		const data = await response.json();
		return decode(data);
	}
}

/**
 * @internal
 * Because `abstract class` is TypeScript feature, we can deliver similar pattern by defining an interface which
 * sub-classes can implement.
 *
 * @typedef RuntimeServer
 * @prop {any} options HTTP server options.
 * @prop {any | undefined} instance HTTP server served instance - created when called {@link RuntimeServer.start}
 * @prop {() => void} start Start the HTTP server.
 * @prop {() => void} shutdown Gracefully shutdown the HTTP server.
 */

export const DEFAULTS = /** @type {const} */ ({
	port: 5555,
});
