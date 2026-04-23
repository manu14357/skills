---
name: azure-cloud-migrate
description: >
  Plan and execute cloud migrations to Azure from on-premises or other clouds.
  Use this skill when users ask for discovery, migration waves, cutover, validation, or modernization during migration.
compatibility:
  models: [any-llm]
  cloud: azure
  patterns: [rehost, replatform, refactor, replace]
---

# Azure Cloud Migrate

Migrate workloads to Azure in controlled waves with clear risk management, rollback options, and validation.

## Use This Skill When

- The user is moving applications or data to Azure
- The user needs migration planning and wave sequencing
- The user needs cutover and post-migration validation
- The user wants to assess workload readiness and identify blockers

## Context: Migration Maturity

**Immature**: Ad hoc migrations, no planning, high risk of failure  
**Developing**: Discovery done, basic wave plan, some testing  
**Managed**: Dependency mapping, wave execution, validation, rollback plan → **Target**  
**Optimized**: Automated discovery, real-time risk scoring, self-healing post-migration

## Required Inputs

- **Workload inventory**: Applications, databases, storage, and external dependencies
- **Current infrastructure**: Hosting stack (VMware, Hyper-V, cloud competitors)
- **Constraints**: Downtime window, cutover blackout dates, compliance/data residency
- **Success criteria**: Performance targets, cost targets, SLA requirements
- **Team**: Who executes? Internal, partner, Microsoft FastTrack?

## Decision Tree

```
What's the migration strategy for each workload?
├─ Rehost (lift-and-shift) → Move VM as-is, minimal changes
├─ Replatform (lift, tinker, shift) → Update OS/runtime, same app logic
├─ Refactor (re-architect) → Rebuild for cloud-native (containers, serverless)
├─ Replace (buy SaaS) → Decommission, switch to SaaS alternative
└─ Retain → Stay on-premises (not migrating)

What's the business criticality and complexity?
├─ Low complexity, non-critical → Migrate first (learn fast)
├─ Medium complexity, moderate criticality → Migrate mid-wave
└─ High complexity, critical → Migrate last (proven process)

How much downtime is acceptable?
├─ Zero downtime (active-active) → Requires dual-run, complex
├─ Few hours (typical) → Scheduled cutover window
├─ Days/weeks (acceptable) → Phased over time
└─ Unlimited (decommissioned) → Can take time

Are there compliance/data residency constraints?
├─ No → Full flexibility, optimize for cost/speed
├─ Yes → Choose Azure region carefully, plan audit trail
└─ Multi-region required → Plan for data synchronization
```

## Workflow

### Phase 1: Discovery & Assessment

1. **Collect inventory**:
   ```bash
   # Use Azure Migrate
   az migrateprojects create --resource-group $RG \
     --migrate-project-name "migration-prod" \
     --location "eastus"
   
   # Discover on-premises:
   # ├─ VMs (Hyper-V, VMware, physical)
   # ├─ Databases (SQL Server, Oracle, PostgreSQL)
   # ├─ File shares and storage
   # └─ Network and firewall rules
   ```

2. **Map dependencies**:
   ```
   Application Tiers:
   
   Frontend (Web):
   └─ asp-web-01 (4-core, 8GB)
   └─ asp-web-02 (4-core, 8GB)
       └─ Depends on: api-backend, load balancer
   
   Backend (API):
   └─ api-backend-01 (8-core, 16GB)
   └─ api-backend-02 (8-core, 16GB)
       └─ Depends on: sql-db, cache, message queue
   
   Data:
   └─ sql-db (2-core, 32GB, 500GB storage)
   └─ cache (2-core, 4GB)
   └─ msg-queue (shared, 100GB)
   ```

3. **Assess readiness**:
   ```
   Checklist:
   ✓ OS supported by Azure (Windows Server 2012+, Linux)
   ✓ No unsupported drivers/hardware
   ✓ Network connectivity (ExpressRoute or VPN gateway planned)
   ✓ Licensing (can migrate with Software Assurance)
   ✓ Backup & DR strategy documented
   ✗ Custom middleware (Oracle WebLogic) → May need workarounds
   ⚠️ Large database (500GB) → Plan staging environment
   ```

4. **Calculate costs**:
   ```
   On-premises annual cost:
   ├─ Hardware/lease: $50K
   ├─ Datacenter/power: $15K
   ├─ Licensing: $30K
   └─ Staff: $60K
   Total: $155K/year
   
   Azure annual cost estimate:
   ├─ VMs (2x D4s_v3): $2,176/month
   ├─ SQL Database (S3): $380/month
   ├─ Storage (1TB): $100/month
   ├─ Data transfer (egress): $500/month
   └─ Networking: $200/month
   Total: ~$45K/year → 71% cost reduction
   ```

### Phase 2: Plan Migration Waves

1. **Define waves** (sequence by risk):
   ```
   Wave 1 (Non-critical, simple) - Week 1-2
   ├─ Dev/Test environments
   ├─ Non-customer-facing apps
   └─ Risk: Low | Duration: 1 day | Rollback: Easy
   
   Wave 2 (Medium criticality) - Week 3-4
   ├─ Internal tools, ops systems
   ├─ Secondary workloads
   └─ Risk: Medium | Duration: 2-4 hours | Rollback: 1 hour
   
   Wave 3 (Critical, complex) - Week 5-6
   ├─ Customer-facing API
   ├─ Database tier
   └─ Risk: High | Duration: 4 hours | Rollback: 4 hours
   
   Wave 4 (Legacy, low urgency) - Month 2
   ├─ Deprecated systems, archive data
   └─ Risk: Low | Duration: Flexible | Rollback: None (decommission)
   ```

2. **Define success criteria per wave**:
   ```
   Wave 1 Validation:
   ✓ All VMs boot and pass health checks
   ✓ Application logs show no errors
   ✓ Network connectivity confirmed
   ✓ Backups run successfully
   → If all pass: Proceed to Wave 2 (hold 1 day for monitoring)
   → If any fail: Rollback and investigate
   
   Wave 3 Validation (critical):
   ✓ Database migrated and schemas match (byte-level comparison)
   ✓ Performance benchmarks met (p95 latency <200ms)
   ✓ Users can log in and perform core operations
   ✓ Alerts firing correctly
   → Monitor for 24 hours before declaring success
   ```

### Phase 3: Prepare Azure Landing Zone

1. **Create landing zone**:
   ```bash
   # Hub VNet for shared services
   az network vnet create \
     --resource-group $RG \
     --name "hub-vnet" \
     --address-prefix "10.0.0.0/16" \
     --location "eastus"
   
   # Spoke VNet for migrated workloads
   az network vnet create \
     --resource-group $RG \
     --name "spoke-prod-vnet" \
     --address-prefix "10.1.0.0/16" \
     --location "eastus"
   
   # Peer hub to spoke
   az network vnet peering create \
     --resource-group $RG \
     --vnet-name "hub-vnet" \
     --name "hub-to-spoke" \
     --remote-vnet "/subscriptions/$SUB/resourceGroups/$RG/providers/Microsoft.Network/virtualNetworks/spoke-prod-vnet" \
     --allow-vnet-access --allow-forwarded-traffic
   ```

2. **Setup connectivity**:
   ```bash
   # ExpressRoute (dedicated connection, recommended for large migrations)
   OR
   # VPN Gateway (cheaper, adequate for <100 Mbps)
   az network vpn-gateway create \
     --resource-group $RG \
     --name "vpn-gateway" \
     --vnet "hub-vnet" \
     --public-ip-address "vpn-public-ip"
   ```

3. **Configure identity**:
   ```bash
   # Azure AD Connect (sync on-premises AD with Entra ID)
   # Enables seamless login for users post-migration
   ```

### Phase 4: Execute Migration

1. **Test migration** (dry-run):
   ```
   For Wave 1 Dev VM:
   ├─ Create snapshot of on-premises VM
   ├─ Replicate to Azure via Azure Migrate
   ├─ Boot test VM (non-production)
   ├─ Verify OS, applications, connectivity
   ├─ Take snapshots for rollback
   ├─ Validate performance (CPU, memory, disk I/O)
   └─ Document issues and blockers
   ```

2. **Production migration** (Wave 1):
   ```
   Timeline:
   00:00 - Pre-cutover validation
         ├─ On-premises: All health checks pass
         ├─ Azure: Landing zone ready, connectivity confirmed
         └─ Rollback: Test executed successfully
   
   01:00 - Begin replication
         ├─ Disable on-premises VM
         ├─ Final delta sync to Azure (5-10 min)
         ├─ Boot Azure VM
         └─ Verify applications online
   
   01:20 - Update DNS/routing
         ├─ Route traffic to Azure VM
         ├─ Monitor error rate and latency
         └─ Alert on-call if issues
   
   02:00 - Validation
         ├─ Run smoke tests (login, core operations)
         ├─ Check logs for errors
         ├─ Verify backup job runs
         └─ Declare success or rollback
   ```

3. **Handle database migrations** (special care):
   ```
   For SQL Server Database:
   
   Option 1: Azure Database Migration Service (DMS)
   ├─ Continuous replication (minimal downtime)
   ├─ Schema sync automatically
   └─ Cutover: Switch connection string
   
   Option 2: Full backup/restore
   ├─ Backup from on-premises
   ├─ Upload to storage
   ├─ Restore to Azure SQL
   └─ Run validation queries
   
   Option 3: Native replication
   ├─ Setup Always-On Availability Group
   ├─ Sync on-premises to Azure
   ├─ Failover when ready
   └─ Decommission on-premises replica
   ```

### Phase 5: Validate & Optimize

1. **Post-migration validation**:
   ```
   Functional:
   ✓ All applications running (no errors in app logs)
   ✓ Users can access (login successful)
   ✓ Data integrity (row counts match, checksums pass)
   ✓ Integrations working (APIs, file shares accessible)
   
   Performance:
   ✓ CPU utilization < 80%
   ✓ Memory utilization < 85%
   ✓ Disk I/O latency < 10ms
   ✓ Application response time: p95 < SLA
   
   Operational:
   ✓ Backups running successfully
   ✓ Monitoring/alerting active
   ✓ Patch management configured
   ✓ Cost tracking shows expected usage
   ```

2. **Optimize sizing** (reduce costs post-migration):
   ```
   Day 1 (over-provisioned for safety):
   ├─ Web tier: 2x D4s_v3 (4-core, 16GB) = $240/month
   ├─ API tier: 2x D8s_v3 (8-core, 32GB) = $480/month
   └─ Total: $720/month
   
   Day 30 (after monitoring):
   ├─ Web tier: Actually uses 20% CPU, 40% memory
   ├─ Downsize to: 1x D2s_v3 (2-core, 8GB) = $60/month
   ├─ API tier: Actually uses 30% CPU, 50% memory
   ├─ Downsize to: 1x D4s_v3 (4-core, 16GB) = $120/month
   └─ Savings: $540/month (75% reduction)
   ```

3. **Decommission on-premises**:
   ```
   After 30 days in production (stable):
   ├─ Keep on-premises running as backup (DR failback if needed)
   ├─ Reduce licensing/support cost
   ├─ Plan hardware decommissioning (6 months)
   └─ Document lessons learned
   ```

## Output Contract

1. **Migration Strategy**
   - Rehost/replatform/refactor approach per workload
   - Dependency map and criticality ranking
   - Readiness assessment (blockers, risks)

2. **Wave Plan**
   - Sequence (Wave 1, 2, 3...)
   - Workloads per wave
   - Timeline and blackout windows
   - Success criteria and validation steps

3. **Risk Assessment**
   - Identified risks (data loss, downtime, performance)
   - Mitigation strategies
   - Rollback procedures

4. **Cutover Runbook**
   - Hour-by-hour timeline
   - Pre-cutover validation checklist
   - Go/no-go decision criteria
   - Rollback triggers

5. **Post-Migration Plan**
   - Validation checklist (functional, performance, ops)
   - Cost optimization (right-sizing)
   - Decommissioning timeline (on-premises)

## Guardrails

- **Don't skip dependency mapping**: Hidden dependencies cause cutover failures.
- **Include rollback path**: Every wave must have <4-hour rollback procedure.
- **Validate before/after**: Use checksums, row counts, smoke tests.
- **Plan data sync carefully**: Large databases need careful timing to avoid data loss.
- **Communicate with users**: Publish maintenance windows, expected downtime.
- **Test in dev first**: Execute exact same procedures in non-prod before production.
- **Monitor obsessively post-cutover**: First 24 hours are highest risk; watch logs/alerts closely.
