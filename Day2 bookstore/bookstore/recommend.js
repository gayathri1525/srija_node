function recommendBooks(userId, alreadyInCartTitles) {
  return new Promise((resolve) => {
    setTimeout(() => {
      const pool = ["You Don't Know JS", "Async JavaScript", "Clean Code"];
      const recs = pool.filter((t) => !alreadyInCartTitles.includes(t));
      resolve(recs.slice(0, 2));
    }, 200);
  });
}

module.exports = { recommendBooks };
