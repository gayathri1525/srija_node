function getUserCart(userId) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(["JS101", "NODE201"]);
    }, 200);
  });
}

module.exports = { getUserCart };
