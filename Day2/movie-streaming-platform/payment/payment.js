export async function initPaymentGateway() {
  await new Promise(r => setTimeout(r, 200));
  return { ready: true, provider: "PayFlex" };
}

export async function checkoutSubscription(userId, plan = "Premium") {
  await new Promise(r => setTimeout(r, 400));
  return { ok: true, transactionId: 78901, userId, plan };
}
