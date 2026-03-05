import React, { useState, useEffect, useContext, useRef } from 'react';
import { api, IMG, GENRES } from '../api';
import MovieCard from '../components/MovieCard';
import { AppContext } from '../App';

/* ── Skeleton loader ─────────────────────────────── */
function SkeletonRow() {
    return (
        <div className="movie-row-inner">
            {[...Array(10)].map((_, i) => (
                <div key={i} className="skeleton-card">
                    <div className="skeleton skeleton-poster" />
                    <div className="skeleton skeleton-text" />
                    <div className="skeleton skeleton-text2" />
                </div>
            ))}
        </div>
    );
}

/* ── Scrollable movie row ────────────────────────── */
function MovieRow({ title, movies, loading, accent }) {
    const rowRef = useRef(null);
    const scroll = (dir) => rowRef.current && (rowRef.current.scrollLeft += dir * 600);

    return (
        <div className="section" style={{ marginBottom: 8 }}>
            <div className="section-header">
                <h2 className="section-title" style={accent ? { color: accent } : {}}>{title}</h2>
                <div style={{ display: 'flex', gap: 6 }}>
                    <button className="scroll-btn" onClick={() => scroll(-1)}>‹</button>
                    <button className="scroll-btn" onClick={() => scroll(1)}>›</button>
                </div>
            </div>
            <div className="movie-row">
                {loading
                    ? <SkeletonRow />
                    : <div className="movie-row-inner" ref={rowRef}>
                        {(movies || []).map(m => <MovieCard key={m.id} movie={m} />)}
                    </div>
                }
            </div>
        </div>
    );
}

/* ── Auto-rotating Hero ──────────────────────────── */
function Hero({ movies }) {
    const [idx, setIdx] = useState(0);
    const { openMovie } = useContext(AppContext);

    useEffect(() => {
        if (!movies.length) return;
        const t = setInterval(() => setIdx(i => (i + 1) % Math.min(movies.length, 8)), 6000);
        return () => clearInterval(t);
    }, [movies]);

    if (!movies.length) {
        return <div style={{ height: '55vh', background: 'var(--surface)' }} />;
    }

    const m = movies[idx];
    const backdrop = IMG(m.backdrop_path, 'original');
    const rating = m.vote_average?.toFixed(1);
    const userScore = Math.round(m.vote_average * 10);

    const scoreColor = userScore >= 70 ? '#21d07a' : userScore >= 50 ? '#d2d531' : '#db2360';

    return (
        <div className="hero">
            {backdrop && <div className="hero-bg" style={{ backgroundImage: `url(${backdrop})` }} />}
            <div className="hero-content">
                <div className="hero-badge">🎬 Featured</div>
                <h1 className="hero-title">{m.title}</h1>
                <div className="hero-meta">
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        {/* TMDb-style circular score */}
                        <div style={{
                            width: 48, height: 48, borderRadius: '50%',
                            background: '#081c22',
                            border: `3px solid ${scoreColor}`,
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            flexDirection: 'column', flexShrink: 0,
                        }}>
                            <span style={{ fontSize: 14, fontWeight: 900, color: scoreColor }}>{userScore}<sup style={{ fontSize: 8 }}>%</sup></span>
                        </div>
                        <span style={{ fontSize: 13, color: 'var(--muted)', lineHeight: 1.3 }}>User<br />Score</span>
                    </div>
                    <span style={{ display: 'flex', alignItems: 'center', gap: 4, color: '#f5c518', fontWeight: 700 }}>
                        ★ {rating}
                    </span>
                    <span style={{ color: 'var(--muted)' }}>{m.release_date?.split('-')[0]}</span>
                    <span style={{ color: 'var(--muted)' }}>{m.vote_count?.toLocaleString()} votes</span>
                </div>
                <p className="hero-overview">{m.overview}</p>
                <div className="hero-actions">
                    <button className="btn-primary" onClick={() => openMovie(m)}>▶ View Details</button>
                </div>
            </div>
            {/* Dots indicator */}
            <div style={{ position: 'absolute', bottom: 24, left: '50%', transform: 'translateX(-50%)', display: 'flex', gap: 6 }}>
                {movies.slice(0, 8).map((_, i) => (
                    <div key={i} onClick={() => setIdx(i)} style={{
                        width: i === idx ? 24 : 8, height: 8, borderRadius: 4,
                        background: i === idx ? 'var(--primary)' : 'rgba(255,255,255,0.3)',
                        cursor: 'pointer', transition: 'all 0.3s',
                    }} />
                ))}
            </div>
        </div>
    );
}

/* ── Genre Filter Bar ────────────────────────────── */
const GENRE_EMOJIS = {
    Action: '💥', Adventure: '🗺️', Animation: '🎨', Comedy: '😂',
    Crime: '🕵️', Documentary: '📽️', Drama: '🎭', Fantasy: '🧙',
    Horror: '👻', Mystery: '🔍', Romance: '❤️', 'Sci-Fi': '🚀',
    Thriller: '😰', Western: '🤠',
};

const GENRE_ACCENTS = {
    Action: '#ff4444', Adventure: '#ff9900', Animation: '#a855f7',
    Comedy: '#facc15', Crime: '#6b7280', Documentary: '#84cc16',
    Drama: '#60a5fa', Fantasy: '#c084fc', Horror: '#ef4444',
    Mystery: '#94a3b8', Romance: '#f472b6', 'Sci-Fi': '#38bdf8',
    Thriller: '#fb923c', Western: '#d97706',
};

/* ── Main Home Component ─────────────────────────── */
const MAIN_SECTIONS = [
    { key: 'trending', title: '🔥 Trending This Week', fn: 'trending' },
    { key: 'nowPlaying', title: '🎭 Now Playing in Theaters', fn: 'nowPlaying' },
    { key: 'topRated', title: '⭐ All-Time Top Rated', fn: 'topRated' },
    { key: 'upcoming', title: '🚀 Coming Soon', fn: 'upcoming' },
];

export default function Home({ category, title }) {
    const [main, setMain] = useState({});
    const [genres, setGenres] = useState({});
    const [loadingMain, setLoadingMain] = useState({});
    const [loadingGenres, setLoadingGenres] = useState({});
    const [activeGenre, setActiveGenre] = useState(null);

    const sections = category
        ? [{ key: category, title: title || category, fn: category }]
        : MAIN_SECTIONS;

    // Load main sections
    useEffect(() => {
        sections.forEach(s => {
            setLoadingMain(prev => ({ ...prev, [s.key]: true }));
            api[s.fn]()
                .then(res => setMain(prev => ({ ...prev, [s.key]: res.results || [] })))
                .finally(() => setLoadingMain(prev => ({ ...prev, [s.key]: false })));
        });
        // Load all genres on home page
        if (!category) {
            Object.entries(GENRES).forEach(([name, id]) => {
                setLoadingGenres(prev => ({ ...prev, [name]: true }));
                api.byGenre(id)
                    .then(res => setGenres(prev => ({ ...prev, [name]: res.results || [] })))
                    .finally(() => setLoadingGenres(prev => ({ ...prev, [name]: false })));
            });
        }
    }, [category]);

    const heroMovies = main['trending'] || main[sections[0]?.key] || [];

    const genreNames = Object.keys(GENRES);

    return (
        <div style={{ paddingBottom: 64 }}>
            {/* Hero */}
            {!category && <Hero movies={heroMovies} />}

            {/* Main category rows */}
            {sections.map(s => (
                <MovieRow
                    key={s.key}
                    title={s.title}
                    movies={main[s.key] || []}
                    loading={loadingMain[s.key]}
                />
            ))}

            {/* Genre Filter Bar */}
            {!category && (
                <>
                    <div style={{ padding: '32px 32px 0' }}>
                        <h2 style={{ fontSize: 20, fontWeight: 800, marginBottom: 16 }}>🎞️ Browse by Genre</h2>
                        <div style={{
                            display: 'flex', flexWrap: 'wrap', gap: 10, marginBottom: 0,
                        }}>
                            {genreNames.map(name => (
                                <button
                                    key={name}
                                    onClick={() => setActiveGenre(activeGenre === name ? null : name)}
                                    style={{
                                        padding: '8px 18px', borderRadius: 24,
                                        background: activeGenre === name ? GENRE_ACCENTS[name] : 'var(--surface2)',
                                        color: activeGenre === name ? 'white' : 'var(--muted)',
                                        fontSize: 13, fontWeight: 600,
                                        border: `2px solid ${activeGenre === name ? GENRE_ACCENTS[name] : 'transparent'}`,
                                        cursor: 'pointer', transition: 'all 0.2s',
                                        boxShadow: activeGenre === name ? `0 0 16px ${GENRE_ACCENTS[name]}55` : 'none',
                                    }}
                                >
                                    {GENRE_EMOJIS[name]} {name}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Show filtered genre or all genre rows */}
                    {activeGenre ? (
                        <MovieRow
                            key={activeGenre}
                            title={`${GENRE_EMOJIS[activeGenre]} Best ${activeGenre} Movies`}
                            movies={genres[activeGenre] || []}
                            loading={loadingGenres[activeGenre]}
                            accent={GENRE_ACCENTS[activeGenre]}
                        />
                    ) : (
                        genreNames.map(name => (
                            <MovieRow
                                key={name}
                                title={`${GENRE_EMOJIS[name]} ${name}`}
                                movies={genres[name] || []}
                                loading={loadingGenres[name]}
                                accent={GENRE_ACCENTS[name]}
                            />
                        ))
                    )}
                </>
            )}
        </div>
    );
}
