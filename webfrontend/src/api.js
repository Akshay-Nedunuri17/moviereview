const TMDB_KEY = '4e44d9029b1270a757cddc766a1bcb63';
const TMDB = 'https://api.themoviedb.org/3';
export const IMG = (p, s = 'w500') => p ? `https://image.tmdb.org/t/p/${s}${p}` : null;

const get = (path, params = {}) => {
    const url = new URL(`${TMDB}${path}`);
    url.searchParams.set('api_key', TMDB_KEY);
    url.searchParams.set('language', 'en-US');
    Object.entries(params).forEach(([k, v]) => url.searchParams.set(k, v));
    return fetch(url).then(r => r.json());
};

// Genre IDs from TMDb
export const GENRES = {
    Action: 28,
    Adventure: 12,
    Animation: 16,
    Comedy: 35,
    Crime: 80,
    Documentary: 99,
    Drama: 18,
    Fantasy: 14,
    Horror: 27,
    Mystery: 9648,
    Romance: 10749,
    'Sci-Fi': 878,
    Thriller: 53,
    Western: 37,
};

export const api = {
    trending: () => get('/trending/movie/week'),
    topRated: () => get('/movie/top_rated'),
    upcoming: () => get('/movie/upcoming'),
    nowPlaying: () => get('/movie/now_playing'),
    search: (query) => get('/search/movie', { query }),
    movie: (id) => get(`/movie/${id}`, { append_to_response: 'videos,credits,similar' }),
    byGenre: (genreId, page = 1) => get('/discover/movie', {
        with_genres: genreId,
        sort_by: 'vote_average.desc',
        'vote_count.gte': 1000,
        page,
    }),
    genreList: () => get('/genre/movie/list'),
    actor: (id) => get(`/person/${id}`, { append_to_response: 'movie_credits,images' }),
};
