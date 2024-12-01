<script lang="ts" generics="U, const C, R extends number, D = string">
interface Props {
	unknown: U;
	constant: C;
	constraint: R;
	default: D;
}
let { ..._ }: Props = $props();
</script>
