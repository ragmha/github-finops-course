# GitHub FinOps — Hands-on Labs

14 short labs that teach you how to read, allocate, forecast and cut GitHub spend (Actions, Codespaces, Packages, Copilot, Advanced Security). You use real `gh` and `jq` against a sample bill, then run the same steps on your own org.

**▶ Start the course: <https://ragmha.github.io/github-finops-course/>**

[![Test and publish](https://github.com/ragmha/github-finops-course/actions/workflows/pages.yml/badge.svg)](https://github.com/ragmha/github-finops-course/actions/workflows/pages.yml)

## Three ways to take it

| Option | How |
| --- | --- |
| **Browser** | Open the [course site](https://ragmha.github.io/github-finops-course/). Download the lab files from lab 0, then run the commands in a terminal. Your progress is saved in the browser. |
| **GitHub Copilot app (canvas)** | [**Open in GitHub Copilot app**](https://github.com/copilot/app/launch?open=ghapp%3A%2F%2Fsession%2Fnew%3Frepo%3Dragmha%252Fgithub-finops-course%26mode%3Dinteractive%26prompt%3DOpen%2520the%2520browser%2520canvas%2520at%2520https%253A%252F%252Fragmha.github.io%252Fgithub-finops-course%252F%2520and%2520coach%2520me%2520through%2520the%2520GitHub%2520FinOps%2520labs%2520from%2520the%2520start.%2520Generate%2520the%2520lab%2520files%2520with%2520%2560node%2520test.mjs%2520data%2560%252C%2520then%2520help%2520me%2520run%2520each%2520step%2520in%2520lab%252F%2520without%2520revealing%2520answers%2520unless%2520I%2520ask.) starts a new session on this repo. Copilot opens the course in a browser canvas beside the chat and coaches you through it. Every lab page also has an **Open in GitHub Copilot app** link that jumps straight to that lab. You confirm the session in the app before anything runs. |
| **Offline** | Clone the repo and open `index.html` in a browser. It is a single file with no build step and no network calls (except the doc links). |

## Requirements

- [`gh`](https://cli.github.com/) and [`jq`](https://jqlang.org/) for the labs.
- Node 18+ for `test.mjs`.
- Optional: org owner or billing manager access for the "Run it for real" steps.

## Labs

| # | Lab | # | Lab |
| --- | --- | --- | --- |
| 0 | [Set up your lab](https://ragmha.github.io/github-finops-course/#setup) | 7 | [Storage: the silent cost](https://ragmha.github.io/github-finops-course/#storage) |
| 1 | [Read the bill (gross vs net)](https://ragmha.github.io/github-finops-course/#bill) | 8 | [Copilot seat hygiene](https://ragmha.github.io/github-finops-course/#copilot) |
| 2 | [Where does the money go?](https://ragmha.github.io/github-finops-course/#product) | 9 | [Copilot AI credits by model](https://ragmha.github.io/github-finops-course/#ai) |
| 3 | [Allocation & cost centers](https://ragmha.github.io/github-finops-course/#alloc) | 10 | [Advanced Security licences](https://ragmha.github.io/github-finops-course/#ghas) |
| 4 | [Forecast before the month ends](https://ragmha.github.io/github-finops-course/#forecast) | 11 | [Admin guardrails & audit](https://ragmha.github.io/github-finops-course/#guardrails) |
| 5 | [Actions hotspot & runner what-if](https://ragmha.github.io/github-finops-course/#actions) | 12 | [Automate: budget alert script](https://ragmha.github.io/github-finops-course/#alert) |
| 6 | [Catch runaway spend](https://ragmha.github.io/github-finops-course/#anomaly) | 13 | [Capstone: your real org](https://ragmha.github.io/github-finops-course/#capstone) |

## Development

```sh
node test.mjs        # runs every lab's jq solution against the sample data and checks the answer checker
node test.mjs data   # writes the sample lab files to ./lab (gitignored)
```

- `index.html` is the whole course. The `<script id="core">` block holds the sample data generator, the labs and the answer checker. It has no DOM code, so `test.mjs` can load it in Node.
- Pushes to `main` run `.github/workflows/pages.yml`. It runs `node test.mjs`, then deploys the repo root to GitHub Pages. Pull requests run the tests only.

The sample data is synthetic, for a fictional enterprise called "acme". Prices are illustrative, so always check [GitHub Docs](https://docs.github.com/billing) for current rates.
