<script lang="ts">
interface Data {
	foo: string;
	bar: number;
}
interface Props {
	data: Data;
}
let { ..._ }: Props = $props();
</script>
