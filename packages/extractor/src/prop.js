import ts from "typescript";

export class PropExtractor {
	/** @type {ts.Symbol} */
	symbol;
	/** @type {ts.Type} */
	type;
	/** @type {ts.Declaration} */
	declaration;
	/** @type {ts.SourceFile} */
	source;

	/**
	 * @param {ts.Symbol} symbol
	 * @param {ts.Type} type
	 */
	constructor(symbol, type) {
		this.symbol = symbol;
		this.type = type;
		this.declaration = this.#get_declaration();
		this.source = this.#get_source();
	}

	/** @returns {ts.Declaration} */
	#get_declaration() {
		const declaration = this.type.getSymbol()?.getDeclarations()?.[0] || this.symbol.getDeclarations()?.[0];
		if (!declaration) throw new Error("Declaration not found");
		return declaration;
	}

	/** @returns {ts.SourceFile} */
	#get_source() {
		return this.declaration.getSourceFile();
	}

	// /** @returns {boolean} */
	// get isOptional() {
	// 	return (this.symbol.getFlags() & ts.SymbolFlags.Optional) !== 0;
	// }

	// /**
	//  * @returns {string | undefined}
	//  */
	// get default() {
	// 	if (!this.isOptional) return undefined;
	// 	const from_props = this.#extractor.props_defaults.get(this.symbol.name);
	// 	if (from_props) return from_props;
	// 	return this.symbol.getJsDocTags().find((tag) => tag.name === "default")?.text?.[0].text;
	// }
	//
	// /** @returns {boolean} */
	// get isBindable() {
	// 	return this.#extractor.bindings.has(this.symbol.name) || this.symbol.name.startsWith("bind:");
	// }
	//
	// /** @returns {boolean} */
	// get isFromSvelte() {
	// 	const { dir } = path.parse(this.source.fileName);
	// 	return dir.endsWith(path.join(path.sep, "node_modules", "svelte"));
	// }
	//
	// /** @returns {boolean} */
	// get isSnippet() {
	// 	return this.alias === "Snippet" && this.isFromSvelte;
	// }
}
