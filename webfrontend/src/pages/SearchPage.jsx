import React, { useState, useCallback } from 'react';
import { api } from '../api';
import MovieCard from '../components/MovieCard';

function debounce(fn, ms) {
    let t;
    return (...args) => { clearTimeout(t); t = setTimeout(() => fn(...args), ms); };
}

export default function SearchPage() {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(false);

    const doSearch = useCallback(debounce((q) => {
        if (!q.trim()) { setResults([]); return; }
        setLoading(true);
        api.search(q)
            .then(res => setResults(res.results || []))
            .finally(() => setLoading(false));
    }, 400), []);

    const onChange = (e) => { setQuery(e.target.value); doSearch(e.target.value); };

    return (
        <div className="search-page">
            <h2 style={{ fontSize: 24, fontWeight: 800, marginBottom: 24 }}>🔍 Search Movies</h2>
            <div className="search-box">
                <span className="icon">🔍</span>
                <input
                    className="search-input"
                    placeholder="Search for movies, actors, genres..."
                    value={query}
                    onChange={onChange}
                    autoFocus
                />
                {query && (
                    <button onClick={() => { setQuery(''); setResults([]); }}
                        style={{ color: 'var(--muted)', background: 'none', fontSize: 18 }}>✕</button>
                )}
            </div>

            {loading && (
                <div style={{ display: 'flex', justifyContent: 'center', padding: 40 }}>
                    <div className="spinner" />
                </div>
            )}

            {!loading && results.length > 0 && (
                <>
                    <p style={{ color: 'var(--muted)', fontSize: 13, marginBottom: 20 }}>
                        Found {results.length} results for "{query}"
                    </p>
                    <div className="search-results">
                        {results.map(m => <MovieCard key={m.id} movie={m} />)}
                    </div>
                </>
            )}

            {!loading && query && results.length === 0 && (
                <div className="empty-state">
                    <span className="icon">🎬</span>
                    <p>No results found for "{query}"</p>
                </div>
            )}

            {!query && (
                <div className="empty-state">
                    <span className="icon">🔍</span>
                    <p>Start typing to search for movies</p>
                </div>
            )}
        </div>
    );
}
