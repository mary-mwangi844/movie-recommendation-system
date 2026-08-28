'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { watchlistApi } from '../../lib/api';

export default function WatchlistPage() {
  const queryClient = useQueryClient();

  const { data: watchlist, isLoading } = useQuery({
    queryKey: ['watchlist'],
    queryFn: () => watchlistApi.get(),
  });

  const updateStatusMutation = useMutation({
    mutationFn: ({ movieId, status }: { movieId: string; status: string }) =>
      watchlistApi.update(movieId, { status }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['watchlist'] });
    },
  });

  const removeMutation = useMutation({
    mutationFn: (movieId: string) => watchlistApi.remove(movieId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['watchlist'] });
    },
  });

  if (isLoading) {
    return <div className="min-h-screen bg-gray-950 text-white p-6">Loading watchlist...</div>;
  }

  const items = watchlist?.data || [];

  return (
    <div className="min-h-screen bg-gray-950 text-white p-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold mb-8">📝 My Watchlist</h1>

        {items.length === 0 ? (
          <div className="text-center py-12 text-gray-400">
            Your watchlist is empty. Add movies to keep track of what you want to watch!
          </div>
        ) : (
          <div className="space-y-4">
            {items.map((item: any) => (
              <div key={item.id} className="bg-gray-900 rounded-lg p-6 flex gap-6 border border-gray-800">
                <img
                  src={item.movie.posterUrl}
                  alt={item.movie.title}
                  className="w-32 h-48 object-cover rounded"
                />

                <div className="flex-1">
                  <h3 className="text-xl font-bold mb-2">{item.movie.title}</h3>
                  <div className="flex items-center gap-4 text-gray-400 mb-4">
                    <span>{item.movie.releaseYear}</span>
                    <span>⭐ {item.movie.averageRating.toFixed(1)}</span>
                  </div>

                  <div className="flex items-center gap-2 mb-4">
                    <span className="text-sm text-gray-400">Status:</span>
                    <select
                      value={item.status}
                      onChange={(e) => updateStatusMutation.mutate({ movieId: item.movieId, status: e.target.value })}
                      className="px-3 py-1 bg-gray-800 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="PLANNED">📅 Planned</option>
                      <option value="WATCHING">👀 Watching</option>
                      <option value="COMPLETED">✅ Completed</option>
                      <option value="DROPPED">❌ Dropped</option>
                    </select>
                  </div>

                  {item.notes && (
                    <p className="text-gray-400 text-sm mb-4">Notes: {item.notes}</p>
                  )}

                  <button
                    onClick={() => removeMutation.mutate(item.movieId)}
                    disabled={removeMutation.isPending}
                    className="px-4 py-2 bg-red-600 hover:bg-red-700 rounded text-sm transition disabled:opacity-50"
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
