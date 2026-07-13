export default {
  "version": "1.0.0",
  "isLatest": false,
  "isDeprecated": true,
  "deprecationMessage": "This version of the SDK (v1.0.0) is deprecated. Please migrate to v2.0.0+ for the modern McpServer SDK decorators.",
  "title": "MCP Decorators v1.0.0 (Legacy SDK)",
  "sections": [
    {
      "id": "introduction",
      "title": "Getting Started",
      "items": [
        {
          "id": "philosophy",
          "title": "Architecture & Philosophy",
          "content": [
            { "type": "paragraph", "text": "The Model Context Protocol (MCP) typically requires setting single request dispatchers (e.g. `server.setRequestHandler`). In standard applications, this leads to monolithic handler functions or custom routing wrappers." },
            { "type": "paragraph", "text": "`@ananay-nag/mcp-decorators` introduces a metadata reflection registry to solve this problem:" },
            { "type": "list", "items": [
                "**Decoupled Handlers:** Write separate, highly cohesive classes for different domains (e.g., `DbHandlers`, `FileHandlers`, `UserHandlers`).",
                "**Auto-Aggregation:** When you instantiate these handler classes, the registry aggregates all annotated tools, prompts, resources, and custom endpoints, generating unified dispatchers automatically before connecting.",
                "**Auto-Capability Detection:** The library dynamically evaluates capability scopes (e.g. `tools`, `prompts`, `resources`) based on registered decorators and calls `registerCapabilities()` on your server instance."
              ]
            }
          ]
        },
        {
          "id": "setup",
          "title": "Installation & Setup",
          "content": [
            { "type": "paragraph", "text": "Install the decorator library in your typescript project using npm:" },
            { "type": "code", "language": "bash", "code": "npm install @ananay-nag/mcp-decorators" },
            { "type": "paragraph", "text": "Configure your tsconfig.json to enable experimental decorators and emit decorator metadata:" },
            { "type": "code", "language": "json", "code": "{\n  \"compilerOptions\": {\n    \"experimentalDecorators\": true,\n    \"emitDecoratorMetadata\": true,\n    \"moduleResolution\": \"NodeNext\",\n    \"target\": \"ES2022\"\n  }\n}" }
          ]
        }
      ]
    },
    {
      "id": "server-decorators",
      "title": "Server Decorators",
      "items": [
        {
          "id": "server-class",
          "title": "Class Decorators",
          "content": [
            { "type": "paragraph", "text": "Server-side decorators automate capability aggregation, map request dispatchers, and route incoming requests." },
            { "type": "heading", "level": 3, "text": "@RegisterServer()" },
            { "type": "paragraph", "text": "Target: Class extending `Server` (from `@modelcontextprotocol/sdk/server/index.js`). Registers the server instance in the global registry." },
            { "type": "code", "language": "typescript", "code": "import { Server, ServerOptions } from \"@modelcontextprotocol/sdk/server/index.js\";\nimport { RegisterServer } from \"@ananay-nag/mcp-decorators\";\nimport { Implementation } from \"@modelcontextprotocol/sdk/types.js\";\n\n@RegisterServer()\nexport class MyMCPServer extends Server {\n  constructor(serverInfo: Implementation, options?: ServerOptions) {\n    super(serverInfo, options);\n  }\n}" },
            { "type": "heading", "level": 3, "text": "@UseServer(options)" },
            { "type": "paragraph", "text": "Target: Any handler/service class. Injects the registered server instance as `this.server` and automatically binds all decorated handlers." },
            { "type": "code", "language": "typescript", "code": "import { UseServer } from \"@ananay-nag/mcp-decorators\";\n\n@UseServer({ name: \"my-mcp-server\", version: \"1.0.0\" })\nexport class DbHandlers {\n  server: any; // Automatically injected server instance\n}" }
          ]
        },
        {
          "id": "server-capabilities",
          "title": "Method Decorators (Capabilities)",
          "items": [
            {
              "id": "cap-tool",
              "title": "@Tool(options)",
              "content": [
                { "type": "paragraph", "text": "Exposes a method as an MCP Tool. Automatically compiles standard JSON Schemas or Zod schemas to register inputs." },
                { "type": "code", "language": "typescript", "code": "@Tool({\n  name: \"add_numbers\",\n  description: \"Add two numbers together\",\n  inputSchema: z.object({\n    a: z.number(),\n    b: z.number()\n  })\n})\nasync add(args: { a: number; b: number }) {\n  return {\n    content: [{ type: \"text\", text: String(args.a + args.b) }]\n  };\n}" }
              ]
            },
            {
              "id": "cap-prompt",
              "title": "@Prompt(options)",
              "content": [
                { "type": "paragraph", "text": "Exposes a prompt template to the client." },
                { "type": "code", "language": "typescript", "code": "@Prompt({\n  name: \"code_review\",\n  description: \"Review a code snippet\",\n  arguments: [{ name: \"code\", description: \"Source code\", required: true }]\n})\nasync review(args: { code: string }) {\n  return {\n    messages: [\n      { role: \"user\", content: { type: \"text\", text: `Review this code:\\n\\n${args.code}` } }\n    ]\n  };\n}" }
              ]
            },
            {
              "id": "cap-resource",
              "title": "@Resource & @ResourceTemplate",
              "content": [
                { "type": "paragraph", "text": "Expose static resource URIs or dynamic URI templates with path variable parsing." },
                { "type": "code", "language": "typescript", "code": "@Resource({\n  uri: \"file://config/default\",\n  name: \"Default Configurations\"\n})\nasync getConfig() {\n  return {\n    contents: [{ uri: \"file://config/default\", text: \"mode=development\" }]\n  };\n}\n\n@ResourceTemplate({\n  uriTemplate: \"db://tables/{tableName}/schema\",\n  name: \"Table Schema\"\n})\nasync getTableSchema(params: { tableName: string }) {\n  return {\n    contents: [{ uri: `db://tables/${params.tableName}/schema`, text: `Schema details` }]\n  };\n}" }
              ]
            }
          ]
        },
        {
          "id": "server-routing",
          "title": "Advanced Server Routing",
          "content": [
            { "type": "paragraph", "text": "Use low-level handlers to capture direct JSON-RPC messages." },
            { "type": "heading", "level": 3, "text": "@RequestHandler(schema) & @NotificationHandler(schema)" },
            { "type": "paragraph", "text": "Defines custom low-level JSON-RPC endpoints. String arguments act as literal method names, while schemas validate the entire request structure." },
            { "type": "code", "language": "typescript", "code": "@RequestHandler(\"custom/ping\")\nasync handlePing(request: any) {\n  return { message: \"pong\" };\n}" },
            { "type": "heading", "level": 3, "text": "@ActionHandler(actionName)" },
            { "type": "paragraph", "text": "Used in combination with `@RequestHandler` to route sub-actions under generic endpoints." },
            { "type": "code", "language": "typescript", "code": "@RequestHandler(CallToolRequestSchema)\n@ActionHandler(\"reboot\")\nasync handleReboot() {\n  return { content: [{ type: \"text\", text: \"Rebooting...\" }] };\n}" }
          ]
        },
        {
          "id": "server-utils",
          "title": "Server Utilities",
          "items": [
            {
              "id": "util-notify",
              "title": "notifyResourceUpdated",
              "content": [
                { "type": "paragraph", "text": "Pushes a change notification to all clients currently subscribed to the given resource URI." },
                { "type": "code", "language": "typescript", "code": "import { notifyResourceUpdated } from \"@ananay-nag/mcp-decorators\";\n\n// Notify clients that the users table schema was modified\nawait notifyResourceUpdated(this.server, \"db://tables/users/schema\");" }
              ]
            },
            {
              "id": "util-progress",
              "title": "sendProgress",
              "content": [
                { "type": "paragraph", "text": "Sends a real-time progress update for long-running processes matching the request's progress token." },
                { "type": "code", "language": "typescript", "code": "import { Tool, sendProgress } from \"@ananay-nag/mcp-decorators\";\n\n@Tool({ name: \"build_project\", description: \"Build code\" })\nasync buildProject(args: any, request: any) {\n  const token = request._meta?.progressToken;\n  if (token) {\n    await sendProgress(this.server, token, 50, 100, \"Compiling files...\");\n  }\n  return { content: [{ type: \"text\", text: \"Build completed!\" }] };\n}" }
              ]
            },
            {
              "id": "util-logging",
              "title": "sendLoggingMessage",
              "content": [
                { "type": "paragraph", "text": "Transmits structured logs directly to connected clients over the protocol." },
                { "type": "code", "language": "typescript", "code": "import { sendLoggingMessage } from \"@ananay-nag/mcp-decorators\";\n\nawait sendLoggingMessage(this.server, \"info\", { status: \"Online\" }, \"SystemLogger\");" }
              ]
            },
            {
              "id": "util-input",
              "title": "elicitInput",
              "content": [
                { "type": "paragraph", "text": "Prompts clients/hosts dynamically for input or forms mid-request execution." },
                { "type": "code", "language": "typescript", "code": "import { elicitInput } from \"@ananay-nag/mcp-decorators\";\n\nconst input = await elicitInput(this.server, {\n  mode: \"form\",\n  message: \"Confirm deletion?\",\n  requestedSchema: {\n    type: \"object\",\n    properties: { confirm: { type: \"boolean\" } },\n    required: [\"confirm\"]\n  }\n});" }
              ]
            }
          ]
        }
      ]
    },
    {
      "id": "serving",
      "title": "Serving & Deployments",
      "items": [
        {
          "id": "stdio",
          "title": "Stdio serving",
          "content": [
            { "type": "paragraph", "text": "Communicate directly over standard output/input streams. Excellent for CLIs." },
            { "type": "code", "language": "typescript", "code": "import { StdioServerTransport } from \"@modelcontextprotocol/sdk/server/stdio.js\";\nimport { MyMCPServer } from \"./server.js\";\n\nconst server = new MyMCPServer({ name: \"stdio-server\", version: \"1.0.0\" });\nawait server.connect(new StdioServerTransport());" }
          ]
        },
        {
          "id": "http-sse",
          "title": "HTTP / SSE serving",
          "content": [
            { "type": "paragraph", "text": "Integrate with modern frameworks to serve over HTTP and Server-Sent Events (SSE)." },
            { "type": "heading", "level": 3, "text": "Express Integration" },
            { "type": "code", "language": "typescript", "code": "app.get(\"/sse\", async (req, res) => {\n  transport = new SSEServerTransport(\"/messages\", res);\n  await server.connect(transport);\n});\n\napp.post(\"/messages\", async (req, res) => {\n  await transport.handleMessage(req, res);\n});" }
          ]
        }
      ]
    },
    {
      "id": "client-decorators",
      "title": "Client Decorators",
      "items": [
        {
          "id": "client-class",
          "title": "Class Decorators",
          "content": [
            { "type": "paragraph", "text": "Set up client class structures cleanly." },
            { "type": "heading", "level": 3, "text": "@RegisterClient() & @UseClient(options)" },
            { "type": "paragraph", "text": "Automatically register and inject active clients." },
            { "type": "code", "language": "typescript", "code": "@RegisterClient()\nexport class MyMCPClient extends Client {}\n\n@UseClient({ name: \"my-mcp-client\" })\nexport class ClientController {\n  client: any;\n}" }
          ]
        },
        {
          "id": "client-wrappers",
          "title": "Method Call Wrappers",
          "items": [
            {
              "id": "wrap-call-tool",
              "title": "@CallTool(name?)",
              "content": [
                { "type": "paragraph", "text": "Decorates a client method to request execution of a server tool over JSON-RPC." },
                { "type": "code", "language": "typescript", "code": "import { UseClient, CallTool } from \"@ananay-nag/mcp-decorators\";\n\n@UseClient({ name: \"my-client\" })\nexport class SystemService {\n  client: any;\n\n  @CallTool(\"add_numbers\")\n  async add(a: number, b: number): Promise<any> {}\n}" }
              ]
            },
            {
              "id": "wrap-list-tools",
              "title": "@ListTools()",
              "content": [
                { "type": "paragraph", "text": "Lists all available tools registered on the server." },
                { "type": "code", "language": "typescript", "code": "import { UseClient, ListTools } from \"@ananay-nag/mcp-decorators\";\n\n@UseClient({ name: \"my-client\" })\nexport class ToolInspector {\n  client: any;\n\n  @ListTools()\n  async getAllTools(): Promise<any> {}\n}" }
              ]
            },
            {
              "id": "wrap-get-prompt",
              "title": "@GetPrompt(name?)",
              "content": [
                { "type": "paragraph", "text": "Retrieves a specific prompt template registered on the server." },
                { "type": "code", "language": "typescript", "code": "import { UseClient, GetPrompt } from \"@ananay-nag/mcp-decorators\";\n\n@UseClient({ name: \"my-client\" })\nexport class PromptInspector {\n  client: any;\n\n  @GetPrompt(\"code_review\")\n  async reviewCode(args: { code: string }): Promise<any> {}\n}" }
              ]
            },
            {
              "id": "wrap-read-resource",
              "title": "@ReadResource(uri?)",
              "content": [
                { "type": "paragraph", "text": "Reads the content of a specific resource URI registered on the server." },
                { "type": "code", "language": "typescript", "code": "import { UseClient, ReadResource } from \"@ananay-nag/mcp-decorators\";\n\n@UseClient({ name: \"my-client\" })\nexport class ResourceReader {\n  client: any;\n\n  @ReadResource(\"file://config/default\")\n  async readConfig(): Promise<any> {}\n}" }
              ]
            },
            {
              "id": "wrap-subscribe-resource",
              "title": "@SubscribeResource(uri?)",
              "content": [
                { "type": "paragraph", "text": "Subscribes the client to updates for a specific resource URI." },
                { "type": "code", "language": "typescript", "code": "import { UseClient, SubscribeResource } from \"@ananay-nag/mcp-decorators\";\n\n@UseClient({ name: \"my-client\" })\nexport class ResourceSubscriber {\n  client: any;\n\n  @SubscribeResource(\"db://tables/users/schema\")\n  async watchUsersSchema(): Promise<any> {}\n}" }
              ]
            }
          ]
        }
      ]
    },
    {
      "id": "full-walkthrough",
      "title": "Implementation Walkthrough",
      "items": [
        {
          "id": "calc-server-code",
          "title": "Complete Server Example",
          "content": [
            { "type": "paragraph", "text": "This walkthrough demonstrates how to build a complete legacy Model Context Protocol (MCP) server using class-based decorators. We organize the server codebase into distinct modules as shown below:" },
            {
              "type": "table",
              "headers": ["File Name", "Role", "Description"],
              "rows": [
                ["`server.ts`", "Server Registry", "Defines the Server class registered via `@RegisterServer()`."],
                ["`handlers.ts`", "Capability Handlers", "Implements tools, prompts, resources, autocompletions, and custom JSON-RPC routers."],
                ["`index.ts`", "Main Entry point", "Initializes the server instance, registers handlers, and connects standard I/O transports."]
              ]
            },
            {
              "type": "code-tabs",
              "tabs": [
                {
                  "name": "server.ts",
                  "language": "typescript",
                  "code": "import { Server, ServerOptions } from \"@modelcontextprotocol/sdk/server/index.js\";\nimport { RegisterServer } from \"@ananay-nag/mcp-decorators\";\nimport { Implementation } from \"@modelcontextprotocol/sdk/types.js\";\n\n@RegisterServer()\nexport class TestMCPServer extends Server {\n  constructor(serverInfo: Implementation, options?: ServerOptions) {\n    super(serverInfo, options);\n  }\n}"
                },
                {
                  "name": "handlers.ts",
                  "language": "typescript",
                  "code": "import {\n  UseServer,\n  Tool,\n  Prompt,\n  Resource,\n  ResourceTemplate,\n  Subscribe,\n  Unsubscribe,\n  Completion,\n  RequestHandler,\n  NotificationHandler,\n  ActionHandler\n} from \"@ananay-nag/mcp-decorators\";\nimport { z } from \"zod\";\n\n@UseServer({ name: \"test-mcp-server\", version: \"1.0.0\" })\nexport class TestHandlers {\n  server: any;\n\n  // 1. Tool Decorators\n  @Tool({\n    name: \"greet\",\n    description: \"Greet a user by name\",\n    inputSchema: z.object({\n      name: z.string()\n    })\n  })\n  async greet(args: { name: string }) {\n    console.error(\"[Server] greet tool called with:\", args);\n    return {\n      content: [{ type: \"text\", text: `Hello, ${args.name}! Welcome to the testbed.` }]\n    };\n  }\n\n  @Tool({\n    name: \"add\",\n    description: \"Add two numbers\",\n    inputSchema: z.object({\n      a: z.number(),\n      b: z.number()\n    })\n  })\n  async add(args: { a: number; b: number }) {\n    console.error(\"[Server] add tool called with:\", args);\n    return {\n      content: [{ type: \"text\", text: String(args.a + args.b) }]\n    };\n  }\n\n  // 2. Prompt Decorators\n  @Prompt({\n    name: \"tutorial\",\n    description: \"Generate a tutorial outline\",\n    arguments: [\n      { name: \\\"topic\\\", description: \\\"The topic of the tutorial\\\", required: true },\n      { name: \\\"length\\\", description: \\\"Brief or detailed\\\", required: false }\n    ]\n  })\n  async tutorial(args: { topic: string; length?: string }) {\n    console.error(\"[Server] tutorial prompt requested with:\", args);\n    const lengthStr = args.length || \"brief\";\n    return {\n      description: `A ${lengthStr} tutorial outline for ${args.topic}`,\n      messages: [\n        {\n          role: \"user\",\n          content: {\n            type: \"text\",\n            text: `Generate a ${lengthStr} tutorial outline for: ${args.topic}`\n          }\n        }\n      ]\n    };\n  }\n\n  // 3. Completion Decorator\n  @Completion({ type: \"prompt\", name: \"tutorial\" })\n  async autocompleteTopic(args: { argument: string; value: string }) {\n    console.error(\"[Server] completion called for prompt tutorial argument:\", args);\n    const options = [\"typescript\", \"javascript\", \"python\", \"rust\"];\n    const filtered = options.filter(opt => opt.startsWith(args.value.toLowerCase()));\n    return {\n      completion: {\n        values: filtered\n      }\n    };\n  }\n\n  // 4. Resource Decorators\n  @Resource({\n    uri: \"test://info/static\",\n    name: \"Static Test Resource\",\n    description: \"Exposes static testing content\",\n    mimeType: \"text/plain\"\n  })\n  async getStaticInfo() {\n    console.error(\"[Server] Read resource test://info/static\");\n    return {\n      contents: [\n        {\n          uri: \"test://info/static\",\n          mimeType: \"text/plain\",\n          text: \"This is static information serving from the decorator testbed server.\"\n        }\n      ]\n    };\n  }\n\n  // 5. Resource Template Decorator\n  @ResourceTemplate({\n    uriTemplate: \"test://echo/{message}\",\n    name: \"Echo Resource Template\",\n    description: \"Echoes back the message in the URI\",\n    mimeType: \"text/plain\"\n  })\n  async echoResource(params: { message: string }) {\n    console.error(\"[Server] Read resource template with params:\", params);\n    return {\n      contents: [\n        {\n          uri: `test://echo/${params.message}`,\n          mimeType: \"text/plain\",\n          text: `Echo: ${params.message}`\n        }\n      ]\n    };\n  }\n\n  // 6. Subscribe & Unsubscribe Decorators\n  @Subscribe()\n  async handleSubscribe(uri: string) {\n    console.error(`[Server] Client subscribed to resource: ${uri}`);\n  }\n\n  @Unsubscribe()\n  async handleUnsubscribe(uri: string) {\n    console.error(`[Server] Client unsubscribed from resource: ${uri}`);\n  }\n}"
                },
                {
                  "name": "index.ts",
                  "language": "typescript",
                  "code": "import { StdioServerTransport } from \"@modelcontextprotocol/sdk/server/stdio.js\";\nimport { TestMCPServer } from \"./server.js\";\nimport { TestHandlers } from \"./handlers.js\";\n\nasync function main() {\n  console.error(\"[Server] Initializing server...\");\n\n  const server = new TestMCPServer(\n    { name: \"test-mcp-server\", version: \"1.0.0\" },\n    { capabilities: { logging: {} } }\n  );\n\n  // Instantiate handlers to register all decorated methods (before connecting)\n  new TestHandlers();\n\n  const transport = new StdioServerTransport();\n  await server.connect(transport);\n\n  console.error(\"[Server] Server successfully started and listening via stdio!\");\n}\n\nmain().catch((err) => {\n  console.error(\"[Server] Fatal error in main:\", err);\n  process.exit(1);\n});"
                }
              ]
            }
          ]
        },
        {
          "id": "calc-client-code",
          "title": "Complete Client Example",
          "content": [
            { "type": "paragraph", "text": "Below is the structured client codebase that connects to the decorated Calculator Server and performs remote calls using TypeScript decorators:" },
            {
              "type": "table",
              "headers": ["File Name", "Role", "Description"],
              "rows": [
                ["`client.ts`", "Client Registry", "Defines the Client class registered via `@RegisterClient()`."],
                ["`controller.ts`", "Client Controller", "Implements client call wrappers and routes custom JSON-RPC callbacks."],
                ["`index.ts`", "Main Runner", "Instantiates the client, connects to stdio transport, and runs end-to-end integration tests."]
              ]
            },
            {
              "type": "code-tabs",
              "tabs": [
                {
                  "name": "client.ts",
                  "language": "typescript",
                  "code": "import { Client } from \"@modelcontextprotocol/sdk/client/index.js\";\nimport { RegisterClient } from \"@ananay-nag/mcp-decorators\";\n\n@RegisterClient()\nexport class TestMCPClient extends Client {}"
                },
                {
                  "name": "controller.ts",
                  "language": "typescript",
                  "code": "import {\n  UseClient,\n  CallTool,\n  ListTools,\n  GetPrompt,\n  ListPrompts,\n  ReadResource,\n  ListResources,\n  ListResourceTemplates,\n  SubscribeResource,\n  UnsubscribeResource,\n  CompletePromptOrResource,\n  SetLoggingLevel,\n  PingServer,\n  RequestHandler,\n  NotificationHandler\n} from \"@ananay-nag/mcp-decorators\";\n\n@UseClient({ name: \"test-mcp-client\", version: \"1.0.0\" })\nexport class ClientController {\n  client: any; // Injected by UseClient\n\n  // 1. Tool wrappers\n  @CallTool(\"greet\")\n  async callGreet(args: { name: string }): Promise<any> {}\n\n  @CallTool(\"add\")\n  async callAdd(args: { a: number; b: number }): Promise<any> {}\n\n  @ListTools()\n  async getTools(): Promise<any> {}\n\n  // 2. Prompt wrappers\n  @ListPrompts()\n  async getPrompts(): Promise<any> {}\n\n  @GetPrompt(\"tutorial\")\n  async callTutorialPrompt(args: { topic: string; length?: string }): Promise<any> {}\n\n  // 3. Resource wrappers\n  @ListResources()\n  async getResources(): Promise<any> {}\n\n  @ListResourceTemplates()\n  async getResourceTemplates(): Promise<any> {}\n\n  @ReadResource()\n  async readResource(uri: string): Promise<any> {}\n\n  @SubscribeResource()\n  async subscribeResource(uri: string): Promise<any> {}\n\n  @UnsubscribeResource()\n  async unsubscribeResource(uri: string): Promise<any> {}\n\n  // 4. Autocomplete wrappers\n  @CompletePromptOrResource()\n  async completePrompt(args: {\n    ref: { type: \"ref/prompt\" | \"ref/resource\"; name?: string; uri?: string };\n    argument: { name: string; value: string };\n  }): Promise<any> {}\n\n  // 5. System level capabilities\n  @SetLoggingLevel()\n  async setLoggingLevel(level: string): Promise<any> {}\n\n  @PingServer()\n  async pingServer(): Promise<any> {}\n\n  // 6. Custom Client Event Handlers\n  @RequestHandler(\"custom/client_request\")\n  async handleClientRequest(request: any) {\n    console.log(\"[Client] Custom request received from server:\", request);\n    return { status: \"processed_by_client\" };\n  }\n\n  @NotificationHandler(\"custom/client_notification\")\n  async handleClientNotification(notification: any) {\n    console.log(\"[Client] Custom notification received from server:\", notification);\n  }\n}"
                },
                {
                  "name": "index.ts",
                  "language": "typescript",
                  "code": "import { StdioClientTransport } from \"@modelcontextprotocol/sdk/client/stdio.js\";\nimport { TestMCPClient } from \"./client.js\";\nimport { ClientController } from \"./controller.js\";\nimport path from \"path\";\nimport { fileURLToPath } from \"url\";\nimport { z } from \"zod\";\n\nconst __dirname = path.dirname(fileURLToPath(import.meta.url));\n\nasync function runTests() {\n  console.log(\"[Client Runner] Starting integration tests...\");\n\n  const client = new TestMCPClient(\n    { name: \"test-mcp-client\", version: \"1.0.0\" },\n    { capabilities: {} }\n  );\n\n  const serverPath = path.resolve(__dirname, \"../../server-new-ex/dist/index.js\");\n  const transport = new StdioClientTransport({\n    command: \"node\",\n    args: [serverPath]\n  });\n\n  console.log(\"[Client Runner] Connecting to server...\");\n  await client.connect(transport);\n  console.log(\"[Client Runner] Connected successfully.\");\n\n  const controller = new ClientController();\n\n  console.log(\"\\n--- Testing @PingServer ---\");\n  await controller.pingServer();\n  console.log(\"Ping successful.\");\n\n  console.log(\"\\n--- Testing @ListTools ---\");\n  const tools = await controller.getTools();\n  console.log(\"Available tools:\", JSON.stringify(tools, null, 2));\n\n  console.log(\"\\n--- Testing @CallTool (greet) ---\");\n  const greetResult = await controller.callGreet({ name: \"Decorator Tester\" });\n  console.log(\"Greet Tool result:\", JSON.stringify(greetResult, null, 2));\n\n  console.log(\"\\n--- Testing @CallTool (add) ---\");\n  const addResult = await controller.callAdd({ a: 15, b: 35 });\n  console.log(\"Add Tool result:\", JSON.stringify(addResult, null, 2));\n\n  console.log(\"\\n--- Testing @ListPrompts ---\");\n  const prompts = await controller.getPrompts();\n  console.log(\"Available prompts:\", JSON.stringify(prompts, null, 2));\n\n  console.log(\"\\n--- Testing @GetPrompt (tutorial) ---\");\n  const promptResult = await controller.callTutorialPrompt({ topic: \"MCP Decorators\", length: \"brief\" });\n  console.log(\"Prompt result:\", JSON.stringify(promptResult, null, 2));\n\n  console.log(\"\\n--- Testing @CompletePromptOrResource ---\");\n  const completionResult = await controller.completePrompt({\n    ref: { type: \"ref/prompt\", name: \"tutorial\" },\n    argument: { name: \"topic\", value: \"type\" }\n  });\n  console.log(\"Completion result:\", JSON.stringify(completionResult, null, 2));\n\n  console.log(\"\\n--- Testing @ListResources ---\");\n  const resources = await controller.getResources();\n  console.log(\"Available resources:\", JSON.stringify(resources, null, 2));\n\n  console.log(\"\\n--- Testing @ReadResource (static) ---\");\n  const staticResResult = await controller.readResource(\"test://info/static\");\n  console.log(\"Static Resource contents:\", JSON.stringify(staticResResult, null, 2));\n\n  console.log(\"\\n--- Testing @ListResourceTemplates ---\");\n  const templates = await controller.getResourceTemplates();\n  console.log(\"Available resource templates:\", JSON.stringify(templates, null, 2));\n\n  console.log(\"\\n--- Testing @ReadResource (dynamic echo template) ---\");\n  const dynamicResResult = await controller.readResource(\"test://echo/hello_from_mcp_decorators\");\n  console.log(\"Dynamic Resource contents:\", JSON.stringify(dynamicResResult, null, 2));\n\n  console.log(\"\\n--- Testing @SubscribeResource ---\");\n  await controller.subscribeResource(\"test://echo/hello_from_mcp_decorators\");\n  console.log(\"Subscribed.\");\n\n  console.log(\"\\n--- Testing @UnsubscribeResource ---\");\n  await controller.unsubscribeResource(\"test://echo/hello_from_mcp_decorators\");\n  console.log(\"Unsubscribed.\");\n\n  console.log(\"\\n--- Testing @SetLoggingLevel ---\");\n  await controller.setLoggingLevel(\"info\");\n  console.log(\"Logging level set.\");\n\n  console.log(\"\\n[Client Runner] All tests completed successfully!\");\n  await client.close();\n}\n\nrunTests().catch(console.error);"
                }
              ]
            }
          ]
        }
      ]
    }
  ]
};
