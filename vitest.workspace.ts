import path from "node:path";
import url from "node:url";

import { loadEnv } from "vite";
import { defineWorkspace, type UserWorkspaceConfig } from "vitest/config";

const __filename = url.fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const SHARED = {
	env: Object.assign(process.env, loadEnv("", path.resolve(__dirname), "")),
	snapshotSerializers: [path.resolve(__dirname, "tests", "snapshot-serializer.ts")],
	typecheck: {
		enabled: true,
	},
} satisfies NonNullable<UserWorkspaceConfig>["test"];

/** @see {@link https://vitest.dev/guide/workspace} */
const config = defineWorkspace([
	{
		test: {
			...SHARED,
			name: "@svelte-docgen/extractor",
			root: path.resolve(__dirname, "packages", "extractor"),
		},
	},
	{
		test: {
			...SHARED,
			name: "@svelte-docgen/extractor",
			root: path.resolve(__dirname, "packages", "extractor"),
		},
	},
	{
		test: {
			...SHARED,
			name: "svelte-docgen",
			root: path.resolve(__dirname, "packages", "svelte-docgen"),
		},
	},
]);

export default config;
