/**
 * @import { Doc } from "./documentation.ts";
 * @import { Extractor } from "./shared.js"
 */

import { get_type_documentation } from "./type.js";

/**
 * @param {Extractor} extractor
 * @returns {Doc.Slots}
 */
export function get_slots_documentation(extractor) {
	return new Map(
		Iterator.from(extractor.slots).map(([name, props]) => {
			const documented_props = new Map(
				Iterator.from(props).map(([name, prop]) => [
					name,
					get_type_documentation({ type: extractor.checker.getTypeOfSymbol(prop), extractor }),
				]),
			);
			return [name, documented_props];
		}),
	);
}
