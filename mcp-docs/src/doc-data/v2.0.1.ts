import { getV2CommonSections } from "./v2-common";

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
            ["`npm run test:coverage`", "Run tests with coverage", "Generates an aggregated coverage report, automatically filtering out the verbose `Uncovered Line #s` terminal output column to preserve build log clean lines."]
          ]
        },
        { "type": "heading", "level": 3, "text": "Aggregated Code Coverage Stats" },
        { "type": "paragraph", "text": "With native reflection and simulated message passing, the project maintains strong coverage markers:" },
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
        { "type": "paragraph", "text": "Automated workflow pipelines are configured under the `.github` directory to enforce project hygiene, test reliability, and secure release procedures:" },
        {
          "type": "list",
          "items": [
            "**Build & Test CI (`.github/workflows/test.yml`):** Runs on every `push` and `pull_request` targeting the `main` branch. It executes linting, building, and full Jest tests across a node matrix version range of **18.x, 20.x, and 22.x**.",
            "**Automated npm Publish (`.github/workflows/publish.yml`):** Automatically triggered on publishing a new GitHub release. Builds the production bundles and securely publishes the packages to npm.",
            "**Provenance & Signed Attestations:** The publisher uses the modern `--provenance` flag paired with OIDC token write permissions (`id-token: write`). This publishes cryptographically signed build attestations directly to the npm registry, allowing users to verify package authenticity.",
            "**Security Audits (`.github/workflows/audit.yml`):** Automatically triggers on every PR and runs weekly on Sundays at midnight. Executes `npm audit --audit-level=high` to block dependency vulnerabilities.",
            "**Dependency Automation (`.github/dependabot.yml`):** Schedules weekly package manager checks to detect and open PR updates for outdated packages and vulnerabilities."
          ]
        }
      ]
    },
    {
      "id": "tsconfig-modernization",
      "title": "TypeScript Config Modernization",
      "content": [
        { "type": "paragraph", "text": "TypeScript settings have been updated to ensure full compatibility with modern runtimes and packaging guidelines:" },
        {
          "type": "list",
          "items": [
            "**No `baseUrl` deprecations:** Removed legacy \"baseUrl\": \".\" configuration fields. Since Node16 resolution makes explicit base URLs obsolete, removing it avoids TS 7.0+ deprecation warnings.",
            "**CJS Compilation target:** Explicitly changed `module` and `moduleResolution` to \"Node16\" inside the CommonJS config (`tsconfig.cjs.json`). This ensures warning-free compile targets for Node environments using legacy CommonJS structures (`require`/`exports`)."
          ]
        }
      ]
    }
  ]
};

export default {
  "version": "2.0.1",
  "isLatest": true,
  "isDeprecated": false,
  "title": "MCP Decorators v2.0.1 (McpServer SDK)",
  "sections": [...getV2CommonSections("2.0.1"), developerGuideSection]
};
