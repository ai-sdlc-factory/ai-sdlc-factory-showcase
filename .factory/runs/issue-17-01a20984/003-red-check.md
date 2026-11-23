# check: reproduction fails

- step: 3, attempt 1
- started: 2026-11-23 17:48:12Z
- duration: 0 s
- outcome: failed as required
- exit code: 1

## Command

```text
npm --prefix frontend test -- src/App.test.tsx -t suggests only cities with a weather reading in the city hint
```

## Output (the end of it)

```text

> weather-web@0.1.0 test
> vitest run src/App.test.tsx -t suggests only cities with a weather reading in the city hint


[1m[46m RUN [49m[22m [36mv4.0.9 [39m[90m/workspace/frontend[39m

 [31m❯[39m src/App.test.tsx [2m([22m[2m6 tests[22m[2m | [22m[31m1 failed[39m[2m | [22m[33m5 skipped[39m[2m)[22m[32m 152[2mms[22m[39m
[31m     [31m×[31m suggests only cities with a weather reading in the city hint[39m[32m 151[2mms[22m[39m
     [2m[90m↓[39m[22m has a labelled input and starts without a result
     [2m[90m↓[39m[22m shows loading, then announces all reading fields after keyboard submission
     [2m[90m↓[39m[22m displays an integer feels-like value without a trailing decimal zero
     [2m[90m↓[39m[22m announces an error and allows a successful retry
     [2m[90m↓[39m[22m clears a previous success when the next request fails

[2m Test Files [22m [1m[31m1 failed[39m[22m[90m (1)[39m
[2m      Tests [22m [1m[31m1 failed[39m[22m[2m | [22m[33m5 skipped[39m[90m (6)[39m
[2m   Start at [22m 17:48:11
[2m   Duration [22m 877ms[2m (transform 77ms, setup 122ms, collect 97ms, tests 152ms, environment 391ms, prepare 4ms)[22m



[31m⎯⎯⎯⎯⎯⎯⎯[39m[1m[41m Failed Tests 1 [49m[22m[31m⎯⎯⎯⎯⎯⎯⎯[39m

[41m[1m FAIL [22m[49m src/App.test.tsx[2m > [22mweather search[2m > [22msuggests only cities with a weather reading in the city hint
[31m[1mError[22m: [2mexpect([22m[31melement[31m[2m).toHaveAccessibleDescription()[22m

Expected element to have accessible description:
[32m  Try Riga, London, Oslo, Madrid or Cairo.[31m
Received:
[31m  Try Riga, London, Oslo, Madrid or Paris.[31m[39m
[36m [2m❯[22m src/App.test.tsx:[2m16:59[22m[39m
    [90m 14| [39m  it('suggests only cities with a weather reading in the city hint', (…
    [90m 15| [39m    [34mrender[39m([33m<[39m[33mApp[39m [33m/[39m[33m>[39m)[33m;[39m
    [90m 16| [39m    expect(screen.getByRole('textbox', { name: 'City' })).toHaveAccess…
    [90m   | [39m                                                          [31m^[39m
    [90m 17| [39m      [32m'Try Riga, London, Oslo, Madrid or Cairo.'[39m[33m,[39m
    [90m 18| [39m    )[33m;[39m

[31m[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[1/1]⎯[22m[39m
```
