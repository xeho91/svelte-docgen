<script lang="ts">
interface Props {
	loose: boolean;
	truthy: true;
	falsy: false;
}
let { ..._ }: Props = $props();
</script>
