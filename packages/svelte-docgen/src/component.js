/**
 * @import { extract } from "@svelte-docgen/extractor";
 *
 * @import { BaseDocumentation, Tag } from "./shared.js";
 */

/**
 * @typedef {BaseDocumentation} ComponentDocumentation
 * @prop {string} description
 * @prop {Tag[]} tags
 */

/**
 * @param {ReturnType<typeof extract>} extractor
 * @returns {BaseDocumentation}
 */
export function generate_component_documentation(extractor) {
	return {
		description: extractor?.documentation?.description ?? "",
		tags: generate_tags(extractor),
	};
}

/**
 * @param {ReturnType<typeof extract>} extractor
 * @returns {Tag[]}
 */
function generate_tags(extractor) {
	return Iterator.from(extractor.documentation?.tags ?? [])
		.map((tag) => {
			return {
				name: tag.name,
				content: tag.description,
			};
		})
		.toArray();
}
