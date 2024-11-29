<script>
/** @type {string} */
export let title;
</script>

<slot name="header" {title} />

<slot>Fallback body</slot>

<footer>
	<slot name="footer">
		<p>
			Created in 2024.<br>
			<small>For testing purposes.</small>
		</p>
	</slot>
</footer>
