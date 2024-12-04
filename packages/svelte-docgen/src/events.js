/**
 * @import { Doc } from "./documentation.ts";
 * @import { Extractor } from "./shared.js"
 */

import { get_type_doc } from "./type.js";

/**
 * @param {Extractor} extractor
 * @returns {Doc.Events}
 */
export function get_events_doc(extractor) {
	return new Map(
		Iterator.from(extractor.events).map(([name, symbol]) => {
			return [`on:${name}`, get_type_doc({ type: extractor.checker.getTypeOfSymbol(symbol), extractor })];
		}),
	);
}
