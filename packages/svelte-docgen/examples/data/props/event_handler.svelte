<script lang="ts">
import type { MouseEventHandler } from "svelte/elements";

interface Props {
	onclick: MouseEventHandler<HTMLDivElement>;
}
let { ..._ }: Props = $props();
</script>
