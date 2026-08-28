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
    mutationFn: (data: { firstName?: string; lastName?: string }) => usersApi.updateProfile(data),
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
    return <div className="min-h-screen bg-gray-950 text-white p-6">Loading...</div>;
  }

  const user = profile?.data;
  const prefs = preferences?.data;

  return (
    <div className="min-h-screen bg-gray-950 text-white p-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-8">👤 Profile</h1>

        <div className="bg-gray-900 rounded-lg p-6 mb-8 border border-gray-800">
          <h2 className="text-2xl font-bold mb-4">Account Information</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">Username</label>
              <p className="text-lg">{user?.username}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">Email</label>
              <p className="text-lg">{user?.email}</p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">First Name</label>
                <input
                  type="text"
                  defaultValue={user?.firstName || ''}
                  onBlur={(e) => updateProfileMutation.mutate({ firstName: e.target.value })}
                  className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">Last Name</label>
                <input
                  type="text"
                  defaultValue={user?.lastName || ''}
                  onBlur={(e) => updateProfileMutation.mutate({ lastName: e.target.value })}
                  className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">Role</label>
              <p className="text-lg">{user?.role}</p>
            </div>
          </div>
        </div>

        <div className="bg-gray-900 rounded-lg p-6 mb-8 border border-gray-800">
          <h2 className="text-2xl font-bold mb-4">Preferences</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">Minimum Rating</label>
              <input
                type="number"
                min="0"
                max="5"
                step="0.5"
                defaultValue={prefs?.minRating || 3}
                onBlur={(e) => updatePreferencesMutation.mutate({ minRating: parseFloat(e.target.value) })}
                className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">Language</label>
              <select
                defaultValue={prefs?.language || 'en'}
                onChange={(e) => updatePreferencesMutation.mutate({ language: e.target.value })}
                className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="en">English</option>
                <option value="es">Spanish</option>
                <option value="fr">French</option>
                <option value="de">German</option>
              </select>
            </div>
          </div>
        </div>

        <div className="bg-gray-900 rounded-lg p-6 border border-gray-800">
          <h2 className="text-2xl font-bold mb-4">Account Stats</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <p className="text-3xl font-bold text-blue-400">{user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}</p>
              <p className="text-sm text-gray-400">Member Since</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold text-green-400">{user?.lastLoginAt ? new Date(user.lastLoginAt).toLocaleDateString() : 'N/A'}</p>
              <p className="text-sm text-gray-400">Last Login</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
