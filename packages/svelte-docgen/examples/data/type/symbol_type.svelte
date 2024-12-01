<script lang="ts">
const unique = Symbol("magic");
interface Props {
	loose: symbol;
	unique: typeof unique;
}
let { ..._ }: Props = $props();
</script>
