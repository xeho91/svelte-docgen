/// <reference types="@types/bun" />

/**
 * @import { RuntimeServer } from "./server.js";
 */

import fs from "node:fs";

import { APP } from "./app.js";
import { Server } from "./server.js";

/**
 * @typedef UserOptions
 * @prop {number} [port]
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

	/** @param {Partial<Options>} user_options */
	constructor(user_options) {
		Object.assign(this, user_options);
	}
}

/**
 * @implements {RuntimeServer}
 */
class BunServer extends Server {
	/**
	 * @type {Options}
	 */
	options;
	/**
	 * @type {ReturnType<typeof Bun.serve> | undefined}
	 */
	instance;

	/** @param {Partial<UserOptions>} options */
	constructor(options) {
		super();
		this.options = new Options(options);
	}

	/** @returns {void} */
	start() {
		this.instance = Bun.serve({
			fetch: APP.fetch,
			...this.options,
		});
	}

	/** @returns {void} */
	shutdown() {
		this.instance?.stop(true);
	}
}

/**
 * @param {string} filepath
 * @returns {string}
 */
export function read_file_sync(filepath) {
	const path_url = URL.canParse(filepath)
		? new URL(filepath)
		: Bun.pathToFileURL(filepath);
	// TODO: In the initial research, I couldn't find a synchronous way to read file. `Bun.file()` is async
	return fs.readFileSync(path_url, "utf-8");
}

/**
 * @param {UserOptions} options
 * @returns {BunServer}
 */
export default function create_server(options) {
	return new BunServer(options);
}
