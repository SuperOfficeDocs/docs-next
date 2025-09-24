# ASP.NET Core Backend + Astro Frontend

This repository contains two main projects:

- **Backend**: ASP.NET Core Web API (serves APIs in Development and frontend + API's in Production).
- **Frontend**: Astro application (served via dev server in development; built and served from `wwwroot` in production).

## Project Structure
```
/docs-next
├──ClientApp/ # Astro frontend
├──Server/ # ASP.NET Core Backend
└──...
```

## Development Setup

### 1. Prerequisites
- [.NET 9 SDK](https://dotnet.microsoft.com/download)
- [Node.js (LTS or latest)](https://nodejs.org/en/)
- [npm](https://www.npmjs.com/)


### 2. Install dependencies

#### Backend

```bash
cd Source/SuperOffice.DocsNext
dotnet restore
```

Frontend
```bash
cd Source/SuperOffice.DocsNext/ClientApp
npm install
```

### 3. Clone external repos

You can either 
1. Manually clone or copy files of `SuperOfficeDocs/superoffice-docs` and `SuperOfficeDocs/contribution` repos into `ClientApp/src/external-content`

2. Use following script to clone or update the required external GitHub repositories into the `ClientApp/src/external-content/` directory. 
If a repository folder already exists, script will fetch and reset it to the latest commit on the `main` branch.

    ```bash
    cd Source/SuperOffice.DocsNext/ClientApp/build
    node setup-external-repos.js
    ```


### 4. Run Development Servers

#### Backend (with API and proxy to frontend)

From docs-next/Source/SuperOffice.DocsNext:
```bash
dotnet run
```

By default API runs at: http://localhost:5215/api. Any non-API request is proxied to the frontend dev server.

#### Frontend (Astro dev server)

From docs-next/Source/SuperOffice.DocsNext/ClientApp:

```bash
npm run dev
```

By default Frontend dev server runs at: http://localhost:4321. The backend proxies requests to it, so you only need to visit: http://localhost:5215

/api/... → handled by backend. 

Any other path → served by Astro dev server.

##### Reduce content during development (dev:partial)

To manage the content during development, npm command to run dev server with reduced content was introduced. This is useful when you only need to run the development server without the content from superoffice-docs. It uses a pre-defined enviornment variable (PARTIAL_BUILD) to disable content collections from rendering.

```bash
npm run dev:partial
```

### 5. Run Production Build

1. Build Backend (includes frontend)

From root:
```bash
dotnet publish -c Release -o out
```

2. Run Published App

```bash
cd out
dotnet docs-next.dll
```


API: https://localhost:5001/api/...
Frontend: served from wwwroot

#### Partial frontend build (build:partial)

To reduce build time when testing a build, npm command to do partial builds was introduced. This is useful when you only need to build the frontend without the content from superoffice-docs. It uses a pre-defined enviornment variable (PARTIAL_BUILD) to disable content collections from building.

```bash
npm run build:partial
```

### Notes
In development, run both servers:

    dotnet run (backend + proxy)

    npm run dev (frontend)

In production run only the backend. It serves the built frontend automatically from wwwroot.
