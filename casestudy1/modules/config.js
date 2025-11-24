

// export const PORT = 4000;
// export const KB_BASE = 1000;

// export const MAX_FILE_SIZE = 5 * 1024 * 1024; 
// export const PRICE_PER_KB = 0.001;
// export const UPLOAD_DIR = new URL("../uploads/", import.meta.url).pathname;

// modules/config.js
import path from "path";
import { fileURLToPath } from "url";

export const PORT = 4000;
export const KB_BASE = 1000;
export const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5 MB
export const PRICE_PER_KB = 0.001;

// Resolve .../uploads without invalid characters
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const UPLOAD_DIR = process.env.UPLOAD_DIR ?? path.resolve(__dirname, "../uploads");
