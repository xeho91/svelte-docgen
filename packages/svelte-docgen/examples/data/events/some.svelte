<script lang="ts">
import { createEventDispatcher } from "svelte";
const dispatch = createEventDispatcher<{
	decrement: number;
	increment: number;
}>();
</script>

<button on:click={() => dispatch('decrement', 1)}>decrement</button>
<button on:click={() => dispatch('increment', 1)}>increment</button>
