# City weather

A small .NET 10 API and React + Vite + TypeScript page showing **fixed, simulated**
weather readings for Riga, London, Oslo, Madrid and Cairo. No live provider or database.

## Run locally

Install the .NET 10 SDK and Node.js 22.12+ with npm. In one terminal, from the root:

```sh
dotnet run --project src/Weather.Api
```

The API listens at http://localhost:5080. In another terminal:

```sh
cd frontend
npm ci
npm run dev
```

Open http://127.0.0.1:5173. The client connects directly to http://localhost:5080;
there is no Vite proxy or Vite configuration file. In Development, the API allows
CORS only from http://127.0.0.1:5173 and http://localhost:5173. CORS is disabled
outside Development. For a different API origin, set `VITE_API_BASE_URL` when
starting Vite or building the page (for example `VITE_API_BASE_URL=http://127.0.0.1:5080 npm run dev`).
For deployment, configure that URL and serve the page and API from the same origin,
or explicitly configure trusted origins for the deployment.

## API contract

`GET /api/weather/Riga` returns:

```json
{"city":"Riga","temperatureC":12,"condition":"Cloudy","humidityPercent":75,"observedAt":"2026-01-15T09:00:00Z","feelsLikeC":10.5}
```

`observedAt` is a fixed, simulated UTC observation time, not the request time.
The page displays it using the browser's locale and local time zone.
`feelsLikeC` is a simulated Celsius value calculated as
`temperatureC - 0.1 * max(0, humidityPercent - 60)`, rounded to one decimal place.

Names are case-insensitive and surrounding spaces are trimmed. The original input
must be at most 60 characters and contain only Unicode letters, spaces, hyphens or
apostrophes. Missing, empty or invalid input returns 400; a valid but unknown city
returns 404. Both errors have the shape `{"error":"A descriptive message."}`.

`GET /api/cities` returns the supported city names in alphabetical order:

```json
[{"name":"Cairo"},{"name":"London"},{"name":"Madrid"},{"name":"Oslo"},{"name":"Riga"}]
```

## Checks

From the repository root:

```sh
dotnet build --nologo -v q
dotnet test --nologo -v q
```

From `frontend/`:

```sh
npm ci --no-audit --no-fund
npm run typecheck
npm test
npm run build
```

API tests use an in-memory server; web tests use mocked responses. No external
services are required. `npm test` runs once without watch mode.

## License

MIT, see [LICENSE](LICENSE). This is a showcase project made to demonstrate [AI SDLC Factory](https://github.com/ai-sdlc-factory/ai-sdlc-factory); it is provided as is, without warranty.
