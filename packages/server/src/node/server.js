/// <reference types="@types/node" />

/**
 * @import { RuntimeServer } from "../server.js";
 */

import fs from "node:fs";
import url from "node:url";

import { serve } from "@hono/node-server";

import { APP } from "../app.js";
import { DEFAULTS, Server } from "../server.js";

/**
 * @typedef {Omit<Parameters<typeof serve>[0], "fetch">} UserOptions
 */

/**
 * Options for Node.js HTTP server with sensible defaults.
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
export class NodeServer extends Server {
	/**
	 * @type {Options}
	 */
	options;
	/**
	 * @type {ReturnType<typeof serve> | undefined}
	 */
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
		this.instance = undefined;
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
