# Weather (API + web)

## What this is
A tiny full-stack app: a .NET API that returns fixed, simulated weather readings for Riga, London, Oslo, Madrid and Cairo, and a React page that asks it for one. No live provider or database.

## Layout
- `src/Weather.Api`: ASP.NET Core API. `Program.cs` maps routes; `WeatherReport.cs` holds the business rule
- `tests/Weather.Api.Tests`: xUnit tests, including API tests that start the app in memory
- `frontend/`: Vite + React + TypeScript. `src/api.ts` is the only code that talks to the API; `src/App.tsx` is the screen
- `Weather.slnx`: the .NET solution; `dotnet build` and `dotnet test` at the root cover the API
- `e2e/`: configured in `.factory/project.json` for end-to-end tests (`Api.E2E` for the API, `ui` for Playwright); not present in this checkout or part of the solution

## Build and test
- API: `dotnet build --nologo -v q` and `dotnet test --nologo -v q` (from the root)
- Web: `cd frontend && npm ci && npm run typecheck && npm test && npm run build`
- Run: `dotnet run --project src/Weather.Api` (http://localhost:5080), then `cd frontend && npm run dev` (http://127.0.0.1:5173). The client calls http://localhost:5080 directly; there is no Vite proxy or Vite configuration file. Override the API origin with `VITE_API_BASE_URL` when starting Vite or building. In Development, the API allows CORS from http://127.0.0.1:5173 and http://localhost:5173 only; CORS is disabled outside Development.
The factory runs the commands under `gates` in `.factory/project.json` (the web ones inside `frontend/`). If this file and the gates disagree, the gates win. Tests must use in-memory fakes rather than require external services.

## Conventions
- API: .NET 10, nullable on, warnings are errors. Business rules in plain classes, not in route handlers. Bad input is a `400` with `{"error": "..."}`.
- Web: React function components and hooks, TypeScript `strict`, no `any`. Components never call `fetch` directly; they use `src/api.ts`.
- `GET /api/weather/{city}` returns six fields: `city`, `temperatureC`, `condition`, `humidityPercent`, `observedAt` (fixed UTC observation time) and `feelsLikeC` (simulated Celsius value). Invalid or missing input returns `400`; a valid but unknown city returns `404`, both with `{"error": "..."}`. See README for the example and calculation. Change both sides and both sets of tests together.
- `GET /api/cities` returns supported city objects in alphabetical order: `[{"name":"Cairo"},{"name":"London"},{"name":"Madrid"},{"name":"Oslo"},{"name":"Riga"}]`.
- No new dependencies unless the ticket needs one; say why in the pull request.

## Accessibility and UX
- Every input has a visible `<label>`; results are announced with `role="status"`; real buttons; everything works with the keyboard.
- Handle loading, error and success states. Text contrast at least 4.5:1. Layouts work from 320 px wide.

## Testing
- xUnit for the API, Vitest and Testing Library for the web. Test behaviour, not implementation details. Every change in behaviour comes with a test; a bug fix includes a test that fails without the fix.

## Do not touch
- `e2e/`: the end-to-end tests belong to the `/qa` run, and only it may change them. If one fails, fix the application, not the test.
- `**/Migrations/**`, `global.json` (the SDK version) and `frontend/vite.config.ts`: a person changes these.
