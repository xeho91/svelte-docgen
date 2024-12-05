<script lang="ts">
import type { HTMLButtonAttributes } from "svelte/elements";

type $$Props = HTMLButtonAttributes;
export let disabled: boolean | null | undefined = undefined;
</script>

<button {disabled}>Click me</button>
