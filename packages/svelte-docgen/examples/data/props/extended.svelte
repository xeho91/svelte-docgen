<script lang="ts">
import type { HTMLButtonAttributes } from "svelte/elements";

import type { CustomProps } from "./custom-extended.ts";

interface Props extends HTMLButtonAttributes, CustomProps {
	custom: string;
}
let { custom, ...rest }: Props = $props();
</script>
