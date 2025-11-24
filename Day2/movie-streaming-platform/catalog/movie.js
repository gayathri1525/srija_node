const MOVIES = [
    { id: 1, title: 'Inception', genre: 'shows' },
    { id: 2, title: 'Interstellar', genre: 'movie' },
    { id: 3, title: 'The Dark Knight', genre: 'Action' },
    { id: 4, title: 'The Prestige', genre: 'Drama' }
];
export async function fetchCatalog() {
  // Simulate network/API delay
  await new Promise(r => setTimeout(r, 250));
  return MOVIES;
}

export function getTitles(movies) {
  return movies.map(m => m.title);
}
