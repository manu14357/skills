---
name: azure-hosted-copilot-sdk
description: >
  Design and deploy copilot-style assistants on Azure with secure model access, tool integration, and observability.
  Use this skill when users ask to build assistants, agents, or copilot workflows in Azure.
  Covers orchestration, retrieval, safety guardrails, and production deployment.
compatibility:
  models: [any-llm]
  cloud: azure
  ai: [copilot, assistant, agent]
---

# Azure Hosted Copilot SDK

Build production-grade copilots on Azure with enterprise controls, tool safety, and predictable operations.

## Use This Skill When

- The user wants to build a customer-facing or internal assistant
- The user needs architecture for prompts, tools, retrieval, and safety
- The user needs deployment guidance and cost controls for copilot workloads
- The user asks about model routing, fallback, or multi-turn conversations

## Context: Copilot Maturity

**Immature**: Hardcoded prompt, single model, no tool safety  
**Developing**: Template-based system prompt, basic tool whitelist  
**Managed**: Versioned prompts, tool isolation, token budgets, structured logging → **Target**  
**Optimized**: Dynamic prompt selection, multi-model routing, real-time safety evaluation, feedback loops

## Required Inputs

- **Use case**: Customer support? Data analyst? Content generator? Internal ops?
- **User scale**: <100 users? 1M+ concurrent users?
- **Model provider**: Azure OpenAI? Third-party API? Mixed?
- **Tool access**: What actions should the copilot take? (Email, DB query, file access?)
- **Data scope**: Should it access company data? User files? Public internet?
- **Budget**: Cost per user? Token budget per session?
- **Latency**: Real-time (<1s)? Batch acceptable?
- **Compliance**: PII handling? Data residency? Audit requirements?

## Decision Tree

```
What's the primary use case?
├─ Customer support (knowledge base, FAQ) → Retrieval augmented generation (RAG)
├─ Data analysis (SQL queries, spreadsheets) → Tool calling + sandbox
├─ Content generation (marketing, docs) → Fine-tuned or prompt-engineered
├─ Internal assistant (ops, IT help) → Multi-tool + controlled access
└─ Specialized domain (medical, legal) → Compliance checks + audit trail

How many users will this serve?
├─ < 100 (pilot) → Single model, shared prompt, simple logging
├─ 100-10K (growing) → Multi-instance, load balancing, token budgets
└─ 10K+ (scale) → Multi-region, model fallback, cost controls

What data should the copilot access?
├─ None (generic) → Just prompt engineering
├─ Public data → Semantic search, embeddings
├─ Private company data → Secure retrieval, managed identity, auditable
└─ User-specific data → Tenant isolation, row-level access control

What actions can the copilot take?
├─ Read-only (analyze, explain) → No tool safety needed
├─ Read-write (email, create docs) → Tool sandboxing, approval workflows
└─ Restricted (delete, financial) → Explicit approval, audit trail, rate limits
```

## Workflow

### Phase 1: Define Copilot Scope & Safety Boundaries

1. **System prompt design** (versioned):
   ```
   You are ProductBot, a customer support assistant.
   
   ✓ You can: Answer FAQs, suggest solutions, escalate to human
   ✗ You cannot: Accept payment, access customer passwords, make promises on behalf of support team
   
   Always:
   - Be friendly and professional
   - If unsure, ask the customer for clarification
   - Offer to escalate to human agent if customer frustrated
   ```

2. **Tool whitelist** (what the copilot can do):
   ```
   Tool: lookup_knowledge_base
   ├─ Purpose: Search company FAQs and docs
   ├─ Inputs: query (string)
   ├─ Returns: matching articles
   ├─ Rate limit: 100/min
   └─ Safety: Read-only, no side effects
   
   Tool: create_support_ticket
   ├─ Purpose: Open a ticket for human agent
   ├─ Inputs: customer_email, issue_summary, priority
   ├─ Returns: ticket_id
   ├─ Rate limit: 10/min per customer
   └─ Safety: Requires verification, audit logged
   
   Tool: send_email_to_customer
   ├─ Purpose: Send follow-up email
   ├─ Inputs: recipient, body
   ├─ Returns: status
   ├─ Rate limit: 1/min per unique recipient
   └─ Safety: ⚠️ Restricted - only on approval workflow
   ```

3. **Safety guardrails**:
   ```
   ✓ Input validation
      └─ Reject prompts > 10K tokens (prevent token stuffing)
      └─ Reject special characters in tool args (SQL injection prevention)
   
   ✓ Output filtering
      └─ Redact email addresses and phone numbers (before sending to user)
      └─ Block generation of malware, illegal content
   
   ✓ Rate limiting
      └─ Per-user: 100 requests/hour
      └─ Per-IP: 1000 requests/hour
   
   ✓ Approval workflows
      └─ send_email_to_customer: Require human review
      └─ delete_customer_record: Disabled (no tool access)
   ```

### Phase 2: Choose Orchestration Stack

**Option 1: Azure Cognitive Services + Custom Orchestration**
```
User → [App Service] 
       ├─ Chat handler
       ├─ Context manager (chat history)
       ├─ Tool dispatcher
       └─ Safety checks
       
       ↓ (Azure OpenAI API)
       
       [Azure OpenAI] → Generate response + tool calls
       
       ↓ (tool call response)
       
       [App Service] → Execute tool + loop back to model
```

**Option 2: Semantic Kernel (Microsoft)**
```csharp
// .NET
var builder = Kernel.CreateBuilder()
    .AddAzureOpenAIChatCompletion(
        deploymentName: "gpt-4",
        endpoint: "https://myai.openai.azure.com/",
        apiKey: kvClient.GetSecret("openai-key").Value.Value)
    .Plugins.AddFromType<ToolPlugin>();

var kernel = builder.Build();

var response = await kernel.InvokePromptAsync(
    """
    You are a helpful assistant. Use tools to help the user.
    Question: {{$input}}
    """
);
```

**Option 3: LangChain / LangGraph (Python)**
```python
# Python
from langchain.chat_models import AzureChatOpenAI
from langchain.tools import Tool
from langgraph.graph import StateGraph

llm = AzureChatOpenAI(
    deployment_name="gpt-4",
    azure_endpoint="https://myai.openai.azure.com/",
    api_key=kv.get_secret("openai-key")
)

tools = [search_kb_tool, create_ticket_tool]
agent = create_tool_calling_agent(llm, tools, system_prompt)
```

### Phase 3: Implement Retrieval (if knowledge-grounded)

1. **Setup Azure AI Search** (semantic search):
   ```bash
   # Create search service
   az search service create \
     --resource-group $RG \
     --name "search-${app}-${env}" \
     --sku "standard" \
     --partition-count 1 \
     --replica-count 1
   ```

2. **Ingest documents** (embeddings):
   ```bash
   # Upload PDFs, docs → Search index with embeddings
   # Each document: text + metadata (source, date, author)
   ```

3. **Query from copilot**:
   ```csharp
   // C#
   var results = await searchClient.SearchAsync<SearchDocument>(
       "How do I reset my password?",
       new SearchOptions { 
           QueryType = SearchQueryType.Semantic,
           SemanticConfiguration = "default",
           Top = 3 
       }
   );
   
   // Inject top results into system prompt
   var context = string.Join("\n", results.Value.GetResults()
       .Select(r => r.Document["content"]));
   
   var prompt = $"Context: {context}\nQuestion: How do I reset my password?";
   ```

### Phase 4: Deploy & Configure

1. **Deploy to Azure**:
   ```bash
   # Option 1: App Service
   az webapp up --runtime "DOTNET:6.0" \
     --resource-group $RG \
     --name "copilot-${app}-${env}"
   
   # Option 2: Container Apps (modern)
   az containerapp create \
     --resource-group $RG \
     --name "copilot-${app}" \
     --image "myacr.azurecr.io/copilot:latest" \
     --environment $ENV \
     --target-port 5000
   ```

2. **Configure secrets** (no hardcoding):
   ```bash
   # Store in Key Vault
   az keyvault secret set \
     --vault-name $KV \
     --name "openai-api-key" \
     --value "$OPENAI_KEY"
   
   # App reads via managed identity
   ```

3. **Set environment variables**:
   ```bash
   az webapp config appsettings set \
     --resource-group $RG \
     --name "copilot-${app}" \
     --settings \
       "AZURE_OPENAI_ENDPOINT=https://myai.openai.azure.com/" \
       "AZURE_OPENAI_MODEL=gpt-4" \
       "AZURE_SEARCH_ENDPOINT=https://search-${app}.search.windows.net/" \
       "TOOL_TIMEOUT_MS=30000" \
       "MAX_TOKENS_PER_REQUEST=4000"
   ```

### Phase 5: Implement Token & Cost Controls

1. **Token budgeting**:
   ```python
   # Track usage per user/session
   class TokenBudget:
       def __init__(self, tokens_per_hour=100_000):
           self.limit = tokens_per_hour
           self.used_this_hour = 0
       
       def check_budget(self, estimated_tokens):
           if self.used_this_hour + estimated_tokens > self.limit:
               raise BudgetExceededError()
           self.used_this_hour += estimated_tokens
       
       def reset_hourly(self):
           self.used_this_hour = 0
   ```

2. **Cost monitoring**:
   ```bash
   # Log token usage to Application Insights
   logger.LogInformation($"Request: {tokens_in}, Response: {tokens_out}, Cost: ${cost}");
   
   # Query: Daily cost by user
   customMetrics
   | where name == "copilot_tokens"
   | summarize sum(value) by user_id, bin(timestamp, 1d)
   ```

### Phase 6: Observability & Safety Monitoring

1. **Instrument traces**:
   ```csharp
   // Log every interaction
   var activity = new Activity("copilot_interaction").Start();
   activity.AddTag("user_id", userId);
   activity.AddTag("session_id", sessionId);
   activity.AddTag("model", "gpt-4");
   activity.AddTag("tokens_in", tokensIn);
   activity.AddTag("tokens_out", tokensOut);
   activity.AddTag("tool_calls", toolCalls.Count);
   activity.AddTag("latency_ms", stopwatch.ElapsedMilliseconds);
   activity.Dispose();
   ```

2. **Alert on anomalies**:
   - High latency: >5 seconds
   - Token overrun: >4K tokens per request
   - Tool failures: >5% error rate
   - Abusive patterns: Same user >100 requests/hour

3. **Capture user feedback**:
   ```
   [Helpful 👍] [Not helpful 👎] [Report abuse 🚩]
   
   → Store feedback in database
   → Retrain or prompt-tune based on patterns
   ```

### Phase 7: Rollout & Failover

1. **Canary deployment** (5% users → 100%):
   ```bash
   # Deploy new copilot version to 5% of traffic
   # Monitor error rate, latency, cost
   # If healthy, gradually shift traffic
   ```

2. **Model fallback**:
   ```python
   # If GPT-4 fails, fallback to GPT-3.5-turbo
   try:
       response = await gpt4_client.call(prompt)
   except APIError:
       response = await gpt35_client.call(prompt)
   ```

3. **Rollback plan**:
   ```
   If latency > 2x or error rate > 5%:
   ├─ Switch traffic to previous version
   ├─ Investigate root cause
   ├─ Fix and re-deploy
   ```

## Output Contract

1. **Copilot Architecture Blueprint**
   - System prompt and safety guardrails
   - Tool whitelist with rate limits
   - Orchestration stack (Semantic Kernel, LangChain, custom)

2. **Deployment Configuration**
   - Infrastructure (App Service, Container Apps, AKS)
   - Secrets management (Key Vault)
   - Model endpoint and fallback strategy

3. **Observability Plan**
   - Token usage tracking and budgeting
   - Latency and error rate SLOs
   - User feedback loops

4. **Safety & Compliance**
   - Input/output filtering rules
   - Approval workflows for restricted actions
   - Audit trail for sensitive operations

5. **Operational Runbook**
   - Deployment and rollback procedures
   - Incident response (model outage, safety violation)
   - Cost optimization (model selection, token budgeting)

## Guardrails

- **Enforce least privilege**: Tools should only access data they need.
- **Version system prompts**: Track changes, enable rollback.
- **Sandbox tool execution**: Run in isolated environment, short timeout (<30s).
- **Redact sensitive data**: Never return API keys, passwords, or PII.
- **Rate limit aggressively**: Prevent token stuffing and abuse.
- **Monitor model outputs**: Flag and block unsafe content generation.
- **Require approval for destructive actions**: Email, delete, payments need human review.
