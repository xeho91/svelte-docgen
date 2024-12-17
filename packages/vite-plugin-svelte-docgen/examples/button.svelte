<script lang="ts">
	import type { HTMLButtonAttributes } from "svelte/elements";

	// eslint-disable-next-line @typescript-eslint/no-empty-object-type
	interface Props extends HTMLButtonAttributes {}
	let { ..._ }: Props = $props();
</script>
