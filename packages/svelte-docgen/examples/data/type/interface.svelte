<script lang="ts">
interface A {
	name: string;
	age?: number;
	moo: () => void;
}
interface B {
	readonly x: number;
	readonly y: number;
}
type AsType = {
	ugly: true;
};
// biome-ignore lint/suspicious/noEmptyInterface: Testing
interface Empty {}
// biome-ignore lint/complexity/noBannedTypes: Testing
type EmptyType = {};
type Aliased = A;
interface Props {
	anonymous: { name: "Guy"; surname: "Fawkes" };
	a: A;
	b: B;
	"as-type": AsType;
	"empty-aliased": Empty;
	"empty-type": EmptyType;
	aliased: Aliased;
}
let { ..._ }: Props = $props();
</script>
