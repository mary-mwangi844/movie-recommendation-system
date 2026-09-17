'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { moviesApi } from '../../lib/api';
import Link from 'next/link';

const genres = [
  'Action',
  'Adventure',
  'Animation',
  'Comedy',
  'Crime',
  'Drama',
  'Horror',
  'Sci-Fi',
  'Thriller',
  'Romance',
];

export default function MoviesPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGenre, setSelectedGenre] = useState('');

  const { data, isLoading, error } = useQuery({
    queryKey: ['movies', searchQuery],
    queryFn: () => moviesApi.search({ query: searchQuery }),
    enabled: searchQuery.trim().length > 0,
  });

  const movies = data?.data?.movies || [];

  const filteredMovies = selectedGenre
    ? movies.filter((movie: any) =>
        movie.genres?.some(
          (genre: any) =>
            genre.name?.toLowerCase() === selectedGenre.toLowerCase()
        )
      )
    : movies;

  return (
    <main className="movies-page">

      <header className="movies-header">

        <div className="movies-header-top">

          <div className="movies-heading">
            <h1>🎬 Movies</h1>
            <p>Discover movies you&apos;ll love</p>
          </div>

          <div className="movie-search">
            <span>🔍</span>

            <input
              type="text"
              placeholder="Search for movies..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

        </div>

        <div className="genre-list">

          <button
            className={!selectedGenre ? 'genre-button active' : 'genre-button'}
            onClick={() => setSelectedGenre('')}
          >
            All
          </button>

          {genres.map((genre) => (
            <button
              key={genre}
              className={
                selectedGenre === genre
                  ? 'genre-button active'
                  : 'genre-button'
              }
              onClick={() => setSelectedGenre(genre)}
            >
              {genre}
            </button>
          ))}

        </div>

      </header>

      <section className="movies-content">

        {!searchQuery.trim() && (

          <div className="movies-empty">

            <div className="empty-icon">
              🎬
            </div>

            <h2>Search for a movie</h2>

            <p>Find your next movie to watch</p>

          </div>

        )}

        {searchQuery.trim() && isLoading && (

          <div className="movies-empty">

            <div className="loading-spinner"></div>

            <p>Searching movies...</p>

          </div>

        )}

        {searchQuery.trim() && error && (

          <div className="movies-empty">

            <div className="empty-icon">
              ⚠️
            </div>

            <h2>Something went wrong</h2>

            <p>
              We couldn&apos;t load the movies. Please try again.
            </p>

          </div>

        )}

        {searchQuery.trim() &&
          !isLoading &&
          !error &&
          filteredMovies.length === 0 && (

            <div className="movies-empty">

              <div className="empty-icon">
                🎞️
              </div>

              <h2>No movies found</h2>

              <p>Try another search or genre.</p>

            </div>

          )}

        {searchQuery.trim() &&
          !isLoading &&
          !error &&
          filteredMovies.length > 0 && (

            <>

              <div className="results-header">

                <div>
                  <h2>
                    {selectedGenre || 'Search Results'}
                  </h2>

                  <p>
                    {filteredMovies.length}{' '}
                    {filteredMovies.length === 1
                      ? 'movie'
                      : 'movies'}{' '}
                    found
                  </p>
                </div>

              </div>

              <div className="movies-grid">

                {filteredMovies.map((movie: any) => (

                  <Link
                    key={movie.tmdbId ?? movie.id}
                    href={`/movies/${movie.id}`}
                    className="movie-link"
                  >

                    <article className="movie-card">

                      <div className="movie-poster">

                        {movie.posterUrl ? (

                          <img
                            src={movie.posterUrl}
                            alt={movie.title}
                          />

                        ) : (

                          <div className="no-poster">
                            🎬
                          </div>

                        )}

                        <div className="movie-rating">
                          ⭐{' '}
                          {typeof movie.averageRating === 'number'
                            ? movie.averageRating.toFixed(1)
                            : 'N/A'}
                        </div>

                        <div className="movie-overlay">

                          <span>
                            View movie
                          </span>

                        </div>

                      </div>

                      <div className="movie-info">

                        <h3>
                          {movie.title}
                        </h3>

                        <div className="movie-meta">

                          <span>
                            {movie.releaseYear || 'Unknown'}
                          </span>

                          <span>•</span>

                          <span>
                            {typeof movie.averageRating === 'number'
                              ? `${movie.averageRating.toFixed(1)} rating`
                              : 'No rating'}
                          </span>

                        </div>

                        <div className="movie-genres">

                          {movie.genres
                            ?.slice(0, 2)
                            .map((genre: any) => (

                              <span key={genre.id ?? genre.name}>
                                {genre.name}
                              </span>

                            ))}

                        </div>

                      </div>

                    </article>

                  </Link>

                ))}

              </div>

            </>

          )}

      </section>

    </main>
  );
}
