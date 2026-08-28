export interface User {
  id: string;
  email: string;
  username: string;
  firstName?: string;
  lastName?: string;
  avatar?: string;
  role: 'USER' | 'ADMIN';
  isActive: boolean;
  createdAt: string;
  lastLoginAt?: string;
}

export interface Movie {
  id: string;
  title: string;
  description: string;
  releaseYear: number;
  runtime?: number;
  posterUrl?: string;
  backdropUrl?: string;
  trailerUrl?: string;
  tmdbId?: number;
  averageRating: number;
  totalRatings: number;
  views: number;
  popularity: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  genres: Genre[];
}

export interface Genre {
  id: string;
  name: string;
  description?: string;
  createdAt: string;
}

export interface Rating {
  id: string;
  userId: string;
  movieId: string;
  rating: number;
  review?: string;
  createdAt: string;
  updatedAt: string;
  user?: {
    id: string;
    username: string;
    avatar?: string;
  };
  movie?: {
    id: string;
    title: string;
    posterUrl?: string;
    averageRating: number;
  };
}

export interface WatchlistItem {
  id: string;
  userId: string;
  movieId: string;
  status: 'PLANNED' | 'WATCHING' | 'COMPLETED' | 'DROPPED';
  notes?: string;
  createdAt: string;
  updatedAt: string;
  movie: {
    id: string;
    title: string;
    posterUrl?: string;
    averageRating: number;
    releaseYear: number;
    genres?: Genre[];
  };
}

export interface UserPreference {
  id: string;
  userId: string;
  preferredGenres: string[];
  preferredActors: string[];
  minRating: number;
  language: string;
  createdAt: string;
  updatedAt: string;
}

export interface ViewHistory {
  id: string;
  userId: string;
  movieId: string;
  watchedAt: string;
  watchDuration?: number;
  completed: boolean;
  createdAt: string;
  movie: {
    id: string;
    title: string;
    posterUrl?: string;
    averageRating: number;
    releaseYear: number;
    genres?: Genre[];
  };
}

export interface Recommendation {
  id: string;
  userId: string;
  movieId: string;
  score: number;
  reason: string;
  recommendationType: 'PERSONALIZED' | 'TRENDING' | 'SIMILAR' | 'EDITOR_PICK';
  createdAt: string;
  movie: {
    id: string;
    title: string;
    posterUrl?: string;
    averageRating: number;
    genres: Genre[];
  };
}

export interface PaginatedResponse<T> {
  movies: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}
