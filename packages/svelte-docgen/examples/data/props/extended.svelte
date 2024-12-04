<script lang="ts">
import type { HTMLButtonAttributes } from "svelte/elements";
interface Props extends HTMLButtonAttributes {
	custom: string;
}
let { custom, ...rest }: Props = $props();
</script>
