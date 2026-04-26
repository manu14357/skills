---
name: connect-apps
description: Connect Claude to 1000+ external applications via Composio CLI. Send emails, create issues, post messages, and execute actions across Gmail, Slack, GitHub, Notion, and more from the terminal.
compatibility:
  use-case: App integration, action automation, cross-app workflows
  frameworks: Composio CLI, Gmail, Slack, GitHub, Notion, 1000+ services
---

# Connect Apps

## Use This Skill When

- User wants to send emails, messages, or notifications through Claude
- Creating issues, tasks, or tickets in external systems
- Posting to Slack, Discord, Teams, or other chat platforms
- Reading data from or writing data to Notion, Sheets, Airtable
- Executing multi-step workflows across connected apps
- Automating repetitive actions in external tools
- Integrating Claude with company's existing app ecosystem

## When NOT to Use

- User wants to understand app APIs (use documentation directly)
- Composio CLI not installed or accessible
- App does not have Composio integration available
- Offline or local-only tasks without external app integration
- Simple data transformations (no external action needed)

## Context: Integration Maturity

**Undeveloped**: Manual app interactions, copy-paste between tools, no automation.

**Target**: Single app connected, basic actions executable (send email, create issue).

**Optimized**: Multi-app workflows, parallel execution, error handling, production-grade automation.

## Core Principle

Composio bridges Claude and external apps, enabling real actions—not just text generation. Authenticate once, then execute 1000+ actions across services seamlessly.

## Prerequisites

1. **Install Composio CLI:**
   ```bash
   curl -fsSL https://composio.dev/install | bash
   ```

2. **Authenticate:**
   ```bash
   composio login
   composio whoami
   ```

3. **Link Required Apps:**
   ```bash
   composio link gmail
   composio link slack
   composio link github
   composio link notion
   ```

## Instructions

### Step 1: Discover Available Actions

**Search for what you want to do:**

```bash
composio search "send an email"
composio search "create a github issue"
composio search "post a message to slack"
```

**List all actions for a toolkit:**

```bash
composio tools list gmail
composio tools list slack
composio tools list github
```

**Get action schema (required inputs):**

```bash
composio execute GMAIL_SEND_EMAIL --get-schema
composio execute SLACK_SEND_MESSAGE --get-schema
```

### Step 2: Prepare Action Inputs

**Dry-run before executing** (test without actually performing action):

```bash
composio execute GMAIL_SEND_EMAIL --dry-run -d '{
  "recipient_email": "user@example.com",
  "subject": "Test",
  "body": "Hello"
}'
```

**Common Action Patterns:**

| Use Case | Action | Required Inputs |
|----------|--------|-----------------|
| Send email | `GMAIL_SEND_EMAIL` | recipient_email, subject, body |
| Post message | `SLACK_SEND_MESSAGE` | channel_id, text |
| Create issue | `GITHUB_CREATE_ISSUE` | owner, repo, title, body |
| Create page | `NOTION_CREATE_PAGE` | parent_id, title, properties |
| Add row | `AIRTABLE_CREATE_RECORDS` | base_id, table_id, fields |

### Step 3: Execute Single Action

**Basic execution:**

```bash
composio execute GMAIL_SEND_EMAIL -d '{
  "recipient_email": "user@example.com",
  "subject": "From Claude",
  "body": "This email was sent by Claude through Composio!"
}'
```

**With error handling:**

```bash
composio execute SLACK_SEND_MESSAGE -d '{
  "channel_id": "C123456",
  "text": "Deployment complete"
}' && echo "Message sent!" || echo "Failed"
```

### Step 4: Execute Multiple Actions (Parallel)

**Run multiple actions simultaneously:**

```bash
composio execute --parallel \
  GMAIL_FETCH_EMAILS -d '{"max_results": 5}' \
  SLACK_SEND_MESSAGE -d '{"channel_id": "C123", "text": "Started"}' \
  GITHUB_GET_THE_AUTHENTICATED_USER -d '{}'
```

### Step 5: Build Multi-Step Workflows

**Create a workflow script (JavaScript/TypeScript):**

```bash
composio run '
  // Step 1: Create GitHub issue
  const issue = await execute("GITHUB_CREATE_ISSUE", {
    owner: "acme",
    repo: "app",
    title: "Deploy to production",
    body: "Automated deployment"
  });
  
  // Step 2: Send Slack notification
  await execute("SLACK_SEND_MESSAGE", {
    channel_id: "C123",
    text: `Issue created: ${issue.html_url}`
  });
  
  // Step 3: Add to Notion
  await execute("NOTION_CREATE_PAGE", {
    parent_id: "parent-123",
    title: `Deploy Ticket #${issue.number}`,
    properties: { url: { url: issue.html_url } }
  });
  
  console.log("Workflow complete");
'
```

### Step 6: Handle Configuration

**Environment Variables:**

```bash
export COMPOSIO_API_KEY="your-key"              # For CI/CD
export COMPOSIO_BASE_URL="https://custom-url"   # Custom endpoint
export COMPOSIO_SESSION_DIR="/custom/path"      # Custom storage
export COMPOSIO_DISABLE_TELEMETRY=true         # Privacy opt-out
```

**Global Logging:**

```bash
composio --log-level debug execute GMAIL_SEND_EMAIL -d '{...}'
composio --log-level info tools list gmail
```

## Supported Services

**Email:** Gmail, Outlook, SendGrid, Mailgun, Brevo
**Chat:** Slack, Discord, Microsoft Teams, Telegram, Twilio
**Development:** GitHub, GitLab, Jira, Linear, Bitbucket
**Documents:** Notion, Google Docs, Confluence, OneNote
**Data:** Google Sheets, Airtable, Postgres, MySQL
**1000+ more:** Check [Composio platform](https://platform.composio.dev)

## Troubleshooting

| Problem | Solution |
|---------|----------|
| "Not logged in" | `composio login` and follow browser auth |
| "Connection required for <toolkit>" | `composio link <toolkit>` to authenticate |
| "Unknown action slug" | `composio search "<goal>"` to find right action |
| "Bad inputs / validation error" | `composio execute <SLUG> --get-schema` to see required fields |
| "Action failed / permission denied" | Check permissions in the target app (Gmail, Slack, etc.) |
| "CLI not found" | Reinstall: `curl -fsSL https://composio.dev/install \| bash` |

## Advanced Patterns

**Retry on failure:**

```bash
for i in {1..3}; do
  composio execute SLACK_SEND_MESSAGE -d '{"channel_id":"C123","text":"msg"}' && break
  sleep 5
done
```

**Pipe data between actions:**

```bash
EMAILS=$(composio execute GMAIL_FETCH_EMAILS -d '{"max_results":1}')
composio execute SLACK_SEND_MESSAGE -d '{"channel_id":"C123","text":"'"${EMAILS}"'"}'
```

**Raw API proxy (when no dedicated tool exists):**

```bash
composio proxy https://api.service.com/v1/endpoint --toolkit google_docs
```

## Output

Provide:

1. **Connected Apps Confirmation**
   - List of successfully linked apps
   - Authentication status per app

2. **Action Inventory**
   - Available actions with full names (e.g., GMAIL_SEND_EMAIL)
   - Required inputs for each action
   - Example payloads

3. **Workflow Examples**
   - Single-action examples (email, message, issue)
   - Multi-step workflows (3+ coordinated actions)
   - Error handling patterns

4. **Integration Ready Checklist**
   - CLI installed ✓
   - Authentication complete ✓
   - Apps linked ✓
   - Dry-run successful ✓
