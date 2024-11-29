<script lang="ts">
interface Props {
	color: "primary" | "secondary" | "tertiary";
	step: 1 | 2 | 3;
	mixed: string | number | boolean | bigint | null | undefined | 1337 | "awesome" | true | 1n;
}
let { ..._ }: Props = $props();
</script>
