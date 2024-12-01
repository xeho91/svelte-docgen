<script lang="ts">
type Baz = string | number;
interface Props {
	void: () => void;
	returning: () => string;
	parametized: (foo: string, bar?: Baz) => boolean;
	// biome-ignore lint/suspicious/noExplicitAny: Testing
	spreaded: (...spread: any) => null;
}
let { ..._ }: Props = $props();
</script>
