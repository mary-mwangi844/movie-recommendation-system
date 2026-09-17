'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { usersApi } from '../../lib/api';

export default function ProfilePage() {
  const queryClient = useQueryClient();

  const { data: profile, isLoading: profileLoading } = useQuery({
    queryKey: ['profile'],
    queryFn: () => usersApi.getProfile(),
  });

  const { data: preferences, isLoading: prefsLoading } = useQuery({
    queryKey: ['preferences'],
    queryFn: () => usersApi.getPreferences(),
  });

  const updateProfileMutation = useMutation({
    mutationFn: (data: { firstName?: string; lastName?: string }) =>
      usersApi.updateProfile(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['profile'] });
    },
  });

  const updatePreferencesMutation = useMutation({
    mutationFn: (data: any) => usersApi.updatePreferences(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['preferences'] });
    },
  });

  if (profileLoading || prefsLoading) {
    return (
      <main className="profile-page">
        <div className="profile-loading">
          <div className="profile-spinner"></div>
          <p>Loading your profile...</p>
        </div>
      </main>
    );
  }

  const user = profile?.data;
  const prefs = preferences?.data;

  const initials =
    `${user?.firstName || ''}${user?.lastName || ''}`.trim().length > 0
      ? `${user?.firstName?.[0] || ''}${user?.lastName?.[0] || ''}`.toUpperCase()
      : user?.username?.[0]?.toUpperCase() || 'U';

  const memberSince = user?.createdAt
    ? new Date(user.createdAt).toLocaleDateString()
    : 'N/A';

  const lastLogin = user?.lastLoginAt
    ? new Date(user.lastLoginAt).toLocaleDateString()
    : 'N/A';

  return (
    <main className="profile-page">

      <div className="profile-container">

        {/* Page heading */}
        <div className="profile-heading">
          <div>
            <p className="profile-eyebrow">YOUR ACCOUNT</p>
            <h1>Profile</h1>
            <p className="profile-subtitle">
              Manage your account and movie preferences.
            </p>
          </div>
        </div>

        {/* Profile hero */}
        <section className="profile-hero">

          <div className="profile-avatar">
            {initials}
          </div>

          <div className="profile-identity">
            <h2>{user?.username || 'User'}</h2>

            <p>{user?.email || 'No email available'}</p>

            <span className="profile-role">
              {user?.role || 'USER'}
            </span>
          </div>

          <div className="profile-member">
            <span>MEMBER SINCE</span>
            <strong>{memberSince}</strong>
          </div>

        </section>

        {/* Account information */}
        <section className="profile-card">

          <div className="profile-card-header">
            <div>
              <p className="profile-section-label">ACCOUNT</p>
              <h2>Account Information</h2>
            </div>
          </div>

          <div className="profile-info-grid">

            <div className="profile-field">
              <label>Username</label>
              <div className="profile-value">
                {user?.username || '—'}
              </div>
            </div>

            <div className="profile-field">
              <label>Email</label>
              <div className="profile-value">
                {user?.email || '—'}
              </div>
            </div>

            <div className="profile-field">
              <label>First Name</label>

              <input
                type="text"
                defaultValue={user?.firstName || ''}
                placeholder="Enter first name"
                onBlur={(e) =>
                  updateProfileMutation.mutate({
                    firstName: e.target.value,
                  })
                }
                className="profile-input"
              />
            </div>

            <div className="profile-field">
              <label>Last Name</label>

              <input
                type="text"
                defaultValue={user?.lastName || ''}
                placeholder="Enter last name"
                onBlur={(e) =>
                  updateProfileMutation.mutate({
                    lastName: e.target.value,
                  })
                }
                className="profile-input"
              />
            </div>

            <div className="profile-field">
              <label>Account Role</label>
              <div className="profile-value">
                <span className="role-dot"></span>
                {user?.role || 'USER'}
              </div>
            </div>

          </div>

        </section>

        {/* Preferences */}
        <section className="profile-card">

          <div className="profile-card-header">
            <div>
              <p className="profile-section-label">PERSONALIZATION</p>
              <h2>Movie Preferences</h2>
            </div>

            <span className="preference-icon">★</span>
          </div>

          <div className="preferences-grid">

            <div className="preference-item">

              <div className="preference-label">
                <div>
                  <h3>Minimum Rating</h3>
                  <p>
                    Only show movies that meet your preferred rating.
                  </p>
                </div>

                <span className="rating-value">
                  {prefs?.minRating || 3.0}
                </span>
              </div>

              <input
                type="range"
                min="0"
                max="5"
                step="0.5"
                defaultValue={prefs?.minRating || 3}
                onChange={(e) =>
                  updatePreferencesMutation.mutate({
                    minRating: parseFloat(e.target.value),
                  })
                }
                className="rating-slider"
              />

              <div className="rating-scale">
                <span>0</span>
                <span>1</span>
                <span>2</span>
                <span>3</span>
                <span>4</span>
                <span>5</span>
              </div>

            </div>

            <div className="preference-item">

              <div className="preference-label">
                <div>
                  <h3>Language</h3>
                  <p>
                    Choose the language used for your movie experience.
                  </p>
                </div>
              </div>

              <select
                defaultValue={prefs?.language || 'en'}
                onChange={(e) =>
                  updatePreferencesMutation.mutate({
                    language: e.target.value,
                  })
                }
                className="profile-select"
              >
                <option value="en">English</option>
                <option value="es">Spanish</option>
                <option value="fr">French</option>
                <option value="de">German</option>
              </select>

            </div>

          </div>

        </section>

        {/* Account statistics */}
        <section className="profile-stats">

          <div className="profile-stat">
            <span className="stat-label">MEMBER SINCE</span>
            <strong>{memberSince}</strong>
          </div>

          <div className="profile-stat">
            <span className="stat-label">LAST LOGIN</span>
            <strong>{lastLogin}</strong>
          </div>

          <div className="profile-stat">
            <span className="stat-label">ROLE</span>
            <strong>{user?.role || 'USER'}</strong>
          </div>

          <div className="profile-stat">
            <span className="stat-label">MIN RATING</span>
            <strong>{prefs?.minRating || 3.0}</strong>
          </div>

        </section>

      </div>

    </main>
  );
}
