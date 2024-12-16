/// <reference types="@types/bun" />

import { APP } from "./app.js";
import { Server } from "./server.js";

export class BunServer extends Server {
	/** @returns {ReturnType<typeof Bun.serve>} */
	serve() {
		return Bun.serve({
			fetch: APP.fetch,
			port: this.port,
		});
	}
}

/**
 * @param {string} filepath
 * @returns {string}
 */
export function read_filepath_source_with_bun(filepath) {
	const path_url = URL.canParse(filepath) ? new URL(filepath) : Bun.pathToFileURL(filepath);
	return Bun.file(path_url, "utf-8");
}
