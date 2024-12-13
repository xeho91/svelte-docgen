/**
 * @import { Node, Property } from "estree";
 * @import { PluginOption } from "vite";
 *
 * @import { UserOptions } from "./options.js";
 */

import fs from "node:fs";
import path from "node:path";
import url from "node:url";

import { print } from "esrap";
import * as docgen from "svelte-docgen";
import { walk } from "zimmerframe";

import { Options } from "./options.js";

const CACHE_STORAGE = docgen.createCacheStorage();

/**
 * @param {UserOptions} [user_options]
 * @returns {Promise<PluginOption>}
 */
async function plugin(user_options) {
	// TODO: Decide whether there is a need for plugin options
	const options = new Options(user_options);
	return {
		name: "vite-plugin-svelte-docgen",
		enforce: "pre",
		resolveId(id, importer) {
			if (!importer) return;
			if (!id.endsWith(".svelte?docgen")) return;
			const svelte_filepath = url.pathToFileURL(
				path.join(
					//
					path.dirname(importer),
					id.replace("?docgen", ""),
				),
			);
			if (fs.existsSync(svelte_filepath)) {
				return `\0virtual:${svelte_filepath.pathname}.docgen.js`;
			}
		},
		load(id) {
			if (id.startsWith("\0virtual:") && id.endsWith(".docgen.js")) {
				/* prettier-ignore */
				const original_svelte_filepath = id
					.replace("\0virtual:", "")
					.replace(".docgen.js", "");
				const svelte_filepath_url = url.pathToFileURL(original_svelte_filepath);
				const source = fs.readFileSync(svelte_filepath_url, "utf-8");
				const parsed = docgen.parse(source, {
					// @ts-ignore: FIXME: Perhaps we really should change this to loose string type
					filepath: svelte_filepath_url.pathname,
					cache: CACHE_STORAGE,
				});
				const stringified = `export default /** @type {const} */(${docgen.serialize(parsed)});`;
				const ast = transform_serialized(this.parse(stringified));
				const { code } = print(ast);
				return code;
			}
		},
	};
}

/**
 * @param {Node} ast
 * @returns {Node}
 */
function transform_serialized(ast) {
	return walk(ast, null, {
		Property(node, ctx) {
			if (
				node.key.type === "Literal" &&
				typeof node.key.value === "string" &&
				node.value.type === "ArrayExpression"
			) {
				// Revive those keys values as Map
				if (["events", "exports", "props", "slots"].includes(node.key.value)) {
					return /** @type {Property} */ ({
						...node,
						value: {
							type: "NewExpression",
							callee: {
								type: "Identifier",
								name: "Map",
							},
							// NOTE: We need to visit nested nodes for further transformation
							arguments: [ctx.visit(node.value)],
						},
					});
				}
				// Revive entry with key `sources`entry value as Set
				if (node.key.value === "sources") {
					return /** @type {Property} */ ({
						...node,
						value: {
							type: "NewExpression",
							callee: {
								type: "Identifier",
								name: "Set",
							},
							arguments: [node.value],
						},
					});
				}
			}
			ctx.next();
		},
	});
}

export default plugin;
