#!/usr/bin/env node

import { randomBytes } from "node:crypto";
import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import process from "node:process";

const ENV_PATH = path.join(process.cwd(), ".env.local");
const DEFAULT_MONITOR_URL = "http://localhost:3000";

function hasEnvKey(contents, key) {
  const pattern = new RegExp(`^\\s*${key}\\s*=`, "m");
  return pattern.test(contents);
}

async function readExistingEnv() {
  try {
    return await readFile(ENV_PATH, "utf8");
  } catch (error) {
    if (error?.code === "ENOENT") {
      return "";
    }

    throw error;
  }
}

async function run() {
  const existing = await readExistingEnv();
  const additions = [];

  if (!hasEnvKey(existing, "ACTIVITY_MONITOR_TOKEN")) {
    additions.push(`ACTIVITY_MONITOR_TOKEN=${randomBytes(32).toString("hex")}`);
  }

  if (!hasEnvKey(existing, "ACTIVITY_MONITOR_URL")) {
    additions.push(`ACTIVITY_MONITOR_URL=${DEFAULT_MONITOR_URL}`);
  }

  if (additions.length === 0) {
    console.log("[activity-monitor:setup] .env.local already has activity monitor settings.");
    return;
  }

  const separator = existing.length > 0 && !existing.endsWith("\n") ? "\n" : "";
  const nextContents = `${existing}${separator}${additions.join("\n")}\n`;
  await writeFile(ENV_PATH, nextContents, "utf8");

  console.log(`[activity-monitor:setup] wrote ${ENV_PATH}`);
  console.log("[activity-monitor:setup] restart `npm run dev` before starting the monitor.");
}

void run().catch((error) => {
  console.error("[activity-monitor:setup] failed:", error);
  process.exit(1);
});
