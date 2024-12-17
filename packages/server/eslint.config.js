export default [
	{
		name: "@svelte-docgen/server",
		languageOptions: {
			globals: {
				bun: "readonly",
				deno: "readonly",
				node: "readonly",
			},
		},
	},
];
