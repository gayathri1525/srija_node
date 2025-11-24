
import http from "http";
import { PORT, KB_BASE } from "./modules/index.js";
import { User, users } from "./modules/index.js";


console.log("Boot: scheduling microtask and timer...");
process.nextTick(() => console.log("Microtask: nextTick executed"));
setTimeout(() => console.log("Timer: setTimeout executed"), 0);

const alice = new User("Alice", "alice@example.com");
const bob   = new User("Bob",   "bob@example.com");
users.push(alice, bob);

async function seedUploads() {

  const contentAlice = Buffer.alloc(1200, "A");
  const contentBob   = Buffer.alloc(2000, "B");

  await Promise.all([
    alice.uploadFile("file1.txt", contentAlice),
    bob.uploadFile("file2.txt", contentBob)
  ]);
}

await seedUploads();

const server = http.createServer(async (req, res) => {

  if (req.url === "/billing") {

    const { billingSummary } = await import("./modules/billing.js");

    const summary = billingSummary(users);

    // Log for demo
    console.log(`HTTP Request: http://localhost:${PORT}/billing`);

    // JSON response
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify(summary, null, 2));
    return;
  }

  // Default route
  res.writeHead(200, { "Content-Type": "text/plain" });
  res.end(
    `Welcome to Secure File Upload & Billing API\n` +
    `KB Base: ${KB_BASE}\n` +
    `Try GET http://localhost:${PORT}/billing`
  );
});

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
})
