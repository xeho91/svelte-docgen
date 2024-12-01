<script lang="ts">
interface Props {
	data: object;
	anonymous: { x: number; y?: number };
	strict: { readonly foo: string; readonly bar: number };
}
let { ..._ }: Props = $props();
</script>
