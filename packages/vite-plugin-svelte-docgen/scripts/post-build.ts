import fs from "node:fs";
import path from "node:path";
import url from "node:url";

const __filename = url.fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function main(): void {
	const types_filepath = url.pathToFileURL(path.join(__dirname, "..", "types", "mod.d.ts"));
	const content = `
declare module "virtual:*.docgen.js" {
	import type { parse } from "svelte-docgen";
	const content: ReturnType<typeof parse>;
	export default content;
}
	`;
	fs.appendFileSync(types_filepath, content, "utf-8");
}

main();
