<script lang="ts">
interface Props {
	name?: string;
	id: number;
	location?: string;
}
let {
	//
	location = "terminal",
}: Props = $props();
</script>
