<script lang="ts">
type Letter = "a" | "b" | "c";
type Num = 0 | 1 | 2;
interface Props {
	letters: Letter[];
	numbers: readonly Num[];
}
let { ..._ }: Props = $props();
</script>
