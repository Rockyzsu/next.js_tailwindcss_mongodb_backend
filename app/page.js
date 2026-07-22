'use client';

import { useState, useEffect, useCallback } from 'react';

export default function Home() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState(null);
  const [searchLoading, setSearchLoading] = useState(false);
  const [searchError, setSearchError] = useState(null);

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

  const handleSearch = async () => {
    const q = searchQuery.trim();
    if (!q) return;

    setSearchLoading(true);
    setSearchError(null);
    setSearchResults(null);

    try {
      const res = await fetch(`/api/search?q=${encodeURIComponent(q)}`);
      const data = await res.json();
      if (data.error) {
        setSearchError(data.error);
      } else {
        setSearchResults(data);
      }
    } catch {
      setSearchError('搜索请求失败');
    } finally {
      setSearchLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') handleSearch();
  };

  const displayName = (item) => {
    return item.series_name || '未知名称';
  };

  const statusText = (status) => {
    if (status === 'completed') return { label: '已完成', color: 'text-green-600 bg-green-50 border-green-200' };
    return { label: status || '未完成', color: 'text-amber-600 bg-amber-50 border-amber-200' };
  };

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
    <main className="min-h-screen flex flex-col items-center p-6">
      {/* Header */}
      <div className="text-center mb-10">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">短剧下载管理</h1>
        <p className="text-gray-500">实时查看短剧下载状态</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-2xl mb-10">
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
        <div className="mb-6 bg-red-50 border border-red-200 text-red-600 px-5 py-3 rounded-xl text-sm">
          {error}
        </div>
      )}

      {/* Refresh Button */}
      <button
        onClick={fetchStats}
        disabled={loading}
        className="mt-6 px-6 py-2 bg-gray-900 text-white rounded-xl text-sm hover:bg-gray-700 transition disabled:opacity-50"
      >
        刷新数据
      </button>

      {/* Search Section */}
      <div className="w-full max-w-2xl mt-10">
        <h2 className="text-xl font-semibold text-gray-800 mb-3">搜索短剧</h2>
        <div className="flex gap-3">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="输入短剧名称..."
            className="flex-1 px-4 py-2.5 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-transparent"
          />
          <button
            onClick={handleSearch}
            disabled={searchLoading || !searchQuery.trim()}
            className="px-6 py-2.5 bg-blue-600 text-white rounded-xl text-sm hover:bg-blue-700 transition disabled:bg-gray-300 disabled:cursor-not-allowed"
          >
            {searchLoading ? '搜索中...' : '搜索'}
          </button>
        </div>
      </div>

      {/* Search Results */}
      <div className="w-full max-w-2xl mt-6">
        {/* Loading */}
        {searchLoading && (
          <div className="flex items-center justify-center py-12">
            <div className="w-6 h-6 border-2 border-gray-300 border-t-gray-600 rounded-full animate-spin" />
          </div>
        )}

        {/* Search Error */}
        {searchError && (
          <div className="bg-red-50 border border-red-200 text-red-600 px-5 py-3 rounded-xl text-sm">
            {searchError}
          </div>
        )}

        {/* Results */}
        {searchResults && !searchLoading && (
          <>
            <div className="text-sm text-gray-500 mb-3">
              共找到 {searchResults.total} 条结果
            </div>
            {searchResults.results.length === 0 ? (
              <div className="bg-gray-50 border border-gray-200 rounded-xl py-12 text-center text-gray-400 text-sm">
                未找到匹配的短剧
              </div>
            ) : (
              <div className="space-y-2">
                {searchResults.results.map((item, index) => {
                  const st = statusText(item.status);
                  return (
                    <div
                      key={index}
                      className="flex items-center justify-between bg-white border border-gray-200 rounded-xl px-5 py-3.5 shadow-sm hover:border-gray-300 transition"
                    >
                      <span className="text-gray-800 text-sm font-medium truncate mr-4">
                        {displayName(item)}
                      </span>
                      <span className={`shrink-0 text-xs font-medium px-2.5 py-1 rounded-full border ${st.color}`}>
                        {st.label}
                      </span>
                    </div>
                  );
                })}
              </div>
            )}
          </>
        )}
      </div>

      </main>
  );
}