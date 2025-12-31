# Interop Control Plane Frontend

A Create React App (TypeScript) frontend for exercising the FastAPI control-plane endpoints.

## Prerequisites
- Node.js 18+
- NPM

## Environment configuration
1. Copy `.env.example` to `.env.local`.
2. Set `REACT_APP_API_BASE_URL` to your FastAPI host (for local dev: `http://localhost:8000`).
3. Restart the dev server after changing environment variables.

If the API base URL is missing, the UI will surface a configuration warning and block health checks and token/search triggers until it is set.

## Install & run
```bash
npm install
npm start
```

## Quality checks
```bash
npm run lint
npm run test
npm run build
```

> Note: Installing dependencies or running the scripts above requires access to npm and the CRA toolchain (`react-scripts`).

## Workflow guidance
- Health endpoints do not require authentication but still need the API base configured.
- Obtain a token before performing patient search or patient discovery triggers.
- Patient operations only return orchestration identifiers; no patient data is persisted in the frontend.
