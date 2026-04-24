---
name: appinsights-instrumentation
description: >
  Instrument applications with Azure Application Insights and OpenTelemetry for end-to-end observability.
  Use this skill when users ask about telemetry, tracing, metrics, logging, or monitoring setup.
  Covers SDK setup, correlation, sampling, dashboards, and alerts per OpenTelemetry standards.
compatibility:
  models: [any-llm]
  cloud: azure
  observability: [application-insights, opentelemetry]
---

# App Insights Instrumentation

Implement high-value telemetry with minimal noise and strong trace correlation for production troubleshooting and performance optimization.

## Use This Skill When

- The user needs monitoring for apps running in Azure
- The user needs distributed tracing across microservices
- The user needs alerting, dashboards, or root cause analysis visibility
- The user wants to migrate from custom logging to structured telemetry

## Context: Observability Maturity

**Immature**: No monitoring, errors discovered by users  
**Developing**: Logs and metrics collected, no correlation or alerting  
**Managed**: Traces linked across services, alerts firing, dashboards useful → **Target**  
**Optimized**: Real-time anomaly detection, SLO tracking, automated runbooks

## Required Inputs

- **Application stack**: Node.js, Python, .NET, Java, Go, etc.
- **Deployment target**: App Service, Container Apps, AKS, Function, VM
- **Critical user journeys**: Signup → Confirmation, Payment → Order, Search → Results
- **SLO targets**: Availability (%), latency (ms p99), error budget
- **Compliance needs**: PII filtering, data residency, retention policy
- **Existing telemetry**: Custom logging, APM, or greenfield?

## Decision Tree

```
Is this a new application or existing?
├─ New → Start with OpenTelemetry SDK from day one
└─ Existing → Assess current logging, add instrumentation incrementally

Which language?
├─ .NET → Application Insights .NET SDK (auto-instrumentation or manual)
├─ Node.js → OpenTelemetry + @opentelemetry/sdk-node
├─ Python → OpenTelemetry + opentelemetry-sdk
├─ Java → OpenTelemetry agent (zero-code) or manual SDK
└─ Other → OpenTelemetry language-specific SDK

How many services (microservices)?
├─ Single → Simple Application Insights setup, no special tracing
├─ 2-5 services → OpenTelemetry with correlation IDs across calls
└─ 5+ services → Distributed trace propagation (W3C Trace Context)

What's the expected volume?
├─ < 1M events/day → 100% sampling acceptable
├─ 1-10M → 10-25% sampling with head-based decisions
└─ > 10M → 1-5% sampling with tail-based (post-request) sampling decisions
```

## Workflow

### Phase 1: Setup Application Insights Workspace

1. **Create Application Insights resource**:
   ```bash
   az monitor app-insights component create \
     --resource-group $RG \
     --app-name "ai-${app}-${env}" \
     --location eastus
   
   # Get instrumentation key
   IKEY=$(az monitor app-insights component show --resource-group $RG --app-name "ai-${app}-${env}" --query "instrumentationKey")
   ```

2. **Create Log Analytics workspace** (for KQL queries):
   ```bash
   az monitor log-analytics workspace create \
     --resource-group $RG \
     --workspace-name "law-${app}-${env}"
   
   # Link to Application Insights
   az monitor app-insights component update --resource-group $RG --app-name "ai-${app}-${env}" \
     --workspace "/subscriptions/$SUBID/resourceGroups/$RG/providers/Microsoft.OperationalInsights/workspaces/law-${app}-${env}"
   ```

3. **Configure retention policy**:
   - Default: 30 days free
   - Increase if needed (paid): 90 days, 1 year
   - Archive to Storage: 7+ years for compliance

### Phase 2: Add SDK to Application

**Example 1: .NET**
```bash
# Install NuGet packages
dotnet add package Microsoft.ApplicationInsights.AspNetCore
dotnet add package Microsoft.ApplicationInsights.DependencyCollector
```

```csharp
// In Program.cs
builder.Services.AddApplicationInsightsTelemetry();

// Instrumentation key from Key Vault
var ikeySecret = new DefaultAzureCredential();
var kvUri = new Uri($"https://{kvName}.vault.azure.net");
var kvClient = new SecretClient(kvUri, ikeySecret);
var ikeySecret = kvClient.GetSecret("APPINSIGHTS_INSTRUMENTATION_KEY");
```

**Example 2: Node.js with OpenTelemetry**
```bash
npm install @opentelemetry/api @opentelemetry/sdk-node \
  @opentelemetry/auto-instrumentations-node \
  @opentelemetry/exporter-trace-otlp-http @opentelemetry/sdk-trace-node
```

```javascript
// instrumentation.js (first require in entry point)
const { NodeTracerProvider } = require("@opentelemetry/sdk-node");
const { getNodeAutoInstrumentations } = require("@opentelemetry/auto-instrumentations-node");
const { OTLPTraceExporter } = require("@opentelemetry/exporter-trace-otlp-http");

const traceExporter = new OTLPTraceExporter({
  url: `https://${process.env.APPLICATIONINSIGHTS_ENDPOINT_URL}/v2.1/track`
});

const sdk = new NodeSDK({
  traceExporter,
  instrumentations: [getNodeAutoInstrumentations()]
});
sdk.start();
```

**Example 3: Python**
```bash
pip install opentelemetry-api opentelemetry-sdk \
  opentelemetry-exporter-azure-monitor \
  opentelemetry-instrumentation-flask opentelemetry-instrumentation-requests
```

```python
from azure.monitor.opentelemetry import configure_azure_monitor

configure_azure_monitor(
    connection_string=os.environ.get("APPLICATIONINSIGHTS_CONNECTION_STRING")
)
```

### Phase 3: Add Custom Telemetry

1. **Track custom events** (business logic):
   ```csharp
   // .NET
   telemetryClient.TrackEvent("UserSignup", new Dictionary<string, string> {
     { "signup_source", "mobile_app" },
     { "user_tier", "premium" }
   });
   ```

   ```javascript
   // Node.js
   const tracer = trace.getTracer("app");
   const span = tracer.startSpan("UserSignup", {
     attributes: { "signup_source": "mobile_app", "user_tier": "premium" }
   });
   ```

2. **Track custom metrics**:
   ```csharp
   // .NET: Track duration
   var stopwatch = System.Diagnostics.Stopwatch.StartNew();
   ProcessOrder(order);
   stopwatch.Stop();
   telemetryClient.GetMetric("ProcessOrderDuration").TrackValue(stopwatch.ElapsedMilliseconds);
   ```

3. **Add correlation context**:
   ```csharp
   // Automatic: Activity.Current.Id correlates across services
   // Manual: Add request ID to headers
   using (var activity = new System.Diagnostics.Activity("ProcessPayment").Start()) {
     activity.AddTag("order_id", orderId);
     CallDownstreamAPI(); // Downstream receives trace context in headers
   }
   ```

### Phase 4: Configure Sampling

1. **Adaptive sampling** (default):
   ```
   Automatically reduces sample rate when volume spikes
   - Default: 25 events/sec threshold
   - Above: Reduces to 5% sampling
   - Below: Continues 100% sampling
   ```

   ```csharp
   services.Configure<ApplicationInsightsServiceOptions>(options => {
     options.SamplingSettings = new SamplingSettings {
       MaxTelemetryItemsPerSecond = 20,
       EvaluationInterval = TimeSpan.FromMinutes(1),
       SampledItemCount = 5
     };
   });
   ```

2. **Fixed sampling** (simpler, for testing):
   ```
   Always sample 10% of requests
   Useful for known volume or testing
   ```

3. **Tail-based sampling** (advanced):
   - Sample entire traces based on errors, latency
   - Only available in Open Telemetry Collector (not direct AppInsights)

### Phase 5: Create Dashboards & Alerts

1. **Business KPI dashboard**:
   ```kql
   // Failed signups in last hour
   customEvents 
   | where name == "SignupFailed" 
   | where timestamp > ago(1h)
   | summarize count() by tostring(customDimensions.failure_reason)
   
   // Average order processing time
   customMetrics
   | where name == "ProcessOrderDuration"
   | summarize avg(value) by bin(timestamp, 5m)
   ```

2. **Performance dashboard**:
   ```kql
   // Request latency (p50, p95, p99)
   requests
   | summarize p50=percentile(duration,50), p95=percentile(duration,95), p99=percentile(duration,99) by bin(timestamp, 1m)
   
   // Dependency failures
   dependencies
   | where success == false
   | summarize count() by target, type, resultCode
   ```

3. **Alert rules** (trigger on SLA breach):
   ```
   Condition: Error rate > 5% in 5 minutes
   → Severity 2 (warning)
   → Notify: on-call via email, PagerDuty
   
   Condition: Response time p99 > 1000ms in 10 minutes
   → Severity 3 (info)
   → Notify: #alerts Slack channel
   
   Condition: Any database connectivity failures
   → Severity 1 (critical)
   → Immediate escalation to DBA
   ```

### Phase 6: Correlation & Troubleshooting

1. **Follow request through services**:
   ```
   User → API Gateway (trace-id: abc123)
        → Auth Service (inherits trace-id: abc123)
        → Database (inherits trace-id: abc123)
   
   All logs linked via same trace-id; one query finds entire flow
   ```

2. **Root cause analysis query**:
   ```kql
   let trace_id = "abc123";
   union
     (requests | where operation_Id == trace_id),
     (dependencies | where operation_Id == trace_id),
     (exceptions | where operation_Id == trace_id),
     (traces | where operation_Id == trace_id),
     (customEvents | where tostring(customDimensions.trace_id) == trace_id)
   | project timestamp, type, message, target, success
   | order by timestamp asc
   ```

## Output Contract

1. **Instrumentation Plan**
   - SDK/agent selected and justification
   - Sampling strategy (fixed %, adaptive, tail-based)
   - Correlation approach (trace context headers)

2. **Implementation Checklist**
   - Packages/SDKs to install
   - Code changes (SDK initialization, custom events)
   - Environment variables or Key Vault secrets

3. **Telemetry Schema**
   - Custom events (name, dimensions, metrics)
   - Business KPIs to track
   - Naming conventions (snake_case, dimensions)

4. **Dashboard & Alert Baseline**
   - Business KPI dashboard (queries provided)
   - Performance dashboard (queries provided)
   - Alert rules (thresholds, severity, channels)

5. **Validation Steps**
   - Send test event, verify in portal
   - Trace sample request end-to-end
   - Verify alerts fire on synthetic failures

## Guardrails

- **Never log secrets, PII, or credentials**: Filter sensitive data before sending.
- **Use structured logging**: JSON/structured dimensions, not free text.
- **Avoid high-cardinality dimensions**: Don't use user ID or request ID as dimension (too many unique values = high cost).
- **Set retention policy**: Default 30 days; archive old data to storage for compliance.
- **Sample intelligently**: 100% at <1M events/day; reduce sampling as volume grows.
- **Correlate traces across services**: Use W3C Trace Context headers to link requests.
- **Monitor the monitor**: Ensure Application Insights is receiving data; check quota.
- **Use alerts for SLA breaches**: Don't rely on dashboards; alerts notify on-call team.
