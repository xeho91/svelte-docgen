<script lang="ts">
import type { HTMLButtonAttributes } from "svelte/elements";

interface Props extends HTMLButtonAttributes {}

let { disabled }: Props = $props();
</script>

<button {disabled}>Click me</button>
