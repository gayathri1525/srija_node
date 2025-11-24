
import { MAX_MESSAGE_LENGTH } from "./config.js";

export class ChatRoom {
  constructor(name) {
    if (typeof name !== "string" || !name.trim()) {
      throw new Error("ChatRoom: name must be a non-empty string");
    }
    this.name = name.trim();
    this.messages = []; 
  }


  async addMessage(sender, content) {
    if (typeof content !== "string" || !content.trim()) {
      throw new Error("Message content must be non-empty string");
    }
    if (content.length > MAX_MESSAGE_LENGTH) {
      throw new Error(`Message too long (max ${MAX_MESSAGE_LENGTH} chars)`);
    }
    if (typeof sender !== "string" || !sender.trim()) {
      throw new Error("Sender must be non-empty string");
    }

    // Simulate event loop scheduling (non-blocking)
    await new Promise(resolve => setImmediate(resolve));

    const msg = {
      sender: sender.trim(),
      content: content.trim(),
      timestamp: new Date().toISOString()
    };
    this.messages.push(msg);
    console.log(`[${this.name}] ${msg.sender}: ${msg.content}`);
    return msg;
  }

  
  async getLastMessages(n = 20) {
    await new Promise(resolve => setImmediate(resolve));
    const slice = this.messages.slice(-n);
    return slice;
  }
}


export const rooms = new Map();

export function getOrCreateRoom(name) {
  const key = name.trim();
  if (!rooms.has(key)) {
    rooms.set(key, new ChatRoom(key));
    console.log(`Room created: ${key}`);
  }
  return rooms.get(key);
}

