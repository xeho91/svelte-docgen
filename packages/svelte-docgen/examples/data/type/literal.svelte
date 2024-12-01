<script lang="ts">
interface Props {
	bigintish: 1n;
	booleanish: true;
	numberish: 1337;
	stringish: "awesome";
}
let { ..._ }: Props = $props();
</script>
