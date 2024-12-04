/**
 * @import { Doc } from "./documentation.ts";
 * @import { Extractor } from "./shared.js"
 */

import { get_type_documentation } from "./type.js";

/**
 * @param {Extractor} extractor
 * @returns {Doc.Exports}
 */
export function get_exports_documentation(extractor) {
	return new Map(
		Iterator.from(extractor.exports).map(([name, symbol]) => {
			return [
				name,
				get_type_documentation({
					type: extractor.checker.getTypeOfSymbol(symbol),
					extractor,
				}),
			];
		}),
	);
}
