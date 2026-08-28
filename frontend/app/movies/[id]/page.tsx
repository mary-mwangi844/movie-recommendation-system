'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useParams } from 'next/navigation';
import { moviesApi, ratingsApi, watchlistApi, historyApi } from '../../../lib/api';
import Link from 'next/link';

export default function MovieDetailPage() {
  const params = useParams();
  const movieId = params.id as string;
  const queryClient = useQueryClient();
  const [rating, setRating] = useState(0);
  const [review, setReview] = useState('');

  const { data: movie, isLoading: movieLoading } = useQuery({
    queryKey: ['movie', movieId],
    queryFn: () => moviesApi.getById(movieId),
  });

  const { data: ratings } = useQuery({
    queryKey: ['movie-ratings', movieId],
    queryFn: () => ratingsApi.getMovieRatings(movieId),
  });

  const addRatingMutation = useMutation({
    mutationFn: (data: { rating: number; review?: string }) => ratingsApi.create(movieId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['movie-ratings', movieId] });
      queryClient.invalidateQueries({ queryKey: ['movie', movieId] });
      setRating(0);
      setReview('');
    },
  });

  const addToWatchlistMutation = useMutation({
    mutationFn: () => watchlistApi.add(movieId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['watchlist'] });
      alert('Added to watchlist!');
    },
  });

  const addToHistoryMutation = useMutation({
    mutationFn: () => historyApi.add(movieId, { completed: false }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['history'] });
    },
  });

  if (movieLoading) {
    return <div className="min-h-screen bg-gray-950 text-white p-6">Loading...</div>;
  }

  const movieData = movie?.data;

  if (!movieData) {
    return <div className="min-h-screen bg-gray-950 text-white p-6">Movie not found</div>;
  }

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      {movieData.backdropUrl && (
        <div
          className="w-full h-96 bg-cover bg-center opacity-30"
          style={{ backgroundImage: `url(${movieData.backdropUrl})` }}
        />
      )}

      <div className="max-w-7xl mx-auto px-6 py-8 -mt-32 relative">
        <div className="flex flex-col md:flex-row gap-8">
          <div className="flex-shrink-0">
            <img
              src={movieData.posterUrl}
              alt={movieData.title}
              className="w-64 rounded-lg shadow-2xl"
            />
          </div>

          <div className="flex-1">
            <h1 className="text-4xl font-bold mb-4">{movieData.title}</h1>
            
            <div className="flex flex-wrap gap-4 mb-6 text-gray-300">
              <span className="flex items-center gap-1">
                ⭐ {movieData.averageRating.toFixed(1)} ({movieData.totalRatings} ratings)
              </span>
              <span>{movieData.releaseYear}</span>
              {movieData.runtime && <span>{movieData.runtime} min</span>}
              <span>{movieData.views} views</span>
            </div>

            <div className="flex flex-wrap gap-2 mb-6">
              {movieData.genres?.map((genre: any) => (
                <span key={genre.id} className="px-3 py-1 bg-blue-600 rounded-full text-sm">
                  {genre.name}
                </span>
              ))}
            </div>

            <p className="text-gray-300 mb-8 text-lg leading-relaxed">{movieData.description}</p>

            <div className="flex flex-wrap gap-4 mb-8">
              <button
                onClick={() => addToHistoryMutation.mutate()}
                className="px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg font-medium transition"
              >
                ▶ Watch Now
              </button>
              <button
                onClick={() => addToWatchlistMutation.mutate()}
                disabled={addToWatchlistMutation.isPending}
                className="px-6 py-3 bg-gray-800 hover:bg-gray-700 rounded-lg font-medium transition disabled:opacity-50"
              >
                + Add to Watchlist
              </button>
              {movieData.trailerUrl && (
                <a
                  href={movieData.trailerUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-6 py-3 bg-gray-800 hover:bg-gray-700 rounded-lg font-medium transition"
                >
                  🎥 Trailer
                </a>
              )}
            </div>

            <div className="bg-gray-900 rounded-lg p-6 mb-8">
              <h2 className="text-2xl font-bold mb-4">Rate this movie</h2>
              <div className="flex gap-2 mb-4">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    onClick={() => setRating(star)}
                    className={`text-3xl transition ${rating >= star ? 'text-yellow-400' : 'text-gray-600'}`}
                  >
                    {rating >= star ? '⭐' : '☆'}
                  </button>
                ))}
              </div>
              <textarea
                value={review}
                onChange={(e) => setReview(e.target.value)}
                placeholder="Write a review (optional)"
                className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4"
                rows={3}
              />
              <button
                onClick={() => addRatingMutation.mutate({ rating, review: review || undefined })}
                disabled={rating === 0 || addRatingMutation.isPending}
                className="px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg font-medium transition disabled:opacity-50"
              >
                {addRatingMutation.isPending ? 'Submitting...' : 'Submit Rating'}
              </button>
            </div>

            {ratings && ratings.data && ratings.data.length > 0 && (
              <div className="bg-gray-900 rounded-lg p-6">
                <h2 className="text-2xl font-bold mb-4">Reviews ({ratings.data.length})</h2>
                <div className="space-y-4">
                  {ratings.data.slice(0, 5).map((rating: any) => (
                    <div key={rating.id} className="border-b border-gray-800 pb-4">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="font-medium">{rating.user?.username}</span>
                        <span className="text-yellow-400">⭐ {rating.rating}</span>
                      </div>
                      {rating.review && <p className="text-gray-300">{rating.review}</p>}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
