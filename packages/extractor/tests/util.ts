import path from "node:path";
import url from "node:url";

import type { SvelteFilepath } from "../src/util.js";

const __filename = url.fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export function create_path_to_example_component(...name: string[]): SvelteFilepath {
	// @ts-expect-error Not worth it
	return path.join(__dirname, "..", "examples", "components", ...name);
}
