<script lang="ts">
	import ts from "typescript";
	import * as tsvfs from "@typescript/vfs";

	import { browser } from "$app/environment";
	import { Debounced } from "runed";

	import { prepareDocgen } from "./demo";
	import initial from "./initial.txt?raw";

	let docgen: ((source: string) => string) | undefined = $state();
	let source = $state(initial);
	let debouncedSource = new Debounced(() => source, 500);
	let encoded = $state("");
	let error: string = $state("");

	if (browser) {
		(async () => {
			const fsmap = await tsvfs.createDefaultMapFromCDN(
				{
					lib: ["esnext", "DOM", "DOM.Iterable"],
					target: ts.ScriptTarget.ESNext,
				},
				ts.version,
				true,
				ts,
				// lzstring
			);

			for (const [k, v] of Object.entries(
				import.meta.glob("/node_modules/svelte/**/*.d.ts", { query: "?raw", exhaustive: true, eager: true }),
			)) {
				// @ts-expect-error: v is a string
				fsmap.set(k, v.default);
			}

			docgen = prepareDocgen(fsmap);
		})();
	}

	$effect(() => {
		if (!docgen) return;
		try {
			encoded = docgen(debouncedSource.current);
			error = "";
		} catch (e) {
			error = String(e);
		}
	});
</script>

<textarea bind:value={source} rows="10" style="width: 100%;"></textarea>

{#if error}
	<pre style="color: red;">{error}</pre>
{/if}

{#if docgen}
	<pre>{encoded}</pre>
{:else}
	loading docgen...
{/if}
