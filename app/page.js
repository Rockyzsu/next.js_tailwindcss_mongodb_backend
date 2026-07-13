'use client';

import { useState, useEffect, useCallback } from 'react';

export default function Home() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchStats = useCallback(async () => {
    try {
      const res = await fetch('/api/stats');
      const data = await res.json();
      if (data.error) {
        console.log(data.error);
        setError(data.error);
      } else {
        console.log(data);
        setStats(data);
      }
    } catch {
      console.log('请求失败');
      setError('请求失败');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  const cards = [
    {
      label: '已完成下载',
      value: stats?.completed ?? '—',
      color: 'green',
      bg: 'bg-green-50',
      border: 'border-green-200',
      text: 'text-green-600',
      icon: '✓',
    },
    {
      label: '未完成下载',
      value: stats?.pending ?? '—',
      color: 'amber',
      bg: 'bg-amber-50',
      border: 'border-amber-200',
      text: 'text-amber-600',
      icon: '⟳',
    },
    {
      label: '全部短剧',
      value: stats?.total ?? '—',
      color: 'blue',
      bg: 'bg-blue-50',
      border: 'border-blue-200',
      text: 'text-blue-600',
      icon: '♬',
    },
  ];

  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-6">
      {/* Header */}
      <div className="text-center mb-10">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">短剧下载统计</h1>
        <p className="text-gray-500">实时查看短剧下载状态</p>
      </div>

      {/* Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-2xl">
        {cards.map((card) => (
          <div
            key={card.label}
            className={`${card.bg} border ${card.border} rounded-2xl p-6 text-center transition-transform hover:scale-105 shadow-sm`}
          >
            <span className="text-3xl mb-3 inline-block">{card.icon}</span>
            <p className="text-gray-600 text-sm font-medium">{card.label}</p>
            {loading ? (
              <div className="h-12 mt-2 flex items-center justify-center">
                <div className="w-6 h-6 border-2 border-gray-300 border-t-gray-600 rounded-full animate-spin" />
              </div>
            ) : (
              <p className={`${card.text} text-5xl font-bold mt-2`}>
                {card.value}
              </p>
            )}
          </div>
        ))}
      </div>

      {/* Error */}
      {error && (
        <div className="mt-6 bg-red-50 border border-red-200 text-red-600 px-5 py-3 rounded-xl text-sm">
          {error}
        </div>
      )}

      {/* Footer */}
      <button
        onClick={fetchStats}
        disabled={loading}
        className="mt-8 px-6 py-2 bg-gray-900 text-white rounded-xl text-sm hover:bg-gray-700 transition disabled:opacity-50"
      >
        刷新数据
      </button>
    </main>
  );
}
