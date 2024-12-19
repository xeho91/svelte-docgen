/**
 * @import { UserOptions } from "./server.js";
 */

import { BunServer } from "./server.js";

/**
 * Create a new Bun HTTP server instance.
 *
 * @param {UserOptions} options
 * @returns {BunServer}
 */
export function createServer(options = {}) {
	return new BunServer(options);
}
