# github:ai-sdlc-factory/ai-sdlc-factory-showcase#17: The hint under the city field suggests Paris, which is not supported

Published as a pull request after every check and review passed (build round 1).

Written by the factory from what it sent to each agent and received back. The agents did not write this file.

| Step | What | Attempt | Outcome | Seconds |
| --- | --- | --- | --- | --- |
| 1 | [bug-analyst](001-bug-analyst.md) | 1 | accepted | 68.5 |
| 2 | [reproducer](002-reproducer.md) | 1 | accepted | 37.8 |
| 3 | [check: reproduction fails](003-red-check.md) | 1 | failed as required | 0 |
| 4 | [diagnostician](004-diagnostician.md) | 1 | accepted | 15 |
| 5 | [developer](005-developer.md) | 1 | accepted | 52.7 |
| 6 | [check: api-build](006-gate-api-build.md) | 1 | passed | 7 |
| 7 | [check: api-test](007-gate-api-test.md) | 1 | passed | 9 |
| 8 | [check: web-install](008-gate-web-install.md) | 1 | passed | 3.9 |
| 9 | [check: web-typecheck](009-gate-web-typecheck.md) | 1 | passed | 2.2 |
| 10 | [check: web-test](010-gate-web-test.md) | 1 | passed | 2.9 |
| 11 | [check: web-build](011-gate-web-build.md) | 1 | passed | 3.2 |
| 12 | [reviewer](012-reviewer.md) | 1 | accepted | 9.2 |
| 13 | [security](013-security.md) | 1 | accepted | 9.5 |

## Usage

Tokens as reported by OpenCode, by role (all attempts). Cost is what OpenCode reports; it is 0 with a ChatGPT login. The full list is in [usage.json](usage.json).

| Role | Model | Runs | Input | Output | Reasoning | Cache read | Total | Cost |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| bug-analyst | openai/gpt-6.1-sol | 1 | 5170 | 395 | 0 | 2560 | 8125 | 0.0000 |
| reproducer | openai/gpt-6.1-sol | 1 | 19064 | 580 | 27 | 38656 | 58327 | 0.0000 |
| diagnostician | openai/gpt-6.1-sol | 1 | 8024 | 385 | 0 | 3840 | 12249 | 0.0000 |
| developer | openai/gpt-6.1-sol | 1 | 19653 | 477 | 0 | 34688 | 54818 | 0.0000 |
| reviewer | openai/gpt-6.1-sol | 1 | 7006 | 150 | 0 | 3456 | 10612 | 0.0000 |
| security | openai/gpt-6.1-sol | 1 | 10703 | 150 | 0 | 0 | 10853 | 0.0000 |
| **all** | | 6 | 69620 | 2137 | 27 | 83200 | **154984** | 0.0000 |
