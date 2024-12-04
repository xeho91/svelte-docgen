/**
 * @import { Doc } from "./documentation.ts";
 * @import { Extractor } from "./shared.js"
 */

import { get_type_doc } from "./type.js";

/**
 * @param {Extractor} extractor
 * @returns {Doc.Exports}
 */
export function get_exports_doc(extractor) {
	return new Map(
		Iterator.from(extractor.exports).map(([name, symbol]) => {
			return [
				name,
				get_type_doc({
					type: extractor.checker.getTypeOfSymbol(symbol),
					extractor,
				}),
			];
		}),
	);
}
