# Skills Directory

This folder contains reusable, model-agnostic skills.

## Available Skills

| Skill | Description |
|---|---|
| [appinsights-instrumentation](./appinsights-instrumentation/SKILL.md) | Instrument applications with Azure Application Insights and OpenTelemetry for end-to-end observability. |
| [azure-aigateway](./azure-aigateway/SKILL.md) | Design an Azure AI gateway layer for model routing, policy enforcement, and operational control. |
| [azure-cloud-migrate](./azure-cloud-migrate/SKILL.md) | Plan and execute migrations from on-premises or other clouds to Azure. |
| [azure-compliance](./azure-compliance/SKILL.md) | Map Azure architectures and operations to security and compliance controls. |
| [azure-compute](./azure-compute/SKILL.md) | Select and implement the right Azure compute platform for a workload. |
| [azure-deploy](./azure-deploy/SKILL.md) | Plan and execute Azure deployments safely and repeatably for applications and infrastructure. |
| [azure-diagnostics](./azure-diagnostics/SKILL.md) | Diagnose Azure application and infrastructure issues with a structured workflow. |
| [azure-hosted-copilot-sdk](./azure-hosted-copilot-sdk/SKILL.md) | Design and deploy copilot style assistants on Azure with secure model access and operations. |
| [azure-kusto](./azure-kusto/SKILL.md) | Write and optimize Kusto Query Language for diagnostics and operational analysis. |
| [azure-messaging](./azure-messaging/SKILL.md) | Design asynchronous messaging patterns in Azure with reliable delivery semantics. |
| [azure-prepare](./azure-prepare/SKILL.md) | Prepare Azure environments and prerequisites before deployment. |
| [azure-quotas](./azure-quotas/SKILL.md) | Assess and manage Azure service quotas and limits to prevent failures. |
| [azure-rbac](./azure-rbac/SKILL.md) | Design and apply Azure role-based access control with least privilege at the right scope. |
| [azure-resource-lookup](./azure-resource-lookup/SKILL.md) | Locate and summarize Azure resources quickly across scopes with consistent lookup patterns. |
| [azure-resource-visualizer](./azure-resource-visualizer/SKILL.md) | Create clear architecture views of Azure resources and their relationships. |
| [azure-storage](./azure-storage/SKILL.md) | Design and operate Azure Storage services for secure and efficient data access. |
| [azure-validate](./azure-validate/SKILL.md) | Validate Azure solutions against functional and non-functional requirements. |
| [entra-app-registration](./entra-app-registration/SKILL.md) | Design and configure Microsoft Entra app registrations for secure authentication and authorization. |
| [frontend-design](./frontend-design/SKILL.md) | Create distinctive, production-ready frontend interfaces with strong visual direction, accessibility, and responsiveness. |
| [shadcn](./shadcn/SKILL.md) | Complete shadcn/ui component lifecycle management for React projects. |

## Add a New Skill

Each skill lives in its own subfolder:

```
skills/
└── your-skill-name/
    ├── SKILL.md
    └── examples/
        └── example-1.md
```

See [docs/how-to-add-a-skill.md](../docs/how-to-add-a-skill.md) to get started.
