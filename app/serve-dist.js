import { createServer } from "node:http";
import { createReadStream, existsSync, statSync } from "node:fs";
import { extname, join, normalize, resolve } from "node:path";

const root = resolve("dist");
const host = process.env.HOST || "127.0.0.1";
const port = Number(process.env.PORT || 4173);
const basePath = "/Civiqa-Impatto";

const types = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".json": "application/json; charset=utf-8",
};

function resolveFile(urlPath) {
  let cleanPath = decodeURIComponent(urlPath.split("?")[0]);
  if (cleanPath === basePath || cleanPath.startsWith(`${basePath}/`)) {
    cleanPath = cleanPath.slice(basePath.length) || "/";
  }

  const requested = normalize(join(root, cleanPath));

  if (!requested.startsWith(root)) {
    return null;
  }

  if (existsSync(requested) && statSync(requested).isFile()) {
    return requested;
  }

  if (extname(cleanPath)) {
    return null;
  }

  return join(root, "index.html");
}

const server = createServer((req, res) => {
  const file = resolveFile(req.url || "/");

  if (!file || !existsSync(file)) {
    res.writeHead(404);
    res.end("Not found");
    return;
  }

  res.writeHead(200, {
    "Content-Type": types[extname(file)] || "application/octet-stream",
    "Cache-Control": "no-store",
  });
  createReadStream(file).pipe(res);
});

// Se la porta è occupata (es. un'istanza precedente ancora attiva), invece di
// crashare con EADDRINUSE proviamo le porte successive e stampiamo l'URL reale.
const MAX_PORT_ATTEMPTS = 10;
let attempts = 0;

server.on("error", (err) => {
  if (err.code === "EADDRINUSE" && attempts < MAX_PORT_ATTEMPTS) {
    attempts += 1;
    const nextPort = port + attempts;
    console.warn(`Porta ${port + attempts - 1} occupata, provo la ${nextPort}...`);
    server.listen(nextPort, host);
    return;
  }
  console.error(`Impossibile avviare il server: ${err.message}`);
  process.exit(1);
});

server.on("listening", () => {
  const actualPort = server.address().port;
  console.log(`Civiqa POC disponibile su http://${host}:${actualPort}${basePath}/`);
});

server.listen(port, host);
