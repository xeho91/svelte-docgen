/**
 * @import { Doc } from "./documentation.ts";
 * @import { Extractor } from "./shared.js"
 */

import { get_prop_doc } from "./props.js";

/**
 * @param {Extractor} extractor
 * @returns {Doc.Slots}
 */
export function get_slots_doc(extractor) {
	return new Map(
		Iterator.from(extractor.slots).map(([name, props]) => {
			const documented_props = new Map(
				Iterator.from(props).map(([name, prop]) => [name, get_prop_doc(prop, extractor)]),
			);
			return [name, documented_props];
		}),
	);
}
