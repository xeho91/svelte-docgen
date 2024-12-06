import { createCacheStorage } from "../src/cache.js";
import { Options } from "../src/options.js";

export const CACHE = createCacheStorage();
export const OPTIONS = new Options({
	cache: CACHE,
});
