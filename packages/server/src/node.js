/// <reference types="@types/node" />

/**
 * @import { RuntimeServer } from "./server.js";
 */

import fs from "node:fs";
import url from "node:url";

import { serve } from "@hono/node-server";

import { APP } from "./app.js";
import { Server } from "./server.js";

/**
 * @typedef {Parameters<typeof serve>[0]} UserOptions
 */

/**
 * Options instance for Node HTTP server with sensible defaults.
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
export class NodeServer extends Server {
	/** @type {Options} */
	options;
	/** @type {ReturnType<typeof serve> | undefined} */
	instance;

	/** @param {Partial<UserOptions>} user_options */
	constructor(user_options) {
		super();
		this.options = new Options(user_options);
	}

	/** @returns {void} */
	start() {
		this.instance = serve({
			fetch: APP.fetch,
			...this.options,
		});
	}

	/** @returns {void} */
	shutdown() {
		this.instance?.close();
	}
}

/**
 * @param {string} filepath
 * @returns {string}
 */
export function read_file_sync(filepath) {
	const path_url = URL.canParse(filepath)
		? new URL(filepath)
		: url.pathToFileURL(filepath);
	return fs.readFileSync(path_url, "utf-8");
}

/**
 * @param {UserOptions} options
 * @returns {NodeServer}
 */
export default function create_server(options) {
	return new NodeServer(options);
}
