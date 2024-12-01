import path from "node:path";
import url from "node:url";

import { createCacheStorage, type extract } from "svelte-docgen-extractor";

const __filename = url.fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export function create_path_to_example_component(...name: string[]): string {
	return path.join(__dirname, "..", "examples", ...name);
}

export const CACHE = createCacheStorage();
export const OPTIONS = {
	cache: CACHE,
} satisfies Partial<Parameters<typeof extract>[1]>;

export function x() {}
