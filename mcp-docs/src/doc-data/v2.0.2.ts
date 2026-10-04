import { getV2CommonSections } from "./v2-common";

const releaseNotesSection = {
  "id": "v2-0-2-release-notes",
  "title": "v2.0.2 Release & Migration",
  "items": [
    {
      "id": "v202-summary",
      "title": "Executive Summary",
      "content": [
        { "type": "paragraph", "text": "Version **2.0.2** of `@ananay-nag/mcp-decorators` introduces first-class native support for **`McpServer`** from `@modelcontextprotocol/sdk` (`^1.32.0`), deprecates the low-level **`Server`** class with runtime notices, resolves compiler warnings (`TS6133`, `TS6385`), and modernizes server transport patterns (Streamable HTTP & Stdio)." },
        {
          "type": "table",
          "headers": ["Area", "Change", "Details"],
          "rows": [
            ["**Core Engine**", "Native `McpServer` Support", "Direct registration of `McpServer` (`@modelcontextprotocol/sdk/server/mcp.js`) with automatic capability attachment."],
            ["**Prompts**", "`argsSchema` Support", "Accepts standard Zod schema records via `argsSchema` on `@Prompt()` decorators in addition to raw argument arrays."],
            ["**Deprecation**", "Low-Level `Server`", "Extending `Server` from `@modelcontextprotocol/sdk/server/index.js` emits runtime warnings; scheduled for removal in `v3.0.0`."],
            ["**Transports**", "Streamable HTTP", "First-class support for `StreamableHTTPServerTransport` (Node.js) and `WebStandardStreamableHTTPServerTransport` (Web Standards runtimes)."],
            ["**Registration**", "New SDK Methods", "Auto-routes to `.registerTool()`, `.registerPrompt()`, and `.registerResource()` with graceful fallback for legacy SDK versions."],
            ["**Type System**", "Warning Elimination", "Eliminated compiler warnings `TS6133` (unused variables) and `TS6385` (deprecated symbols). Full `tsc --noEmit` clean pass."]
          ]
        }
      ]
    },
    {
      "id": "v202-deprecations",
      "title": "Deprecations & Roadmap",
      "content": [
        { "type": "heading", "level": 3, "text": "1. Deprecation of Low-Level Server Class" },
        {
          "type": "alert",
          "style": "warning",
          "text": "Status: DEPRECATED as of v2.0.2. Scheduled Removal: v3.0.0 (Next Major Version). In @modelcontextprotocol/sdk v1.32.0+, Server was marked deprecated in favor of McpServer."
        },
        { "type": "paragraph", "text": "In `@modelcontextprotocol/sdk` v1.32.0+, the low-level `Server` class from `@modelcontextprotocol/sdk/server/index.js` was officially marked `@deprecated Use McpServer instead for the high-level API. Only use Server for advanced use cases.`" },
        { "type": "paragraph", "text": "In `@ananay-nag/mcp-decorators` v2.0.2, the following actions have been executed:" },
        {
          "type": "list",
          "items": [
            "**Unused Import Removal:** Removed unused `Server` imports from `src/server/decorators/server.decorator.ts` and `src/server/utils/serverRegistry.ts` to eliminate `TS6133` (unused variable) and `TS6385` (deprecated symbol) compiler warnings during builds.",
            "**Runtime Deprecation Warning:** If `@RegisterServer()` or `@UseServer()` encounters a legacy `Server` instance, it logs a helpful warning notice:"
          ]
        },
        {
          "type": "code",
          "language": "bash",
          "code": "[mcp-decorators] [DEPRECATION WARNING] 'Server' is deprecated in @modelcontextprotocol/sdk. Please migrate to 'McpServer' from '@modelcontextprotocol/sdk/server/mcp.js'. Support for legacy 'Server' will be removed in the next major version of @ananay-nag/mcp-decorators."
        },
        { "type": "heading", "level": 3, "text": "2. Deprecation of Legacy Registration Methods" },
        { "type": "paragraph", "text": "In `McpServer`, legacy helper methods `.tool()`, `.prompt()`, and `.resource()` are marked deprecated by the official SDK in favor of `.registerTool()`, `.registerPrompt()`, and `.registerResource()`." },
        { "type": "paragraph", "text": "The library now natively routes capability registration through `.registerTool()`, `.registerPrompt()`, and `.registerResource()` while gracefully falling back to legacy methods if executed against older SDK distributions." }
      ]
    },
    {
      "id": "v202-new-features",
      "title": "New Features",
      "content": [
        { "type": "heading", "level": 3, "text": "First-Class Native McpServer Support" },
        { "type": "paragraph", "text": "`@RegisterServer()` now natively detects and registers instances of `McpServer` (`@modelcontextprotocol/sdk/server/mcp.js`), extending standard TypeScript class inheritance:" },
        {
          "type": "code",
          "language": "typescript",
          "code": `import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { RegisterServer } from "@ananay-nag/mcp-decorators";
import { Implementation } from "@modelcontextprotocol/sdk/types.js";

@RegisterServer()
export class MyMCPServer extends McpServer {
  constructor(serverInfo: Implementation, options?: any) {
    super(serverInfo, options);
  }
}`
        },
        { "type": "heading", "level": 3, "text": "Native Capability Registration on McpServer" },
        { "type": "paragraph", "text": "When `@UseServer()` attaches handlers to an `McpServer` instance:" },
        {
          "type": "list",
          "items": [
            "**Tools:** Directly invokes `server.registerTool(name, config, callback)`.",
            "**Prompts:** Directly invokes `server.registerPrompt(name, config, callback)`.",
            "**Resources & Templates:** Directly invokes `server.registerResource(name, uriOrTemplate, config, callback)`.",
            "**Context Preservation:** Automatically preserves low-level request access via `extra.mcpReq` and `extra`."
          ]
        },
        { "type": "heading", "level": 3, "text": "argsSchema Support for @Prompt()" },
        { "type": "paragraph", "text": "In addition to standard `arguments: PromptArgument[]` arrays, `@Prompt()` now accepts `argsSchema?: Record<string, z.ZodTypeAny>` for type-safe parameter validation:" },
        {
          "type": "code",
          "language": "typescript",
          "code": `import { Prompt } from "@ananay-nag/mcp-decorators";
import { z } from "zod";

@Prompt({
  name: "review_code",
  description: "Generate structured code review feedback",
  argsSchema: {
    code: z.string().describe("Code snippet to review"),
    language: z.string().default("typescript").describe("Programming language")
  }
})
async reviewCode(args: { code: string; language: string }) {
  return {
    messages: [
      { role: "user", content: { type: "text", text: \`Review this \${args.language} code:\\n\\n\${args.code}\` } }
    ]
  };
}`
        }
      ]
    },
    {
      "id": "v202-enhancements",
      "title": "Enhancements & Bug Fixes",
      "content": [
        { "type": "paragraph", "text": "The v2.0.2 release includes several critical enhancements, bug fixes, and test improvements:" },
        {
          "type": "table",
          "headers": ["Area", "Issue / Goal", "Resolution"],
          "rows": [
            ["**Compiler / Type Checking**", "Warnings `TS6133` & `TS6385` during compilation", "Removed unused `Server` imports across server decorators and registry. Build passes warning-free."],
            ["**Jest Test Suite**", "Mock typing error (`TS2345`)", "Resolved type mismatch in `tests/client/client-use-register.test.ts`. `npx tsc --noEmit` now passes with 0 errors."],
            ["**Resource Templates**", "Safe URI parsing with URL objects", "URI template matching now safely falls back to string URI representation when given URL objects."],
            ["**Integration Tests**", "Verify McpServer & deprecation checks", "Added test suite verifying clean registration of `McpServer` without warnings and validating deprecation notices on legacy `Server`."]
          ]
        }
      ]
    },
    {
      "id": "v202-migration-guide",
      "title": "Migration Guide: Upgrading to v2.0.2",
      "content": [
        { "type": "paragraph", "text": "Follow this two-step migration guide to upgrade your project to **v2.0.2**:" },
        { "type": "heading", "level": 3, "text": "Step 1: Update Server Class Definition" },
        { "type": "paragraph", "text": "Update your server class declaration to inherit from `McpServer` instead of the deprecated `Server`:" },
        {
          "type": "code-tabs",
          "tabs": [
            {
              "name": "After (v2.0.2+ Recommended)",
              "language": "typescript",
              "code": `import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { RegisterServer } from "@ananay-nag/mcp-decorators";
import { Implementation } from "@modelcontextprotocol/sdk/types.js";

@RegisterServer()
export class MyMCPServer extends McpServer {
  constructor(serverInfo: Implementation, options?: any) {
    super(serverInfo, options);
  }
}`
            },
            {
              "name": "Before (v2.0.1 Deprecated)",
              "language": "typescript",
              "code": `import { Server, ServerOptions } from "@modelcontextprotocol/sdk/server/index.js";
import { RegisterServer } from "@ananay-nag/mcp-decorators";
import { Implementation } from "@modelcontextprotocol/sdk/types.js";

// Legacy - Emits runtime deprecation warning in v2.0.2
@RegisterServer()
export class MyMCPServer extends Server {
  constructor(serverInfo: Implementation, options?: ServerOptions) {
    super(serverInfo, options);
  }
}`
            }
          ]
        },
        { "type": "heading", "level": 3, "text": "Step 2: Instantiation & Transport Connection" },
        { "type": "paragraph", "text": "No changes needed for handler classes (`@UseServer`, `@Tool`, `@Prompt`, `@Resource`). When connecting transports, both `StdioServerTransport` and `StreamableHTTPServerTransport` are supported:" },
        {
          "type": "code-tabs",
          "tabs": [
            {
              "name": "Stdio Transport",
              "language": "typescript",
              "code": `import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { MyMCPServer } from "./server.js";
import { MyHandlers } from "./handlers.js";

// 1. Initialize modern McpServer instance
const server = new MyMCPServer({ name: "my-service", version: "2.0.2" });

// 2. Instantiate handlers to register all decorated capabilities
new MyHandlers();

// 3. Connect Stdio transport
const transport = new StdioServerTransport();
await server.connect(transport);`
            },
            {
              "name": "Streamable HTTP Transport",
              "language": "typescript",
              "code": `import express from "express";
import { StreamableHTTPServerTransport } from "@modelcontextprotocol/sdk/server/streamableHttp.js";
import { MyMCPServer } from "./server.js";
import { MyHandlers } from "./handlers.js";

const app = express();
app.use(express.json());

const server = new MyMCPServer({ name: "my-service", version: "2.0.2" });
new MyHandlers();

const transport = new StreamableHTTPServerTransport({
  sessionIdGenerator: undefined // Stateless mode
});
await server.connect(transport);

app.post("/mcp", (req, res) => {
  transport.handleRequest(req, res, req.body);
});

app.listen(3000, () => console.log("MCP Server running on port 3000"));`
            }
          ]
        }
      ]
    }
  ]
};

const developerGuideSection = {
  "id": "developer-guide",
  "title": "Developer & CI/CD Guide",
  "items": [
    {
      "id": "testing",
      "title": "Testing Suite (Jest)",
      "content": [
        { "type": "paragraph", "text": "The library utilizes **Jest** along with **ts-jest** to run native ES Module tests in a clean, fully simulated protocol environment." },
        { "type": "paragraph", "text": "To verify the integrity of the framework or run custom validation tests, execute the following npm scripts:" },
        {
          "type": "table",
          "headers": ["Script Command", "Purpose", "Details / Output Customization"],
          "rows": [
            ["`npm run test`", "Run full Jest test suite", "Runs all specs across tools, prompts, resources, and custom route handlers."],
            ["`npm run test:coverage`", "Run tests with coverage", "Generates an aggregated coverage report, automatically filtering out the verbose `Uncovered Line #s` terminal output column to preserve clean build logs."]
          ]
        },
        { "type": "heading", "level": 3, "text": "Aggregated Code Coverage & Type Safety" },
        { "type": "paragraph", "text": "In v2.0.2, all TypeScript mock typings (`TS2345`) have been resolved so `npx tsc --noEmit` passes with 0 errors. Strong coverage markers are maintained:" },
        {
          "type": "list",
          "items": [
            "**Statements:** `70.12%`",
            "**Branches:** `52.12%`",
            "**Functions:** `61.36%`",
            "**Lines:** `70.47%`",
            "**Core decorator modules** (such as `@Tool`, `@Prompt`, `@Resource`) maintain `100%` statement coverage."
          ]
        }
      ]
    },
    {
      "id": "ci-cd-workflows",
      "title": "GitHub Actions CI/CD",
      "content": [
        { "type": "paragraph", "text": "Automated workflow pipelines are configured under `.github` to enforce project hygiene, test reliability, and secure release procedures:" },
        {
          "type": "list",
          "items": [
            "**Build & Test CI (`.github/workflows/test.yml`):** Runs on every `push` and `pull_request` targeting `main`. Executes linting, building, and full Jest tests across Node **18.x, 20.x, and 22.x**.",
            "**Automated npm Publish (`.github/workflows/publish.yml`):** Automatically triggered on publishing a new GitHub release. Builds production bundles and securely publishes to npm.",
            "**Provenance & Signed Attestations:** The publisher uses the modern `--provenance` flag paired with OIDC token write permissions (`id-token: write`). This publishes cryptographically signed build attestations directly to the npm registry.",
            "**Security Audits (`.github/workflows/audit.yml`):** Runs weekly and on PRs with `npm audit --audit-level=high` to block vulnerabilities.",
            "**Dependency Automation (`.github/dependabot.yml`):** Schedules weekly package manager checks to detect and open PR updates."
          ]
        }
      ]
    },
    {
      "id": "tsconfig-modernization",
      "title": "TypeScript Config Modernization",
      "content": [
        { "type": "paragraph", "text": "TypeScript settings ensure full compatibility with modern runtimes and packaging guidelines:" },
        {
          "type": "list",
          "items": [
            "**No `baseUrl` deprecations:** Removed legacy \"baseUrl\": \".\" configuration fields to avoid TS 7.0+ deprecation warnings.",
            "**CJS Compilation target:** Explicitly configured `module` and `moduleResolution` to \"Node16\" inside the CommonJS config (`tsconfig.cjs.json`).",
            "**Warning-Free Builds:** Clean compiler passes with zero `TS6133` (unused variable) or `TS6385` (deprecated symbol) warnings."
          ]
        }
      ]
    }
  ]
};

const commonSections = getV2CommonSections("2.0.2");

export default {
  "version": "2.0.2",
  "isLatest": true,
  "isDeprecated": false,
  "title": "MCP Decorators v2.0.2 (McpServer SDK)",
  "sections": [
    commonSections[0], // Getting Started
    releaseNotesSection, // v2.0.2 Release & Migration
    ...commonSections.slice(1), // Server Decorators, Serving, Client Decorators, Full Walkthrough
    developerGuideSection // Developer & CI/CD Guide
  ]
};
