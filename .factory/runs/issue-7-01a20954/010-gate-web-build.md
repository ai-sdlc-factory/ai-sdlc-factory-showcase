# check: web-build

- step: 10, attempt 1
- started: 2026-11-23 17:01:19Z
- duration: 7 s
- outcome: passed
- exit code: 0

## Command

```text
(in frontend) npm run build
```

## Output (the end of it)

```text

> weather-web@0.1.0 build
> tsc --noEmit && vite build

vite v7.2.2 building client environment for production...
transforming...
✓ 31 modules transformed.
rendering chunks...
computing gzip size...
dist/index.html                   0.49 kB │ gzip:  0.31 kB
dist/assets/index-DvYUlBWG.css    1.28 kB │ gzip:  0.61 kB
dist/assets/index-ByJd6y8e.js   195.95 kB │ gzip: 61.61 kB
✓ built in 1.50s
```
