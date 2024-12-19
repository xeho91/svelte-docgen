import { defaultTheme } from "@sveltepress/theme-default";
import { sveltepress } from "@sveltepress/vite";
import { defineConfig } from "vitest/config";

export default defineConfig({
	plugins: [
		sveltepress({
			siteConfig: {
				title: "svelte-docgen",
				description: "Lorem ipsum dolor sit amet",
			},
			theme: defaultTheme({
				logo: "/sveltepress.svg",
				github: "https://github.com/svelte-docgen/svelte-docgen",
				navbar: [
					// Add your navbar configs here
					{
						title: "Docs",
						to: "/docs/",
					},
					{
						title: "Examples",
						to: "/examples/",
					},
					{
						title: "Playground",
						to: "/playground/",
					},
				],
				sidebar: {
					// Add your sidebar configs here
				},
			}),
		}),
	],

	test: {
		include: ["src/**/*.{test,spec}.{js,ts}"],
	},
});
