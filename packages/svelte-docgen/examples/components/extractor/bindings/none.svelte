<script lang="ts">
interface Props {
	id: string;
}
let {
	//
	id,
}: Props = $props();
</script>

<input
	{id}
	type="text"
/>
