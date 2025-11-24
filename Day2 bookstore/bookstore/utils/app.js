
const { validateLogin } = require("./auth/auth");
const { getUserCart } = require("./bookstore/cart");
const { fetchBookDetails, checkStockAvailability } = require("./bookstore/inventory");
const {
  processPayment,
  cancelPayment,
  generateInvoice,
  sendConfirmationEmail
} = require("./bookstore/payment");
const { info, error } = require("./utils/logger");
const { recommendBooks } = require("./recommendations/recommend");

/**
 * function to calculate total amount from book details.
 */
const computeTotal = (books) => books.reduce((sum, b) => sum + (Number(b.price) || 0), 0);

// -----------------------------
// DEMO TOGGLES
// -----------------------------
const DEMO = {
  FORCE_OUT_OF_STOCK_TITLE: null,     
  PAYMENT_FAILURE: false             // make it true to stimulate failure 
};


function processOrderWithPromises(credentials) {
  let userRef = null;
  let booksRef = null;
  let transactionRef = null;

  return validateLogin(credentials)
    .then((user) => {
      userRef = user;
      info(`User login successful: User ID ${user.id}`);
      return getUserCart(user.id);
    })
    .then((cartSkus) => {
      return fetchBookDetails(cartSkus);
    })
    .then((books) => {
      booksRef = books;
      const titles = books.map((b) => b.title);
      info(`Book details fetched: ${JSON.stringify(titles)}`);
      return checkStockAvailability(books, DEMO.FORCE_OUT_OF_STOCK_TITLE);
    })
    .then((availableBooks) => {
      info("Stock checked: All items available");
      const amount = computeTotal(availableBooks);
      return processPayment(userRef, amount, { simulateFailure: DEMO.PAYMENT_FAILURE });
    })
    .then((payment) => {
      transactionRef = payment.transactionId;
      info(`Payment successful: Transaction ID ${payment.transactionId}`);
      return generateInvoice(payment.transactionId);
    })
    .then((invoice) => {
      info(`Invoice generated: Invoice #${invoice.invoiceNumber}`);
      return sendConfirmationEmail(userRef.email, invoice.invoiceNumber);
    })
    .then((mailMsg) => {
      info(mailMsg);
      return recommendBooks(userRef.id, booksRef.map((b) => b.title));
    })
    .then((recs) => {
      if (recs.length) {
        info(`Recommended for you: ${JSON.stringify(recs)}`);
      }
    })
    .catch(async (err) => {
     
      if (transactionRef) {
        await cancelPayment(transactionRef);
        error("Order rolled back due to failure.", err);
      } else {
        error("Order processing stopped", err);
      }
      throw err; 
    });
}

async function processOrderWithAsyncAwait(credentials) {
  let transactionRef = null;

  try {
    const user = await validateLogin(credentials);
    info(`User login successful: User ID ${user.id}`);

    const cartSkus = await getUserCart(user.id);

    const books = await fetchBookDetails(cartSkus);
    info(`Book details fetched: ${JSON.stringify(books.map((b) => b.title))}`);

    const availableBooks = await checkStockAvailability(books, DEMO.FORCE_OUT_OF_STOCK_TITLE);
    info("Stock checked: All items available");

    const amount = computeTotal(availableBooks);
    const payment = await processPayment(user, amount, { simulateFailure: DEMO.PAYMENT_FAILURE });
    transactionRef = payment.transactionId;
    info(`Payment successful: Transaction ID ${payment.transactionId}`);

    const invoice = await generateInvoice(payment.transactionId);
    info(`Invoice generated: Invoice #${invoice.invoiceNumber}`);

    const mailMsg = await sendConfirmationEmail(user.email, invoice.invoiceNumber);
    info(mailMsg);

    const recs = await recommendBooks(user.id, books.map((b) => b.title));
    if (recs.length) {
      info(`Recommended for you: ${JSON.stringify(recs)}`);
    }
  } catch (err) {
    if (transactionRef) {
      await cancelPayment(transactionRef);
      error("Order rolled back due to failure.", err);
    } else {
      error("Order processing stopped", err);
    }
    throw err;
  }
}


(async () => {
  console.log("\n=== DEMO 1: Success with PROMISE CHAIN ===");
  DEMO.FORCE_OUT_OF_STOCK_TITLE = null;
  DEMO.PAYMENT_FAILURE = false;
  try {
    await processOrderWithPromises({ username: "user@example.com", password: "pass123" });
  } catch (_) {}

  console.log("\n=== DEMO 2: OUT OF STOCK with ASYNC/AWAIT ===");
  DEMO.FORCE_OUT_OF_STOCK_TITLE = "Node.js Guide"; // matches sample error scenario
  DEMO.PAYMENT_FAILURE = false;
  try {
    await processOrderWithAsyncAwait({ username: "user@example.com", password: "pass123" });
  } catch (_) {}

  console.log("\n=== DEMO 3: PAYMENT FAILURE with PROMISE CHAIN ===");
  DEMO.FORCE_OUT_OF_STOCK_TITLE = null;
  DEMO.PAYMENT_FAILURE = true;
  try {
    await processOrderWithPromises({ username: "user@example.com", password: "pass123" });
  } catch (_) {}
})();
