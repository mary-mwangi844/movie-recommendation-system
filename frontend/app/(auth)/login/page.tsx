"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setLoading(true);
    setError("");

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000"}/auth/login`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email,
            password,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Invalid email or password");
      }

      if (typeof window !== "undefined") {
        localStorage.setItem("accessToken", data.accessToken);
        localStorage.setItem("token", data.accessToken);

        if (data.user) {
          localStorage.setItem("user", JSON.stringify(data.user));
        }
      }

      router.push("/dashboard");
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Something went wrong. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="login-page">
      {/* Decorative movie visual */}
      <div className="login-visual" aria-hidden="true">
        <div className="login-visual-overlay" />

        <div className="film-strip film-strip-one">
          <span>🎬</span>
          <span>★</span>
          <span>🎬</span>
          <span>★</span>
          <span>🎬</span>
        </div>

        <div className="film-strip film-strip-two">
          <span>★</span>
          <span>🎬</span>
          <span>★</span>
          <span>🎬</span>
          <span>★</span>
        </div>

        <div className="visual-content">
          <span className="visual-kicker">YOUR NEXT STORY</span>

          <h2>
            Find something
            <br />
            worth watching.
          </h2>

          <p>
            Pick up where you left off, discover new favourites, and let
            MovieRec help you decide what comes next.
          </p>

          <div className="visual-line" />
        </div>
      </div>

      {/* Login section */}
      <section className="login-content">
        <div className="login-topbar">
          <Link href="/" className="login-logo">
            MOVIEREC
          </Link>
<a href="/" className="back-link">
            ← Back to MovieRec
</a>
        </div>

        <div className="login-card">
          <div className="login-heading">
            <span className="login-eyebrow">WELCOME BACK</span>

            <h1>Welcome back</h1>

            <p>Continue your movie journey.</p>
          </div>

          <form onSubmit={handleSubmit} className="login-form">
            {error && (
              <div className="login-error" role="alert">
                {error}
              </div>
            )}

            <div className="form-group">
              <label htmlFor="email">Email address</label>

              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <div className="password-label-row">
                <label htmlFor="password">Password</label>
              </div>

              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <button
              type="submit"
              className="login-button"
              disabled={loading}
            >
              {loading ? "SIGNING IN..." : "SIGN IN"}
            </button>
          </form>

          <div className="signup-prompt">
            <span>Don't have an account?</span>{" "}
            <Link href="/register">Sign up</Link>
          </div>

          <div className="login-footer-message">
            <span>✦</span>
            <p>Discover something worth watching.</p>
            <span>✦</span>
          </div>
        </div>
      </section>
    </main>
  );
}
