import fs from "node:fs";
import path from "node:path";
import url from "node:url";

const __filename = url.fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * We can't re-export types using JSDoc, sadly.
 * Hence we append the module declaration with import part query parameter to provide a better TypeScript experience for users.
 *
 * NOTE: Is included in `build:pkg` script
 */
function main(): void {
	const types_filepath = url.pathToFileURL(path.join(__dirname, "..", "types", "mod.d.ts"));
	const content = `
declare module "*.svelte?docgen" {
	import type { parse } from "svelte-docgen";
	const content: ReturnType<typeof parse>;
	export default content;
}
	`;
	fs.appendFileSync(types_filepath, content, "utf-8");
}

main();
