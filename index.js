import { performance } from "node:perf_hooks";

const url = process.argv[2];

if (!url) {
  console.error("Usage: node index.js <url>");
  process.exit(1);
}

const REQUESTS = 10;
let totalBytes = 0;
let totalMs = 0;

for (let i = 1; i <= REQUESTS; i++) {
  const start = performance.now();
  const res = await fetch(url);

  if (!res.ok) {
    console.error(`Request ${i} failed: HTTP ${res.status}`);
    process.exit(1);
  }

  const buf = Buffer.from(await res.arrayBuffer());
  const elapsed = performance.now() - start;

  totalBytes += buf.length;
  totalMs += elapsed;

  console.log(
    `Request ${i}: ${elapsed.toFixed(1)} ms, ${(buf.length / 1024 / 1024).toFixed(1)} MB`,
  );
}

const avgMs = totalMs / REQUESTS;
const totalMb = totalBytes / (1024 * 1024);
const mbps = (totalBytes * 8) / (totalMs / 1000) / 1e6;

console.log("");
console.log(`Average request time: ${avgMs.toFixed(1)} ms`);
console.log(`Total downloaded:     ${totalMb.toFixed(2)} MB`);
console.log(`Download speed:       ${mbps.toFixed(2)} Mbps`);
