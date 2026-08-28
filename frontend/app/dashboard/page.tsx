"use client";

import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { moviesApi, recommendationsApi } from "../../lib/api";

interface Movie {
  id: string;
  title: string;
  posterUrl: string;
  backdropUrl?: string;
  releaseYear?: number;
  averageRating?: number;
  genres?: {
    id: string;
    name: string;
  }[];
}

interface Recommendation {
  id: string;
  movie: Movie;
  reason?: string;
}

const genres = [
  "Action",
  "Adventure",
  "Animation",
  "Comedy",
  "Crime",
  "Drama",
  "Fantasy",
  "Horror",
  "Romance",
  "Sci-Fi",
  "Thriller",
];

export default function DashboardPage() {
  const { data: trending, isLoading: trendingLoading } = useQuery({
    queryKey: ["trending"],
    queryFn: () => moviesApi.getTrending(10),
  });

  const { data: recommendations, isLoading: recommendationsLoading } =
    useQuery({
      queryKey: ["recommendations"],
      queryFn: () => recommendationsApi.get(),
    });

  const trendingMovies: Movie[] = trending?.data || [];
  const recommendedMovies: Recommendation[] = recommendations?.data || [];

  /*
   * Use a trending movie backdrop as the dashboard's cinematic
   * background. The user has not selected this movie.
   */
  const heroMovie = trendingMovies.find(
    (movie) => movie.backdropUrl
  );

  return (
    <main className="dashboard-page">
      {/* =====================================================
          NAVIGATION
      ====================================================== */}
      <nav className="dashboard-nav">
        <Link href="/dashboard" className="dashboard-logo">
          MOVIEREC
        </Link>

        <div className="dashboard-nav-links">
          <Link href="/dashboard" className="active">
            Home
          </Link>

          <Link href="/movies">
            Movies
          </Link>

          <Link href="/movies?genre=African">
            African
          </Link>

          <Link href="/movies?genre=Anime">
            Anime
          </Link>

          <Link href="/movies?genre=K-Drama">
            K-Drama
          </Link>

          <Link href="/recommendations">
            For You
          </Link>

          <Link href="/watchlist">
            Watchlist
          </Link>
        </div>

        <div className="dashboard-nav-actions">
          <Link
            href="/movies"
            className="dashboard-nav-icon"
            aria-label="Search movies"
          >
            ⌕
          </Link>

          <Link
            href="/profile"
            className="dashboard-profile"
            aria-label="Profile"
          >
            👤
          </Link>
        </div>
      </nav>

      {/* =====================================================
          WELCOME / DISCOVERY HERO
      ====================================================== */}
      <section
        className="dashboard-hero"
        style={
          heroMovie?.backdropUrl
            ? {
                backgroundImage: `url("${heroMovie.backdropUrl}")`,
              }
            : undefined
        }
      >
        <div className="dashboard-hero-overlay" />

        <div className="dashboard-hero-content">
          <span className="dashboard-eyebrow">
            WELCOME BACK
          </span>

          <h1>
            Discover something
            <br />
            worth watching.
          </h1>

          <p>
            Explore movies, discover hidden gems and find
            your next favourite film.
          </p>

          <div className="dashboard-hero-actions">
            <Link
              href="/movies"
              className="dashboard-primary-button"
            >
              EXPLORE MOVIES
              <span>→</span>
            </Link>

            <Link
              href="/recommendations"
              className="dashboard-secondary-button"
            >
              FOR YOU
            </Link>
          </div>
        </div>
      </section>

      {/* =====================================================
          SEARCH
      ====================================================== */}
      <section className="dashboard-search-section">
        <div className="dashboard-section-heading">
          <span>SEARCH MOVIEREC</span>

          <h2>What do you want to watch?</h2>
        </div>

        <Link
          href="/movies"
          className="dashboard-search-box"
        >
          <span className="dashboard-search-symbol">
            ⌕
          </span>

          <span className="dashboard-search-placeholder">
            Search movies, genres, actors...
          </span>

          <span className="dashboard-search-arrow">
            →
          </span>
        </Link>
      </section>

      {/* =====================================================
          GENRES
      ====================================================== */}
      <section className="dashboard-section">
        <div className="dashboard-section-header">
          <div>
            <span className="dashboard-section-label">
              EXPLORE
            </span>

            <h2>Browse by genre</h2>
          </div>
        </div>

        <div className="dashboard-genre-row">
          {genres.map((genre) => (
            <Link
              key={genre}
              href={`/movies?genre=${encodeURIComponent(genre)}`}
              className="dashboard-genre-pill"
            >
              {genre}
              <span>→</span>
            </Link>
          ))}
        </div>
      </section>

      {/* =====================================================
          TRENDING NOW
      ====================================================== */}
      <section className="dashboard-section">
        <div className="dashboard-section-header">
          <div>
            <span className="dashboard-section-label">
              POPULAR RIGHT NOW
            </span>

            <h2>Trending Now</h2>
          </div>

          <Link
            href="/movies"
            className="dashboard-view-all"
          >
            View all →
          </Link>
        </div>

        {trendingLoading ? (
          <div className="dashboard-loading">
            Loading movies...
          </div>
        ) : trendingMovies.length > 0 ? (
          <div className="dashboard-movie-row">
            {trendingMovies.map((movie) => (
              <Link
                key={movie.id}
                href={`/movies/${movie.id}`}
                className="dashboard-movie-card"
              >
                <div className="dashboard-poster-wrapper">
                  <img
                    src={movie.posterUrl}
                    alt={movie.title}
                    className="dashboard-movie-poster"
                  />

                  <div className="dashboard-rating">
                    ★{" "}
                    {typeof movie.averageRating === "number"
                      ? movie.averageRating.toFixed(1)
                      : "—"}
                  </div>

                  <div className="dashboard-card-overlay">
                    <span>VIEW MOVIE</span>
                    <strong>→</strong>
                  </div>
                </div>

                <div className="dashboard-movie-info">
                  <h3>{movie.title}</h3>

                  <div className="dashboard-movie-meta">
                    <span>
                      {movie.releaseYear || "—"}
                    </span>

                    {movie.genres &&
                      movie.genres.length > 0 && (
                        <>
                          <span>•</span>
                          <span>
                            {movie.genres[0].name}
                          </span>
                        </>
                      )}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="dashboard-empty">
            No trending movies available right now.
          </div>
        )}
      </section>

      {/* =====================================================
          MADE FOR YOU
      ====================================================== */}
      <section className="dashboard-section">
        <div className="dashboard-section-header">
          <div>
            <span className="dashboard-section-label">
              PERSONALIZED
            </span>

            <h2>Made for You</h2>

            <p className="dashboard-section-description">
              Recommendations based on your movie
              preferences.
            </p>
          </div>

          <Link
            href="/recommendations"
            className="dashboard-view-all"
          >
            View all →
          </Link>
        </div>

        {recommendationsLoading ? (
          <div className="dashboard-loading">
            Finding movies for you...
          </div>
        ) : recommendedMovies.length > 0 ? (
          <div className="dashboard-movie-row">
            {recommendedMovies.map((recommendation) => {
              const movie = recommendation.movie;

              return (
                <Link
                  key={recommendation.id}
                  href={`/movies/${movie.id}`}
                  className="dashboard-movie-card"
                >
                  <div className="dashboard-poster-wrapper">
                    <img
                      src={movie.posterUrl}
                      alt={movie.title}
                      className="dashboard-movie-poster"
                    />

                    <div className="dashboard-rating">
                      ★{" "}
                      {typeof movie.averageRating ===
                      "number"
                        ? movie.averageRating.toFixed(1)
                        : "—"}
                    </div>

                    <div className="dashboard-card-overlay">
                      <span>VIEW MOVIE</span>
                      <strong>→</strong>
                    </div>
                  </div>

                  <div className="dashboard-movie-info">
                    <h3>{movie.title}</h3>

                    <div className="dashboard-movie-meta">
                      <span>
                        {movie.releaseYear || "—"}
                      </span>

                      {movie.genres &&
                        movie.genres.length > 0 && (
                          <>
                            <span>•</span>
                            <span>
                              {movie.genres[0].name}
                            </span>
                          </>
                        )}
                    </div>

                    {recommendation.reason && (
                      <p className="dashboard-reason">
                        {recommendation.reason}
                      </p>
                    )}
                  </div>
                </Link>
              );
            })}
          </div>
        ) : (
          <div className="dashboard-recommendation-empty">
            <div className="dashboard-empty-icon">
              ✦
            </div>

            <h3>Your recommendations are waiting.</h3>

            <p>
              Rate a few movies and build your watchlist
              to help MovieRec understand your taste.
            </p>

            <Link href="/movies">
              Explore Movies →
            </Link>
          </div>
        )}
      </section>

      {/* =====================================================
          QUICK ACCESS
      ====================================================== */}
      <section className="dashboard-section dashboard-quick-section">
        <div className="dashboard-section-header">
          <div>
            <span className="dashboard-section-label">
              YOUR SPACE
            </span>

            <h2>Quick Access</h2>
          </div>
        </div>

        <div className="dashboard-quick-grid">
          <Link
            href="/watchlist"
            className="dashboard-quick-card"
          >
            <span className="dashboard-quick-icon">
              +
            </span>

            <div>
              <h3>Watchlist</h3>
              <p>Your saved movies.</p>
            </div>

            <strong>→</strong>
          </Link>

          <Link
            href="/history"
            className="dashboard-quick-card"
          >
            <span className="dashboard-quick-icon">
              ◷
            </span>

            <div>
              <h3>History</h3>
              <p>Movies you've watched.</p>
            </div>

            <strong>→</strong>
          </Link>

          <Link
            href="/recommendations"
            className="dashboard-quick-card"
          >
            <span className="dashboard-quick-icon">
              ✦
            </span>

            <div>
              <h3>Recommendations</h3>
              <p>Movies picked for you.</p>
            </div>

            <strong>→</strong>
          </Link>
        </div>
      </section>

      {/* =====================================================
          FOOTER
      ====================================================== */}
      <footer className="dashboard-footer">
        <span>MOVIEREC</span>

        <p>Discover something worth watching.</p>
      </footer>
    </main>
  );
}
