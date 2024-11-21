<script>
/** @type {number} */
let number_value = 123;
let string_value = "abc";
</script>

<div>
	<slot number={number_value} string={string_value}></slot>
</div>
