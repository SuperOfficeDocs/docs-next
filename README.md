# The Expanse

## 🚀 Project structure

Inside of your Astro project, you'll see the following folders and files:

```text
/
├── public/
├── src/
│   └── assets/
│   └── components/
│   └── content/
│   └── layouts/
│   └── media/
│   └── pages/
│       └── index.astro
│   └── reuse/
│   └── scripts/
│   └── styles/
└── package.json
```

Astro looks for `.astro` or `.md` files in the `src/pages/` directory. Each page is exposed as a route based on its file name.

Put any Astro/React/Vue/Svelte/Preact components in `src/components/`.

Any static assets can be placed in the `public/` directory. Put images referenced by content in `media/`.

## Look and feel

This project uses Tailwind CSS. SuperOffice colors are specified in tailwind.config.mjs.

## Internalization

TK

## Dependencies

See `package.json`.

## 🧞 Commands

All commands are run from the root of the project, from a terminal:

| Command                   | Action                                           |
| :------------------------ | :----------------------------------------------- |
| `npm install`             | Installs dependencies                            |
| `npm run dev`             | Starts local dev server at `localhost:4321`      |
| `npm run build`           | Build your production site to `./dist/`          |
| `npm run preview`         | Preview your build locally, before deploying     |
| `npm run astro ...`       | Run CLI commands like `astro add`, `astro check` |
| `npm run astro -- --help` | Get help using the Astro CLI                     |

## 👀 Want to learn more?

Feel free to check [our documentation](https://docs.astro.build) or jump into our [Discord server](https://astro.build/chat).

## External content

The external-content folder serves as a grafting point for content residing outside the docs-next repo.

To get up and running on the current code:

1. Clone superoffice-docs and contribution into this folder.
2. Add "YamlMime: SubCategory" on line 2 of contribution/index.yml. (only until the repo's we're pulling in become compliant)

To bring in more of the external content when building the site:

1. Define collections from this external content in src/content.config.ts
2. Add route-building and layout for each collection in src/pages.
