---
name: azure-diagnostics
description: >
  Diagnose Azure application and infrastructure issues with a structured, evidence-based workflow.
  Use this skill when users ask to troubleshoot outages, latency, failures, configuration drift, or anomalies.
  Root cause analysis using logs, metrics, traces, and dependency mapping.
compatibility:
  models: [any-llm]
  cloud: azure
  observability: [application-insights, log-analytics, network-watcher]
---

# Azure Diagnostics

Troubleshoot Azure problems systematically: narrow scope, gather evidence, form hypotheses, validate fixes.
Use structured root cause analysis to prevent recurrence.

## Use This Skill When

- The user reports application downtime, errors, or performance regression
- Deployments succeed but service behavior is broken or degraded
- There are connectivity, identity, DNS, scaling, or quota issues
- Configuration drift or unexpected resource state is observed
- Error messages are cryptic or originating from dependent services

## Context: Incident Classification

**Availability** (0% traffic passing): Database down, network cut, authentication broken  
**Degradation** (partial traffic/slowness): High latency, connection pool exhaustion, throttling  
**Configuration drift**: Resource settings changed outside IaC, policy violation, quota exceeded  
**Data integrity**: Corruption, replication lag, backup failure  
**Security**: Unauthorized access, malicious activity, compliance violation  

## Required Inputs

- **Affected resources**: Service name, region, resource group
- **Symptom timeline**: Start time, duration, frequency (one-off or recurring)
- **Error signals**: HTTP status codes, error messages, exception stack traces, correlation IDs
- **Recent changes**: Deployment, config update, DNS change, certificate rotation, network topology
- **Expected vs. observed**: What should happen vs. what actually happened
- **User impact**: How many users? Business tier? SLA breach?

## Decision Tree

```
Is the service completely unavailable (0% traffic)?
├─ Yes → Check Azure Service Health, then check compute (app/function) status
│         ├─ Resource deleted/stopped? → Restart or redeploy
│         ├─ Resource failed to start? → Check startup logs, quotas
│         └─ Resource healthy but unreachable? → Check network, DNS, firewall
└─ No (partial/slow) → Proceed to performance analysis

Did this occur after a recent deployment or change?
├─ Yes → Suspect new code, config, or infrastructure
│         ├─ Rollback or undo change → Verify symptom resolves
│         └─ If resolved: Root cause is the change; analyze diff
└─ No → Suspect environmental change, quota, or dependent service

Is the issue isolated to one region/subscription or widespread?
├─ Isolated → Check resource-specific logs, networking, IAM
└─ Widespread → Check Azure platform status, quotas, throttling
```

## Workflow

### Phase 1: Triage (First 2 minutes)

1. **Check Azure Service Health**:
   ```bash
   # Portal: Service Health blade
   # Or search "Service Health" in Azure portal
   # Look for: Incidents, Advisories, Planned Maintenance affecting your region
   ```

2. **Verify resource status**:
   ```bash
   az resource show --ids /subscriptions/$SUBID/resourceGroups/$RG/providers/$TYPE/$NAME
   # Check: provisioningState, powerState, healthStatus fields
   ```

3. **Check resource limits**:
   - Has quota been exceeded? (CPU, memory, concurrent connections, API calls/sec)
   - Is the resource in a failed provisioning state?

### Phase 2: Evidence Gathering (5-15 minutes)

1. **Collect logs from all layers**:
   
   **Application Logs** (Application Insights or Log Analytics):
   ```kql
   // Find errors in last hour
   traces | where timestamp > ago(1h) and severityLevel >= 2
   | summarize count() by tostring(severityLevel), message
   ```

   **Dependency Tracking** (what services called what):
   ```kql
   dependencies | where timestamp > ago(1h) and success == false
   | summarize count() by target, type, resultCode
   ```

   **Network Flow** (connectivity issues):
   ```bash
   az network watcher flow-log show --resource-group $RG --nsg-name $NSG
   # Download NSG flow logs from storage account
   ```

   **Resource Logs** (Azure Monitor Diagnostics):
   ```bash
   # For Key Vault:
   az monitor diagnostic-settings list --resource $KV_ID
   # Check: logs enabled, destination correct, retention policy
   ```

2. **Extract correlation IDs and trace context**:
   ```
   - Application Insights: Operation ID (shows request chain across services)
   - HTTP requests: x-correlation-id, x-request-id headers
   - Logs: transaction ID linking app → dependency → database
   ```

3. **Timeline of events**:
   ```
   10:30 AM: User reports 500 error
   10:31 AM: Error rate spikes to 95%
   10:32 AM: Database logs show connection timeout
   10:33 AM: DBA identifies firewall rule was deleted
   ```

### Phase 3: Root Cause Analysis

**Check each layer bottom-up**:

1. **Infrastructure Layer**:
   - Is the resource running? (VM status, App Service plan load, Function runtime)
   - Are quotas exceeded? (vCPU, disk, network bandwidth, RPS limits)
   - Is there a network path? (ping, tracert, NSG rules, firewall)

   ```bash
   # Check VM status
   az vm get-instance-view --resource-group $RG --name $VM --query 'instanceView.statuses'
   
   # Check App Service plan utilization
   az monitor metrics list --resource $PLAN_ID --metric "CpuPercentage,MemoryPercentage"
   ```

2. **Network Layer**:
   - Can DNS resolve? (nslookup, dig)
   - Is there routing? (ip route show, traceroute)
   - Are NSGs blocking traffic? (check inbound/outbound rules)
   - Is private endpoint configured correctly? (DNS name resolution, IP routing)

   ```bash
   # Test DNS from within the resource:
   nslookup myapp.azurewebsites.net
   # If fails: Check private DNS zones, conditional forwarders
   ```

3. **Identity Layer**:
   - Does managed identity have permissions? (RBAC role assignments)
   - Is Key Vault access allowed? (network rules, access policies, RBAC)
   - Has credential rotated or expired? (service principal secret)

   ```bash
   # Check role assignment
   az role assignment list --assignee $PRINCIPAL_ID --scope $SCOPE
   
   # Verify Key Vault access
   az keyvault key list --vault-name $KV --query '[].name'
   ```

4. **Data Layer**:
   - Is the database accessible? (connection string, firewall, availability)
   - Are credentials valid? (username, password, connection string format)
   - Is there replication lag or transaction lock? (database health check)

   ```bash
   # Check SQL database connectivity
   sqlcmd -S $SERVER.database.windows.net -U $USER -P $PWD -Q "SELECT 1"
   ```

5. **Application Layer**:
   - Is there a code bug? (recent deployment, null pointer, logic error)
   - Are resource limits exhausted? (connection pool, memory, threads)?
   - Is there an unhandled exception? (check exception logs)

### Phase 4: Hypothesis Testing

**Form and test one hypothesis at a time**:

```
Hypothesis 1: Network connectivity broken
  → Test: Can ping the endpoint? Can telnet to port?
  → Result: YES/NO → Adjust hypothesis or confirm

Hypothesis 2: Identity permissions missing
  → Test: Run az role assignment list for managed identity
  → Result: Missing "Key Vault Secrets User" role → CONFIRMED

Hypothesis 3: Quota exceeded
  → Test: az vm list-usage --location eastus --query "[?name.value=='cores'].currentValue"
  → Result: 100 cores used, limit 98 → CONFIRMED
```

### Phase 5: Implement & Verify Fix

1. **Minimal reversible fix**:
   - Do NOT make multiple changes at once
   - Prefer configuration change over code deployment
   - Have rollback plan ready

2. **Verify the fix**:
   ```bash
   # Run post-fix validation
   # 1. Service health check passes
   # 2. Error rate returns to baseline
   # 3. Latency within SLA
   # 4. No cascading failures in dependent services
   ```

3. **Monitor for 5-10 minutes**:
   - Is error rate stable and low?
   - Are there any new errors in logs?
   - Have dependent services recovered?

## Output Contract

1. **Problem Statement**
   - What users experience (HTTP 500, timeout, latency)
   - When it started, how long it lasted
   - Blast radius (% of users, which regions/tiers)

2. **Root Cause (with Evidence)**
   - Most likely cause with 2-3 supporting log entries
   - Alternative causes if root cause is 70-80% confidence

3. **Supporting Evidence**
   - Log excerpts showing the failure
   - Correlation IDs linking events across services
   - Timeline of events

4. **Fix Actions** (step-by-step, reversible)
   - Exact commands or portal steps
   - Expected wait time for fix to take effect
   - Rollback procedure if fix doesn't work

5. **Verification Checklist**
   - Smoke test (e.g., GET /health returns 200)
   - Full transaction test (e.g., POST /order, verify in database)
   - Dependent service test (e.g., can call downstream API)

6. **Prevention & Lessons Learned**
   - Alert that should have caught this earlier
   - Configuration or IaC change to prevent recurrence
   - Post-incident runbook for next time

## Guardrails

- **Separate facts from assumptions**: Show evidence for each claim.
- **Prefer reversible fixes**: Change config before redeploying code.
- **Avoid blame**: Focus on systems, not people ("firewall rule was deleted" not "DBA made a mistake").
- **Keep timeline explicit**: Timestamps matter for correlation.
- **Do not guess**: If logs don't show the cause, keep investigating; don't assume.
- **Test rollback**: Never assume rollback works without testing.
- **Create post-incident runbook**: Document for faster diagnosis next time.
