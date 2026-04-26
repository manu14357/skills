---
name: deploy-pipeline
description: Coordinate end-to-end deployments across Stripe, Supabase, and Vercel using the Composio CLI. Update pricing, apply database migrations, deploy frontend, verify changes, and announce releases from a single script.
compatibility:
  use-case: Release management, multi-service deployments, full-stack product launches
  frameworks: Stripe, Supabase, Vercel, Composio CLI
---

# Deploy Pipeline (Stripe / Supabase / Vercel)

## Use This Skill When

- Full-stack product launch touching billing, database, and frontend
- Promoting a preview build to production with Stripe price updates and Supabase migrations
- Weekly release trains requiring repeatable, reliable deploy sequences
- Coordinating changes across multiple external services in strict order
- Need post-deploy verification and automated release announcements

## When NOT to Use

- Single-service deployments (use Vercel/Stripe/Supabase UIs)
- Manual, one-off changes without automation
- Deployments requiring complex approval workflows
- Services not integrated via Composio (unsupported platforms)

## Context: Pipeline Automation Maturity

**Undeveloped**: Manual steps across Stripe, Supabase, Vercel; no coordination; error-prone ordering.

**Target**: Composio CLI orchestration of Stripe → Supabase → Vercel in correct sequence with basic verification.

**Optimized**: Automated pipeline with rollback strategies, feature flags, comprehensive post-deploy checks, scheduled releases.

## Core Principle

**Order matters for full-stack releases.** Stripe → Supabase → Vercel ensures billing changes precede database migrations, and migrations precede frontend deployment. One coordinated script prevents cascading failures.

## Instructions

### Step 1: Install and Link Services

**Install Composio CLI:**
```bash
curl -fsSL https://composio.dev/install | bash
composio login
```

**Link all three services:**
```bash
composio link stripe
composio link supabase
composio link vercel
composio link slack        # For release announcements
```

### Step 2: Discover and Verify Actions

**Search available actions:**

| Service | Discovery Command |
|---------|------------------|
| Stripe | `composio search "create price" --toolkits stripe` |
| Supabase | `composio search "apply migration" --toolkits supabase` |
| Vercel | `composio search "create deployment" --toolkits vercel` |

**Common action slugs:**

```
STRIPE_CREATE_PRODUCT, STRIPE_CREATE_PRICE, STRIPE_UPDATE_PRODUCT
SUPABASE_LIST_PROJECTS, SUPABASE_RUN_SQL_QUERY, SUPABASE_APPLY_MIGRATION
VERCEL_CREATE_A_NEW_DEPLOYMENT, VERCEL_GET_A_DEPLOYMENT_BY_ID_OR_URL, VERCEL_PROMOTE_DEPLOYMENT
```

**Verify schemas:**
```bash
composio tools get-schema STRIPE_CREATE_PRICE
composio tools get-schema SUPABASE_APPLY_MIGRATION
composio tools get-schema VERCEL_CREATE_A_NEW_DEPLOYMENT
```

### Step 3: Execute Stripe Actions (Pricing & Products)

**Create new price:**
```bash
composio execute STRIPE_CREATE_PRICE -d '{
  "product": "prod_abc123",
  "unit_amount": 2900,
  "currency": "usd",
  "recurring": { "interval": "month" },
  "lookup_key": "team-plan-v2"
}'
```

**Update product metadata:**
```bash
composio execute STRIPE_UPDATE_PRODUCT -d '{
  "id": "prod_abc123",
  "name": "Team Plan v2",
  "description": "Enhanced team collaboration features"
}'
```

**List and verify prices:**
```bash
composio execute STRIPE_LIST_PRICES -d '{
  "product": "prod_abc123",
  "limit": 10
}' | jq '.data[] | {id, lookup_key, unit_amount}'
```

### Step 4: Execute Supabase Actions (Database Migrations)

**Apply database migration:**
```bash
composio execute SUPABASE_APPLY_MIGRATION -d '{
  "project_id": "abcxyz",
  "name": "add_team_tier_column",
  "query": "ALTER TABLE teams ADD COLUMN tier TEXT DEFAULT '"'"'free'"'"';"
}'
```

**Verify schema changes:**
```bash
composio execute SUPABASE_RUN_SQL_QUERY -d '{
  "project_id": "abcxyz",
  "query": "SELECT column_name FROM information_schema.columns WHERE table_name='"'"'teams'"'"' AND column_name='"'"'tier'"'"';"
}'
```

**Check for data issues:**
```bash
composio execute SUPABASE_RUN_SQL_QUERY -d '{
  "project_id": "abcxyz",
  "query": "SELECT COUNT(*) FROM teams WHERE tier IS NULL;"
}'
```

### Step 5: Execute Vercel Actions (Frontend Deployment)

**Create production deployment:**
```bash
composio execute VERCEL_CREATE_A_NEW_DEPLOYMENT -d '{
  "name": "web",
  "target": "production",
  "gitSource": {
    "type": "github",
    "ref": "main",
    "repoId": 123456
  }
}'
```

**Poll deployment status:**
```bash
composio execute VERCEL_GET_A_DEPLOYMENT_BY_ID_OR_URL -d '{
  "idOrUrl": "dpl_xxx"
}' | jq '.readyState'
```

**Wait for ready state (shell loop):**
```bash
DEPLOYMENT_ID="dpl_xxx"
while true; do
  STATE=$(composio execute VERCEL_GET_A_DEPLOYMENT_BY_ID_OR_URL -d "{\"idOrUrl\":\"$DEPLOYMENT_ID\"}" | jq -r '.readyState')
  [ "$STATE" = "READY" ] && break
  [ "$STATE" = "ERROR" ] && exit 1
  sleep 4
done
```

### Step 6: Post-Deployment Verification

**Health check:**
```bash
curl -fsS https://app.acme.com/api/health || exit 1
```

**Database verification:**
```bash
composio execute SUPABASE_RUN_SQL_QUERY -d '{
  "project_id": "abcxyz",
  "query": "SELECT COUNT(*) as total, COUNT(CASE WHEN tier IS NOT NULL THEN 1 END) as migrated FROM teams;"
}'
```

**Stripe verification:**
```bash
composio execute STRIPE_LIST_PRICES -d '{
  "product": "prod_abc123",
  "active": true
}' | jq '.data[].lookup_key'
```

### Step 7: Automate with Workflow File

**Create `scripts/ship.ts`:**

```typescript
const ref = process.argv[process.argv.indexOf("--ref") + 1] ?? "main";
const channel = process.argv[process.argv.indexOf("--channel") + 1] ?? "releases";

try {
  // Step 1: Stripe - Create price
  const price = await execute("STRIPE_CREATE_PRICE", {
    product: "prod_abc123",
    unit_amount: 2900,
    currency: "usd",
    recurring: { interval: "month" },
    lookup_key: "team-plan-v2"
  });
  console.log(`✓ Stripe price created: ${price.id}`);

  // Step 2: Supabase - Apply migration
  await execute("SUPABASE_APPLY_MIGRATION", {
    project_id: "abcxyz",
    name: "add_team_tier_column",
    query: "ALTER TABLE teams ADD COLUMN tier TEXT DEFAULT 'free';"
  });
  console.log(`✓ Supabase migration applied`);

  // Step 3: Vercel - Create deployment
  const dep = await execute("VERCEL_CREATE_A_NEW_DEPLOYMENT", {
    name: "web",
    target: "production",
    gitSource: { type: "github", ref, repoId: 123456 }
  });
  console.log(`✓ Vercel deployment created: ${dep.id}`);

  // Step 4: Wait for Vercel ready
  let state = "QUEUED";
  let attempts = 0;
  while (state !== "READY" && state !== "ERROR" && attempts < 60) {
    await new Promise(r => setTimeout(r, 4000));
    const d = await execute("VERCEL_GET_A_DEPLOYMENT_BY_ID_OR_URL", { idOrUrl: dep.id });
    state = d.readyState;
    attempts++;
  }
  if (state !== "READY") throw new Error(`Vercel deploy failed: ${state}`);
  console.log(`✓ Vercel deployment ready`);

  // Step 5: Announce
  await execute("SLACK_SEND_MESSAGE", {
    channel,
    text: `✅ *Production Release* — Ref: \`${ref}\`\nStripe: ${price.id}\nVercel: ${dep.url}`
  });
  console.log(`✓ Release announced on #${channel}`);

} catch (error) {
  console.error(`✗ Pipeline failed: ${error.message}`);
  await execute("SLACK_SEND_MESSAGE", {
    channel,
    text: `❌ *Release Failed* — ${error.message}`
  });
  throw error;
}
```

**Run the workflow:**
```bash
composio run --file scripts/ship.ts -- --ref main --channel releases
```

### Step 8: Rollback Strategy

**If verification fails, undo in reverse order:**

1. **Vercel**: Promote previous deployment
   ```bash
   composio execute VERCEL_PROMOTE_DEPLOYMENT -d '{
     "deploymentId": "dpl_previous"
   }'
   ```

2. **Supabase**: Apply down migration
   ```bash
   composio execute SUPABASE_APPLY_MIGRATION -d '{
     "project_id": "abcxyz",
     "name": "rollback_add_team_tier_column",
     "query": "ALTER TABLE teams DROP COLUMN tier;"
   }'
   ```

3. **Stripe**: Hide new price (don't delete)
   ```bash
   composio execute STRIPE_UPDATE_PRODUCT -d '{
     "id": "prod_abc123",
     "metadata": { "rollback": "true" }
   }'
   ```

4. **Announce rollback**
   ```bash
   composio execute SLACK_SEND_MESSAGE -d '{
     "channel": "releases",
     "text": "⚠️ Release rolled back due to verification failure"
   }'
   ```

## Troubleshooting

| Issue | Solution |
|-------|----------|
| **Stripe price visible but old price in checkout** | Cache issue on app side; verify `lookup_key` matches what checkout fetches |
| **Supabase migration hangs** | Another connection holds a lock; check: `SELECT pid, state FROM pg_stat_activity WHERE state <> 'idle';` |
| **Vercel deployment stuck in QUEUED** | Check build logs; verify git ref exists and permissions are set |
| **Frontend reads column before migration applies** | Never parallelize; always serialize Stripe → Supabase → Vercel |
| **Rollback partially failed** | Check Slack history for last successful state; manually verify each service |

## Output

**Deliver:**

1. **Deployment IDs and timestamps** for each service
2. **Verification results** (health checks, data counts)
3. **Slack announcement** with links to deployments
4. **Rollback reference** if needed for quick recovery