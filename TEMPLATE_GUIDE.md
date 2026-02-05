# Enterprise Copilot Template Guide

This codebase has been architected to serve as a **Universal Enterprise Copilot**. While currently configured as a "CFO Copilot", the underlying patterns (MCP Data Layer + LLM Context + Persona UI) are universal.

## 1. Architecture Mapping for Your Friends

Here is how your friends can adapt `cfo-copilot` for their specific "Problem Statements":

| Component | CFO Copilot (Current) | Sales AI (Revenue) | Recruiting AI (Talent) | Data Hub (BI) | Ops AI (Supply Chain) |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Personas** | CFO, Controller, AP Clerk | VP Sales, AE, RevOps | Recruiter, Hiring Manager | Exec, Data Analyst | COO, Plant Mgr, Logistics |
| **Data Source** | Sage, NetSuite, QB | Salesforce, HubSpot, Outreach | Greenhouse, LinkedIn, Workday | *All Systems Unified* | SAP, Oracle SCM, IoT Hub |
| **Templates** | "AR Aging", "Burn Rate" | "Stalled Deals", "Forecast Risk" | "Candidate Match", "Time-to-Fill" | "Cross-System KPI", "Churn" | "Inventory Low", "Shipment Delay" |
| **MCP Layer** | `mcp.ts` (Finance Logic) | `crm_mcp.ts` (Pipeline Logic) | `ats_mcp.ts` (Skill Logic) | `unified_mcp.ts` (Joins) | `scm_mcp.ts` (ERP Logic) |
| **AI Context** | GL Ranges, GAAP Rules | Sales Stages (MEDDIC/BANT) | Skills Taxonomy, Boolean Search | SQL Dialects, Bi-Tools | Lead Times, BOM Structures |

## 2. Adaptation Steps (How to use this Template)

### Step 1: Clone & Rename
Download this folder and rename it (e.g., `sales-copilot`).
```bash
npm install
```

### Step 2: Define New Types (`src/lib/types.ts`)
Change `Persona` and `DataSource` unions.
```typescript
// For Sales Copilot
export type Persona = 'VP Sales' | 'Account Executive' | 'SDR';
export type DataSource = 'Salesforce' | 'HubSpot' | 'Gong';
```

### Step 3: Update Domain Logic (`src/lib/mcp.ts` & `templates.ts`)
Replace the Finance SQL templates with domain-specific queries.
*   *Sales Example:* `SELECT Name, Stage, Amount FROM Opportunities WHERE Probability > 50%`
*   *Recruiting Example:* `SELECT CandidateName, MatchScore FROM Applications WHERE RoleId = '123'`

### Step 4: System Prompt (`src/lib/llm.ts`)
Update the `systemPrompt` variable to teach the AI the new rules.
*   *Ops Example:* "You are an Ops Assistant. Monitor 'Safety Stock' levels. Critical = < 10 units."

## 3. GitHub Push Instructions

To push this template to GitHub so your friends can clone it:

1.  **Initialize Git**:
    ```bash
    git init
    git add .
    git commit -m "Initial commit of Enterprise Copilot Template"
    ```

2.  **Create Repository**:
    Go to GitHub.com -> New Repository -> Name it (e.g., `enterprise-copilot-starter`).

3.  **Push**:
    ```bash
    git remote add origin https://github.com/YOUR_USERNAME/enterprise-copilot-starter.git
    git branch -M main
    git push -u origin main
    ```

## 4. Why This Architecture Wins
*   **Unified Interface**: Frontend is decoupled from the data.
*   **Secure**: Data masking (SSN, etc.) is handled in the middleware (`mcp.ts`) before reaching the UI or LLM.
*   **Extensible**: Adding a new "Skill" is just adding an object to the `QUERY_TEMPLATES` array.
