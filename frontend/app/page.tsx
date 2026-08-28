"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

interface Genre {
  id: string;
  name: string;
}

interface Movie {
  id: string;
  title: string;
  posterUrl: string;
  backdropUrl?: string;
  averageRating: number;
  genres: Genre[];
}

const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api";

export default function HomePage() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadMovies = async () => {
      try {
        const response = await fetch(`${API_URL}/movies?limit=20`);

        if (!response.ok) {
          throw new Error("Failed to fetch movies");
        }

        const data = await response.json();
        setMovies(data.movies || []);
      } catch (error) {
        console.error("Failed to load movies:", error);
      } finally {
        setLoading(false);
      }
    };

    loadMovies();
  }, []);

  /*
   * Duplicate the posters so the wall feels full even when
   * the API only returns a small number of movies.
   */
  const posterWall = [...movies, ...movies, ...movies];

  return (
    <main className="landing-page">
      {/* =====================================================
          MOVIE POSTER BACKGROUND
      ====================================================== */}
      <div className="poster-wall" aria-hidden="true">
        <div className="poster-row poster-row-1">
          {posterWall.slice(0, 12).map((movie, index) => (
            <div
              className="wall-poster"
              key={`row1-${movie.id}-${index}`}
            >
              <img
                src={movie.posterUrl}
                alt=""
                loading="eager"
              />
            </div>
          ))}
        </div>

        <div className="poster-row poster-row-2">
          {posterWall.slice(8, 20).map((movie, index) => (
            <div
              className="wall-poster"
              key={`row2-${movie.id}-${index}`}
            >
              <img
                src={movie.posterUrl}
                alt=""
                loading="eager"
              />
            </div>
          ))}
        </div>

        <div className="poster-row poster-row-3">
          {posterWall.slice(16, 28).map((movie, index) => (
            <div
              className="wall-poster"
              key={`row3-${movie.id}-${index}`}
            >
              <img
                src={movie.posterUrl}
                alt=""
                loading="eager"
              />
            </div>
          ))}
        </div>

        <div className="poster-row poster-row-4">
          {posterWall.slice(24, 36).map((movie, index) => (
            <div
              className="wall-poster"
              key={`row4-${movie.id}-${index}`}
            >
              <img
                src={movie.posterUrl}
                alt=""
                loading="eager"
              />
            </div>
          ))}
        </div>
      </div>

      {/* =====================================================
          OVERLAY
      ====================================================== */}
      <div className="poster-overlay" />

      {/* =====================================================
          NAVIGATION
      ====================================================== */}
      <nav className="landing-nav">
        <Link href="/" className="brand">
          MOVIEREC
        </Link>

        <div className="nav-actions">
          <Link href="/login" className="nav-login">
            Login
          </Link>

          <Link href="/register" className="nav-register">
            Get Started
          </Link>
        </div>
      </nav>

      {/* =====================================================
          MAIN CONTENT
      ====================================================== */}
      <section className="landing-content">
        <div className="content-card">

          <div className="eyebrow">
            YOUR NEXT FAVORITE MOVIE AWAITS
          </div>

          <h1>MOVIEREC</h1>

          <h2>
            Discover. Rate. Remember.
          </h2>

          <p className="landing-description">
            Find movies that match your taste, discover hidden gems,
            build your watchlist, and let MovieRec help you decide
            what to watch next.
          </p>

          <div className="landing-actions">
            <Link
              href="/register"
              className="start-button"
            >
              START EXPLORING
              <span className="button-arrow">→</span>
            </Link>
          </div>

          <p className="login-prompt">
            Already have an account?
            <Link href="/login">
              Login
            </Link>
          </p>

          <div className="story-line">
            <span className="story-icon">✦</span>
            <span>Your next story starts here</span>
          </div>

        </div>
      </section>

      {/* =====================================================
          SMALL STATUS INDICATOR
      ====================================================== */}
      {!loading && movies.length > 0 && (
        <div className="movie-count">
          <span className="status-dot" />
          {movies.length} movies ready to explore
        </div>
      )}
    </main>
  );
}
