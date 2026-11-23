# github:ai-sdlc-factory/ai-sdlc-factory-showcase#15: README and AGENTS.md describe an outdated API and a Vite proxy that does not exist

Published as a documentation pull request (round 1).

Written by the factory from what it sent to each agent and received back. The agents did not write this file.

| Step | What | Attempt | Outcome | Seconds |
| --- | --- | --- | --- | --- |
| 1 | [docs-writer](001-docs-writer.md) | 1 | accepted | 45.5 |
| 2 | [reviewer](002-reviewer.md) | 1 | accepted | 23.7 |
| 3 | [security](003-security.md) | 1 | accepted | 12 |

## Usage

Tokens as reported by OpenCode, by role (all attempts). Cost is what OpenCode reports; it is 0 with a ChatGPT login. The full list is in [usage.json](usage.json).

| Role | Model | Runs | Input | Output | Reasoning | Cache read | Total | Cost |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| docs-writer | openai/gpt-6.1-sol | 1 | 22678 | 1549 | 42 | 11776 | 36045 | 0.0000 |
| reviewer | openai/gpt-6.1-sol | 1 | 23206 | 565 | 24 | 20224 | 44019 | 0.0000 |
| security | openai/gpt-6.1-sol | 1 | 9395 | 200 | 0 | 4992 | 14587 | 0.0000 |
| **all** | | 3 | 55279 | 2314 | 66 | 36992 | **94651** | 0.0000 |
