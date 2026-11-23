# check: web-build

- step: 9, attempt 1
- started: 2026-11-23 17:01:25Z
- duration: 5.3 s
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
dist/index.html                   0.49 kB │ gzip:  0.30 kB
dist/assets/index-DgoE67Bm.css    1.79 kB │ gzip:  0.75 kB
dist/assets/index-5CkRexlh.js   195.89 kB │ gzip: 61.58 kB
✓ built in 1.26s
```
