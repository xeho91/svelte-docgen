/// <reference types="@types/bun" />

import fs from "node:fs";

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
export function read_file_sync(filepath) {
	const path_url = URL.canParse(filepath) ? new URL(filepath) : Bun.pathToFileURL(filepath);
	// TODO: In the initial research, I couldn't find a synchronous way to read file. `Bun.file()` is async
	return fs.readFileSync(path_url, "utf-8");
}
