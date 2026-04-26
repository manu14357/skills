---
name: datadog-logs
description: Query and filter Datadog logs from the shell using the Composio CLI. Run scoped log searches, pivot across services/environments, and export structured JSON for incident investigation and diagnostics.
compatibility:
  use-case: Log search, incident investigation, diagnostics, monitoring
  frameworks: Datadog, Composio CLI, log aggregation
---

# Datadog Logs

## Use This Skill When

- Investigating error spikes, latency regressions, or service failures
- Searching logs across services/environments without the Datadog UI
- Correlating deploys with log volume or error rate changes
- Building incident digests or automated monitoring alerts
- Analyzing request traces across services
- Extracting structured log data for reporting or downstream processing

## When NOT to Use

- Need real-time dashboards or long-term trending (use Datadog UI)
- Searching extremely large datasets (billion+ events)
- Datadog is not integrated or API keys unavailable
- Need to create custom metrics (use Datadog instrumentation instead)

## Context: Log Query Capability Maturity

**Undeveloped**: Manual Datadog UI navigation, screenshot pasting, unstructured results.

**Target**: Composio CLI queries for common patterns, JSON piping for analysis, single-service searches.

**Optimized**: Multi-step workflows, trace correlation across services, scheduled digests, automated alerting.

## Core Principle

**Logs are data.** Query them programmatically via CLI to get structured JSON, pivot across services/environments, and feed results into downstream analysis or alerts instead of clicking through the UI.

## Instructions

### Step 1: Install and Authenticate Composio

**Install Composio CLI:**
```bash
curl -fsSL https://composio.dev/install | bash
composio login
```

**Link Datadog:**
```bash
composio link datadog
# Prompts for: Datadog site (e.g., datadoghq.com or datadoghq.eu)
# Prompts for: API Key
# Prompts for: APP Key (must have logs_read scope)
```

**Verify connection:**
```bash
composio tools list datadog
```

### Step 2: Discover Available Datadog Actions

**Search for common actions:**

| Action | Purpose | Command |
|--------|---------|---------|
| Search Logs | Filter logs by query | `composio search "search logs" --toolkits datadog` |
| Aggregate Logs | Group/count logs | `composio search "aggregate logs" --toolkits datadog` |
| List Metrics | View available metrics | `composio search "list.*metrics" --toolkits datadog` |
| Get Event | Fetch specific event | `composio search "get event" --toolkits datadog` |
| Create Saved View | Save query template | `composio search "save.*view" --toolkits datadog` |

**Get schema for any action:**
```bash
composio tools get-schema DATADOG_SEARCH_LOGS
```

**Common action slugs:**
- `DATADOG_SEARCH_LOGS`
- `DATADOG_AGGREGATE_LOGS`
- `DATADOG_LIST_ACTIVE_METRICS`
- `DATADOG_GET_EVENT`

### Step 3: Basic Log Queries

**Format: Filter by service, status, environment, time range**

**Query errors from one service (last 15 minutes):**
```bash
composio execute DATADOG_SEARCH_LOGS -d '{
  "filter": {
    "query": "service:checkout status:error env:prod",
    "from": "now-15m",
    "to": "now"
  },
  "page": { "limit": 100 },
  "sort": "-timestamp"
}'
```

**Query logs from specific trace:**
```bash
composio execute DATADOG_SEARCH_LOGS -d '{
  "filter": {
    "query": "@trace_id:7f3a2b1c env:prod",
    "from": "now-1h",
    "to": "now"
  },
  "sort": "timestamp"
}'
```

**Query by environment and status:**
```bash
composio execute DATADOG_SEARCH_LOGS -d '{
  "filter": {
    "query": "env:staging status:warning",
    "from": "now-4h",
    "to": "now"
  },
  "page": { "limit": 200 }
}'
```

### Step 4: Aggregate and Analyze Logs

**Aggregate error count by endpoint:**
```bash
composio execute DATADOG_AGGREGATE_LOGS -d '{
  "filter": {
    "query": "service:checkout status:error",
    "from": "now-1h",
    "to": "now"
  },
  "group_by": [{ "facet": "@http.url_path", "limit": 20 }],
  "compute": [{ "aggregation": "count" }]
}'
```

**Group errors by host/service:**
```bash
composio execute DATADOG_AGGREGATE_LOGS -d '{
  "filter": {
    "query": "status:error",
    "from": "now-2h",
    "to": "now"
  },
  "group_by": [
    { "facet": "service", "limit": 10 },
    { "facet": "host", "limit": 50 }
  ],
  "compute": [{ "aggregation": "count" }]
}'
```

### Step 5: Pipe Results to Local Analysis

**Extract and count error messages:**
```bash
composio execute DATADOG_SEARCH_LOGS -d '{
  "filter": { "query": "service:api status:error", "from": "now-30m", "to": "now" },
  "page": { "limit": 500 }
}' | jq -r '.data[].attributes.message' | sort | uniq -c | sort -rn | head
```

**Extract trace IDs from errors:**
```bash
composio execute DATADOG_SEARCH_LOGS -d '{
  "filter": { "query": "service:payment status:error", "from": "now-1h", "to": "now" },
  "page": { "limit": 100 }
}' | jq -r '.data[].attributes."@trace_id"'
```

**Format for reporting:**
```bash
composio execute DATADOG_SEARCH_LOGS -d '{
  "filter": { "query": "status:error", "from": "now-6h", "to": "now" },
  "page": { "limit": 1000 }
}' | jq -r '.data[] | "\(.timestamp) | \(.host) | \(.attributes.message)"'
```

### Step 6: Multi-Step Workflows

**Save as `scripts/incident-check.ts`:**

```typescript
const svc = process.argv[process.argv.indexOf("--service") + 1] || "api";
const hours = parseInt(process.argv[process.argv.indexOf("--hours") + 1] || "1");

// Fetch error samples
const errors = await execute("DATADOG_SEARCH_LOGS", {
  filter: {
    query: `service:${svc} status:error`,
    from: `now-${hours}h`,
    to: "now"
  },
  page: { limit: 200 },
  sort: "-timestamp"
});

// Aggregate by endpoint
const topPaths = await execute("DATADOG_AGGREGATE_LOGS", {
  filter: {
    query: `service:${svc} status:error`,
    from: `now-${hours}h`,
    to: "now"
  },
  group_by: [{ facet: "@http.url_path", limit: 10 }],
  compute: [{ aggregation: "count" }]
});

// Aggregate by host
const topHosts = await execute("DATADOG_AGGREGATE_LOGS", {
  filter: {
    query: `service:${svc} status:error`,
    from: `now-${hours}h`,
    to: "now"
  },
  group_by: [{ facet: "host", limit: 5 }],
  compute: [{ aggregation: "count" }]
});

console.log(JSON.stringify({
  service: svc,
  timespan: `${hours}h`,
  error_count: errors.data?.length || 0,
  top_errors: errors.data?.slice(0, 5).map(e => e.attributes.message),
  error_paths: topPaths.data,
  error_hosts: topHosts.data
}, null, 2));
```

**Run the workflow:**
```bash
composio run --file scripts/incident-check.ts -- --service checkout --hours 2
```

### Step 7: Save Queries and Automate Alerts

**Create reusable saved query:**
```bash
composio execute DATADOG_CREATE_SAVED_VIEW -d '{
  "name": "checkout-errors-prod",
  "description": "Production errors in checkout service",
  "query": "service:checkout status:error env:prod"
}'
```

**Schedule daily digest (cron example):**
```bash
#!/bin/bash
# Add to crontab: 0 9 * * * /path/to/daily-digest.sh

composio run --file scripts/incident-check.ts -- --service checkout --hours 24 > /tmp/digest.json

composio execute SLACK_SEND_MESSAGE -d "$(jq -n \
  --slurpfile digest /tmp/digest.json \
  '{channel: "oncall", text: "Daily Incident Report: \($digest[0] | tostring)"}')"
```

## Common Query Patterns

| Use Case | Query Example |
|----------|---------------|
| **Errors in service** | `service:api status:error` |
| **Specific environment** | `env:prod` or `env:staging` |
| **Response time threshold** | `@duration:[1000 TO *]` (>1s) |
| **HTTP status codes** | `@http.status:5xx` or `@http.status:404` |
| **User context** | `@user.id:12345` |
| **Request correlation** | `@trace_id:abc123def456` |
| **Combined filters** | `service:web env:prod status:error @duration:[1000 TO *]` |

## Troubleshooting

| Issue | Solution |
|-------|----------|
| **Empty results** | Verify `env:` and `service:` tags match your setup; confirm Datadog site region is correct |
| **403 Forbidden** | APP Key lacks `logs_read` scope; regenerate with correct permissions and re-link |
| **Slow queries** | Narrow `from/to` window; add additional filters; use `AGGREGATE_LOGS` instead of `SEARCH_LOGS` for large datasets |
| **Unknown facet** | Run `composio search "list log facets" --toolkits datadog` to discover available facets |
| **No logs indexed** | Ensure application is instrumented with Datadog agent; check that logs are being sent to Datadog |

## Output

**Deliver:**

1. **Structured JSON** from Datadog (via stdout)
2. **Piped analysis** results (error counts, top patterns)
3. **Automation-ready** format for downstream processing (alerts, reports, dashboards)