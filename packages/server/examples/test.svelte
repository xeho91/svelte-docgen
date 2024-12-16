<script lang="ts">
	import type { Snippet } from "svelte";

	interface Props {
		custom: string;
		children?: Snippet;
	}
	let { children, ...rest_props }: Props = $props();
</script>

<button {...rest_props}>
	{#if children}
		{@render children()}
	{/if}
</button>
