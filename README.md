[![CI](https://github.com/ertush/kmhfl-upgrade-alpha-ui/actions/workflows/ci.yml/badge.svg)](https://github.com/ertush/kmhfl-upgrade-alpha-ui/actions/workflows/ci.yml) [![CodeQL](https://github.com/ertush/kmhfl-upgrade-alpha-ui/actions/workflows/github-code-scanning/codeql/badge.svg)](https://github.com/ertush/kmhfl-upgrade-alpha-ui/actions/workflows/github-code-scanning/codeql)


# KMHFR Frontend

This is the frontend application for KMHFL with new features (GIS, Dynamic Reports). Phase 1 is to have it as a read-only data consumption app. Phase 2 and beyond is to add CRUD features.

## Tech stack

- Next.js
- Tailwind CSS

## API

Currently, this uses the test API available through [api.kmhfltest.health.go.ke](https://api.kmhfltest.health.go.ke).

## Preview

An on-premise test server is needed. Currently, you can preview the example live on [kmhfl3.vercel.app](https://kmhfl3.vercel.app):

## Setting up local instance

- Clone this repository ```git clone https://github.com/uonafya/kmhfl-upgrade-alpha-ui mfl3```
- cd into the folder ```cd mfl3```
- Make a copy of the ```.env``` file and add your environment variables as detailed ```cp .env.local.example .env.local && nano .env.local```
- Install dependencies ```npm install``` or ```yarn``` or ```(preferred) pnpm install```
- For local development, run ```npm run dev``` or ```yarn dev``` or ```(preferred) pnpm dev```


