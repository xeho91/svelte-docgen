import ts from "typescript";
import * as tsvfs from "@typescript/vfs";

import { parse, createCacheStorage, encode } from "svelte-docgen";

import shim from "svelte2tsx/svelte-shims-v4.d.ts?raw";

export function prepareDocgen(fsmap: Map<string, string>) {
	fsmap.set("/svelte2tsx/svelte-shims-v4.d.ts", shim);

	const system = tsvfs.createSystem(fsmap);
	const cache = createCacheStorage(system);

	// const debug_system: ts.System = {
	//   ...system,
	//   fileExists(p){
	// 		const r = system.fileExists(p);
	// 		console.log("fileexists", p, "=>", r);
	// 		return r;
	// 	},
	// 	readFile (p) {
	// 		const r = system.readFile(p);
	// 		console.log("readfile", p, "=>", r ? "found" : "not found");
	// 		return r;
	// 	},
	// 	readDirectory (path, extensions, exclude, include, depth) {
	// 		const r = system.readDirectory(path, extensions, exclude, include, depth);
	// 		console.log("readDirectory", path, "=>", r);
	// 		return r;
	// 	},
	// 	getCurrentDirectory() {
	// 		const r = system.getCurrentDirectory();
	// 		console.log("getCurrentDirectory", "=>", r);
	// 		return r;
	// 	},
	// 	directoryExists(p) {
	// 		const r = system.directoryExists(p);
	// 		console.log("directoryExists", p, "=>", r);
	// 		return r;
	// 	},
	// }

	return (source: string) => {
		cache.delete("/src/Demo.svelte.tsx");
		const parsed = parse(source, {
			cache,
			filepath: "/src/Demo.svelte",
			system: system,
			host: tsvfs.createVirtualCompilerHost(system, {}, ts).compilerHost,
		});
		return encode(parsed, { indent: 2 });
	};
}
