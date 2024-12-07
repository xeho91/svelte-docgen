import { createCacheStorage } from "@svelte-docgen/extractor";
import { Options, type UserOptions } from "../src/options.js";

export const CACHE = createCacheStorage();
export function create_options(filepath: UserOptions["filepath"]): Options {
	return new Options({
		filepath,
		cache: CACHE,
	});
}
