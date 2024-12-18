# Svelte Docgen

This project is a monorepo for `svelte-docgen` packages.

> [!TIP]
>
> 📣 **This project is attempting to compete at [SvelteHack 2024](https://hack.sveltesociety.dev/2024)!**
> See [announcement](https://github.com/svelte-docgen/svelte-docgen/discussions/11).

> [!WARNING]
> This project is still a work in progress. [See roadmap for `v1`](https://github.com/svelte-docgen/svelte-docgen/issues/5).

## Packages

| Package                                                                                        | Description                                                                                           |
| ---------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------- |
| [`svelte-docgen`](./packages/svelte-docgen)                                                    | Core package                                                                                          |
| `@svelte-docgen/cli` [🚧 Tracking](https://github.com/svelte-docgen/svelte-docgen/issues/9)    | Standalone CLI                                                                                        |
| [`@svelte-docgen/extractor`](./packages/extractor)                                             | Extracting types from `*.svelte` files to write your own                                              |
| `@svelte-docgen/server` [🚧 Tracking](https://github.com/svelte-docgen/svelte-docgen/issues/6) | Run a server which allows fetching docs on demand                                                     |
| [`vite-plugin-svelte-docgen`](./packages/vite-plugin-svelte-docgen)                            | [Vite](https://github.com/vitejs/vite) plugin which creates virtual files for your stories on demand. |

---

## Features

### Computed types

This project relies on [TypeScript Compiler API](https://www.typescriptlang.org/docs/handbook/compiler-api.html).
Thanks to it we're able to recognize actual _(computed)_ types.

> [!WARNING]
>
> Be mindful that starting **tsc** _(TypeScript Compiler)_ is slow at start, but after that is doing quite well.
> Hence why **we provide an ability to create a custom cache storage**,
> so there's no need to start a new program for parsing of every Svelte component file.

#### Recognized type kinds

Currently we recognize and support the following type kinds.

- `any`,
- `array`,
- `bigint`,
- `boolean`,
- `constructible`,
- `function`,
- `interface`,
- `intersection`,
- `literal`,
- `never`,
- `null`,
- `number`,
- `object`,
- `string`,
- `symbol`,
- `tuple`,
- `type-parameter`,
- `undefined`,
- `union`,
- `unknown`,
- `void`.

### Component documentation

It supports the root HTML comment with `@component` tag.
It can be described anywhere, and the first one found will be used.

#### Description

It extracts the description right after the `@component` tag.
[Example](./examples/component-documentation/description.svelte).

#### Tags

Like in JSDoc, tags are supported too!
Every line starting with `@<tag-name>` will be extracted as separate tag.
It's content can be empty, multi-line or with markdown. Just like [description](#description)!
[Example](./examples/component-documentation/tags.svelte).

> [!IMPORTANT]
> The root comment with tags needs to have `@component` tag too!

> [!TIP]
> Tags can be repetitive, e.g. `@example`.

### Legacy or modern?

Our extractor parser is capable to recognize _(based on provided source code)_ whether component is:

<ol type="a">
 <li><strong>legacy</strong> - uses legacy syntax features,</li>
 <li><strong>modern</strong> - assumed by default if no legacy syntax was found.</li>
</ol>

This information is provided via `isLegacy` boolean flag.

### Props

It extracts props from the `$props()` rune as map, since each one of them is unique.

#### Bindable

Properties which are [`bindable()`](https://svelte.dev/docs/svelte/$bindable) via rune,
and including the native ones are recognized as well!
Whether the prop is bindable, this information is provided via `isBindable` boolean flag.

```svelte
<script lang="ts">
  interface Props {
    value?: number;
  }
  let {
    value = $bindable(0), // 👈 It recognizes!
  }: Props = $props();
</script>
```

#### Event Handler

Our analyzer also recognizes properties which are **event handlers**.
These are following conditions to consider prop(s) as event handler(s):

1. it's type kind is `"function"`,
2. `<Name>EventHandler` or `EventHandler` type helpers from `"svelte/elements"` were used.

```svelte
<script lang="ts">
  import { MouseEventHandler } from "svelte/elements";

  interface Props {
    onclick?: MouseEventHandler;
    onkeyup?: EventHandlerL<KeyboardEvent>;
  }
  let { onclick, onkeyup }: Props = $props();
</script>
```

#### Extended

Properties extended to the props interface or type are included.
And more than that. **It also recognizes if the prop was extended by providing `isExtended` boolean flag!**

```svelte
<script lang="ts">
  import { HTMLButtonAttributes } from "svelte/elements";

  interface Props extends HTMLButtonAttributes {} /* 👈 They are included too! */
  let { disabled, "aria-hidden": aria_hidden, ...rest }: Props = $props();
</script>
```

#### Snippets

We provide an analyzer to see if the provided component property is a [snippet](https://svelte.dev/docs/svelte/snippet).
This is determined whether the prop was typed with [`Snippet`](https://svelte.dev/docs/svelte/snippet#Typing-snippets) type helper.

```svelte
<script lang="ts">
  import type { Snippet } from "svelte";
  interface Props {
    children: Snippet;
    footer?: Snippet<[string, number]>;
  }
</script>
```

Our parser provides this information via `isSnippet` boolean flag.

> [!TIP]
> And also, we provide a function helpet to make an easier access to get snippet parameters types with `getSnippetParameters()`.

### Legacy support for Svelte `v4`

- `events` - custom even handlers created with deprecated [`createEventDispatcher()`](https://svelte.dev/docs/svelte/svelte#createEventDispatcher),
- `exports` - exported constant variables inside the **instance** script tag, example:

  ```svelte
  <script>
    export const ID = "svelte-docgen"; // 👈 in Svelte prior to `v4` you could do it
  </script>
  ```

- `props` - exported with `export let <name>`,
- `slots` - legacy props and their props are supported as well.

> [!CAUTION]
> Currently we don't recognize yet whether slots are optional or not. [Tracking issue](https://github.com/svelte-docgen/svelte-docgen/issues/10).

### Other

> [!TIP]
>
> You haven't found a feature you're looking for?
> Take a look at [💡Ideas discussions](https://github.com/svelte-docgen/svelte-docgen/discussions/categories/ideas).
> If it still not there, then [please 🙏 share with us!](https://github.com/svelte-docgen/svelte-docgen/discussions/new?category=ideas)

---

## Contributing

Take a look at [contributing guide](./.github/CONTRIBUTING.md).

This project follows the [all-contributors](https://github.com/all-contributors/all-contributors) specification.
**Contributions of any kind are welcome!**

💌 to these people ([emoji key](https://allcontributors.org/docs/en/emoji-key)):

<!-- ALL-CONTRIBUTORS-LIST:START - Do not remove or modify this section -->
<!-- prettier-ignore-start -->
<!-- markdownlint-disable -->
<table>
  <tbody>
    <tr>
      <td align="center" valign="top" width="14.28%"><a href="https://github.com/xeho91"><img src="https://avatars.githubusercontent.com/u/18627568?v=4?s=50" width="50px;" alt="Mateusz Kadlubowski"/><br /><sub><b>Mateusz Kadlubowski</b></sub></a><br /><a href="https://github.com/svelte-docgen/svelte-docgen/commits?author=xeho91" title="Code">💻</a> <a href="#infra-xeho91" title="Infrastructure (Hosting, Build-Tools, etc)">🚇</a> <a href="#maintenance-xeho91" title="Maintenance">🚧</a></td>
      <td align="center" valign="top" width="14.28%"><a href="https://github.com/ciscorn"><img src="https://avatars.githubusercontent.com/u/5351911?v=4?s=50" width="50px;" alt="Taku Fukada"/><br /><sub><b>Taku Fukada</b></sub></a><br /><a href="https://github.com/svelte-docgen/svelte-docgen/commits?author=ciscorn" title="Code">💻</a></td>
    </tr>
  </tbody>
</table>

<!-- markdownlint-restore -->
<!-- prettier-ignore-end -->

<!-- ALL-CONTRIBUTORS-LIST:END -->

> [!NOTE]
> We put a lot of effort to make this project [e18e](https://e18e.dev/)-friendly.

### Support

If you don't have time, but you need this project to work, or resolve an existing issue, consider [sponsorship](https://github.com/sponsors/svelte-docgen).

---

## Authors

- Mateusz "[xeho91](https://github.com/xeho91)" Kadlubowski
- Taku "[ciscorn](https://github.com/ciscorn)" Fukada

> [!TIP]
> It can be you too! See [announcement](https://github.com/svelte-docgen/svelte-docgen/discussions/11).

## License

![Project License](https://img.shields.io/github/license/svelte-docgen/svelte-docgen?style=for-the-badge)

This project is licensed under the [MIT License](./LICENSE.md).
