/// <reference types="@types/deno" />

/**
 * @import { RuntimeServer } from "../server.js";
 */

// TODO: Change to deno std lib - and figure out a way to solve typescript errors
import url from "node:url";

import { APP } from "../app.js";
import { Server } from "../server.js";

/**
 * @typedef {Parameters<typeof Deno.serve>[0]} UserOptions
 */

/**
 * Options instance for Deno HTTP server with sensible defaults.
 */
class Options {
	// TODO: Add more sensible defaults
	/**
	 * @type {number}
	 */
	port = 3000;

	/** @param {Partial<UserOptions>} user_options */
	constructor(user_options) {
		Object.assign(this, user_options);
	}
}

// FIXME: Uncommenting below JSDoc comment breaks `dts-buddy`, need to create an issue with reproduction
// /**
//  * @implements {RuntimeServer}
//  */
export class DenoServer extends Server {
	/** @type {Options} */
	options;
	/** @type {ReturnType<typeof Deno.serve> | undefined} */
	instance;

	/** @param {Partial<UserOptions>} user_options */
	constructor(user_options) {
		super();
		this.options = new Options(user_options);
	}

	/** @returns {void} */
	start() {
		this.instance = Deno.serve(this.options, APP.fetch);
	}

	/** @returns {void} */
	shutdown() {
		this.instance?.shutdown();
	}
}

/**
 * @param {string} filepath
 * @returns {string}
 */
export function read_file_sync(filepath) {
	const path_url = URL.canParse(filepath) ? new URL(filepath) : url.pathToFileURL(filepath);
	// FIXME: Conflict between Web API URL and Node URL type
	return Deno.readTextFileSync(/** @type {Parameters<typeof Deno.readTextFileSync>[0]}} */ (path_url));
}
