<script lang="ts">
import type { Snippet } from "svelte";

type Color = "red" | "green" | "blue";
interface Props {
	header?: Snippet<[string]>;
	children: Snippet;
	footer?: Snippet<[Color, number]>;
	// biome-ignore lint/suspicious/noExplicitAny: Testing
	whatever: any;
}
let { footer = default_footer }: Props = $props();
const color = "red" satisfies Color;
</script>

{#snippet default_footer(color: Color, year: number)}
	<p class:color>{`Copyright © ${year}`}</p>
{/snippet}

{@render footer(color, new Date().getFullYear())}
