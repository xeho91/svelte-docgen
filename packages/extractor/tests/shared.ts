import path from "node:path";
import url from "node:url";

import { createCacheStorage } from "../src/cache.js";
import type { Options, SvelteFilepath } from "../src/util.js";

const __filename = url.fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export function create_path_to_example_component(...name: string[]): SvelteFilepath {
	// @ts-expect-error Not worth it
	return path.join(__dirname, "..", "examples", "components", ...name);
}

export const CACHE = createCacheStorage();
export const OPTIONS = {
	cache: CACHE,
} satisfies Partial<Options>;
