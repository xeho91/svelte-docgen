/**
 * @param {string} filepath
 * Most of the code here should probably be exported by @storybook/svelte and reused here.
 * @see {@link https://github.com/storybookjs/storybook/blob/next/app/svelte/src/server/svelte-docgen-loader.ts}
 **/
export function get_name_from_svelte_file_basename(filepath) {
	const parts = filepath.split(/[/\\]/).map(encodeURI);
	if (parts.length > 1) {
		const idx_match = parts[parts.length - 1].match(/^index(\.\w+)/);
		if (idx_match) {
			parts.pop();
			parts[parts.length - 1] += idx_match[1];
		}
	}
	const base = parts
		.pop()
		?.replace(/%/g, "u")
		.replace(/\.[^.]+$/, "")
		.replace(/[^a-zA-Z_$0-9]+/g, "_")
		.replace(/^_/, "")
		.replace(/_$/, "")
		.replace(/^(\d)/, "_$1");
	if (!base) throw new Error(`Could not derive component name from file ${filepath}`);
	return base[0].toUpperCase() + base.slice(1);
}
