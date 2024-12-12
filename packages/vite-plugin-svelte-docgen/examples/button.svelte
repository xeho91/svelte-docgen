<script lang="ts">
import type { HTMLButtonAttributes } from "svelte/elements";

interface Props extends HTMLButtonAttributes {}
let { ..._ }: Props = $props();
</script>
