/// <reference types="@types/deno" />

// TODO: Change to deno std lib - and figure out a way to solve typescript errors
import url from "node:url";

import { APP } from "./app.js";
import { Server } from "./server.js";

export class DenoBunServer extends Server {
	/** @returns {ReturnType<typeof Deno.serve>} */
	serve() {
		return Deno.serve(
			{
				port: this.port,
			},
			APP.fetch,
		);
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
