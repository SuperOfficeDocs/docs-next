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
cd Server
dotnet restore
```

Frontend
```bash
cd ClientApp
npm install
```

### 3. Run Development Servers

#### Backend (with API and proxy to frontend)

From docs-next/Server:
```bash
dotnet run
```

By default API runs at: http://localhost:5215/api. Any non-API request is proxied to the frontend dev server.

#### Frontend (Astro dev server)

From docs-next/ClientApp:

```bash
npm run dev
```

By default Frontend dev server runs at: http://localhost:4321. The backend proxies requests to it, so you only need to visit: http://localhost:5215

/api/... → handled by backend. 

Any other path → served by Astro dev server.

### 4. Run Production Build

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

### Notes
In development, run both servers:

    dotnet run (backend + proxy)

    npm run dev (frontend)

In production run only the backend. It serves the built frontend automatically from wwwroot.
