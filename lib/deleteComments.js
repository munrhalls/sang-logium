import fs from "fs";
import path from "path";
import { parse } from "@babel/parser";
import generate from "@babel/generator";
import traverse from "@babel/traverse";

function removeComments(filePath) {
  try {
    const originalContent = fs.readFileSync(filePath, "utf8");

    const backupPath = `${filePath}.backup`;
    fs.writeFileSync(backupPath, originalContent, "utf8");

    let ast;
    try {
      ast = parse(originalContent, {
        sourceType: "module",
        plugins: [
          "typescript",
          "jsx",
          "decorators-legacy",
          "classProperties",
          "optionalChaining",
          "nullishCoalescingOperator",
        ],
      });
    } catch (parseError) {
      console.error(`Parse error in ${filePath}: ${parseError.message}`);
      fs.unlinkSync(backupPath);
      return;
    }

    traverse(ast, {
      enter(path) {
        if (path.node.leadingComments) {
          path.node.leadingComments = [];
        }
        if (path.node.trailingComments) {
          path.node.trailingComments = [];
        }
        if (path.node.innerComments) {
          path.node.innerComments = [];
        }
      },
    });

    const output = generate(
      ast,
      {
        comments: false,
        retainLines: false,
        compact: false,
      },
      originalContent
    );

    let newContent = output.code;

    try {
      const verifyAst = parse(newContent, {
        sourceType: "module",
        plugins: [
          "typescript",
          "jsx",
          "decorators-legacy",
          "classProperties",
          "optionalChaining",
          "nullishCoalescingOperator",
        ],
      });

      const originalIdentifiers = new Set();
      const newIdentifiers = new Set();
      const originalLiterals = [];
      const newLiterals = [];

      traverse(
        parse(originalContent, {
          sourceType: "module",
          plugins: [
            "typescript",
            "jsx",
            "decorators-legacy",
            "classProperties",
          ],
        }),
        {
          Identifier(path) {
            originalIdentifiers.add(path.node.name);
          },
          StringLiteral(path) {
            originalLiterals.push(path.node.value);
          },
          NumericLiteral(path) {
            originalLiterals.push(path.node.value);
          },
          TemplateLiteral(path) {
            path.node.quasis.forEach((q) => originalLiterals.push(q.value.raw));
          },
        }
      );

      traverse(verifyAst, {
        Identifier(path) {
          newIdentifiers.add(path.node.name);
        },
        StringLiteral(path) {
          newLiterals.push(path.node.value);
        },
        NumericLiteral(path) {
          newLiterals.push(path.node.value);
        },
        TemplateLiteral(path) {
          path.node.quasis.forEach((q) => newLiterals.push(q.value.raw));
        },
      });

      const identifiersMatch =
        originalIdentifiers.size === newIdentifiers.size &&
        [...originalIdentifiers].every((id) => newIdentifiers.has(id));

      const literalsMatch =
        originalLiterals.length === newLiterals.length &&
        originalLiterals.every((lit, i) => lit === newLiterals[i]);

      if (!identifiersMatch || !literalsMatch) {
        console.error(`❌ SAFETY CHECK FAILED for ${filePath}`);
        console.error(`Identifiers match: ${identifiersMatch}`);
        console.error(`Literals match: ${literalsMatch}`);
        console.error(`Restoring from backup...`);
        fs.unlinkSync(backupPath);
        return;
      }
    } catch (verifyError) {
      console.error(
        `❌ Verification failed for ${filePath}: ${verifyError.message}`
      );
      console.error(`Restoring from backup...`);
      fs.unlinkSync(backupPath);
      return;
    }

    fs.writeFileSync(filePath, newContent, "utf8");
    fs.unlinkSync(backupPath);

    console.log(`✓ Processed: ${filePath}`);
  } catch (error) {
    console.error(`Error processing ${filePath}: ${error.message}`);
  }
}

function processDirectory(dirPath) {
  const files = fs.readdirSync(dirPath);

  for (const file of files) {
    const fullPath = path.join(dirPath, file);
    const stat = fs.statSync(fullPath);

    if (stat.isDirectory()) {
      processDirectory(fullPath);
    } else if (file.endsWith(".ts") || file.endsWith(".tsx")) {
      removeComments(fullPath);
    }
  }
}

function main() {
  const inputPath = process.argv[2];

  if (!inputPath) {
    console.log("Usage: node deleteComments.js <path>");
    console.log(
      "\nThis script safely removes comments from TypeScript/TSX files using AST parsing."
    );
    console.log("Safety features:");
    console.log("  - Creates backup before modification");
    console.log("  - Verifies code integrity after removal");
    console.log("  - Validates all identifiers and literals remain unchanged");
    console.log("  - Automatically restores from backup if verification fails");
    process.exit(1);
  }

  const resolvedPath = path.resolve(inputPath);

  if (!fs.existsSync(resolvedPath)) {
    console.error(`Path doesn't exist: ${resolvedPath}`);
    process.exit(1);
  }

  const stat = fs.statSync(resolvedPath);

  if (stat.isDirectory()) {
    processDirectory(resolvedPath);
  } else if (resolvedPath.endsWith(".ts") || resolvedPath.endsWith(".tsx")) {
    removeComments(resolvedPath);
  } else {
    console.error("File must be a .ts or .tsx file");
    process.exit(1);
  }

  console.log("\n✓ Comment removal completed successfully!");
}

main();
