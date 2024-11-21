<script lang="ts">
import type { MouseEventHandler } from "svelte/elements";

interface Props {
	id?: string;
	onclick?: MouseEventHandler<HTMLButtonElement>;
	disabled?: boolean;
}
let {
	//
	id = "button-123",
	onclick = () => {},
	disabled,
}: Props = $props();
</script>

<button {id} {onclick} {disabled}>Click me</button>
