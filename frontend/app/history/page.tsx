'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { historyApi } from '../../lib/api';

export default function HistoryPage() {
  const queryClient = useQueryClient();

  const { data: history, isLoading } = useQuery({
    queryKey: ['history'],
    queryFn: () => historyApi.get(),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => historyApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['history'] });
    },
  });

  if (isLoading) {
    return <div className="min-h-screen bg-gray-950 text-white p-6">Loading history...</div>;
  }

  const items = history?.data || [];

  return (
    <div className="min-h-screen bg-gray-950 text-white p-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold mb-8">📺 Viewing History</h1>

        {items.length === 0 ? (
          <div className="text-center py-12 text-gray-400">
            No viewing history yet. Start watching movies to track your progress!
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
                    <span>Watched: {new Date(item.watchedAt).toLocaleDateString()}</span>
                  </div>

                  <div className="flex items-center gap-4 mb-4">
                    {item.completed && (
                      <span className="px-3 py-1 bg-green-600 rounded-full text-sm">✅ Completed</span>
                    )}
                    {item.watchDuration && (
                      <span className="text-sm text-gray-400">Duration: {item.watchDuration} min</span>
                    )}
                  </div>

                  <button
                    onClick={() => deleteMutation.mutate(item.id)}
                    disabled={deleteMutation.isPending}
                    className="px-4 py-2 bg-red-600 hover:bg-red-700 rounded text-sm transition disabled:opacity-50"
                  >
                    Remove from History
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
