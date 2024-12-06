/**
 * @import { Doc } from "./documentation.ts";
 * @import { UserOptions } from "./options.js";
 */

import { extract } from "@svelte-docgen/extractor";

import { get_component_doc } from "./component.js";
import { get_events_doc } from "./events.js";
import { get_exports_doc } from "./exports.js";
import { Options } from "./options.js";
import { get_props_doc } from "./props.js";
import { get_slots_doc } from "./slots.js";

class Parser {
	/** @type {ReturnType<typeof extract>} */
	#extractor;
	/** @type {Options} */
	#options;

	/**
	 * @param {string} source
	 * @param {Options} options
	 */
	constructor(source, options) {
		this.#options = options;
		this.#extractor = extract(source, this.#options);
	}

	/** @returns {Doc.Component} */
	get component() {
		return get_component_doc(this.#extractor);
	}

	/** @returns {boolean} */
	get isLegacy() {
		const has_slots = this.#extractor.slots.size > 0;
		const has_exports = this.#extractor.events.size > 0;
		return this.#extractor.parser.hasLegacySyntax || has_slots || has_exports;
	}

	/** @returns {Doc.Props} */
	get props() {
		return get_props_doc(this.#extractor);
	}

	/** @returns {Doc.Exports} */
	get exports() {
		return get_exports_doc(this.#extractor);
	}

	/** @returns {ReturnType<typeof this['isLegacy']> extends true ? Doc.Events : never} */
	get events() {
		// TODO: Document error
		if (!this.isLegacy) throw new Error();
		// @ts-expect-error Not worth it?
		return get_events_doc(this.#extractor);
	}

	/** @returns {ReturnType<typeof this['isLegacy']> extends true ? Doc.Slots : never} */
	get slots() {
		// TODO: Document error
		if (!this.isLegacy) throw new Error();
		// @ts-expect-error Not worth it?
		return get_slots_doc(this.#extractor);
	}
}
/**
 * @typedef LegacyComponent
 * @prop {true} isLegacy
 * @prop {Doc.Component} component
 * @prop {Doc.Props} props
 * @prop {Doc.Exports} exports
 * @prop {Doc.Events} events
 * @prop {Doc.Slots} slots
 */

/**
 * @typedef ModernComponent
 * @prop {false} isLegacy
 * @prop {Doc.Component} component
 * @prop {Doc.Props} props
 * @prop {Doc.Exports} exports
 * @prop {never} events
 * @prop {never} slots
 */

/** @typedef {LegacyComponent | ModernComponent} ParsedComponent */

/**
 * @param {string} source
 * @param {UserOptions} user_options
 * @returns {[string, ParsedComponent]}
 */
export function parse(source, user_options = {}) {
	// @ts-expect-error Not worth asserting
	return [source, new Parser(source, new Options(user_options))];
}
