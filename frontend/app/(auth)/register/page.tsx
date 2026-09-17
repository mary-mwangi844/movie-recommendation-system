'use client';

import './register.css';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { authApi } from '../../../lib/api';

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    email: '',
    username: '',
    password: '',
    confirmPassword: '',
    firstName: '',
    lastName: '',
  });

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    try {
      const { confirmPassword, ...registerData } = formData;

      const response = await authApi.register(registerData);

      localStorage.setItem('token', response.data.token);

      router.push('/dashboard');
    } catch (err: any) {
      console.error('Registration error:', err);

      setError(
        err.response?.data?.message ||
          'Registration failed. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  const updateField = (
    field: keyof typeof formData,
    value: string
  ) => {
    setFormData((current) => ({
      ...current,
      [field]: value,
    }));
  };

  return (
    <main className="register-page">

      {/* Header */}
      <header className="register-header">
        <Link href="/" className="register-brand">
          <span className="register-brand-icon">🎬</span>
          <span>Movie Recommender</span>
        </Link>

        <Link href="/login" className="register-header-link">
          Already a member?{' '}
          <strong>Sign in</strong>
        </Link>
      </header>

      {/* Main */}
      <section className="register-main">
        <div className="register-card">

          {/* Left introduction */}
          <div className="register-intro">

            <div className="register-intro-circle-one" />
            <div className="register-intro-circle-two" />

            <div className="register-intro-content">
              <div className="register-star">★</div>

              <p className="register-eyebrow">
                Welcome to the movies
              </p>

              <h1>
                Your next favorite movie is waiting.
              </h1>

              <p className="register-intro-text">
                Create your account and discover movies based on
                what you actually enjoy watching.
              </p>
            </div>

            <div className="register-intro-footer">
              <div className="register-intro-divider" />

              <div className="register-intro-steps">
                <span>DISCOVER</span>
                <span>RATE</span>
                <span>ENJOY</span>
              </div>
            </div>
          </div>

          {/* Form */}
          <div className="register-form-panel">
            <div className="register-form-inner">

              {/* Mobile heading */}
              <div className="register-mobile-heading">
                <p>Movie Recommender</p>

                <h1>Create your account</h1>

                <span>
                  Join us and discover movies you&apos;ll love.
                </span>
              </div>

              {/* Desktop heading */}
              <div className="register-form-heading">
                <p>Get started</p>

                <h2>Create your account</h2>

                <span>
                  Enter your details below to start your movie journey.
                </span>
              </div>

              <form
                onSubmit={handleSubmit}
                className="register-form"
              >

                {/* Names */}
                <div className="register-name-row">

                  <div className="register-field">
                    <label htmlFor="firstName">
                      First name
                    </label>

                    <input
                      id="firstName"
                      type="text"
                      value={formData.firstName}
                      onChange={(e) =>
                        updateField(
                          'firstName',
                          e.target.value
                        )
                      }
                      autoComplete="given-name"
                      placeholder="John"
                    />
                  </div>

                  <div className="register-field">
                    <label htmlFor="lastName">
                      Last name
                    </label>

                    <input
                      id="lastName"
                      type="text"
                      value={formData.lastName}
                      onChange={(e) =>
                        updateField(
                          'lastName',
                          e.target.value
                        )
                      }
                      autoComplete="family-name"
                      placeholder="Doe"
                    />
                  </div>

                </div>

                {/* Email */}
                <div className="register-field">
                  <label htmlFor="email">
                    Email address
                  </label>

                  <input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) =>
                      updateField('email', e.target.value)
                    }
                    required
                    autoComplete="email"
                    placeholder="you@example.com"
                  />
                </div>

                {/* Username */}
                <div className="register-field">
                  <label htmlFor="username">
                    Username
                  </label>

                  <input
                    id="username"
                    type="text"
                    value={formData.username}
                    onChange={(e) =>
                      updateField(
                        'username',
                        e.target.value
                      )
                    }
                    required
                    autoComplete="username"
                    placeholder="Choose a username"
                  />
                </div>

                {/* Password */}
                <div className="register-field">
                  <label htmlFor="password">
                    Password
                  </label>

                  <div className="register-password">
                    <input
                      id="password"
                      type={
                        showPassword
                          ? 'text'
                          : 'password'
                      }
                      value={formData.password}
                      onChange={(e) =>
                        updateField(
                          'password',
                          e.target.value
                        )
                      }
                      required
                      minLength={6}
                      autoComplete="new-password"
                      placeholder="At least 6 characters"
                    />

                    <button
                      type="button"
                      className="register-password-button"
                      onClick={() =>
                        setShowPassword(
                          (current) => !current
                        )
                      }
                      aria-label={
                        showPassword
                          ? 'Hide password'
                          : 'Show password'
                      }
                    >
                      {showPassword ? '◉' : '◌'}
                    </button>
                  </div>
                </div>

                {/* Confirm Password */}
                <div className="register-field">
                  <label htmlFor="confirmPassword">
                    Confirm password
                  </label>

                  <div className="register-password">
                    <input
                      id="confirmPassword"
                      type={
                        showConfirmPassword
                          ? 'text'
                          : 'password'
                      }
                      value={formData.confirmPassword}
                      onChange={(e) =>
                        updateField(
                          'confirmPassword',
                          e.target.value
                        )
                      }
                      required
                      minLength={6}
                      autoComplete="new-password"
                      placeholder="Enter your password again"
                    />

                    <button
                      type="button"
                      className="register-password-button"
                      onClick={() =>
                        setShowConfirmPassword(
                          (current) => !current
                        )
                      }
                      aria-label={
                        showConfirmPassword
                          ? 'Hide password'
                          : 'Show password'
                      }
                    >
                      {showConfirmPassword ? '◉' : '◌'}
                    </button>
                  </div>
                </div>

                {/* Error */}
                {error && (
                  <div className="register-error">
                    {error}
                  </div>
                )}

                {/* Submit */}
                <button
                  type="submit"
                  className="register-submit"
                  disabled={loading}
                >
                  {loading
                    ? 'Creating account...'
                    : 'Create account'}
                </button>
              </form>

              {/* Login */}
              <p className="register-login">
                Already have an account?{' '}
                <Link href="/login">
                  Sign in
                </Link>
              </p>

              <p className="register-note">
                By creating an account, you can discover and
                personalize your movie recommendations.
              </p>

            </div>
          </div>

        </div>
      </section>
    </main>
  );
}
