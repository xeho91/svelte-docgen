<script lang="ts">
interface Props {
	data: object;
	// biome-ignore lint/complexity/noBannedTypes: Testing
	unknown: {};
}
let { ..._ }: Props = $props();
</script>
