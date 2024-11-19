/**
 * @import { Options } from "./util.js";
 */

import { Analyzer } from "./analyzer.js";
import { validate_filepath } from "./util.js";

/**
 * @param {string} filepath
 * @param {Partial<Options>} options
 * */
export function generate(filepath, options = {}) {
	validate_filepath(filepath);
	const analyzer = new Analyzer(filepath, options);
	return analyzer.build();
}
