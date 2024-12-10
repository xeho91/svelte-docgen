/**
 * @import { PluginOption } from "vite";
 *
 * @import { UserOptions } from "./options.js";
 */

import path from "node:path";

import MagicString from "magic-string";
import * as compiler from "svelte/compiler";

import * as docgen from "svelte-docgen";
import { Options } from "./options.js";
import { get_name_from_svelte_file_basename } from "./utils.js";

const CACHE_STORAGE = docgen.createCacheStorage();

/**
 * @param {UserOptions} [user_options]
 * @returns {Promise<PluginOption>}
 */
async function plugin(user_options) {
	const options = new Options(user_options);
	const include = /\.(svelte)$/;
	const { createFilter } = await import("vite");
	const filter = createFilter(include);
	return {
		name: "plugin-svelte-docgen",
		async transform(source, id) {
			if (!filter(id)) return;
			// TODO: This should be used in the upper scope
			try {
				require.resolve("typescript");
			} catch (error) {
				// NOTE: Prevent throwing error when TypeScript is not used in the project.
				return;
			}
			const src = new MagicString(source);
			const filepath = path.relative(options.cwd.pathname, id);
			const component_name = get_name_from_svelte_file_basename(path.basename(filepath));
			const parsed = docgen.parse(source, { filepath, cache: CACHE_STORAGE });
			const serialized = docgen.serialize(parsed);
			src.append(`\n${component_name}.__docgen = ${serialized}`);
			return {
				code: src.toString(),
				map: src.generateMap({ hires: options.sourceMapHires, source }),
			};
		},
	};
}

export default plugin;
