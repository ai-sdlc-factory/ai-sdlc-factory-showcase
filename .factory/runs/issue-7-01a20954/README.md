# github:ai-sdlc-factory/ai-sdlc-factory-showcase#7: Add a footer with the app version

Published as a pull request after every check and review passed (build round 1).

Written by the factory from what it sent to each agent and received back. The agents did not write this file.

| Step | What | Attempt | Outcome | Seconds |
| --- | --- | --- | --- | --- |
| 1 | [analyst](001-analyst.md) | 1 | accepted | 34 |
| 2 | [coverage](002-coverage.md) | 1 | accepted | 69.6 |
| 3 | [architect](003-architect.md) | 1 | accepted | 40.4 |
| 4 | [developer](004-developer.md) | 1 | accepted | 119.9 |
| 5 | [check: api-build](005-gate-api-build.md) | 1 | passed | 22.6 |
| 6 | [check: api-test](006-gate-api-test.md) | 1 | passed | 27.8 |
| 7 | [check: web-install](007-gate-web-install.md) | 1 | passed | 13.7 |
| 8 | [check: web-typecheck](008-gate-web-typecheck.md) | 1 | passed | 5.4 |
| 9 | [check: web-test](009-gate-web-test.md) | 1 | passed | 7.1 |
| 10 | [check: web-build](010-gate-web-build.md) | 1 | passed | 7 |
| 11 | [reviewer](011-reviewer.md) | 1 | accepted | 15 |
| 12 | [security](012-security.md) | 1 | accepted | 25.2 |
| 13 | [ux](013-ux.md) | 1 | accepted | 24.5 |
| 14 | [acceptance](014-acceptance.md) | 1 | accepted | 23 |

## Usage

Tokens as reported by OpenCode, by role (all attempts). Cost is what OpenCode reports; it is 0 with a ChatGPT login. The full list is in [usage.json](usage.json).

| Role | Model | Runs | Input | Output | Reasoning | Cache read | Total | Cost |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| analyst | openai/gpt-6.1-sol | 1 | 5873 | 473 | 60 | 11136 | 17542 | 0.0000 |
| coverage | openai/gpt-6.1-sol | 1 | 7481 | 581 | 60 | 11776 | 19898 | 0.0000 |
| architect | openai/gpt-6.1-sol | 1 | 11870 | 1254 | 79 | 7680 | 20883 | 0.0000 |
| developer | openai/gpt-6.1-sol | 1 | 21035 | 1147 | 14 | 46848 | 69044 | 0.0000 |
| reviewer | openai/gpt-6.1-sol | 1 | 13962 | 249 | 25 | 0 | 14236 | 0.0000 |
| security | openai/gpt-6.1-sol | 1 | 15141 | 254 | 0 | 0 | 15395 | 0.0000 |
| ux | openai/gpt-6.1-sol | 1 | 8406 | 242 | 0 | 4224 | 12872 | 0.0000 |
| acceptance | openai/gpt-6.1-sol | 1 | 13209 | 528 | 0 | 0 | 13737 | 0.0000 |
| **all** | | 8 | 96977 | 4728 | 238 | 81664 | **183607** | 0.0000 |
