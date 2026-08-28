'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { moviesApi } from '../../lib/api';
import Link from 'next/link';

export default function MoviesPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGenre, setSelectedGenre] = useState('');

  const { data, isLoading, error } = useQuery({
    queryKey: ['movies', searchQuery, selectedGenre],
    queryFn: () => moviesApi.getAll({ query: searchQuery, genre: selectedGenre }),
  });

  const movies = data?.data?.movies || [];

  return (
    <div className="min-h-screen bg-gray-950 text-white p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-4">🎬 Movies</h1>
          
          <div className="flex flex-col md:flex-row gap-4 mb-4">
            <input
              type="text"
              placeholder="Search movies..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1 px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <select
              value={selectedGenre}
              onChange={(e) => setSelectedGenre(e.target.value)}
              className="px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Genres</option>
              <option value="Action">Action</option>
              <option value="Adventure">Adventure</option>
              <option value="Animation">Animation</option>
              <option value="Comedy">Comedy</option>
              <option value="Crime">Crime</option>
              <option value="Drama">Drama</option>
              <option value="Horror">Horror</option>
              <option value="Sci-Fi">Sci-Fi</option>
              <option value="Thriller">Thriller</option>
              <option value="Romance">Romance</option>
            </select>
          </div>
        </div>

        {isLoading ? (
          <div className="text-center py-12">Loading movies...</div>
        ) : error ? (
          <div className="text-center py-12 text-red-400">Error loading movies</div>
        ) : movies.length === 0 ? (
          <div className="text-center py-12 text-gray-400">No movies found</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            {movies.map((movie: any) => (
              <Link key={movie.id} href={`/movies/${movie.id}`}>
                <div className="bg-gray-900 rounded-lg overflow-hidden hover:scale-105 transition-transform cursor-pointer border border-gray-800">
                  <img
                    src={movie.posterUrl}
                    alt={movie.title}
                    className="w-full h-64 object-cover"
                  />
                  <div className="p-4">
                    <h3 className="font-semibold text-lg mb-2 line-clamp-2">{movie.title}</h3>
                    <div className="flex items-center justify-between text-sm text-gray-400">
                      <span>{movie.releaseYear}</span>
                      <span className="flex items-center gap-1">
                        ⭐ {movie.averageRating.toFixed(1)}
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-1 mt-2">
                      {movie.genres?.slice(0, 2).map((genre: any) => (
                        <span key={genre.id} className="text-xs px-2 py-1 bg-gray-800 rounded">
                          {genre.name}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
