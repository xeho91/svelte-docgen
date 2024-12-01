<script lang="ts">
interface Props {
	loose: bigint;
	positive: 1337n;
	negative: -666n;
}
let { ..._ }: Props = $props();
</script>
