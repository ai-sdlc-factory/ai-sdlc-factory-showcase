# check: qa-ui

- step: 6, attempt 1
- started: 2026-11-23 17:40:08Z
- duration: 14.1 s
- outcome: passed
- exit code: 0

## Command

```text
(in e2e/ui) sh -c npm ci --no-audit --no-fund && npx playwright test
```

## Output (the end of it)

```text

added 122 packages in 3s

Running 9 tests using 1 worker

  ✓  1 footer.spec.ts:25:1 › release metadata agrees with the visible production footer (150ms)
  ✓  2 footer.spec.ts:35:3 › footer remains after the reading through idle loading success error and retry at 320px (500ms)
  ✓  3 footer.spec.ts:35:3 › footer remains after the reading through idle loading success error and retry at 1280px (448ms)
  ✓  4 footer.spec.ts:93:3 › footer survives empty input and recovery (297ms)
  ✓  5 footer.spec.ts:93:3 › footer survives whitespace input and recovery (363ms)
  ✓  6 footer.spec.ts:93:3 › footer survives numeric input and recovery (343ms)
  ✓  7 footer.spec.ts:93:3 › footer survives long input and recovery (263ms)
  ✓  8 footer.spec.ts:106:1 › a rebuild takes its footer version from package metadata, not UI literals (113ms)
  ✓  9 footer.spec.ts:114:1 › existing mocked API component suite covers the footer states and ordering (1.7s)

  9 passed (7.0s)

npm warn deprecated whatwg-encoding@3.1.1: Use @exodus/bytes instead for a more spec-conformant and faster implementation
Skipping host requirements validation logic because `PLAYWRIGHT_SKIP_VALIDATE_HOST_REQUIREMENTS` env variable is set.
```
