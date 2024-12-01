<script lang="ts">
interface Props {
	value?: number;
	group?: string[];
	disabled?: boolean;
}
let {
	//
	value = $bindable(0),
	group = $bindable<string[]>([]),
}: Props = $props();
</script>
