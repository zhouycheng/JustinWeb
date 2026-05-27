import "server-only";

import { execFile } from "node:child_process";
import { promisify } from "node:util";
import path from "node:path";

const execFileAsync = promisify(execFile);

type CheckItem = {
  command: string;
  output: string;
  status: "passed" | "failed";
};

type PublishCheckResult = {
  ok: boolean;
  results: CheckItem[];
};

function resolveRepoRoot() {
  const cwd = process.cwd();

  if (path.basename(cwd) !== "admin") {
    return cwd;
  }

  return path.resolve(cwd, "..");
}

async function runCheck(command: string, args: string[]): Promise<CheckItem> {
  try {
    const { stdout, stderr } = await execFileAsync(command, args, {
      cwd: resolveRepoRoot(),
      env: process.env,
      maxBuffer: 1024 * 1024 * 10,
    });

    return {
      command: [command, ...args].join(" "),
      output: [stdout, stderr].filter(Boolean).join("\n").trim(),
      status: "passed",
    };
  } catch (error) {
    const candidate = error as NodeJS.ErrnoException & {
      stderr?: string;
      stdout?: string;
    };

    return {
      command: [command, ...args].join(" "),
      output: [candidate.stdout, candidate.stderr, candidate.message]
        .filter(Boolean)
        .join("\n")
        .trim(),
      status: "failed",
    };
  }
}

export async function runPublishChecks(): Promise<PublishCheckResult> {
  const tasks: Array<[string, string[]]> = [
    ["npm", ["run", "lint"]],
    ["npm", ["run", "build"]],
    ["npm", ["run", "admin:build"]],
  ];

  const results: CheckItem[] = [];

  for (const [command, args] of tasks) {
    const result = await runCheck(command, args);
    results.push(result);

    if (result.status === "failed") {
      return {
        ok: false,
        results,
      };
    }
  }

  return {
    ok: true,
    results,
  };
}
