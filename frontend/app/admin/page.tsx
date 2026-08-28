'use client';

import Link from 'next/link';
import { mockMovies } from '../../lib/mock-data';

export default function AdminDashboardPage() {
  const totalMovies = mockMovies.length;
  const totalViews = mockMovies.reduce((sum, m) => sum + m.views, 0);
  const avgRating = mockMovies.reduce((sum, m) => sum + m.averageRating, 0) / mockMovies.length;

  return (
    <div className="min-h-screen bg-gray-950 text-white p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-4xl font-bold">🛡️ Admin Dashboard</h1>
          <Link
            href="/movies"
            className="px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg font-medium transition"
          >
            Back to App
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
          <div className="bg-gray-900 rounded-lg p-6 border border-gray-800">
            <p className="text-gray-400 text-sm mb-2">Total Movies</p>
            <p className="text-3xl font-bold">{totalMovies}</p>
          </div>
          <div className="bg-gray-900 rounded-lg p-6 border border-gray-800">
            <p className="text-gray-400 text-sm mb-2">Total Views</p>
            <p className="text-3xl font-bold">{totalViews.toLocaleString()}</p>
          </div>
          <div className="bg-gray-900 rounded-lg p-6 border border-gray-800">
            <p className="text-gray-400 text-sm mb-2">Average Rating</p>
            <p className="text-3xl font-bold">{avgRating.toFixed(1)}</p>
          </div>
          <div className="bg-gray-900 rounded-lg p-6 border border-gray-800">
            <p className="text-gray-400 text-sm mb-2">Active Users</p>
            <p className="text-3xl font-bold">1,234</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Link
            href="/admin/movies"
            className="bg-gray-900 rounded-lg p-8 border border-gray-800 hover:border-blue-500 transition cursor-pointer"
          >
            <div className="flex items-center gap-4">
              <div className="text-4xl">🎬</div>
              <div>
                <h3 className="text-xl font-bold mb-1">Movie Management</h3>
                <p className="text-gray-400">Add, edit, and delete movies</p>
              </div>
            </div>
          </Link>

          <div className="bg-gray-900 rounded-lg p-8 border border-gray-800 opacity-50">
            <div className="flex items-center gap-4">
              <div className="text-4xl">👥</div>
              <div>
                <h3 className="text-xl font-bold mb-1">User Management</h3>
                <p className="text-gray-400">Coming soon</p>
              </div>
            </div>
          </div>

          <div className="bg-gray-900 rounded-lg p-8 border border-gray-800 opacity-50">
            <div className="flex items-center gap-4">
              <div className="text-4xl">📊</div>
              <div>
                <h3 className="text-xl font-bold mb-1">Analytics</h3>
                <p className="text-gray-400">Coming soon</p>
              </div>
            </div>
          </div>

          <div className="bg-gray-900 rounded-lg p-8 border border-gray-800 opacity-50">
            <div className="flex items-center gap-4">
              <div className="text-4xl">⚙️</div>
              <div>
                <h3 className="text-xl font-bold mb-1">Settings</h3>
                <p className="text-gray-400">Coming soon</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
