'use client';

import { useQuery } from '@tanstack/react-query';
import { recommendationsApi, moviesApi } from '../../lib/api';
import Link from 'next/link';

export default function RecommendationsPage() {
  const { data: personalized, isLoading: personalizedLoading } = useQuery({
    queryKey: ['recommendations'],
    queryFn: () => recommendationsApi.get(),
  });

  const { data: trending, isLoading: trendingLoading } = useQuery({
    queryKey: ['trending'],
    queryFn: () => moviesApi.getTrending(8),
  });

  return (
    <div className="min-h-screen bg-gray-950 text-white p-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold mb-8">🎯 Recommendations</h1>

        <div className="mb-12">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold">Personalized for You</h2>
          </div>

          {personalizedLoading ? (
            <div className="text-center py-12">Loading recommendations...</div>
          ) : personalized && personalized.data && personalized.data.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {personalized.data.map((rec: any) => (
                <Link key={rec.id} href={`/movies/${rec.movie.id}`}>
                  <div className="bg-gray-900 rounded-lg overflow-hidden hover:scale-105 transition-transform cursor-pointer border border-gray-800">
                    <img
                      src={rec.movie.posterUrl}
                      alt={rec.movie.title}
                      className="w-full h-64 object-cover"
                    />
                    <div className="p-4">
                      <h3 className="font-semibold text-lg mb-2 line-clamp-2">{rec.movie.title}</h3>
                      <p className="text-sm text-gray-400 mb-2">{rec.reason}</p>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-yellow-400">⭐ {rec.movie.averageRating.toFixed(1)}</span>
                        <span className="text-blue-400">{(rec.score * 100).toFixed(0)}% match</span>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 text-gray-400">
              No personalized recommendations yet. Rate some movies to get started!
            </div>
          )}
        </div>

        <div>
          <h2 className="text-2xl font-bold mb-4">🔥 Trending Now</h2>

          {trendingLoading ? (
            <div className="text-center py-12">Loading trending movies...</div>
          ) : trending && trending.data && trending.data.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {trending.data.map((movie: any) => (
                <Link key={movie.id} href={`/movies/${movie.id}`}>
                  <div className="bg-gray-900 rounded-lg overflow-hidden hover:scale-105 transition-transform cursor-pointer border border-gray-800">
                    <img
                      src={movie.posterUrl}
                      alt={movie.title}
                      className="w-full h-64 object-cover"
                    />
                    <div className="p-4">
                      <h3 className="font-semibold text-lg mb-2 line-clamp-2">{movie.title}</h3>
                      <p className="text-sm text-gray-400 mb-2">Based on popularity</p>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-yellow-400">⭐ {movie.averageRating.toFixed(1)}</span>
                        <span className="text-orange-400">🔥 Trending</span>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 text-gray-400">No trending movies available</div>
          )}
        </div>
      </div>
    </div>
  );
}
