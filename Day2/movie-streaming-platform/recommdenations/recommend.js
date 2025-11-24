const recommend = async (userId, catalogTitles, currentWatchlist) => {
  await new Promise(r => setTimeout(r, 300));
  const popular = ["Tenet", "Interstellar", "Dune", "Inception"];
  const recs = popular.filter(t => catalogTitles.includes(t) && !currentWatchlist.includes(t));
  return recs.slice(0, 3);
};

export default recommend;
