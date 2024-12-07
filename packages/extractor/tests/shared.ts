import { createCacheStorage } from "../src/cache.js";
import { Options } from "../src/options.js";
import type { SvelteFilepath } from "../src/util.js";

export const CACHE = createCacheStorage();
export function create_options(filepath: SvelteFilepath): Options {
	return new Options({
		filepath,
		cache: CACHE,
	});
}
