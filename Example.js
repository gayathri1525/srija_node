// Scenario 1: Checkout System using Boolean logic
 
let hasItems = true;       // cart has items
let isLoggedIn = false;    // user not logged in
let paymentValid = false;  // payment not validated
 
function checkout() {
  if (!hasItems) {
    console.log("Your cart is empty!");
    return;
  }
 
  if (!isLoggedIn) {
    console.log("Please log in to continue.");
    return;
  }
 
  if (!paymentValid) {
    console.log("Payment validation failed!");
    return;
  }
 
  console.log("Checkout successful!");
}
 
checkout();
 