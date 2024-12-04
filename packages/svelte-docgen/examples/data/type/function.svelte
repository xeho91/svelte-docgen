<script lang="ts">
type Baz = string | number;
type Aliased = () => void;
interface Props {
	void: () => void;
	returning: () => string;
	parametized: (foo: string, bar?: Baz) => boolean;
	// biome-ignore lint/suspicious/noExplicitAny: Testing
	spreaded: (...spread: any) => null;
	aliased: Aliased;
}
let { ..._ }: Props = $props();
</script>
