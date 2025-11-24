import authenticate from "./auth/auth.js";               // default export
import { fetchCatalog, getTitles } from "./catalog/movies.js";  // named exports
import { Watchlist } from "./watchlist/watchlist.js";     // named export
import { info, error } from "./utils/logger.js";          // named exports

const simulateClickRecommended = () => new Promise(r => setTimeout(r, 300));
const simulateClickSubscribe    = () => new Promise(r => setTimeout(r, 300));

async function main() {
  try {
    info("App initialized successfully");

    //  Auth module
    const user = await authenticate({ username: "user@example.com", password: "pass123" });
    info(`User logged in: ID ${user.id}`);

    //  Catalog module
    const catalog = await fetchCatalog();
    info(`Movie catalog loaded: ${JSON.stringify(getTitles(catalog))}`);

    //  Watchlist module
    const watchlist = new Watchlist();
    const wl = await watchlist.loadForUser(user.id);
    info(`Watchlist loaded: ${JSON.stringify(wl)}`);

    //  Dynamic import — Recommendation Engine
    info("User clicked 'Recommended' → loading recommendation engine dynamically");
    await simulateClickRecommended();

    // Dynamically import only when needed
    const { default: recommend } = await import("./recommendation/recommend.js");
    const recs = await recommend(user.id, getTitles(catalog), watchlist.list());
    info(`Recommended movies: ${JSON.stringify(recs)}`);

    // User adds a recommended movie to watchlist
    const added = watchlist.add("Dune");
    info(`User added "Dune" to watchlist`);
 

    // Dynamic import — Payment Module
    info("Payment module loaded for subscription checkout");
    await simulateClickSubscribe();
    const paymentModule = await import("./payment/payment.js"); // namespace import style
    const gw = await paymentModule.initPaymentGateway();
    if (!gw.ready) throw new Error("Payment gateway not ready");

    const result = await paymentModule.checkoutSubscription(user.id, "Premium");
    if (!result.ok) throw new Error("Payment failed");
    info(`Payment successful: Transaction ID ${result.transactionId}`);

  } catch (err) {
    error("App error", err);
  }
}

main();
