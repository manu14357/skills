---
name: azure-resource-lookup
description: >
  Locate and summarize Azure resources quickly across scopes using consistent query patterns.
  Use this skill when users ask where resources are, what they are configured as, or need inventory by type, region, or tag.
compatibility:
  models: [any-llm]
  cloud: azure
  tags: [inventory, discovery, diagnostics]
---

# Azure Resource Lookup

Find Azure resources efficiently across subscriptions and return concise, actionable metadata.

## Use This Skill When

- The user cannot find a resource in Azure
- The user needs inventory by type, region, tag, or naming pattern
- The user needs configuration details before making changes
- The user needs to verify resource existence or validate naming conventions

## Context: Lookup Maturity

**Immature**: Manual searches in portal, incomplete knowledge of resources  
**Developing**: CLI queries, some automation of common lookups  
**Managed**: Scripted queries with filtering, tags for organization → **Target**  
**Optimized**: Auto-indexing, graph-based discovery, dependency visualization

## Required Inputs

- **Scope**: Management group, subscription, resource group, or single app name?
- **Resource type**: Specific type (VMs, databases) or keyword search?
- **Filters**: Region, environment tag, owner, creation date range?
- **Required fields**: Basic (id, name, location) or detailed (config, cost, status)?
- **Output format**: Table, JSON, or filtered list?

## Decision Tree

```
What are you looking for?
├─ Specific resource by name → Direct query: az resource show --name
├─ All resources of one type → Type filter: az resource list --resource-type
├─ Resources in a region → Location filter: az resource list --location
├─ Resources by tag → Tag filter: az resource list --query "[?tags.Environment=='Prod']"
└─ Unknown (keyword search) → Graph query with semantic search

How broad is the scope?
├─ Single resource group → Query is fast
├─ Single subscription → Query takes 5-10 seconds
├─ Multiple subscriptions → Use Azure Resource Graph (optimized)
└─ Entire organization → Use Azure Resource Graph with batch mode

Do you need real-time status or historical data?
├─ Real-time → CLI query (az resource list)
├─ Historical → Query resource logs (Activity logs)
├─ Cost-related → Query Cost Management API
```

## Workflow

### Phase 1: Query Resources

1. **Find by name**:
   ```bash
   # Exact match
   az resource show --name "myappdb" --resource-type "Microsoft.Sql/servers/databases"
   
   # Output
   {
     "id": "/subscriptions/abc123/resourceGroups/prod-rg/providers/Microsoft.Sql/servers/myserver/databases/myappdb",
     "name": "myappdb",
     "type": "Microsoft.Sql/servers/databases",
     "location": "eastus",
     "properties": {
       "status": "Online",
       "edition": "Standard",
       "serviceLevelObjective": "S0"
     }
   }
   ```

2. **Find by type** (all VMs in subscription):
   ```bash
   az resource list --resource-type "Microsoft.Compute/virtualMachines" \
     --query "[].{name:name, group:resourceGroup, location:location, vmSize:properties.hardwareProfile.vmSize}" \
     -o table
   
   # Output
   Name              Group        Location    VmSize
   vm-prod-1         prod-rg      eastus      Standard_D2s_v3
   vm-prod-2         prod-rg      eastus      Standard_D2s_v3
   vm-dev-1          dev-rg       eastus      Standard_B2s
   ```

3. **Find by tag** (all prod resources):
   ```bash
   az resource list --query "[?tags.Environment=='Prod']" \
     --query "[].{name:name, type:type, group:resourceGroup}" \
     -o table
   ```

4. **Find by region**:
   ```bash
   az resource list --location "eastus" \
     --query "[].{name:name, type:type, sku:sku.name}" \
     -o table
   ```

5. **Find by naming pattern**:
   ```bash
   # All resources starting with "api-"
   az graph query -q "resources | where name startswith 'api-'" \
     -o table
   ```

### Phase 2: Azure Resource Graph (advanced queries)

**Why Resource Graph?** Fast, parallel queries across subscriptions without hitting throttle limits.

1. **Query all subscriptions** (as organization admin):
   ```bash
   # All databases across subscriptions
   az graph query -q "resources | where type == 'microsoft.sql/servers/databases' | project name, resourceGroup, location, properties.status"
   ```

2. **Find resources by partial name** (fuzzy search):
   ```bash
   az graph query -q "resources | where name contains 'prod' and type contains 'compute'"
   ```

3. **Find orphaned resources** (no tags, old creation date):
   ```bash
   az graph query -q "resources | where tags == '{}' and tostring(properties.timeCreated) < '2023-01-01'"
   ```

4. **Find underutilized resources** (check costs):
   ```bash
   # App Service plans with low CPU
   az graph query -q "resources | where type == 'microsoft.web/serverfarms' | project name, resourceGroup, properties.workerCount, properties.sku"
   ```

### Phase 3: Extract Configuration Details

1. **Database configuration**:
   ```bash
   az sql db show --resource-group prod-rg --server myserver --name myappdb \
     --query "{name:name, status:status, tier:edition, slo:serviceLevelObjective, backupRetention:longTermRetentionBackupResourceId}"
   ```

2. **VM configuration**:
   ```bash
   az vm show --resource-group prod-rg --name vm-prod-1 \
     --query "{name:name, vmSize:hardwareProfile.vmSize, osType:osProfile.osType, imageId:storageProfile.imageReference.id, powerState:powerState}"
   ```

3. **App Service configuration**:
   ```bash
   az webapp config show --resource-group prod-rg --name myapp \
     --query "{runtime:properties.runtime, ftpEnabled:properties.ftpsState, http20Enabled:properties.http20Enabled, minTlsVersion:properties.minTlsVersion}"
   ```

4. **Network configuration**:
   ```bash
   az network nsg show --resource-group prod-rg --name prod-nsg \
     --query "securityRules[].{name:name, protocol:protocol, sourcePort:sourcePortRange, destPort:destinationPortRange, access:access, direction:direction}"
   ```

### Phase 4: Cost & Metrics Lookup

1. **Estimated monthly cost**:
   ```bash
   # App Service pricing
   az vm show --resource-group prod-rg --name vm-prod-1 \
     --query "hardwareProfile.vmSize" | xargs -I {} \
     az vm list-prices --location eastus --vmImage UbuntuLTS --query "[?name=='{}'].prices[].value" -o table
   ```

2. **Resource usage metrics** (for decisions):
   ```bash
   # Last 7 days average CPU
   az monitor metrics list --resource-group prod-rg --resource-type virtualMachines \
     --name vm-prod-1 --metric Percentage\ CPU --start-time 2024-04-16T00:00:00Z \
     --aggregation Average --interval PT1H
   ```

### Phase 5: Validate & Deep Inspect

1. **Checklist before changes**:
   ```
   Resource: myappdb (SQL Database)
   ✓ Exists in: prod-rg / eastus
   ✓ Status: Online
   ✓ Backups enabled: Yes (35-day retention)
   ✓ Access: Private endpoint configured
   ✓ Monitoring: Application Insights connected
   ✓ Owner tag: team-database (found)
   
   Safe to modify: YES (all prerequisites met)
   ```

2. **Dependencies** (what breaks if we change this?):
   ```bash
   # Find all app services using this database
   az graph query -q "resources | where properties.connectionStrings contains 'myappdb'"
   
   # Find who has access
   az role assignment list --resource-group prod-rg --resource-name myappdb
   ```

3. **Recent changes** (who touched this?):
   ```bash
   az monitor activity-log list --resource-group prod-rg \
     --query "[?resourceId contains 'myappdb']" \
     --query "[].{time:eventTimestamp, caller:caller, operationName:operationName.value}" \
     -o table
   ```

## Output Contract

1. **Query Summary**
   - What was searched?
   - How many results?
   - Time taken?

2. **Resource Table** (matching results)
   - Name, Type, Location, Status
   - Resource Group, Tags
   - Relevant config fields

3. **Notable Findings**
   - ⚠️ Untagged resources
   - ⚠️ Old/orphaned resources
   - ⚠️ Non-standard configurations
   - ✓ Best practices followed

4. **Configuration Details** (if requested)
   - Current settings
   - Recent changes (Activity Log)
   - Dependencies (what uses this?)

5. **Suggested Next Steps**
   - Inspect related resources
   - Check cost/metrics
   - Validate before changes

## Guardrails

- **Always confirm scope before broad queries**: Querying entire org can take time.
- **Check access first**: Ensure you have permissions to view resources.
- **Avoid destructive commands in lookup workflows**: This skill is read-only.
- **Mark stale data**: If discovery is incomplete, flag assumptions.
- **Use Resource Graph for scale**: CLI is faster for single subscriptions; Graph for multi-subscription.
- **Protect sensitive output**: Don't expose API keys or connection strings from config lookups.
- **Validate query results**: Don't assume 0 results = resource doesn't exist (could be permissions issue).
