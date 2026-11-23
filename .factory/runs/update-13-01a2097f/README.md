# github:ai-sdlc-factory/ai-sdlc-factory-showcase#13: Add a footer with the app version

Pushed as an update of pull request #13 (round 1).

Written by the factory from what it sent to each agent and received back. The agents did not write this file.

| Step | What | Attempt | Outcome | Seconds |
| --- | --- | --- | --- | --- |
| 1 | [merge-resolver](001-merge-resolver.md) | 1 | accepted | 57.8 |
| 2 | [check: api-build](002-gate-api-build.md) | 1 | passed | 7.5 |
| 3 | [check: api-test](003-gate-api-test.md) | 1 | passed | 9.9 |
| 4 | [check: web-install](004-gate-web-install.md) | 1 | passed | 4.7 |
| 5 | [check: web-typecheck](005-gate-web-typecheck.md) | 1 | passed | 2.5 |
| 6 | [check: web-test](006-gate-web-test.md) | 1 | passed | 3 |
| 7 | [check: web-build](007-gate-web-build.md) | 1 | passed | 3.8 |
| 8 | [reviewer](008-reviewer.md) | 1 | accepted | 12.3 |
| 9 | [security](009-security.md) | 1 | accepted | 9.1 |

## Usage

Tokens as reported by OpenCode, by role (all attempts). Cost is what OpenCode reports; it is 0 with a ChatGPT login. The full list is in [usage.json](usage.json).

| Role | Model | Runs | Input | Output | Reasoning | Cache read | Total | Cost |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| merge-resolver | openai/gpt-6.1-sol | 1 | 12924 | 611 | 0 | 47232 | 60767 | 0.0000 |
| reviewer | openai/gpt-6.1-sol | 1 | 13420 | 194 | 22 | 3584 | 17220 | 0.0000 |
| security | openai/gpt-6.1-sol | 1 | 6098 | 146 | 0 | 3968 | 10212 | 0.0000 |
| **all** | | 3 | 32442 | 951 | 22 | 54784 | **88199** | 0.0000 |
