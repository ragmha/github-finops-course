# GitHub FinOps — Hands-on Labs

14 short labs that teach you how to read, allocate, forecast and cut GitHub spend (Actions, Codespaces, Packages, Copilot, Advanced Security). You use `gh` and `jq` against a sample bill, then adapt the exercises to your own data.

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
- Optional: appropriate organization or enterprise billing access for the "Run it for real" steps. API availability depends on the billing platform and account permissions.

## Sample assumptions

The fictional enterprise's September 2026 data is **not a historical bill or a price quote**. Rates and rules were checked against GitHub's published documentation on **2026-11-12**. Verify your account's current prices, entitlements, contract terms, and model availability before using these figures.

- Runner rates are Linux $0.006/min, Windows $0.010/min, macOS $0.062/min, and Linux 16-core $0.042/min. The sample applies a single $300 Enterprise Cloud compute allowance to eligible private runner usage; real eligible usage can also include cloud sandbox compute and memory. Jobs round up to whole minutes. [Actions billing](https://docs.github.com/en/billing/concepts/product-billing/github-actions) · [Runner pricing](https://docs.github.com/en/billing/reference/actions-runner-pricing)
- The sample has 85 distinct, full-month Copilot Business seats at $19 each, yielding 161,500 shared AI credits (85 × 1,900). Credit usage is synthetic and included in both `usage.json` and the model breakdown in `ai-usage.json`: **do not add the two totals**. AI credits are $0.01 each, but real consumption depends on tokens and model; extra usage depends on policy and budgets. [Copilot seats](https://docs.github.com/en/copilot/concepts/billing-and-usage/organizations-and-enterprises/seats-and-billing-cycles) · [AI model pricing](https://docs.github.com/en/copilot/reference/copilot-billing/models-and-pricing) · [Budgets](https://docs.github.com/en/copilot/concepts/billing-and-usage/organizations-and-enterprises/budgets)
- Copilot access is an optional, gradually rolling-out model for eligible enterprises: no incremental seat charge with an Enterprise Cloud license, or $10 per user per month for Copilot Standalone, with no included AI credits. As of the check date it was unavailable to self-service customers, GitHub Free/Team organizations, and self-service enterprise trials; an enterprise cannot mix it with Business/Enterprise. [Eligibility and plan comparison](https://docs.github.com/en/copilot/get-started/whats-changing-with-github-enterprise-and-copilot)
- Storage rates use 720 hours for the 30-day sample month, and round each synthetic line to cents. The sample omits storage and transfer allowances, other discounts, tax, and invoice adjustments. `monthlyBudgetUSD` is a fictional aggregate finance target, not a GitHub budget field. [Actions storage](https://docs.github.com/en/billing/concepts/product-billing/github-actions) · [Codespaces pricing](https://docs.github.com/en/billing/concepts/product-billing/github-codespaces)

## Using real billing data

- The sample is enterprise-wide and uses normalized identifiers. An [organization `/usage` report](https://docs.github.com/en/rest/billing/usage) covers that organization. Enterprise [`/usage`](https://docs.github.com/en/enterprise-cloud@latest/rest/billing/usage) defaults to usage with **no** cost center; [`/usage/summary`](https://docs.github.com/en/enterprise-cloud@latest/rest/billing/usage) defaults to all cost centers but returns aggregated fields, not daily repository rows. Request [enterprise detailed report exports](https://docs.github.com/en/enterprise-cloud@latest/rest/billing/usage-reports) for recorded attribution.
- Budget/query identifiers such as `actions_linux` are not necessarily response display labels such as `Actions Linux`. Inspect your report before filtering. The [SKU reference](https://docs.github.com/en/billing/reference/product-and-sku-names) lists `actions_linux_16_core`, while the [runner price table](https://docs.github.com/en/billing/reference/actions-runner-pricing) calls it `linux_16_core`. Check your account and API error details rather than assuming either label works everywhere.
- GitHub's [reporting tutorial](https://docs.github.com/en/enterprise-cloud@latest/billing/tutorials/automate-usage-reporting) says usage endpoints require a classic personal access token, while the [organization endpoint reference](https://docs.github.com/en/rest/billing/usage) documents fine-grained tokens with Administration read. The [enterprise reference](https://docs.github.com/en/enterprise-cloud@latest/rest/billing/usage) also permits an enterprise-installed GitHub App with Enterprise billing read. These authentication paths have not been verified against a live billing account.

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
