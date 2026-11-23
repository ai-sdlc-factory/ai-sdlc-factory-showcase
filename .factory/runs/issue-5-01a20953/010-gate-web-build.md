# check: web-build

- step: 10, attempt 1
- started: 2026-11-23 17:01:29Z
- duration: 5.4 s
- outcome: passed
- exit code: 0

## Command

```text
(in frontend) npm run build
```

## Output (the end of it)

```text

> weather-web@1.0.0 build
> tsc --noEmit && vite build

vite v7.2.2 building client environment for production...
transforming...
✓ 30 modules transformed.
rendering chunks...
computing gzip size...
dist/index.html                   0.49 kB │ gzip:  0.31 kB
dist/assets/index-ByNtEnI9.css    1.24 kB │ gzip:  0.61 kB
dist/assets/index-DrjBESKT.js   196.16 kB │ gzip: 61.68 kB
✓ built in 959ms
```
