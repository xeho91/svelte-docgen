/**
 * @import { BaseDocumentation, Tag } from "./shared.js";
 * @import { PropDocumentation } from "./props.js";
 */

import { extract } from "svelte-docgen-extractor";

/**
 * @typedef ModernComponentDocumentation
 * @prop {false} isLegacy
 * @prop {PropDocumentation[]} props
 * @prop {PropDocumentation[]} bindings
 * @prop {PropDocumentation[]} snippets
 * @prop {never} slots
 * @prop {never} exports
 * @prop {never} events
 */

/**
 * @typedef LegacyComponentDocumentation
 * @prop {true} isLegacy
 * @prop {PropDocumentation[]} props
 * @prop {never} bindings
 * @prop {never} snippets
 * @prop {PropDocumentation[]} slots
 * @prop {PropDocumentation[]} exports
 * @prop {PropDocumentation[]} events
 */

/**
 * @typedef {ModernComponentDocumentation | LegacyComponentDocumentation} ComponentDocumentation
 */

/**
 * @typedef {BaseDocumentation & ComponentDocumentation} Documentation
 */

/**
 * @typedef {BaseDocumentation} BindableDocumentation
 * @prop {string} type
 * @prop {string} alias
 */

const FIELD_CREATORS = /** @type {const} */ ({
	documentation: create_documentation,
	tags: create_tags,
	props: create_props,
	bindings: create_bindings,
	snippets: create_snippets,
	slots: create_slots,
	exports: create_exports,
	events: create_events,
});

/** @returns {Documentation['documentation']} */
function create_documentation() {
	throw new Error("Not implemented");
}

/** @returns {Documentation['tags']} */
function create_tags() {
	throw new Error("Not implemented");
}

/** @returns {Documentation['props']} */
function create_props() {
	throw new Error("Not implemented");
}

/** @returns {Documentation['bindings']} */
function create_bindings() {
	throw new Error("Not implemented");
}

/** @returns {Documentation['snippets']} */
function create_snippets() {
	throw new Error("Not implemented");
}

/** @returns {Documentation['slots']} */
function create_slots() {
	throw new Error("Not implemented");
}

/** @returns {Documentation['exports']} */
function create_exports() {
	throw new Error("Not implemented");
}

/** @returns {Documentation['events']} */
function create_events() {
	throw new Error("Not implemented");
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
	/** @type {Documentation} */
	let documentation = {};
	return [filepath, documentation];
}

const [filepath, doc] = generate("test.svelte", { fields: ["documentation", "tags", "props", "snippets"] });

if (doc.isLegacy) {
	doc.slots;
} else {
	doc.slots;
	doc.snippets;
}
