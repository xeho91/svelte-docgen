import fs from "node:fs";
import url from "node:url";

import { serve } from "@hono/node-server";

import { APP } from "./app.js";
import { Server } from "./server.js";

export class NodeServer extends Server {
	/** @returns {ReturnType<typeof serve>} */
	serve() {
		return serve({
			fetch: APP.fetch,
			port: this.port,
		});
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
