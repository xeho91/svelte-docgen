/**
 * @import { UserOptions } from "./server.js";
 */

import { DenoServer } from "./server.js";

/**
 * Create a new Deno HTTP server instance.
 *
 * @param {UserOptions} options
 * @returns {DenoServer}
 */
export function createServer(options) {
	return new DenoServer(options);
}
