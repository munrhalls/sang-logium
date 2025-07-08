#!/usr/bin/env node

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

class SangLogiumMCPServer {
  constructor() {
    this.server = {
      name: "sang-logium-workflow",
      version: "1.0.0",
    };
    this.projectRoot = path.resolve(__dirname, "..");
  }

  // Get workflow instructions
  getInstructions() {
    try {
      const instructionsPath = path.join(
        this.projectRoot,
        "cursor-instructions.md",
      );
      return fs.readFileSync(instructionsPath, "utf8");
    } catch (error) {
      return `# Instructions Not Found\nPlease create cursor-instructions.md in your project root.\nError: ${error.message}`;
    }
  }

  // Get project structure context for sang-logium
  getProjectContext() {
    const context = [];

    context.push("# sang-logium Project Context\n");

    // Check key directories from your project structure
    const keyDirs = [
      "app",
      "sanity",
      "components/features",
      "components/ui",
      "actions",
      "services",
      "hooks",
    ];

    keyDirs.forEach((dir) => {
      const dirPath = path.join(this.projectRoot, dir);
      if (fs.existsSync(dirPath)) {
        context.push(`✅ /${dir} directory exists`);
      } else {
        context.push(`❌ /${dir} directory missing`);
      }
    });

    // Check specific sang-logium features
    const projectFeatures = [
      "app/(store)/basket - Basket functionality",
      "app/(store)/checkout - Checkout flow",
      "app/(store)/product - Product pages",
      "components/features/auth - Clerk authentication",
      "components/features/basket - Basket controls",
      "sanity/schemaTypes - CMS schemas",
    ];

    context.push("\n## Key Project Features:");
    projectFeatures.forEach((feature) => {
      const [dirPath, description] = feature.split(" - ");
      const fullPath = path.join(this.projectRoot, dirPath);
      if (fs.existsSync(fullPath)) {
        context.push(`✅ ${description} (${dirPath})`);
      }
    });

    context.push(`\n## Project Root: ${this.projectRoot}`);
    context.push(
      "\n## Remember: Follow specifications-first, test-driven workflow!",
    );

    return context.join("\n");
  }

  // Handle MCP requests
  handleRequest(request) {
    const { method, params } = request;

    switch (method) {
      case "resources/list":
        return {
          resources: [
            {
              uri: "workflow://instructions",
              name: "sang-logium Workflow & Methodology",
              description:
                "Specifications-first, test-driven workflow and component archaeology principles",
              mimeType: "text/markdown",
            },
            {
              uri: "workflow://project-context",
              name: "sang-logium Project Structure",
              description:
                "Audio equipment e-commerce project structure and available features",
              mimeType: "text/markdown",
            },
          ],
        };

      case "resources/read":
        if (params.uri === "workflow://instructions") {
          return {
            contents: [
              {
                uri: params.uri,
                mimeType: "text/markdown",
                text: this.getInstructions(),
              },
            ],
          };
        } else if (params.uri === "workflow://project-context") {
          return {
            contents: [
              {
                uri: params.uri,
                mimeType: "text/markdown",
                text: this.getProjectContext(),
              },
            ],
          };
        }
        throw new Error(`Unknown resource: ${params.uri}`);

      case "initialize":
        return {
          protocolVersion: "2025-03-26",
          capabilities: {
            resources: {},
          },
          serverInfo: this.server,
        };

      default:
        throw new Error(`Unknown method: ${method}`);
    }
  }

  // Start stdio server
  start() {
    let buffer = "";

    process.stdin.on("data", (chunk) => {
      buffer += chunk.toString();

      // Process complete lines
      const lines = buffer.split("\n");
      buffer = lines.pop() || ""; // Keep incomplete line in buffer

      lines.forEach((line) => {
        if (line.trim()) {
          try {
            const request = JSON.parse(line);
            const response = this.handleRequest(request);

            console.log(
              JSON.stringify({
                jsonrpc: "2.0",
                id: request.id,
                result: response,
              }),
            );
          } catch (error) {
            console.log(
              JSON.stringify({
                jsonrpc: "2.0",
                id: 1,
                error: {
                  code: -1,
                  message: error.message,
                },
              }),
            );
          }
        }
      });
    });

    process.stdin.resume();
  }
}

const server = new SangLogiumMCPServer();
server.start();
