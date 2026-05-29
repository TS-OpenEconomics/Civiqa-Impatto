import { createServer } from "node:http";
import { createReadStream, existsSync, statSync } from "node:fs";
import { extname, join, normalize, resolve } from "node:path";

const root = resolve("dist");
const host = process.env.HOST || "127.0.0.1";
const port = Number(process.env.PORT || 4173);

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
  const cleanPath = decodeURIComponent(urlPath.split("?")[0]);
  const requested = normalize(join(root, cleanPath));

  if (!requested.startsWith(root)) {
    return null;
  }

  if (existsSync(requested) && statSync(requested).isFile()) {
    return requested;
  }

  return join(root, "index.html");
}

createServer((req, res) => {
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
}).listen(port, host, () => {
  console.log(`Civiqa POC disponibile su http://${host}:${port}/`);
});
