<script lang="ts">
type Aliased = "red" | "green" | "blue";
interface Props {
	color: "primary" | "secondary" | "tertiary";
	step: 1 | 2 | 3;
	mixed: string | number | boolean | bigint | null | undefined | 1337 | "awesome" | true | 1n;
	aliased: Aliased;
}
let { ..._ }: Props = $props();
</script>
