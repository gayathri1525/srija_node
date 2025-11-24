import { PRICE_PER_KB } from "./config.js";

export function calculateBill(user) {
  if (!user || !Array.isArray(user.files)) {
    throw new Error("calculateBill: invalid user");
  }
  const totalKB = user.files.reduce((sum, f) => sum + (Number(f.sizeKB) || 0), 0);
  const bill = Number((totalKB * PRICE_PER_KB).toFixed(2));
  return {
    name: user.name,
    email: user.email,
    totalFiles: user.files.length,
    totalKB: Number(totalKB.toFixed(3)),
    bill
  };
}


export function billingSummary(users) {
  return users.map(calculateBill);}
