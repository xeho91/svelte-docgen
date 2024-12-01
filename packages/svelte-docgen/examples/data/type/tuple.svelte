<script lang="ts">
type Letter = "a" | "b" | "c";
type Num = 0 | 1 | 2;
type Aliased = [string, boolean];
interface Props {
	sample: [Letter, Num];
	strict: readonly [Letter, Num];
	empty: [];
	"really-empty": readonly [];
	aliased: Aliased;
}
let { ..._ }: Props = $props();
</script>
