---
name: azure-compliance
description: >
  Map Azure architectures and operations to security and compliance controls.
  Use this skill when users ask for governance, policy enforcement, audit readiness, or regulatory alignment.
  Covers ISO, SOC2, HIPAA, PCI-DSS, and custom compliance frameworks.
compatibility:
  models: [any-llm]
  cloud: azure
  frameworks: [iso-27001, soc2, hipaa, pci-dss]
  security: [governance, audit, compliance]
---

# Azure Compliance

Translate policy and regulatory requirements into implementable Azure controls and audit evidence.
Map frameworks (ISO 27001, SOC2, HIPAA, PCI-DSS) to Azure services and configurations.

## Use This Skill When

- The user needs compliance alignment (ISO, SOC2, HIPAA, PCI-DSS, or custom)
- The user asks for policy enforcement, audit logging, or data protection controls
- The user needs a remediation plan for compliance gaps
- The user is preparing for a security audit or certification

## Context: Compliance Maturity

**Immature**: No compliance framework, ad hoc security, no audit trail  
**Developing**: Framework chosen, basic controls, manual evidence collection  
**Managed**: Controls automated with Azure Policy, audit logging centralized → **Target**  
**Optimized**: Continuous compliance monitoring, real-time dashboards, attestation automated

## Required Inputs

- **Applicable frameworks**: ISO 27001, SOC2 Type II, HIPAA, PCI-DSS, or custom?
- **Data classification**: Public, internal, confidential, secret (PII, PHI, payment data)?
- **Current architecture**: Existing controls, gaps identified?
- **Audit scope**: What resources/processes in scope?
- **Evidence requirements**: Reports, logs, attestations needed for certification?
- **Risk tolerance**: What's acceptable? What's not?

## Decision Tree

```
Which compliance framework applies?
├─ ISO 27001 → Identity (4.6), Access (6.2, 6.6), Encryption (10.2), Audit (12.4)
├─ SOC2 Type II → Trust Service Criteria: Security, Availability, Processing Integrity, Confidentiality, Privacy
├─ HIPAA → Technical safeguards: Access, encryption, audit, integrity
├─ PCI-DSS → Network, access, encryption, logging, incident response (for payment processing)
└─ Custom → Map control names to Azure services

Is data sensitive (PII, PHI, payment)?
├─ Yes → Encryption (at-rest + in-transit), MFA, audit logging, DLP
└─ No → Basic controls sufficient

Do you process across regions/countries?
├─ Yes → Data residency compliance (GDPR, CCPA, regional data localization)
└─ No → Single-region controls

Do you process continuously or in batches?
├─ Continuous → Real-time monitoring, alerts, anomaly detection
└─ Batch → Periodic reviews, manual attestation

Who audits you (internal, external, customer)?
├─ Internal only → Simplified documentation
├─ External audit → Formal evidence packages, reports
└─ Customer audit → On-demand access, dashboards
```

## Workflow

### Phase 1: Map Control Objectives

**ISO 27001 Example Controls:**

```
Control 6.2: User registration and access rights
├─ Objective: Only authorized users access systems
├─ Azure Implementation:
│  ├─ Entra ID for authentication
│  ├─ RBAC for authorization
│  ├─ MFA for privileged access (PIM)
│  └─ Access reviews quarterly
├─ Evidence: Role assignments list, access review reports

Control 10.2: Monitoring and review of access records
├─ Objective: Detect unauthorized access attempts
├─ Azure Implementation:
│  ├─ Activity logs → Log Analytics
│  ├─ Alerts on failed logins (5+ failures = suspicious)
│  ├─ Alerts on privilege escalation
│  └─ Monthly log review
├─ Evidence: Alert configuration, log samples, review sign-offs

Control 10.7: Retention of log information
├─ Objective: Maintain audit trail for investigation
├─ Azure Implementation:
│  ├─ Logs stored for 1+ year (retention policy)
│  ├─ Archive to storage for long-term (7+ years)
│  └─ Access controlled (only security team)
├─ Evidence: Retention policy screenshot, archive storage exists
```

**PCI-DSS Example Controls:**

```
Requirement 2: Default security parameters
├─ Objective: Change default passwords, disable unnecessary services
├─ Azure Implementation:
│  ├─ No default storage account keys in use
│  ├─ Change password on deployment
│  ├─ Disable basic auth (use OAuth/OIDC)
│  └─ Disable unnecessary ports/protocols
├─ Evidence: Configuration review, disabled services list

Requirement 6: Develop and maintain secure applications
├─ Objective: No hardcoded passwords, input validation, error handling
├─ Azure Implementation:
│  ├─ Code scanning (DevSecOps)
│  ├─ Dependency scanning (vulnerabilities)
│  ├─ SAST/DAST testing
│  └─ Security gate in CI/CD
├─ Evidence: Scan reports, remediation history
```

### Phase 2: Implement Azure Governance Controls

1. **Enable Azure Policy** (enforce controls automatically):
   ```bash
   # Require encryption on storage accounts
   az policy assignment create \
     --name "Require-Storage-Encryption" \
     --display-name "Require Storage Encryption" \
     --policy "fc6e5a0a-e4c7-4f7a-b3f7-8b7e1a9b5c3d" \
     --scope "/subscriptions/$SUBID" \
     --enforcement-mode "Default"  # or "DoNotEnforce" for audit-only
   ```

2. **Common compliance policies**:
   ```bash
   # ISO 27001 / SOC2 policies
   ├─ Require encryption in transit (HTTPS only)
   ├─ Require encryption at rest (Storage encryption)
   ├─ Require MFA for Azure Admin
   ├─ Require NSGs on all subnets
   ├─ Require private endpoints for databases
   ├─ Require activity log retention (90+ days)
   ├─ Require Defender on compute/storage/databases
   └─ Audit only: Allowed resource types
   ```

   ```bash
   # PCI-DSS specific
   ├─ Network isolation (NSGs, firewalls)
   ├─ Encryption for payment data
   ├─ Access logging and monitoring
   ├─ Vulnerability scanning
   ├─ Incident response planning
   └─ Annual security assessments
   ```

   ```bash
   # HIPAA specific
   ├─ Encryption (at-rest + in-transit)
   ├─ Access controls and audit logging
   ├─ Backup and disaster recovery
   ├─ Data integrity controls (no tampering)
   ├─ Encryption of portable media
   └─ Business associate agreements (BAA)
   ```

3. **Assign policies at management group scope** (cascades to all subscriptions):
   ```bash
   az policy assignment create \
     --name "Org-Compliance-Policy-Set" \
     --display-name "Organization Compliance Controls" \
     --policy-set-definition "1f3afb9d-9a04-4a29-a705-cda07f4f3ad0" \
     --scope "/providers/Microsoft.Management/managementGroups/ContosoMG" \
     --location "eastus" \
     --enforce
   ```

### Phase 3: Configure Audit Logging & Monitoring

1. **Centralize audit logs**:
   ```bash
   # Activity logs → Log Analytics workspace
   az monitor diagnostic-settings create \
     --name "audit-to-law" \
     --resource "/subscriptions/$SUBID" \
     --workspace "/subscriptions/$SUBID/resourceGroups/$RG/providers/Microsoft.OperationalInsights/workspaces/$LAW" \
     --logs '[{"category":"Administrative","enabled":true},{"category":"Security","enabled":true}]'
   ```

2. **Configure alerts for suspicious activity**:
   ```bash
   # Alert: 5+ failed logins in 5 minutes (brute force attempt)
   az monitor metrics alert create \
     --name "brute-force-attempt" \
     --resource-group $RG \
     --scopes "/subscriptions/$SUBID" \
     --condition "total SignInFailures > 5" \
     --window-size "PT5M" \
     --evaluation-frequency "PT1M" \
     --actions email_action "admin@contoso.com"
   ```

3. **Audit logging queries** (KQL):
   ```kql
   // Administrative changes (who changed what, when)
   AzureActivity
   | where OperationName in ("Create", "Update", "Delete")
   | summarize count() by Caller, OperationName, bin(TimeGenerated, 1h)
   
   // Failed authentication attempts
   SigninLogs
   | where Status.errorCode != "0"
   | summarize count() by UserPrincipalName, ClientAppUsed
   
   // Privilege escalation (owner role granted)
   AzureActivity
   | where OperationName == "Create role assignment"
   | where Properties contains "Owner"
   | project TimeGenerated, Caller, SubscriptionId, Properties
   ```

### Phase 4: Data Protection & Encryption

1. **Enable encryption at rest**:
   ```bash
   # Storage account: Microsoft-managed keys (default) or CMK (better)
   az storage account update \
     --resource-group $RG \
     --name "st${app}${env}" \
     --encryption-key-name "storage-key" \
     --encryption-key-vault "/subscriptions/$SUBID/resourceGroups/$RG/providers/Microsoft.KeyVault/vaults/$KV"
   
   # Database: Transparent Data Encryption (TDE)
   az sql server update \
     --resource-group $RG \
     --name $SQL_SERVER \
     --encryption-key-id "/subscriptions/$SUBID/resourceGroups/$RG/providers/Microsoft.KeyVault/vaults/$KV/keys/$KEY"
   ```

2. **Enable encryption in transit**:
   ```bash
   # HTTPS only (no HTTP)
   az storage account update \
     --resource-group $RG \
     --name "st${app}${env}" \
     --https-only
   
   # SQL Server: Enforce SSL
   az sql server firewall-rule create \
     --resource-group $RG \
     --server $SQL_SERVER \
     --name "AllowAzureIPs" \
     --start-ip-address 0.0.0.0 \
     --end-ip-address 0.0.0.0  # Azure IPs only
   ```

3. **Key Vault for secrets** (no hardcoding):
   ```bash
   # Store connection strings, API keys, passwords in Key Vault
   az keyvault secret set \
     --vault-name $KV \
     --name "sql-connection-string" \
     --value "Server=...;User Id=...;Password=..."
   
   # Access from app via managed identity
   # No password in code, config, or logs
   ```

### Phase 5: Access & Identity Controls

1. **Multi-factor authentication** (for humans):
   ```bash
   # Require MFA for all admin users
   az ad user update \
     --user-principal-name admin@contoso.com \
     --strong-authentication-requirement true
   ```

2. **Privileged access management** (PIM):
   ```bash
   # Owner role requires approval, 4-hour max, MFA
   az rest --method post \
     --uri "https://graph.microsoft.com/v1.0/privilegedIdentityManagement/roleAssignments" \
     --body '{
       "roleDefinitionId":"'$OWNER_ROLE_ID'",
       "principalId":"'$ADMIN_GROUP_ID'",
       "type":"eligible",
       "requestorId":"'$USER_ID'"
     }'
   ```

3. **Least privilege (RBAC)**:
   ```bash
   # Avoid: Contributor (too broad)
   # Use specific roles: 
   ├─ Storage Blob Data Reader (read-only)
   ├─ Key Vault Secrets User (get secrets only)
   ├─ SQL DB Contributor (database, not server)
   └─ Owner: Reserved for emergency only, PIM-eligible
   ```

### Phase 6: Compliance Evidence & Audit Readiness

1. **Generate compliance report**:
   ```bash
   # Azure Advisor: Security recommendations
   az advisor recommendation list --category Security
   
   # Defender for Cloud: Secure Score
   az security secure-score show
   
   # Policy Compliance: Non-compliant resources
   az policy state list \
     --filter "isCompliant eq false" \
     --group-by "policyDefinitionId" \
     --apply "groupby((properties/policyDefinitionGroupNames/any()), count() as count)"
   ```

2. **Audit readiness checklist**:
   ```
   ✓ Policies defined and enforced
   ✓ Audit logs centralized and retained 1+ year
   ✓ Alerts configured for sensitive operations
   ✓ Encryption (at-rest, in-transit) enabled
   ✓ Access controls (RBAC, MFA, PIM) in place
   ✓ Vulnerability scans run regularly
   ✓ Backups tested and verified
   ✓ Incident response plan documented and practiced
   ✓ Security training completed (staff)
   ✓ Business Associate Agreements (if HIPAA)
   ```

3. **Maintain evidence artifacts**:
   ```
   ├─ Policy assignments and exemptions
   ├─ Role assignments (human + workload)
   ├─ Audit log exports (monthly)
   ├─ Secure Score trend (monthly)
   ├─ Vulnerability scan reports
   ├─ Access review attestations
   ├─ Incident response logs
   └─ Security training records
   ```

## Output Contract

1. **Control Mapping Document**
   - Framework control → Azure implementation
   - Responsibility: Microsoft (shared) vs. Customer (your responsibility)

2. **Gap Analysis**
   - Current state: Which controls in place?
   - Target state: Which controls needed?
   - Severity: Blocking (critical), high, medium, low

3. **Remediation Plan** (prioritized)
   - Priority 1 (blocking): Fix before production
   - Priority 2 (high): Fix within 30 days
   - Priority 3 (medium): Fix within 90 days
   - Priority 4 (low): Fix as opportunity allows

4. **Audit Evidence Checklist**
   - Policy configuration screenshots
   - Logs and queries proving monitoring
   - Access review sign-offs
   - Encryption certificates or Key Vault references
   - Incident response runbook

5. **Compliance Monitoring Dashboard**
   - Policy compliance % (target: 100%)
   - Resources non-compliant by policy
   - Alert trends (suspicious activity)
   - Secure Score trend

## Guardrails

- **Do not claim certification by default**: Only claim compliance when formally audited and certified.
- **Separate shared controls from customer controls**: Microsoft handles infrastructure; you handle application + data.
- **Enable audit logging for all services**: If you can't prove it happened, assume it didn't (audit requirement).
- **Encrypt sensitive data**: At-rest (CMK) and in-transit (TLS 1.2+) for regulated workloads.
- **Require MFA for humans**: Eliminates 99% of credential-based attacks.
- **Review access quarterly**: Remove unused accounts, downgrade overpermissioned roles.
- **Test incident response**: Don't wait for a real incident; practice quarterly.
- **Document assumptions**: Mark which controls are inherited from Azure vs. implemented by you.
