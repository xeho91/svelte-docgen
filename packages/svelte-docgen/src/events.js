/**
 * @import { Doc } from "./documentation.ts";
 * @import { Extractor } from "./shared.js"
 */

import { get_type_documentation } from "./type.js";

/**
 * @param {Extractor} extractor
 * @returns {Doc.Events}
 */
export function get_events_documentation(extractor) {
	return new Map(
		Iterator.from(extractor.events).map(([name, symbol]) => {
			return [
				`on:${name}`,
				get_type_documentation({ type: extractor.checker.getTypeOfSymbol(symbol), extractor }),
			];
		}),
	);
}
