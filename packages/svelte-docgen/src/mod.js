/**
 * @import { ExportsDocumentation } from "./exports.js";
 * @import { EventsDocumentation } from "./events.js";
 * @import { PropDocumentation } from "./props.js";
 * @import { BaseDocumentation } from "./shared.js";
 * @import { SlotsDocumentation } from "./slots.js";
 */

import { extract } from "@svelte-docgen/extractor";

import { generate_component_documentation } from "./component.js";
import { generate_events_documentation } from "./events.js";
import { generate_exports_documentation } from "./exports.js";
import { generate_props_documentation } from "./props.js";
import { generate_slots_documentation } from "./slots.js";

class Documentation {
	/** @type {ReturnType<typeof extract>} */
	#extractor;

	/**
	 * @param {string} filepath
	 * @param {GeneratorOptions} options
	 */
	constructor(filepath, options) {
		this.#extractor = extract(filepath, options);
	}

	/** @returns {BaseDocumentation} */
	get component() {
		return generate_component_documentation(this.#extractor);
	}

	/** @returns {boolean} */
	get isLegacy() {
		const has_slots = this.#extractor.slots.size > 0;
		const has_exports = this.#extractor.events.size > 0;
		return this.#extractor.parser.has_legacy_syntax || has_slots || has_exports;
	}

	/** @returns {Map<string, PropDocumentation>} */
	get props() {
		return generate_props_documentation(this.#extractor);
	}

	/** @returns {ExportsDocumentation} */
	get exports() {
		return generate_exports_documentation(this.#extractor);
	}

	/** @returns {typeof this['isLegacy'] extends true ? EventsDocumentation : never} */
	get events() {
		// TODO: Document error
		if (!this.isLegacy) throw new Error();
		// @ts-expect-error Not worth it?
		return generate_events_documentation(this.#extractor);
	}

	/** @returns {typeof this['isLegacy'] extends true ? SlotsDocumentation : never} */
	get slots() {
		// TODO: Document error
		if (!this.isLegacy) throw new Error();
		// @ts-expect-error Not worth it?
		return generate_slots_documentation(this.#extractor);
	}
}

/**
 * @typedef {object} GeneratorOptions
 */

/**
 * @param {string} filepath
 * @param {Partial<GeneratorOptions>} options
 * @returns {[string, Documentation]}
 */
export function generate(filepath, options = {}) {
	/** @type {GeneratorOptions} */
	const merged_options = {
		// TODO: Provide default options
		...options,
	};
	const documentation = new Documentation(filepath, merged_options);
	return [filepath, documentation];
}
