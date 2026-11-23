# check: web-build

- step: 11, attempt 1
- started: 2026-11-23 17:49:49Z
- duration: 3.2 s
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
dist/index.html                   0.49 kB │ gzip:  0.30 kB
dist/assets/index-CsizoPxv.css    1.84 kB │ gzip:  0.77 kB
dist/assets/index-DJf9lFes.js   196.41 kB │ gzip: 61.73 kB
✓ built in 774ms
```
