<script lang="ts">
interface Props {
	disabled?: boolean;
}
let { disabled }: Props = $props();
</script>

<button {disabled}>Click me</button>
