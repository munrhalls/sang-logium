import fs from "fs";
import path from "path";

function removeComments(filePath) {
  try {
    let content = fs.readFileSync(filePath, "utf8");

    content = content.replace(/\/\*[\s\S]*?\*\//g, "");

    content = content.replace(/\/\/.*$/gm, "");

    content = content.replace(/^\s*[\r\n]/gm, "");

    fs.writeFileSync(filePath, content, "utf8");

    console.log(`Processed: ${filePath}`);
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

  console.log("Comment removal completed!");
}

main();
