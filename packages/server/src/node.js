import fs from "node:fs";
import url from "node:url";

import { serve } from "@hono/node-server";

import { APP } from "./app.js";
import { create_request } from "./request.js";
import { deserialize_data } from "./shared.js";

/**
 * @typedef Options
 * @prop {number} [port=3000]
 */

export class NodeServer {
	/** @type {number} */
	port;

	/** @param {Options} options */
	constructor(options) {
		this.port = options.port ?? 3000;
	}

	/** @returns {ReturnType<typeof serve>} */
	serve() {
		return serve({
			fetch: APP.fetch,
			port: this.port,
		});
	}

	/**
	 * @param {Parameters<typeof create_request>[0]} body
	 * @returns {ReturnType<typeof create_request>}
	 */
	async createRequest(body) {
		return await create_request(body);
	}

	/**
	 * @param {Response} res
	 * @returns {Promise<ReturnType<deserialize_data>>}
	 */
	async handleResponse(res) {
		const data = await res.json();
		return deserialize_data(data);
	}
}

/**
 * @param {string} filepath
 * @returns {string}
 */
export function read_filepath_source_with_node(filepath) {
	const path_url = URL.canParse(filepath) ? new URL(filepath) : url.pathToFileURL(filepath);
	return fs.readFileSync(path_url, "utf-8");
}
