<script lang="ts">
class Custom {
	foo: string;
	bar?: number;
	baz: string;

	constructor(foo: string, bar?: number, baz = "hello") {
		this.foo = foo;
		this.bar = bar;
		this.baz = baz;
	}
}
interface Props {
	custom: Custom;
	date: Date;
	map: Map<string, number>;
	set: Set<string>;
}
let { ..._ }: Props = $props();
</script>
