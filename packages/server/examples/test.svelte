<script lang="ts">
import type { Snippet } from "svelte";
import type { HTMLButtonAttributes } from "svelte/elements";

interface Props extends HTMLButtonAttributes {
	custom: string;
	header: Snippet;
}
let { children, ...rest_props }: Props = $props();
</script>

<button {...rest_props}>
	{#if children}
		{@render children()}
	{/if}
</button>
