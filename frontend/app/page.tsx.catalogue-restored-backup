'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  Play,
  Plus,
  Search,
  Star,
  ChevronRight,
  Film,
  Sparkles,
} from 'lucide-react';

type Genre = {
  id: string;
  name: string;
};

type Movie = {
  id: string;
  title: string;
  description: string;
  releaseYear: number;
  runtime: number | null;
  posterUrl: string | null;
  backdropUrl: string | null;
  trailerUrl: string | null;
  tmdbId: number | null;
  averageRating: number;
  totalRatings: number;
  views: number;
  popularity: number;
  genres: Genre[];
};

const API_URL =
  process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api';

/* ============================================================
   MOVIE CARD
============================================================ */

function MovieCard({ movie }: { movie: Movie }) {
  return (
    <Link
      href={`/movies/${movie.id}`}
      className="group block w-[170px] flex-shrink-0 sm:w-[190px] md:w-[210px]"
    >
      <div className="relative aspect-[2/3] overflow-hidden rounded-xl bg-zinc-900 shadow-lg shadow-black/20">
        {movie.posterUrl ? (
          <img
            src={movie.posterUrl}
            alt={movie.title}
            className="h-full w-full object-cover transition duration-700 ease-out group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full items-center justify-center bg-zinc-900">
            <Film className="h-10 w-10 text-zinc-700" />
          </div>
        )}

        {/* Bottom cinematic gradient */}
        <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-80" />

        {/* Hover overlay */}
        <div className="absolute inset-0 bg-black/30 opacity-0 transition duration-300 group-hover:opacity-100" />

        {/* Rating */}
        <div className="absolute right-3 top-3 flex items-center gap-1 rounded-full bg-black/70 px-2.5 py-1.5 text-xs font-semibold text-white backdrop-blur-md">
          <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
          {movie.averageRating.toFixed(1)}
        </div>

        {/* Hover actions */}
        <div className="absolute inset-x-0 bottom-4 flex translate-y-3 justify-center gap-2 opacity-0 transition duration-300 group-hover:translate-y-0 group-hover:opacity-100">
          <span className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-black shadow-xl">
            <Play className="h-4 w-4 fill-current" />
          </span>

          <span className="flex h-10 w-10 items-center justify-center rounded-full border border-white/20 bg-black/70 text-white backdrop-blur-md">
            <Plus className="h-4 w-4" />
          </span>
        </div>
      </div>

      <div className="pt-3">
        <h3 className="truncate text-sm font-semibold text-white transition group-hover:text-zinc-300 md:text-base">
          {movie.title}
        </h3>

        <div className="mt-1.5 flex items-center gap-2 text-xs text-zinc-500">
          <span>{movie.releaseYear}</span>

          {movie.genres?.length > 0 && (
            <>
              <span>•</span>
              <span className="truncate">
                {movie.genres
                  .slice(0, 1)
                  .map((genre) => genre.name)
                  .join('')}
              </span>
            </>
          )}
        </div>
      </div>
    </Link>
  );
}

/* ============================================================
   MOVIE ROW
============================================================ */

function MovieRow({
  title,
  subtitle,
  movies,
}: {
  title: string;
  subtitle?: string;
  movies: Movie[];
}) {
  if (!movies.length) return null;

  return (
    <section className="py-10">
      <div className="mb-5 flex items-end justify-between px-6 md:px-10 lg:px-16">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-white md:text-3xl">
            {title}
          </h2>

          {subtitle && (
            <p className="mt-1 text-sm text-zinc-500">
              {subtitle}
            </p>
          )}
        </div>

        <Link
          href="/movies"
          className="group flex items-center gap-1 text-sm font-medium text-zinc-500 transition hover:text-white"
        >
          Explore
          <ChevronRight className="h-4 w-4 transition group-hover:translate-x-1" />
        </Link>
      </div>

      <div className="flex gap-4 overflow-x-auto px-6 pb-4 scrollbar-hide md:gap-5 md:px-10 lg:px-16">
        {movies.map((movie) => (
          <MovieCard key={movie.id} movie={movie} />
        ))}
      </div>
    </section>
  );
}

/* ============================================================
   HOME PAGE
============================================================ */

export default function LandingPage() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadMovies() {
      try {
        const response = await fetch(`${API_URL}/movies`);

        if (!response.ok) {
          throw new Error('Failed to fetch movies');
        }

        const data = await response.json();

        setMovies(data.movies || []);
      } catch (error) {
        console.error('Failed to load movies:', error);
      } finally {
        setLoading(false);
      }
    }

    loadMovies();
  }, []);

  const featuredMovie = movies[0];

  const trendingMovies = [...movies]
    .sort((a, b) => b.views - a.views)
    .slice(0, 10);

  const popularMovies = [...movies]
    .sort((a, b) => b.popularity - a.popularity)
    .slice(0, 10);

  const topRatedMovies = [...movies]
    .sort((a, b) => b.averageRating - a.averageRating)
    .slice(0, 10);

  return (
    <main className="min-h-screen overflow-hidden bg-[#070707] text-white">

      {/* ======================================================
          NAVBAR
      ====================================================== */}

      <nav className="fixed inset-x-0 top-0 z-50">
        <div className="absolute inset-0 bg-gradient-to-b from-black/80 to-transparent" />

        <div className="relative mx-auto flex h-20 max-w-[1600px] items-center justify-between px-6 md:px-10 lg:px-16">

          {/* Logo */}
          <Link href="/" className="group flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-black transition duration-300 group-hover:scale-105">
              <Film className="h-5 w-5" />
            </div>

            <span className="text-lg font-bold tracking-tight">
              MovieRec
            </span>
          </Link>

          {/* Main navigation */}
          <div className="hidden items-center gap-8 md:flex">
            <Link
              href="/"
              className="text-sm font-medium text-white"
            >
              Home
            </Link>

            <Link
              href="/movies"
              className="text-sm font-medium text-zinc-400 transition hover:text-white"
            >
              Movies
            </Link>

            <Link
              href="/recommendations"
              className="flex items-center gap-1.5 text-sm font-medium text-zinc-400 transition hover:text-white"
            >
              <Sparkles className="h-3.5 w-3.5" />
              For You
            </Link>

            <Link
              href="/watchlist"
              className="text-sm font-medium text-zinc-400 transition hover:text-white"
            >
              Watchlist
            </Link>
          </div>

          {/* Right */}
          <div className="flex items-center gap-3">
            <Link
              href="/movies"
              className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/5 text-zinc-300 backdrop-blur-md transition hover:bg-white/10 hover:text-white"
            >
              <Search className="h-4.5 w-4.5" />
            </Link>

            <Link
              href="/login"
              className="hidden text-sm font-medium text-zinc-300 transition hover:text-white sm:block"
            >
              Log in
            </Link>

            <Link
              href="/register"
              className="rounded-full bg-white px-5 py-2.5 text-sm font-semibold text-black transition duration-300 hover:scale-105 hover:bg-zinc-200"
            >
              Get Started
            </Link>
          </div>
        </div>
      </nav>

      {/* ======================================================
          HERO
      ====================================================== */}

      <section className="relative min-h-[760px] overflow-hidden md:min-h-[850px]">

        {/* Background */}
        {featuredMovie?.backdropUrl ? (
          <div className="absolute inset-0">
            <img
              src={featuredMovie.backdropUrl}
              alt=""
              className="h-full w-full object-cover object-center scale-105 animate-[heroZoom_20s_ease-out_forwards]"
            />
          </div>
        ) : (
          <div className="absolute inset-0 bg-zinc-950" />
        )}

        {/* Dark cinematic treatment */}
        <div className="absolute inset-0 bg-black/30" />

        <div className="absolute inset-0 bg-gradient-to-r from-black via-black/70 to-black/10" />

        <div className="absolute inset-0 bg-gradient-to-t from-[#070707] via-transparent to-black/20" />

        <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-transparent to-transparent" />

        {/* Hero content */}
        <div className="relative z-10 mx-auto flex min-h-[760px] max-w-[1600px] items-end px-6 pb-24 pt-32 md:min-h-[850px] md:px-10 md:pb-28 lg:px-16">

          {loading ? (
            <div className="w-full max-w-2xl animate-pulse">
              <div className="mb-5 h-7 w-28 rounded-full bg-white/10" />
              <div className="mb-5 h-20 w-full max-w-xl rounded-xl bg-white/10" />
              <div className="mb-3 h-4 w-full max-w-xl rounded bg-white/10" />
              <div className="mb-3 h-4 w-[85%] max-w-lg rounded bg-white/10" />
              <div className="mt-8 h-12 w-44 rounded-full bg-white/10" />
            </div>
          ) : featuredMovie ? (
            <div className="max-w-3xl">

              {/* Label */}
              <div className="mb-5 flex items-center gap-3">
                <span className="flex items-center gap-1.5 rounded-full bg-white px-3 py-1.5 text-xs font-bold uppercase tracking-wider text-black">
                  <Sparkles className="h-3.5 w-3.5" />
                  Featured
                </span>

                <span className="flex items-center gap-1.5 text-sm font-medium text-yellow-400">
                  <Star className="h-4 w-4 fill-current" />
                  {featuredMovie.averageRating.toFixed(1)}
                </span>

                <span className="text-sm text-zinc-300">
                  {featuredMovie.releaseYear}
                </span>
              </div>

              {/* Title */}
              <h1 className="max-w-4xl text-5xl font-black leading-[0.92] tracking-[-0.04em] text-white sm:text-6xl md:text-7xl lg:text-8xl">
                {featuredMovie.title}
              </h1>

              {/* Description */}
              <p className="mt-6 max-w-2xl text-base leading-7 text-zinc-300 md:text-lg md:leading-8">
                {featuredMovie.description}
              </p>

              {/* Genres */}
              {featuredMovie.genres?.length > 0 && (
                <div className="mt-5 flex flex-wrap gap-2">
                  {featuredMovie.genres.slice(0, 4).map((genre) => (
                    <span
                      key={genre.id}
                      className="rounded-full border border-white/10 bg-black/30 px-3 py-1.5 text-xs font-medium text-zinc-300 backdrop-blur-md"
                    >
                      {genre.name}
                    </span>
                  ))}
                </div>
              )}

              {/* Buttons */}
              <div className="mt-8 flex flex-wrap gap-3">
                <Link
                  href={`/movies/${featuredMovie.id}`}
                  className="group flex items-center gap-2 rounded-full bg-white px-7 py-3.5 font-semibold text-black shadow-2xl transition duration-300 hover:scale-105 hover:bg-zinc-200"
                >
                  <Play className="h-5 w-5 fill-current transition group-hover:scale-110" />
                  Watch Trailer
                </Link>

                <Link
                  href="/watchlist"
                  className="flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-7 py-3.5 font-semibold text-white backdrop-blur-md transition duration-300 hover:bg-white/20"
                >
                  <Plus className="h-5 w-5" />
                  My Watchlist
                </Link>
              </div>

            </div>
          ) : (
            <div className="max-w-2xl">
              <h1 className="text-5xl font-black tracking-tight md:text-7xl">
                Discover your next favorite movie.
              </h1>

              <p className="mt-5 text-zinc-400">
                Discover movies, build your watchlist and get recommendations
                based on what you love.
              </p>

              <Link
                href="/movies"
                className="mt-8 inline-flex rounded-full bg-white px-7 py-3.5 font-semibold text-black"
              >
                Explore Movies
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* ======================================================
          MOVIE COLLECTIONS
      ====================================================== */}

      <div className="relative z-20 -mt-6">

        <MovieRow
          title="Trending Now"
          subtitle="What everyone is watching"
          movies={trendingMovies}
        />

        <MovieRow
          title="Popular Movies"
          subtitle="The movies people keep coming back to"
          movies={popularMovies}
        />

        <MovieRow
          title="Top Rated"
          subtitle="Highest rated movies in MovieRec"
          movies={topRatedMovies}
        />

      </div>

      {/* ======================================================
          DISCOVERY CTA
      ====================================================== */}

      <section className="relative mx-6 my-20 overflow-hidden rounded-3xl border border-white/10 bg-zinc-950 md:mx-10 lg:mx-16">

        {featuredMovie?.backdropUrl && (
          <img
            src={featuredMovie.backdropUrl}
            alt=""
            className="absolute inset-0 h-full w-full object-cover opacity-10"
          />
        )}

        <div className="absolute inset-0 bg-gradient-to-br from-white/[0.06] via-transparent to-black" />

        <div className="relative px-6 py-20 text-center md:px-12 md:py-24">

          <div className="mx-auto mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-white text-black">
            <Sparkles className="h-5 w-5" />
          </div>

          <h2 className="mx-auto max-w-3xl text-3xl font-bold tracking-tight md:text-5xl">
            Stop scrolling.
            <br />
            Start discovering.
          </h2>

          <p className="mx-auto mt-5 max-w-xl text-sm leading-7 text-zinc-400 md:text-base">
            Tell MovieRec what you enjoy watching and discover recommendations
            that actually match your taste.
          </p>

          <Link
            href="/register"
            className="mt-8 inline-flex rounded-full bg-white px-7 py-3.5 font-semibold text-black transition duration-300 hover:scale-105 hover:bg-zinc-200"
          >
            Create Your Account
          </Link>
        </div>
      </section>

      {/* ======================================================
          FOOTER
      ====================================================== */}

      <footer className="border-t border-white/5 px-6 py-10 md:px-10 lg:px-16">

        <div className="mx-auto flex max-w-[1600px] flex-col gap-6 md:flex-row md:items-center md:justify-between">

          <Link href="/" className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-white text-black">
              <Film className="h-4 w-4" />
            </div>

            <span className="font-semibold">
              MovieRec
            </span>
          </Link>

          <div className="flex flex-wrap gap-6 text-sm text-zinc-500">
            <Link
              href="/movies"
              className="transition hover:text-white"
            >
              Movies
            </Link>

            <Link
              href="/recommendations"
              className="transition hover:text-white"
            >
              Recommendations
            </Link>

            <Link
              href="/watchlist"
              className="transition hover:text-white"
            >
              Watchlist
            </Link>

            <Link
              href="/profile"
              className="transition hover:text-white"
            >
              Profile
            </Link>
          </div>

          <p className="text-sm text-zinc-600">
            © 2026 MovieRec
          </p>

        </div>
      </footer>

    </main>
  );
}
