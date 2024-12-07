import path from "node:path";
import url from "node:url";

import { loadEnv } from "vite";
import { defineWorkspace } from "vitest/config";

const __filename = url.fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/** @see {@link https://vitest.dev/guide/workspace} */
const config = defineWorkspace([
	{
		test: {
			name: "@svelte-docgen/extractor",
			root: path.resolve(__dirname, "packages", "extractor"),
			env: Object.assign(process.env, loadEnv("", path.resolve(__dirname), "")),
			snapshotSerializers: [path.resolve(__dirname, "tests", "snapshot-serializer.ts")],
			typecheck: {
				enabled: true,
			},
		},
	},
	{
		test: {
			name: "svelte-docgen",
			root: path.resolve(__dirname, "packages", "svelte-docgen"),
			env: Object.assign(process.env, loadEnv("", path.resolve(__dirname), "")),
			snapshotSerializers: [path.resolve(__dirname, "tests", "snapshot-serializer.ts")],
			typecheck: {
				enabled: true,
			},
		},
	},
]);

export default config;
