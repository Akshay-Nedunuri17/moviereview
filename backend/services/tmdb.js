const axios = require('axios');

const TMDB_BASE_URL = 'https://api.themoviedb.org/3';

const tmdbApi = axios.create({
    baseURL: TMDB_BASE_URL,
    params: {
        api_key: process.env.TMDB_API_KEY,
    },
});

const getTrendingMovies = async () => {
    const response = await tmdbApi.get('/trending/movie/day');
    return response.data;
};

const getTopRatedMovies = async () => {
    const response = await tmdbApi.get('/movie/top_rated');
    return response.data;
};

const getUpcomingMovies = async () => {
    const response = await tmdbApi.get('/movie/upcoming');
    return response.data;
};

const getMovieDetails = async (tmdbId) => {
    const response = await tmdbApi.get(`/movie/${tmdbId}`, {
        params: { append_to_response: 'videos,credits' }
    });
    return response.data;
};

module.exports = {
    getTrendingMovies,
    getTopRatedMovies,
    getUpcomingMovies,
    getMovieDetails,
};
