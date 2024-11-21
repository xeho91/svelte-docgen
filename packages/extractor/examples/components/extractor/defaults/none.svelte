<script lang="ts">
interface Props {
	id: string;
}
let {
	//
	id,
}: Props = $props();
</script>

<button {id}>Click me</button>
