/**
 * @import { Doc } from "./documentation.ts";
 * @import { Extractor } from "./shared.js"
 */

/**
 * @param {Extractor} extractor
 * @returns {Doc.Component}
 */
export function get_component_doc(extractor) {
	return {
		description: extractor?.documentation?.description ?? "",
		tags: get_tags(extractor),
	};
}

/**
 * @param {Extractor} extractor
 * @returns {Doc.Tag[]}
 */
function get_tags(extractor) {
	return Iterator.from(extractor.documentation?.tags ?? [])
		.map((tag) => {
			return {
				name: tag.name,
				content: tag.description,
			};
		})
		.toArray();
}
