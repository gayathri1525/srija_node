
let price = 120;      
let quantity = 5;     

// Validate that quantity is an integer
if (!Number.isInteger(quantity)) {
    console.log("Invalid quantity! Please enter an integer.");
} else {
    //total price
    let total = price * quantity;

    // Apply 10% discount if total > 500
    if (total > 500) {
        total = total * 0.9; 
    }

    // Round to 2 decimal places
    let finalAmount = total.toFixed(2);

    // Print final amount
    console.log("Final Amount: ₹" + finalAmount);
}