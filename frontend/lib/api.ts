import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const authApi = {
  register: (data: { email: string; username: string; password: string; firstName?: string; lastName?: string }) =>
    api.post('/auth/register', data),
  login: (data: { email: string; password: string }) =>
    api.post('/auth/login', data),
  me: () => api.get('/auth/me'),
};

export const usersApi = {
  getProfile: () => api.get('/users/profile'),
  updateProfile: (data: { firstName?: string; lastName?: string; avatar?: string }) =>
    api.patch('/users/profile', data),
  getPreferences: () => api.get('/users/preferences'),
  updatePreferences: (data: { preferredGenres?: string[]; preferredActors?: string[]; minRating?: number; language?: string }) =>
    api.patch('/users/preferences', data),
  getRatings: () => api.get('/users/ratings'),
  getWatchlist: () => api.get('/users/watchlist'),
  getRecommendations: () => api.get('/users/recommendations'),
  getHistory: () => api.get('/users/history'),
};

export const moviesApi = {
  getAll: (params?: { query?: string; genre?: string; year?: number; minRating?: number; page?: number; limit?: number }) =>
    api.get('/movies', { params }),
getTmdbTrending: (page?: number) =>
    api.get('/tmdb/trending', { params: { page } }),

getTmdbByGenre: (genreId: number, page?: number) =>
    api.get(`/tmdb/genre/${genreId}`, { params: { page } }),
  getTrending: (limit?: number) => api.get('/movies/trending', { params: { limit } }),
search: (params?: { query?: string; page?: number }) =>
    api.get('/tmdb/search', { params }),
  getById: (id: string) => api.get(`/movies/${id}`),
  getSimilar: (id: string, limit?: number) => api.get(`/movies/${id}/similar`, { params: { limit } }),
  create: (data: any) => api.post('/movies', data),
  update: (id: string, data: any) => api.patch(`/movies/${id}`, data),
  delete: (id: string) => api.delete(`/movies/${id}`),
};

export const ratingsApi = {
  create: (movieId: string, data: { rating: number; review?: string }) =>
    api.post(`/movies/${movieId}/ratings`, data),
  update: (movieId: string, data: { rating?: number; review?: string }) =>
    api.patch(`/movies/${movieId}/ratings`, data),
  delete: (movieId: string) => api.delete(`/movies/${movieId}/ratings`),
  getMovieRatings: (movieId: string) => api.get(`/movies/${movieId}/ratings`),
};

export const watchlistApi = {
  add: (movieId: string, data?: { status?: string; notes?: string }) =>
    api.post(`/watchlist/${movieId}`, data),
  update: (movieId: string, data: { status?: string; notes?: string }) =>
    api.patch(`/watchlist/${movieId}`, data),
  remove: (movieId: string) => api.delete(`/watchlist/${movieId}`),
  get: () => api.get('/watchlist'),
};

export const historyApi = {
  add: (movieId: string, data?: { watchDuration?: number; completed?: boolean }) =>
    api.post(`/history/${movieId}`, data),
  get: () => api.get('/history'),
  delete: (id: string) => api.delete(`/history/${id}`),
};

export const recommendationsApi = {
  get: () => api.get('/recommendations'),
  refresh: () => api.post('/recommendations/refresh'),
  getTrending: () => api.get('/recommendations/trending'),
  getSimilar: (movieId: string) => api.get(`/recommendations/similar/${movieId}`),
};

export default api;
