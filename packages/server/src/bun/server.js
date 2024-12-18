/// <reference types="@types/bun" />

/**
 * @import { RuntimeServer } from "../server.js";
 */

import fs from "node:fs";

import { APP } from "../app.js";
import { DEFAULTS, Server } from "../server.js";

/**
 * @typedef {Omit<Parameters<typeof Bun.serve>[0], "fetch">} UserOptions
 */

/**
 * Options for Bun HTTP server with sensible defaults.
 */
class Options {
	// TODO: Add more sensible defaults
	/**
	 * @type {number}
	 */
	port = DEFAULTS.port;

	/** @param {Partial<UserOptions>} user_options */
	constructor(user_options) {
		Object.assign(this, user_options);
	}
}

// FIXME: Uncommenting below JSDoc comment breaks `dts-buddy`, need to create an issue with reproduction
// /**
//  * @implements {RuntimeServer}
//  */
export class BunServer extends Server {
	/**
	 * @type {Options}
	 */
	options;
	/**
	 * @type {ReturnType<typeof Bun.serve> | undefined}
	 */
	instance;

	/** @param {Partial<UserOptions>} user_options */
	constructor(user_options) {
		super();
		this.options = new Options(user_options);
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
	const path_url = URL.canParse(filepath) ? new URL(filepath) : Bun.pathToFileURL(filepath);
	// TODO: In the initial research, I couldn't find a synchronous way to read file. `Bun.file()` is async
	return fs.readFileSync(path_url, "utf-8");
}
