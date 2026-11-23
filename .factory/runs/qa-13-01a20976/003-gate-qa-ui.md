# check: qa-ui

- step: 3, attempt 1
- started: 2026-11-23 17:35:23Z
- duration: 6.4 s
- outcome: failed
- exit code: 1

## Command

```text
(in e2e/ui) sh -c npm ci --no-audit --no-fund && npx playwright test
```

## Output (the end of it)

```text

added 3 packages in 864ms
Error: Process from config.webServer was not able to start. Exit code: 1


[WebServer] npm error code ENOTCACHED
[WebServer] npm error request to https://registry.npmjs.org/xmlchars/-/xmlchars-2.2.0.tgz failed: cache mode is 'only-if-cached' but no cached response is available.
[WebServer] npm error A complete log of this run can be found in: /tmp/npm-cache/_logs/2026-11-23T17_35_28_485Z-debug-0.log
[WebServer] file:///workspace/e2e/ui/serve.mjs:9
[WebServer] if (install.status !== 0) throw new Error('Could not install the frontend from the local npm cache.');
[WebServer]                                 ^
[WebServer] 
[WebServer] Error: Could not install the frontend from the local npm cache.
[WebServer]     at [90mfile:///workspace/e2e/ui/[39mserve.mjs:9:33
[WebServer] [90m    at ModuleJob.run (node:internal/modules/esm/module_job:343:25)[39m
[WebServer] [90m    at async onImport.tracePromise.__proto__ (node:internal/modules/esm/loader:681:26)[39m
[WebServer] [90m    at async asyncRunEntryPointWithESMLoader (node:internal/modules/run_main:117:5)[39m
[WebServer] 
[WebServer] Node.js v22.23.5
--- the application log (last lines) ---
An issue was encountered verifying workloads. For more information, run "dotnet workload update".
Using launch settings from src/Weather.Api/Properties/launchSettings.json...
warn: Microsoft.AspNetCore.Hosting.Diagnostics[15]
      Overriding HTTP_PORTS '8080' and HTTPS_PORTS ''. Binding to values defined by URLS instead 'http://127.0.0.1:5080'.
info: Microsoft.Hosting.Lifetime[14]
      Now listening on: http://127.0.0.1:5080
info: Microsoft.Hosting.Lifetime[0]
      Application started. Press Ctrl+C to shut down.
info: Microsoft.Hosting.Lifetime[0]
      Hosting environment: Development
info: Microsoft.Hosting.Lifetime[0]
      Content root path: /workspace/src/Weather.Api
info: Microsoft.AspNetCore.Hosting.Diagnostics[1]
      Request starting HTTP/1.1 GET http://127.0.0.1:5080/api/weather/Riga - - -
info: Microsoft.AspNetCore.Routing.EndpointMiddleware[0]
      Executing endpoint 'HTTP: GET /api/weather/{city?}'
info: Microsoft.AspNetCore.Http.Result.OkObjectResult[1]
      Setting HTTP status code 200.
info: Microsoft.AspNetCore.Http.Result.OkObjectResult[3]
      Writing value of type 'WeatherReading' as Json.
info: Microsoft.AspNetCore.Routing.EndpointMiddleware[1]
      Executed endpoint 'HTTP: GET /api/weather/{city?}'
info: Microsoft.AspNetCore.Hosting.Diagnostics[2]
      Request finished HTTP/1.1 GET http://127.0.0.1:5080/api/weather/Riga - 200 - application/json;+charset=utf-8 57.7451ms
info: Microsoft.Hosting.Lifetime[0]
      Application is shutting down...
```
