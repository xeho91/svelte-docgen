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
interface Props {
	a: A;
	b: B;
}
let { ..._ }: Props = $props();
</script>
