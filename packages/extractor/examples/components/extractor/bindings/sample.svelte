<script lang="ts">
interface Props {
	id: string;
	value?: string;
	borderBoxSize?: ResizeObserverSize[];
}
let {
	//
	id,
	borderBoxSize = $bindable(),
	value = $bindable(),
}: Props = $props();
</script>

<input
	{id}
	bind:value
	bind:borderBoxSize
/>
