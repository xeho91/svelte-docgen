<script>
/** @type {string} */
let title = "Header";
/** @type {string} */
let footnote = "This is a footnote";
/** @type {number} */
let clicked = 0;
</script>
<div>
	<slot name="header" {title}></slot>
	<slot>Fallback</slot>
	<slot name="buttons" {clicked}></slot>
	<slot name="footer" {footnote}></slot>
</div>
