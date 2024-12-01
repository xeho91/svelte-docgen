<script lang="ts">
type Aliased = number & {};
interface Props {
	anonymous: string & {};
	aliased: Aliased;
}
let { ..._ }: Props = $props();
</script>
