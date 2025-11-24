
import fs from "fs";
import { mkdir } from "fs/promises";
import path from "path";
import { Readable, PassThrough } from "stream";
import crypto from "crypto";
import { MAX_FILE_SIZE, UPLOAD_DIR, KB_BASE } from "./config.js";

// Global registry of users
export const users = [];


export class User {
  constructor(name, email) {
    if (typeof name !== "string" || !name.trim()) {
      throw new Error("User: name must be a non-empty string");
    }
    if (typeof email !== "string" || !email.includes("@")) {
      throw new Error("User: email must be valid");
    }
    this.name = name.trim();
    this.email = email.trim();
    this.files = []; // [{ name, sizeBytes, sizeKB, hash, storedAs }]
  }

  async uploadFile(fileName, content) {
    if (typeof fileName !== "string" || !fileName.trim()) {
      throw new Error("uploadFile: fileName must be a non-empty string");
    }
    if (!content || (typeof content !== "string" && !Buffer.isBuffer(content) && !(content instanceof Uint8Array))) {
      throw new Error("uploadFile: content must be string or Buffer");
    }

  
    await mkdir(UPLOAD_DIR, { recursive: true });

   
    const storedAs = `${this.email.replace(/[^a-zA-Z0-9._-]/g, "_")}-${Date.now()}-${path.basename(fileName)}`;
    const filePath = path.join(UPLOAD_DIR, storedAs);

    // Stream setup
    const input = Readable.from(content);
    const tee = new PassThrough();
    const output = fs.createWriteStream(filePath);
    const hash = crypto.createHash("sha256");

    let sizeBytes = 0;

    tee.on("data", (chunk) => {
      sizeBytes += chunk.length;
      hash.update(chunk);
      // size guard
      if (sizeBytes > MAX_FILE_SIZE) {
        tee.destroy(new Error(`File too large. Max ${MAX_FILE_SIZE} bytes`));
      }
    });

    input.pipe(tee).pipe(output);

    await new Promise((resolve, reject) => {
      output.once("finish", resolve);
      output.once("error", reject);
      tee.once("error", reject);
      input.once("error", reject);
    });

    const digest = hash.digest("hex");
    const sizeKB = Number((sizeBytes / KB_BASE).toFixed(3)); // keep 3 decimals for precision

    const meta = { name: fileName, sizeBytes, sizeKB, hash: digest, storedAs };
    this.files.push(meta);

    console.log(`File ${fileName} uploaded by ${this.name}`);
    return meta;
  }
}

