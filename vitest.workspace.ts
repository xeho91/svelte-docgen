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
			name: "extractor",
			root: path.resolve(__dirname, "packages", "extractor"),
			env: Object.assign(process.env, loadEnv("", path.resolve(__dirname), "")),
			typecheck: {
				enabled: true,
			},
		},
	},
]);

export default config;
