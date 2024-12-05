import process from "node:process";

import type { SnapshotSerializer } from "vitest";

export default {
	test: (value) => typeof value === "string" && value.includes(process.cwd()),
	print: (value) => (typeof value === "string" ? value.replace(process.cwd(), "<process-cwd>") : ""),
} satisfies SnapshotSerializer;
