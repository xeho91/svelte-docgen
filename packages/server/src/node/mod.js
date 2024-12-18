/**
 * @import { UserOptions } from "./server.js";
 */

import { NodeServer } from "./server.js";

/**
 * Create a new Node.js HTTP server instance.
 *
 * @param {UserOptions} options
 * @returns {NodeServer}
 */
export function createServer(options = {}) {
	return new NodeServer(options);
}
