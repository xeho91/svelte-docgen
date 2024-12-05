/**
 * @import { Doc } from "../documentation.ts";
 * @import { ParsedComponent } from "../parser.ts";
 */

class ComponentAnalyzer {
	/** @type {ParsedComponent} */
	#component;

	/** @param {ParsedComponent} component */
	constructor(component) {
		this.#component = component;
	}

	/** @returns {string | undefined} */
	get category() {
		return this.#component.component.tags.find((t) => t.name === "category")?.content;
	}

	/** @returns {string | undefined} */
	get subcategory() {
		return this.#component.component.tags.find((t) => t.name === "subcategory")?.content;
	}

	/**
	 * Filters out legacy event handler props if the component is modern.
	 * Or filters out modern event handler props if the component is legacy.
	 * @returns {Doc.Props}
	 */
	get props() {
		return new Map(
			Iterator.from(this.#component.props).filter(([name, _prop]) => {
				if (this.#component.isLegacy) {
					return name.startsWith("on:") || (!name.startsWith("on") && name.at(2) !== ":");
				}
				return !name.startsWith("on:");
			}),
		);
	}
}

/**
 * @param {ParsedComponent} component
 * @returns {ComponentAnalyzer}
 */
export function analyzeComponent(component) {
	return new ComponentAnalyzer(component);
}
