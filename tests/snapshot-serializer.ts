import path from "node:path";
import url from "node:url";

const __filename = url.fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

import type { SnapshotSerializer } from "vitest";

const ROOT_PATH = path.join(__dirname, "..");

export default {
	test: (value) => typeof value === "string" && value.includes(ROOT_PATH),
	print: (value) => (typeof value === "string" ? value.replace(new RegExp(ROOT_PATH, "g"), "<process-cwd>") : ""),
} satisfies SnapshotSerializer;
