import axios from 'axios';

// To connect from an Android emulator use 10.0.2.2 instead of localhost
const API_URL = 'http://localhost:5000/api';

const api = axios.create({
    baseURL: API_URL,
});

api.interceptors.request.use(async (config) => {
    // In a real app we would get the token from AsyncStorage here
    // const token = await AsyncStorage.getItem('userToken');
    // if (token) {
    //   config.headers.Authorization = `Bearer ${token}`;
    // }
    return config;
});

export const movieApi = {
    getTrending: () => api.get('/movies', { params: { category: 'trending' } }),
    getTopRated: () => api.get('/movies', { params: { category: 'top_rated' } }),
    getUpcoming: () => api.get('/movies', { params: { category: 'upcoming' } }),
    getMovieDetails: (id: string) => api.get(`/movies/${id}`),
    searchMovies: (query: string) => api.get('/movies', { params: { search: query } }),
};

export const reviewApi = {
    getReviewsForMovie: (movieId: string) => api.get(`/reviews/movie/${movieId}`),
    postReview: (movieId: string, rating: number, comment: string) =>
        api.post('/reviews', { movieId, rating, comment }),
};

export default api;
