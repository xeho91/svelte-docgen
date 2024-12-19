import path from "node:path";
import url from "node:url";

const __filename = url.fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

import type { SnapshotSerializer } from "vitest";

const ROOT_PATH = path.join(__dirname, "..");
const REGEX_PACKAGE_VERSION = /(?<package>[\w-]+)@(?<semver>\d+\.\d+\.\d+)/g;

export default {
	test: (value) => {
		return typeof value === "string" && (value.includes(ROOT_PATH) || REGEX_PACKAGE_VERSION.test(value));
	},
	print: (value) => {
		if (typeof value === "string") {
			return value
				.replaceAll(ROOT_PATH, "<process-cwd>")
				.replaceAll(REGEX_PACKAGE_VERSION, "$<package>@<semver>");
		}
		return "";
	},
} satisfies SnapshotSerializer;
