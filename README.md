# The Expanse

## 🚀 Project structure

Inside of your Astro project, you'll see the following folders and files:

```text
/
├── external-content
├── public/
├── src/
│   └── content.config.ts
│   └── content.schema.ts
│   └── assets/
│   └── components/
│   └── content/ (deprecated)
│   └── layouts/
│   └── media/
│   └── pages/
│       └── index.astro
│   └── plugins
│   └── reuse/
│   └── scripts/
│   └── styles/
│   └── types/
│   └── utils/
├── astro.config.mjs
└── package.json
```

Astro looks for `.astro` or `.md` files in the `src/pages/` directory. Each page is exposed as a route based on its file name.

Put any Astro/React/Vue/Svelte/Preact components in `src/components/`.

Any static assets can be placed in the `public/` directory. Put images referenced by content in `media/`.

## Getting started

### One-time setup

1. Clone docs-next
1. cd docs-next
1. mkdir external-content
1. cd external-content
1. Clone superoffice-docs and contribution
1. cd ../public
1. Clone downloads
1. cd ..

### Set up local build environment

1. Install Node.js - v18.20.8 or v20.3.0, v22.0.0 or higher. ( v19 and v21 are not supported.)
1. Install Astro: `npm install astro`.
1. Install/update dependencies: `npm install`.

NOTE: We're running on a beta release of astro_redirect_from, because the creator generously implemented a fix for us. Eventually, we'll switch to the official version.

To install just the fix: `npm i astro-redirect-from@1.4.0-beta.0`

I've requested additional modifications, so keep an eye out for updates.

### Increase memory

For some content collections, Astro needs more memory than the default settings.

We have modified the scripts in *package.json* like this (12GB):

```json
"build": "cross-env NODE_OPTIONS=\"--max-old-space-size=12288\" astro check && astro build",
```

Other ways to increase memory:

* `npm run build --max-old-space-size=12288`
* `set NODE_OPTIONS="--max-old-space-size=12288"` (before builds)
* `export NODE_OPTIONS="--max-old-space-size=12288"` (restart cli required)
* `setx NODE_OPTIONS "--max-old-space-size=12288"` (for/in VSCode)

## Build the site

1. `npm run build` (takes ca 6 minutes, depending on your hardware)

1. Optionally, inspect the generated HTML in the *dist* folder.

    * Redirect stubs from astro_redirect_from are in dist/docs-next.
    * Search indexes from pagefind are in dist/pagefind.

1. Preview the build: `npm run preview`

### Partial builds

At the time of writing, the build is split in 2 and controlled with `process.env.API_ONLY`. Locally, you have to choose one or the other:

* API only: crmscript and netserver-scripting references from automation (`$env:API_ONLY = "true"`)
* Main: everything else (`$env:API_ONLY = "false"`) - this is the default!

To see what's in each mode at any time, go to src/content.config.ts
The GitHub deployment runs both builds and stitch the files together before re-running pagefind (search index). This is orchestrated in .github/workflows/deploy.yml

Todo: create a script that mimics the github workflow locally to create a full build.

### Optionally check memory usage while building

```cmd
Get-Process node | Sort-Object WS -Descending | Select-Object -First 1
```

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

The **external-content** folder serves as a grafting point for content residing outside the docs-next repo.

To get up and running, `mkdir external-content` and clone superoffice-docs and contribution into this folder.

Remember to pull periodically to make sure you have the latest content.

Todo: create a small script that pulls both superoffice-docs, contribution, and downloads.
