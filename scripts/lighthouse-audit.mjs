import { spawn, spawnSync } from "node:child_process";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";

const DEFAULT_PORT = Number(process.env.AUDIT_PORT || 3100);
const BASE_URL = process.env.AUDIT_BASE_URL || `http://127.0.0.1:${DEFAULT_PORT}`;
const ROUTES = (process.env.AUDIT_ROUTES?.split(",").map((r) => r.trim()).filter(Boolean)) || [
  "/",
  "/liturgia",
  "/liturgia/hoje",
  "/liturgia/29-outubro-2026",
  "/acompanhar",
  "/blog",
  "/donate",
];

const THRESHOLDS = {
  performance: Number(process.env.LH_MIN_PERFORMANCE || 95),
  accessibility: Number(process.env.LH_MIN_ACCESSIBILITY || 100),
  "best-practices": Number(process.env.LH_MIN_BEST_PRACTICES || 100),
  seo: Number(process.env.LH_MIN_SEO || 100),
};

function findLighthouseCommand() {
  const localBin = path.join(process.cwd(), "node_modules", ".bin", "lighthouse");
  if (fs.existsSync(localBin)) return { cmd: localBin, prefixArgs: [] };

  const npxCacheDir = path.join(os.homedir(), ".npm", "_npx");
  if (fs.existsSync(npxCacheDir)) {
    for (const dir of fs.readdirSync(npxCacheDir)) {
      const candidate = path.join(npxCacheDir, dir, "node_modules", ".bin", "lighthouse");
      if (fs.existsSync(candidate)) return { cmd: candidate, prefixArgs: [] };
    }
  }

  return { cmd: "npx", prefixArgs: ["--yes", "lighthouse@12"] };
}

function findChromeBinary() {
  if (process.env.CHROME_PATH && fs.existsSync(process.env.CHROME_PATH)) {
    return process.env.CHROME_PATH;
  }

  for (const bin of ["google-chrome", "chromium", "chromium-browser"]) {
    const res = spawnSync("which", [bin], { encoding: "utf8" });
    if (res.status === 0 && res.stdout.trim()) return res.stdout.trim();
  }

  const playwrightDir = path.join(os.homedir(), ".cache", "ms-playwright");
  if (fs.existsSync(playwrightDir)) {
    const candidates = fs
      .readdirSync(playwrightDir)
      .filter((entry) => entry.startsWith("chromium-"))
      .sort()
      .reverse()
      .map((entry) => path.join(playwrightDir, entry, "chrome-linux64", "chrome"))
      .filter((candidate) => fs.existsSync(candidate));
    if (candidates.length > 0) return candidates[0];
  }

  throw new Error("Nenhum binário Chrome/Chromium encontrado. Defina CHROME_PATH.");
}

async function waitForServer(url, timeoutMs = 25000) {
  const start = Date.now();
  while (Date.now() - start < timeoutMs) {
    try {
      const response = await fetch(`${url}/robots.txt`);
      if (response.ok) return true;
    } catch {
      // aguardando inicialização
    }
    await new Promise((resolve) => setTimeout(resolve, 400));
  }
  return false;
}

async function main() {
  const chromePath = findChromeBinary();
  const lh = findLighthouseCommand();
  console.log(`Usando navegador: ${chromePath}`);

  let serverProcess = null;
  const alreadyUp = await waitForServer(BASE_URL, 1200);

  if (!alreadyUp) {
    if (!fs.existsSync(path.join(process.cwd(), ".next", "BUILD_ID"))) {
      throw new Error("Build de produção ausente em .next/. Execute `bun run build` antes de `bun run audit:lighthouse`.");
    }
    console.log(`Iniciando servidor de produção em ${BASE_URL}...`);
    serverProcess = spawn("bun", ["--bun", "next", "start", "-p", String(DEFAULT_PORT), "-H", "127.0.0.1"], {
      stdio: "ignore",
      env: { ...process.env, NODE_ENV: "production" },
    });
    const ready = await waitForServer(BASE_URL, 25000);
    if (!ready) {
      serverProcess.kill("SIGTERM");
      throw new Error(`Servidor não respondeu em ${BASE_URL} dentro de 25s.`);
    }
  }

  const summary = [];
  let hasFailures = false;

  try {
    for (const route of ROUTES) {
      const targetUrl = `${BASE_URL}${route}`;
      const tmpJson = path.join(os.tmpdir(), `lh-${route.replace(/[^a-z0-9]/gi, "_") || "home"}-${Date.now()}.json`);

      const args = [
        ...lh.prefixArgs,
        targetUrl,
        "--output=json",
        `--output-path=${tmpJson}`,
        "--only-categories=performance,accessibility,best-practices,seo",
        "--chrome-flags=--headless=new --no-sandbox --disable-gpu --disable-dev-shm-usage",
        "--quiet",
      ];

      const result = spawnSync(lh.cmd, args, {
        encoding: "utf8",
        env: { ...process.env, CHROME_PATH: chromePath },
      });

      if (!fs.existsSync(tmpJson)) {
        throw new Error(`Lighthouse falhou em ${targetUrl}:\n${result.stderr || result.stdout}`);
      }

      const lhr = JSON.parse(fs.readFileSync(tmpJson, "utf8"));
      fs.unlinkSync(tmpJson);

      const scores = {
        performance: Math.round((lhr.categories.performance?.score ?? 0) * 100),
        accessibility: Math.round((lhr.categories.accessibility?.score ?? 0) * 100),
        "best-practices": Math.round((lhr.categories["best-practices"]?.score ?? 0) * 100),
        seo: Math.round((lhr.categories.seo?.score ?? 0) * 100),
      };

      const metrics = {
        fcpMs: Math.round(lhr.audits["first-contentful-paint"]?.numericValue ?? 0),
        lcpMs: Math.round(lhr.audits["largest-contentful-paint"]?.numericValue ?? 0),
        tbtMs: Math.round(lhr.audits["total-blocking-time"]?.numericValue ?? 0),
        cls: Number((lhr.audits["cumulative-layout-shift"]?.numericValue ?? 0).toFixed(3)),
      };

      const failingAudits = Object.values(lhr.audits)
        .filter((audit) => audit.score !== null && audit.score < 1 && audit.scoreDisplayMode !== "informative" && audit.scoreDisplayMode !== "notApplicable")
        .map((audit) => ({ id: audit.id, score: audit.score, title: audit.title }));

      const routeFailed = Object.entries(THRESHOLDS).some(([cat, min]) => scores[cat] < min);
      if (routeFailed) hasFailures = true;

      summary.push({ route, scores, metrics, failingAudits });
      console.log(
        `${routeFailed ? "✗" : "✓"} ${route.padEnd(28)} Perf:${String(scores.performance).padStart(3)} | A11y:${String(scores.accessibility).padStart(3)} | BP:${String(scores["best-practices"]).padStart(3)} | SEO:${String(scores.seo).padStart(3)} | LCP:${metrics.lcpMs}ms TBT:${metrics.tbtMs}ms CLS:${metrics.cls}`,
      );
      if (routeFailed) {
        for (const audit of failingAudits) {
          console.log(`    - [${audit.id}] (${audit.score}): ${audit.title}`);
        }
      }
    }

    const outPath = path.join(process.cwd(), "docs", "lighthouse-audit-latest.json");
    fs.writeFileSync(
      outPath,
      JSON.stringify(
        {
          date: new Date().toISOString(),
          baseUrl: BASE_URL,
          thresholds: THRESHOLDS,
          results: summary,
        },
        null,
        2,
      ) + "\n",
    );
    console.log(`\nRelatório salvo em ${outPath}`);
  } finally {
    if (serverProcess) {
      serverProcess.kill("SIGTERM");
    }
  }

  if (hasFailures) {
    console.error("\nAlgumas rotas ficaram abaixo das metas mínimas do Lighthouse.");
    process.exit(1);
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
