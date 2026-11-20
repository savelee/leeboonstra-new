---
title: "Headless Gemini Enterprise: Exposing Managed Agents via a Streaming API to Build Your Own Agentic Platform"
description: "How to unbundle Gemini Enterprise Managed Agents, the Interactions API, Gemini Enterprise Search RAG, and remote MCP servers behind a stateless Cloud Run streaming proxy to power multi-tenant, white-label agentic platforms."
tags:
  - Gemini Enterprise
  - Managed Agents
  - Interactions API
  - Streaming API
  - Server-Sent Events
  - Multi-Tenancy
  - MCP
  - A2A
  - Gemini Enterprise Search
  - Google Cloud
categories:
  - AI Architecture
  - Agentic Platform
  - Agents
featured: lorna-shoreline
date: 2026-11-24 12:00:00
---

Out of the box, [**Gemini Enterprise**](https://docs.cloud.google.com/gemini/enterprise/docs/concepts) gives organizations a turnkey, governed AI workspace. For end users, it looks like a unified, ready-to-use agentic platform: a web console where employees can chat with Gemini, run grounded enterprise search across internal documents, kick off deep multi-step research, discover and interact with hosted agents across your company, and take action across Google Workspace and connected business tools.

<div class="chart-container img-contain">

![Default Gemini Enterprise Web Console](/images/gemini-enterprise.png)

</div>

Unlike a basic chatbot that only answers questions, an **agentic platform** lets you automate real business processes end-to-end. You can deploy specialized agents powered by Gemini that reason over enterprise data, call internal APIs, **run scripts and code** inside isolated sandboxes, and execute either interactively in chat or **on a schedule** (such as recurring nightly reconciliations, inventory checks, or automated briefings).

For many teams, the default Gemini Enterprise console is all they need. But other organizations want to shape the platform around their own world. They may want a completely custom front-end design that matches their brand, workflows tailored to proprietary business processes, or a **Bring Your Own (BYO)** architecture—where they plug in their own fine-tuned domain models, custom MCP connectors, and specialized agents rather than adapting to a fixed SaaS interface.

You can do that with Gemini Enterprise, too. By running Gemini Enterprise **headlessly**—meaning you separate the AI engine from Google’s default web interface—you can expose **Managed Agents** and the **Interactions API** through a **Server-Sent Events (SSE) Streaming API**. In plain terms, instead of waiting for a full answer to finish, your custom app receives words, reasoning steps, and interactive data cards in real time as they are generated, while Google still handles the heavy lifting underneath (grounded search, isolated execution sandboxes, memory, and security governance).

<!--more-->

## The Business Case: One Headless Core, Five Bespoke Brands

To illustrate the multi-tenant complexity in practice, let’s walk through a concrete example where we model a **main holding company with four daughter companies**: a B2B record label and band management group called **Gemini Vibe Records**.

* **The Parent Holding Company (Label HQ)** needs centralized AI governance, shared operational agents (A&R demo evaluation, royalty & sync licensing, tour logistics, PR), **Gemini Enterprise Search RAG** (previously Vertex AI Search) grounding over master contracts and rate cards, and a control plane where platform admins can tune agent skills without redeploying code.
* **The Subsidiaries (Four Performing Artists)**—a metalcore band (**Lorna Shoreline**), a stadium rock act (**The Goo Fighters**), a pop star (**Gemi Lovato**), and an electronic dance act (**Googillaz**)—each have their own management, tour, and merchandise operations teams. They cannot share a single, mixed SaaS chat console: a tour manager working for **Lorna Shoreline** must never accidentally order tour T-shirts for **Gemi Lovato**, access another act's contracts, or mix chat sessions across rosters.

```text
+-------------------------------------------------------------------------------+
|                      5 BESPOKE BYO FRONT-ENDS (UI LAYER)                      |
| [Label HQ Ops] [Metalcore Ops] [Rock Ops]    [Pop Ops]      [Dance Ops]       |
+-------+----------------+--------------+---------------+---------------+-------+
        | SSE / JSON     | SSE / JSON   | SSE / JSON    | SSE / JSON    | SSE / JSON
+-------v----------------v--------------v---------------v---------------v-------+
|            HEADLESS GEMINI ENTERPRISE & BYO AGENTIC PLATFORM                  |
|  * Identity Brokering & Scoped RBAC (Parent Label -> Child Artist Tenants)    |
|  * Modifiable Skill Registry (Hot-swappable prompts, schemas, tool bindings)  |
|  * Gemini Enterprise Search RAG (Isolated per-artist + shared datastores)    |
|  * MCP & A2A Gateways (Merch Store DB, Royalty Ledger, Ticketing APIs)        |
+-------------------------------------------------------------------------------+
```

With a **Headless Gemini Enterprise** core, all five front-ends consume the exact same streaming API contract. Underneath, **Identity Brokering** (translating a user’s login into strict company permissions), **Gemini Enterprise Search ACLs** (document-level access filters), and **remote MCP servers** (standardized connectors to external business systems like inventory or royalty databases) enforce strict tenant isolation.

For example, the two custom artist management portals below—**Lorna Shoreline**’s dark *Merch & Pit Vault* and **The Goo Fighters**’ retro *Take Cover Tour 2026* dispatch—look completely different, yet both render their agent lists, recent sessions, streaming status, and structured `ui_card` inventory tables from the exact same headless streaming backend:

<div class="chart-container img-contain">

![Lorna Shoreline Custom Ops Portal — Merch & Pit Vault](/images/lorna-shoreline.png)

</div>

<div class="chart-container img-contain">

![The Goo Fighters Custom Ops Portal — Take Cover Tour 2026](/images/goo-fighters.png)

</div>

---

## Architecture Overview: Pure Headless Interactions API

To expose Managed Agents as a multi-tenant platform API, the cleanest pattern is a **stateless streaming and control proxy** (in my simple-to-explain example, I use FastAPI running on **Cloud Run**) sitting in front of the **Gemini Enterprise Platform**. Think of this proxy as a lightweight traffic cop: it does not store conversation history itself, so it can scale down to zero when idle and spin up instantly when traffic arrives. Its only job is to check who the caller is, enforce their permissions, and forward the live stream.

```text
[ Bespoke BYO UIs (SSE / WS)  |  External A2A Agents  |  Replicator / CLI ]
                  │                       │                    │
  (POST /api/chat/stream)        (POST /a2a/tasks/*)   (/llms.txt, /api/manifest.json)
                  ▼                       ▼                    ▼
┌──────────────────────────────────────────────────────────────────────────────┐
│            Stateless FastAPI Streaming & Control Proxy (Cloud Run)           │
│  ├── Tenant Auth & Scoped RBAC Middleware (OIDC/JWT -> tenant_id, role)      │
│  ├── Identity Brokering (User Token -> Tenant IAM / SPIFFE / MCP Claims)     │
│  ├── Control Plane (Tenants, Agents, Hot-Swappable Skill Registry, Manifest) │
│  ├── Discovery & Replication (/llms.txt, /llms-full.txt, /.well-known/agent) │
│  └── Data Plane (google-genai client.interactions.create + SSE Normalizer)   │
└───────────────────────────────────────┬──────────────────────────────────────┘
                                        │
        ┌───────────────────────────────┼───────────────────────────────┐
        ▼                               ▼                               ▼
[ Gemini Enterprise Platform ]  [ Gemini Enterprise Search ] [ Remote MCP & Storage ]
  ├── Agents API (Control)        ├── Shared Parent Stores     ├── Merch / Royalty /
  ├── Interactions API (Data)     ├── Tenant-Isolated Stores   │   Ticketing MCPs
  ├── Managed Sandbox (Capsule)   └── Document ACL / Filters   ├── GCS Artifacts
  ├── Model Armor & Gateway                                    ├── Firestore (Registry/
  ├── Memory Bank & Eval Hub                                   │   Sessions Index)
  └── BYO / Vertex Model Endpoints                             └── Cloud Scheduler
```

### Why API-First Interactions Beat CLI Wrapping

A common shortcut when prototyping agent platforms is wrapping a local agent CLI—such as the [**Antigravity CLI (`agy`)**](https://antigravity.google/docs/home), Google’s terminal-based AI coding and agent-orchestration CLI (available from [antigravity.google/download](https://antigravity.google/download))—in a subprocess pool and piping `stdout` to a web socket. While `agy` is great for local skill authoring, interactive workflows, and single-developer prototyping, wrapping a CLI subprocess for a multi-tenant production platform creates operational bottlenecks: OS subprocesses, `stdin`/`stdout` pipe locks, and stateful worker affinity that prevents scale-to-zero.

Using the **Pure Headless Interactions API** (`client.interactions.create(..., stream=True)` over HTTPS) solves this cleanly:

* **True Serverless Scale:** The Cloud Run proxy holds no subprocesses and no in-memory conversation state, allowing it to scale to zero and handle bursty multi-tenant traffic.
* [**Managed Agents & Isolated Sandboxes:**](https://docs.cloud.google.com/gemini-enterprise-agent-platform/build/managed-agents) In Gemini Enterprise, **Managed Agents** are config-driven, autonomous agents hosted and executed entirely by Google Cloud—you define the model, instructions, `SKILL.md` skills, and MCP tools via the Agents API without building or operating your own agent runtime or container fleet. Behind the Interactions API, Google runs the Antigravity agentic harness inside an isolated Linux [sandbox environment](https://docs.cloud.google.com/gemini-enterprise-agent-platform/build/managed-agents/sandbox-environment) ("capsule") with built-in `bash` and filesystem tools, handling multi-step tool loops, context caching, and async background execution (`background=true`) automatically.
* **Per-Request Identity Brokering:** Every incoming request carries a scoped OIDC/JWT token that the proxy resolves into tenant claims, Gemini Enterprise Search RAG filters, and remote MCP authorization headers before the model ever runs.

---

## How Managed Agents & Stateful Sessions Work

Even though the Cloud Run proxy is completely stateless, conversations remain stateful across turns by delegating session continuity to the [**Interactions API**](https://docs.cloud.google.com/gemini-enterprise-agent-platform/build/managed-agents/interact-with-agents) and [**Memory Bank**](https://docs.cloud.google.com/gemini-enterprise-agent-platform/scale/memory-bank).

### 1. Stateless Proxy, Stateful Sessions (`previous_interaction_id`)

1. **Turn 1:** The client sends `POST /api/chat/stream` without an `interaction_id`. The proxy invokes `client.interactions.create(..., stream=True)`, receives a new `interaction_id` in the `init` and `done` frames, and persists `last_interaction_id` in the tenant-scoped session index (e.g., Firestore).
2. **Turn 2+:** The client sends the next prompt with its `session_id`. The proxy looks up `session.last_interaction_id` and passes it as `previous_interaction_id` to `client.interactions.create(...)`. Gemini Enterprise automatically reconstructs the prior turn history, tool outputs, and context cache server-side.

### 2. Inside a Single Turn

Each agent is registered in the **Agents API** (`projects/{project}/locations/{location}/agents/{agent_id}`) with a target model (such as `gemini-4-hydrogen` on `location="global"` or a custom fine-tuned Vertex AI endpoint), system instructions, and bound tools:

* **Gemini Enterprise Search RAG:** Grounding queries execute with the caller's brokered `tenant_id` filter—for example, `tenant_id: ANY("<tenant_id>", "shared-policy")`. Unauthorized documents never enter the model's context window, and returned `groundingChunks` are normalized into `rag_citation` SSE events.
* **Remote MCP Tools:** The proxy forwards signed tenant or SPIFFE claims to remote MCP servers (such as merch inventory, royalty ledgers, or ticketing APIs), emits `tool_call` and `tool_result` SSE events, and maps structured tool responses into typed `ui_card` SSE events.
* **Google Workspace (3-Legged OAuth):** For user-scoped Workspace actions (Drive, Docs, Sheets, Gmail, Calendar), the proxy exchanges per-user OAuth tokens from Secret Manager or an OAuth vault so Workspace MCP connectors act strictly with the caller's actual permissions rather than a shared service account.
* **Deep Research & Async Jobs (`background=true`):** Long-running synthesis tasks triggered via `POST /api/jobs` run asynchronously with `background=true`, streaming structured progress and persisting final artifacts to tenant-scoped Cloud Storage prefixes (`gs://<bucket>/tenants/<tenant_id>/artifacts/`).

---

## Exposing the Streaming API (Data Plane)

In platform architecture, the **Data Plane** is the live traffic lane where user messages, search results, and AI responses flow in real time. To let any front-end—whether a React dashboard, a mobile app, or a custom artist management portal—render rich agentic experiences without tying itself to Gemini-specific SDK internals, the proxy exposes a normalized **Data Plane** and a **Canonical SSE Event Schema**.

### Core Data Plane Endpoints

| Endpoint | Transport | Purpose |
| :--- | :--- | :--- |
| `POST /api/auth/token` | HTTP JSON | Exchanges credentials or persona context for a scoped JWT (`tenant_id`, `role`). |
| `POST /api/chat/stream` | HTTP **SSE** (`text/event-stream`) | Primary stateless streaming endpoint for all white-label UIs. |
| `WS /ws/chat` | **WebSocket** | Bidirectional streaming for interactive builders needing mid-turn cancellation. |
| `POST /api/chat` | HTTP JSON | Non-streaming fallback returning the completed run payload. |
| `POST /api/jobs` | HTTP JSON (`202 Accepted`) | Triggers `background=true` async interactions for long-running research or Cloud Scheduler jobs. |
| `GET /api/jobs/{interaction_id}` | HTTP JSON / SSE | Polls or attaches to an in-flight background interaction. |
| `GET /api/sessions` | HTTP JSON | Lists tenant- and user-scoped conversation sessions for sidebar history. |
| `GET /api/sessions/{session_id}` | HTTP JSON | Retrieves session metadata, `last_interaction_id`, and message history. |
| `PATCH /api/sessions/{session_id}` | HTTP JSON | Updates session metadata (such as `pinned` state). |
| `DELETE /api/sessions/{session_id}` | HTTP `204 No Content` | Deletes a tenant-scoped session. |
| `POST /api/files` | Multipart HTTP JSON | Uploads files to tenant-scoped GCS and returns an `artifact_uri` for chat turns. |

### The Canonical SSE Event Schema

Every front-end consumes the exact same SSE frame format (`event: <type>\ndata: <json>\n\n`). Think of it like a universal shipping container: the backend sends standardized data packets, and each brand’s front-end decides how to display them on screen. Separating **what the event means** from **how it looks** is what allows five radically different UIs to share one backend:

| Event Type | Payload Fields | Purpose |
| :--- | :--- | :--- |
| `init` | `interaction_id`, `session_id`, `agent_id`, `tenant_id`, `model` | Emitted at stream start with resolved tenant and session context. |
| `thought` | `step`, `label`, `detail` | Intermediate reasoning/planning steps (rendered as an amp-stack signal chain, tape counter, or BPM telemetry depending on the UI). |
| `tool_call` | `call_id`, `tool_name`, `server`, `args` | Remote MCP or Search tool invocation (sensitive arguments redacted via Model Armor / DLP). |
| `tool_result` | `call_id`, `tool_name`, `status`, `summary` | Tool execution outcome returned to the model. |
| `rag_citation` | `citation_id`, `datastore_id`, `title`, `uri`, `snippet`, `page` | Grounded Gemini Enterprise Search RAG source chunk (rendered as contract chips or tour memos). |
| `ui_card` | `card_type`, `schema_version`, `data` | Structured domain payload (`catalog_grid`, `product_card`, `bundle_quote`, `order_receipt`, `event_schedule`, `data_table`). |
| `delta` | `text` | Incremental assistant markdown/text token delta. |
| `done` | `interaction_id`, `usage` (`input_tokens`, `output_tokens`, `search_queries`, `tool_calls`), `latency_ms` | Final frame; client stores `interaction_id` as `previous_interaction_id` for the next turn. |
| `error` | `code`, `message`, `retryable` | Structured error (e.g., `403 TENANT_ISOLATION_VIOLATION`, `429 QUOTA_EXCEEDED`). |

### Streaming Request Flow in Python

Inside the FastAPI streaming handler, the proxy authenticates the caller, builds the tenant-scoped Discovery Engine filter and signed MCP claims, and streams normalized frames from the `google-genai` client:

```python
from fastapi import APIRouter, Depends
from fastapi.responses import StreamingResponse
from google import genai

router = APIRouter()

@router.post("/api/chat/stream")
async def chat_stream(request: ChatRequest, ctx: TenantContext = Depends(resolve_tenant_rbac)):
    # 1. Initialize Vertex AI client (use location="global" for preview/hydrogen models)
    client = genai.Client(vertexai=True, project=GCP_PROJECT, location="global")

    # 2. Load previous_interaction_id for Turn 2+ continuity
    session = await session_store.get_or_create(ctx.tenant_id, request.session_id)

    async def event_generator():
        stream = client.interactions.create(
            agent=f"projects/{GCP_PROJECT}/locations/global/agents/{request.agent_id}",
            input=request.prompt,
            previous_interaction_id=session.last_interaction_id,  # None on Turn 1
            stream=True,
        )

        interaction_id = None
        for chunk in stream:
            for sse_event, payload in normalize_chunk_to_sse(chunk, ctx, session.id):
                if sse_event == "init":
                    interaction_id = payload["interaction_id"]
                yield f"event: {sse_event}\ndata: {json.dumps(payload)}\n\n"

        if interaction_id:
            await session_store.update_last_interaction(ctx.tenant_id, session.id, interaction_id)

    return StreamingResponse(event_generator(), media_type="text/event-stream")
```

On the client side, a lightweight shared JavaScript SDK (`fetch` + `ReadableStream`) reads each incoming event, updates the `session_id`, and hands `ui_card` data to each brand's native UI components. Because `ui_card` carries pure structured data (`catalog_grid`, `bundle_quote`, `data_table`) rather than pre-styled HTML, the metalcore ops portal renders a high-contrast crimson-and-black card while the pop management portal renders an iridescent rounded card—zero backend changes required.

---

## Control Plane & Hot-Swappable Skills

While the Data Plane handles live chat traffic, the **Control Plane** is the admin settings layer where platform owners configure tenants, agents, data sources, and skills. A platform is only useful to enterprise teams if domain owners can tune agent behavior without waiting on a software deployment. The Control Plane manages tenants, Agents API registrations, datastores, MCP bindings, and a live **Skill Registry**.

### Agents vs. Skills: Holding Company Control & Subsidiary Autonomy

Before looking at how skills are updated at runtime, it helps to separate what an **Agent** is from what a **Skill** is:

* **What an Agent Is (The Persona & Runtime Binding):** An **Agent** is a configured, goal-oriented assistant registered in the Agents API (`model`, system instructions, bound Gemini Enterprise Search RAG datastores, remote MCP servers, and attached skills).
  * *Example — The T-Shirt & Merch Ordering Agent:* Every artist team uses a **Merch Ordering Agent** connected to the `merch-mcp` server (`list_products`, `check_size_stock`, `quote_bundle`, `submit_order`). When a tour manager for *Lorna Shoreline* asks for Tokyo stock on XL tour tees and blood-red vinyl, the agent queries only Lorna Shoreline’s inventory partition and streams back a structured `ui_card` order table—never touching *Gemi Lovato*’s catalog.
* **What a Skill Is (The Portable Business Rule):** A **Skill** is a modular, reusable instruction package defined in a portable `SKILL.md` file with typed parameters. It teaches an agent *how* to execute a specific business rule or workflow without touching application code.
  * *Example Skill — `create_tour_merch_bundle`:* Defines the exact sizing ratios, minimum order quantities, and restock discount rules (for example, `bulk_tee_discount_pct: 15` when ordering 100+ XL tour tees alongside vinyl) that the Merch Ordering Agent follows whenever a tour manager requests a bundle quote.

In a holding-company model like **Gemini Vibe Records**, this separation unlocks both centralized governance and local autonomy:

* **Top-Down Distribution:** Label HQ can centrally author and push standardized agents—such as the **T-Shirt & Merch Ordering Agent** or **Tour & Rider Logistics Agent**—and baseline compliance skills down to all four artist subsidiaries at once.
* **Subsidiary Customization:** Each daughter company can also create its own unique, tenant-isolated agents and skills tailored to its own operations—for example, *Lorna Shoreline*’s **Lore & Rig Technician** agent (with a skill for guitar tunings and amp chains) or *Googillaz*’s **Track-ID & BPM Detective**—without exposing them to sibling acts.

That combination—centralized governance pushed from the top, paired with local agent and skill creation at the edges—is the whole core and purpose of building your own agentic platform.

### Control Plane Endpoints

| Endpoint | Method | Purpose |
| :--- | :--- | :--- |
| `/api/tenants` | `GET`, `POST` | List or onboard parent/child tenants and their datastore/RBAC scopes. |
| `/api/agents` | `GET`, `POST`, `PUT` | Register or update agent resources via the **Agents API**. |
| `/api/skills` | `GET`, `POST` | List or register modular skills (`SKILL.md` + parameter JSON/YAML). |
| `/api/skills/{skill_id}` | `GET`, `PUT`, `DELETE` | Read or **hot-swap** a skill's instructions or parameters and patch the bound agent. |
| `/api/datastores` | `GET`, `POST` | Register Gemini Enterprise Search RAG datastores and their `tenant_id` ACL filter templates. |
| `/api/mcp-servers` | `GET`, `POST` | Register remote MCP server endpoints, Secret Manager refs, and egress allowlists. |

### How Hot-Swappable Skills Work

1. **Author:** A skill is defined as a portable `SKILL.md` file paired with typed parameters (e.g., `quote_sync_license` with `indie_film_discount_pct: 15`). Live transactional data stays out of `SKILL.md` and lives in MCP tools or Gemini Enterprise Search RAG.
2. **Edit Live:** A Label HQ admin opens the Skill Studio in the UI, changes `indie_film_discount_pct` from `15` to `25`, and saves (`PUT /api/skills/quote_sync_license`).
3. **Instant Effect:** The proxy validates the schema, versions the skill in Firestore, and patches the bound agent via the **Agents API** (`UpdateAgent`) or passes the updated skill version override on the next `interactions.create` call. The very next `POST /api/chat/stream` request reflects the updated rule immediately.

---

## Multi-Tenancy, Double-Fence Security & Governance

In a B2B2X architecture, prompt instructions alone are never a security boundary. Even if a user attempts a prompt injection across tenants (for example, a manager for *The Goo Fighters* trying to query *Gemi Lovato*'s royalty ledger), the platform enforces **Double-Fence Isolation**:

1. **Proxy RBAC Gate:** The FastAPI middleware validates the caller's OIDC/JWT before `interactions.create` is ever called, verifying that `(user_id, tenant_id, role)` has permission to invoke the requested `agent_id`.
2. **Gemini Enterprise Search ACL Filters:** Every retrieval call injects a mandatory `tenant_id` filter (`tenant_id: ANY("<tenant_id>", "shared-policy")`), preventing cross-tenant documents from entering the model's context.
3. **Remote MCP Row-Level Isolation:** The proxy forwards signed tenant claims (or a **SPIFFE SVID**—a verifiable digital ID badge for the agent) to remote MCP servers. Each MCP server independently filters database rows by `tenant_id` and returns `403 TENANT_ISOLATION_VIOLATION` on mismatch.
4. **Model Armor & Secret Manager:** **Model Armor** inspects inputs and tool arguments for prompt injections or PII leaks before execution. Remote MCP credentials and third-party API keys are stored in **Google Cloud Secret Manager** (`auth_secret_ref`)—never hardcoded in manifests or `SKILL.md`.
5. **B2B2X Usage Metering & Evaluation:** The `done` SSE event emits `input_tokens`, `output_tokens`, `search_queries`, and `tool_calls` per tenant into Cloud Monitoring or BigQuery for subsidiary chargebacks, while `interaction_id` traces flow to the **Evaluation Hub** to track groundedness and tool accuracy.

---

## Making Your Platform Agent-Ready: A2A & Declarative Manifests

Exposing a human-facing streaming UI is only half the story. Modern agentic platforms also need to be callable by external agents and replicable across environments.

### Agent-to-Agent (A2A) Protocol Surface

The **Agent-to-Agent (A2A)** protocol is a shared standard that lets one AI agent ask another AI agent for help—much like an API between two software services. By exposing standard A2A endpoints alongside `/api/chat/stream`, parent Label HQ agents can delegate tasks to child artist agents, or external enterprise systems can invoke your platform directly without scraping UI streams:

* `GET /.well-known/agent.json` — Platform-level A2A Agent Card advertising capabilities, auth schemes (OIDC/SPIFFE), and tenant discovery.
* `GET /tenants/{tenant_id}/agents/{agent_id}/.well-known/agent.json` — Tenant- and agent-specific Agent Card listing declared skills and output modes.
* `POST /a2a/tasks/send` — Synchronous A2A task execution (maps to non-streaming `interactions.create`).
* `POST /a2a/tasks/sendSubscribe` — Streaming A2A task execution (maps to `interactions.create(..., stream=True)` over SSE).

### Discovery & Declarative Replication (`PlatformManifest`)

To make the platform self-describing—so developers or automated setup tools can inspect what agents exist and spin up an identical copy in a new environment—expose discovery endpoints (`/developers`, `/openapi.json`, `/llms.txt`, `/llms-full.txt`) alongside a blueprint API (`GET /api/manifest.json` and `POST /api/manifest/apply`):

```yaml
apiVersion: headless-ge.octo.dev/v1
kind: PlatformManifest
metadata:
  name: gemini-vibe-records
  default_location: global
  default_model: gemini-4-hydrogen

tenants:
  - id: vibe-records
    role: parent_admin
    datastore_scope: ["*"]
  - id: lorna-shoreline
    parent: vibe-records
    role: child_tenant
    datastore_scope: ["lorna-shoreline", "shared-policy"]

skills:
  - id: quote_sync_license
    version: "1.2.0"
    source: /api/skills/quote_sync_license/SKILL.md
    parameters:
      indie_film_discount_pct: 15

datastores:
  - id: label-contracts-rag
    type: vertex_ai_search
    acl_mode: tenant_filter

mcp_servers:
  - id: merch-mcp
    url: https://merch-mcp.internal.run.app/mcp
    auth_secret_ref: projects/${PROJECT_ID}/secrets/merch-mcp-token/versions/latest
    egress_allowlist: ["merch-mcp.internal.run.app"]

agents:
  - id: management-agent
    tenant_scope: ["vibe-records"]
    model: gemini-4-hydrogen
    skills: ["quote_sync_license", "score_demo_submission"]
    datastores: ["label-contracts-rag"]
    mcp_servers: ["royalty-mcp"]
```

Always enforce two invariants on the manifest surface: never inline raw secrets (emit `auth_secret_ref` Secret Manager paths instead), and enforce caller RBAC on `GET /api/manifest.json` so child tenants cannot enumerate sibling tenants, agents, or datastores.

---

## Wrapping Up

You do not need to accept a one-size-fits-all chat console to get the enterprise security, grounding, memory, and sandboxed execution of **Gemini Enterprise**. By placing a stateless **Cloud Run** proxy in front of **Managed Agents** and the **Interactions API**, normalizing responses into a canonical **SSE Streaming API**, and enforcing **Double-Fence Isolation** across Gemini Enterprise Search RAG and remote MCP servers, you can turn Gemini Enterprise into the headless engine behind any white-label or multi-tenant agentic platform.

---

## Further Reading & Official Documentation

* **[Gemini Enterprise Concepts & Overview](https://docs.cloud.google.com/gemini/enterprise/docs/concepts)** — Core architecture, data stores, blended search, and enterprise governance.
* **[Managed Agents API on Gemini Enterprise Agent Platform](https://docs.cloud.google.com/gemini-enterprise-agent-platform/build/managed-agents)** — Overview of the Managed Agents runtime, isolated sandboxes, and REST-first agent management.
* **[Interact with Managed Agents](https://docs.cloud.google.com/gemini-enterprise-agent-platform/build/managed-agents/interact-with-agents)** — Multi-turn session state, runtime payloads, and dynamic configuration overrides.
* **[Managed Agents Sandbox Environment & Skills](https://docs.cloud.google.com/gemini-enterprise-agent-platform/build/managed-agents/sandbox-environment)** — Container isolation, `SKILL.md` mounting, and built-in sandbox tools.
* **[Interactions API Overview](https://aistudio.google.com/docs/interactions-overview)** — Stateful `interactions.create` interface, `previous_interaction_id`, streaming, and `background=true` execution.
* **[Memory Bank on Gemini Enterprise Agent Platform](https://docs.cloud.google.com/gemini-enterprise-agent-platform/scale/memory-bank)** — Persistent, cross-session memory generation and retrieval for personalized agent continuity.
* **[Register and Manage A2A Agents in Gemini Enterprise](https://docs.cloud.google.com/gemini/enterprise/docs/register-and-manage-an-a2a-agent)** — Connecting and orchestrating Agent2Agent (A2A) services on Google Cloud.

