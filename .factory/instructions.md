House rules for the agents of this project. Everything here adds to your role's rules and never relaxes them. Replace the examples with your own.

Names in this project: a *reading* is the weather for one *city* (temperature, condition, humidity). Use these words in code, tests and comments.

## developer
- The API and the web share one contract (`GET /api/weather/{city}`). Change both sides and both sets of tests in the same pull request.
- API rules go in plain classes with an xUnit test; components never call `fetch` directly, they use `frontend/src/api.ts`.

## reviewer
- Reject a change to one side of the contract that leaves the other side or its tests behind.
- Reject a bug fix that comes without a test that fails without it.

## security
- Names come from strangers: check that every new input is length-limited on the API (not only in the form), and that nothing a visitor typed reaches a log message other than as a template argument.

## ux
- Every screen that waits for the API must show loading, error and success; check each one is reachable and readable at 320 px wide.
