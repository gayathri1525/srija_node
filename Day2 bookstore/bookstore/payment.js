function processPayment(amount) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            if (amount > 0) {
                resolve("Payment successful");
            } else {
                reject("Payment failed");
            }
        }, 1000);
    });
}

module.exports = processPayment;

