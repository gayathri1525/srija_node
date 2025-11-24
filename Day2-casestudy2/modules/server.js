

import http from "http";
import { URL } from "url";
import {
  PORT,
  DEFAULT_ROOM,
  registerUser,
  findUserByName,
  getOrCreateRoom
} from "./modules/index.js";


console.log("Boot: scheduling microtask and timers...");
process.nextTick(() => console.log("Microtask: process.nextTick executed"));
setTimeout(() => console.log("Timer: setTimeout(0) executed"), 0);

const alice = registerUser("Alice", "alice@example.com"); 
const bob   = registerUser("Bob",   "bob@example.com");

const generalRoom = getOrCreateRoom(DEFAULT_ROOM);


await generalRoom.addMessage("Alice", "Hello everyone!");
await generalRoom.addMessage("Bob", "Hi Alice!");

-
function parseJsonBody(req) {
  return new Promise((resolve, reject) => {
    let data = "";
    req.on("data", chunk => { data += chunk; });
    req.on("end", () => {
      if (!data) return resolve(null);
      try { resolve(JSON.parse(data)); } catch (e) { reject(e); }
    });
    req.on("error", reject);
  });
}

const server = http.createServer(async (req, res) => {
  const url = new URL(req.url, `http://${req.headers.host}`);
  const pathname = url.pathname;

  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET,POST,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  if (req.method === "OPTIONS") {
    res.writeHead(204); res.end(); return;
  }

  try {
    if (pathname === "/sendMessage" && (req.method === "POST" || req.method === "GET")) {
     
      let userName = url.searchParams.get("user");
      let message  = url.searchParams.get("message");
      let roomName = url.searchParams.get("room") || DEFAULT_ROOM;

      if (req.method === "POST") {
        const body = await parseJsonBody(req);
        if (body) {
          userName = body.user ?? userName;
          message  = body.message ?? message;
          roomName = body.room ?? roomName;
        }
      }

      if (!userName || !message) {
        res.writeHead(400, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ error: "Missing 'user' or 'message' parameter" }));
        return;
      }

      const user = findUserByName(userName);
      if (!user) {
        res.writeHead(404, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ error: `User '${userName}' not found` }));
        return;
      }

      const room = getOrCreateRoom(roomName);
      const msg = await room.addMessage(user.name, message);

      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ status: "Message sent successfully", room: room.name, data: msg }));
      return;
    }

    if (pathname === "/getMessages" && req.method === "GET") {
      const roomName = url.searchParams.get("room") || DEFAULT_ROOM;
      const nParam   = url.searchParams.get("n");
      const n        = Math.max(1, Math.min(100, Number(nParam) || 20)); // Last N messages

      const room = getOrCreateRoom(roomName);
      const last = await room.getLastMessages(n);

      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(JSON.stringify(last, null, 2));
      return;
    }

    
    res.writeHead(200, { "Content-Type": "text/plain" });
    res.end(
      `Chat API\n` +
      `- GET  /getMessages?room=${DEFAULT_ROOM}&n=20\n` +
      `- GET  /sendMessage?user=Alice&message=Hello%20world&room=${DEFAULT_ROOM}\n` +
      `- POST /sendMessage  (JSON: { "user": "Bob", "message": "Hi!", "room": "${DEFAULT_ROOM}" })\n`
    );
  } catch (err) {
    console.error("Server error:", err);
    res.writeHead(500, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ error: "Internal Server Error", detail: err.message }));
  }
});

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

