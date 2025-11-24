unction checkStock(books) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            let outOfStock = false;
            if (outOfStock) {
                resolve("Out of stock");
            } else {
                resolve("In stock");
            }
        }, 1000);
    });
}

module.exports = checkStock;
