import React, { useContext, useState, useEffect } from 'react';
import { AppContext } from '../App';
import { api, IMG } from '../api';
import MovieCard from './MovieCard';
import ActorModal from './ActorModal';

export default function MovieModal({ movie }) {
    const { closeMovie, toggleWatchlist, watchlist, userReviews, addReview, user, openMovie } = useContext(AppContext);
    const [details, setDetails] = useState(null);
    const [reviewText, setReviewText] = useState('');
    const [starRating, setStarRating] = useState(0);
    const [hoverStar, setHoverStar] = useState(0);
    const [submitted, setSubmitted] = useState(false);
    const [selectedActor, setSelectedActor] = useState(null);

    const inWatchlist = watchlist.find(m => m.id === movie.id);

    useEffect(() => {
        api.movie(movie.id).then(setDetails);
    }, [movie.id]);

    const submitReview = () => {
        if (!reviewText.trim() || !starRating) return;
        addReview(movie.id, starRating, reviewText.trim());
        setReviewText('');
        setStarRating(0);
        setSubmitted(true);
        setTimeout(() => setSubmitted(false), 3000);
    };

    const trailer = details?.videos?.results?.find(v => v.type === 'Trailer' && v.site === 'YouTube');
    const cast = details?.credits?.cast?.slice(0, 16) || [];
    const reviews = userReviews[movie.id] || [];
    const backdrop = IMG(movie.backdrop_path || details?.backdrop_path, 'w1280');
    const poster = IMG(movie.poster_path, 'w342');
    const genres = details?.genres || [];
    const runtime = details?.runtime ? `${Math.floor(details.runtime / 60)}h ${details.runtime % 60}m` : null;
    const similar = details?.similar?.results?.slice(0, 8) || [];
    const avgRating = movie.vote_average?.toFixed(1);
    const userScore = Math.round(movie.vote_average * 10);
    const scoreColor = userScore >= 70 ? '#21d07a' : userScore >= 50 ? '#d2d531' : '#db2360';
    const year = movie.release_date?.split('-')[0];

    return (
        <>
            <div className="modal-overlay" onClick={closeMovie}>
                <div className="modal" onClick={e => e.stopPropagation()}>
                    <button className="modal-close" onClick={closeMovie}>✕</button>

                    {backdrop
                        ? <img className="modal-backdrop" src={backdrop} alt="" />
                        : <div className="modal-backdrop-placeholder">🎬</div>
                    }

                    <div className="modal-body">
                        <div className="modal-header">
                            {poster
                                ? <img className="modal-poster" src={poster} alt={movie.title} />
                                : <div className="modal-poster-placeholder">🎬</div>
                            }
                            <div className="modal-info">
                                <h2 className="modal-title">{movie.title}</h2>
                                <div className="modal-meta">
                                    {/* TMDb-style circular score */}
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                        <div style={{
                                            width: 48, height: 48, borderRadius: '50%',
                                            background: '#081c22',
                                            border: `3px solid ${scoreColor}`,
                                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                                        }}>
                                            <span style={{ fontSize: 13, fontWeight: 900, color: scoreColor }}>{userScore}<sup style={{ fontSize: 8 }}>%</sup></span>
                                        </div>
                                        <span style={{ fontSize: 12, color: 'var(--muted)', lineHeight: 1.3 }}>User<br />Score</span>
                                    </div>
                                    <div className="modal-rating-big">
                                        <span className="star">★</span>
                                        <span className="score">{avgRating}</span>
                                        <span className="max">/10</span>
                                        <span className="votes">({movie.vote_count?.toLocaleString()} votes)</span>
                                    </div>
                                    {year && <span className="modal-year">📅 {year}</span>}
                                    {runtime && <span className="modal-runtime">⏱ {runtime}</span>}
                                </div>
                                {genres.length > 0 && (
                                    <div className="genre-tags">
                                        {genres.map(g => <span key={g.id} className="genre-tag">{g.name}</span>)}
                                    </div>
                                )}
                                <div className="modal-actions">
                                    <button
                                        className={`btn-sm btn-ghost ${inWatchlist ? 'on' : ''}`}
                                        onClick={() => toggleWatchlist(movie)}
                                    >
                                        {inWatchlist ? '★ In Watchlist' : '☆ Add to Watchlist'}
                                    </button>
                                </div>
                            </div>
                        </div>

                        {movie.overview && (
                            <div className="modal-section">
                                <h3>Overview</h3>
                                <p className="modal-overview">{movie.overview}</p>
                            </div>
                        )}

                        {trailer && (
                            <div className="modal-section">
                                <h3>🎬 Trailer</h3>
                                <iframe
                                    className="trailer-frame"
                                    src={`https://www.youtube-nocookie.com/embed/${trailer.key}?rel=0`}
                                    title="Trailer"
                                    allowFullScreen
                                />
                            </div>
                        )}

                        {cast.length > 0 && (
                            <div className="modal-section">
                                <h3>Cast <span style={{ color: 'var(--muted)', fontSize: 13, fontWeight: 400 }}>— click an actor to learn more</span></h3>
                                <div className="cast-row">
                                    {cast.map(c => (
                                        <div key={c.id} className="cast-card"
                                            onClick={() => setSelectedActor(c)}
                                            style={{ cursor: 'pointer' }}
                                            title={`View ${c.name}'s profile`}
                                        >
                                            <div style={{ position: 'relative' }}>
                                                {c.profile_path
                                                    ? <img className="cast-avatar" src={IMG(c.profile_path, 'w185')} alt={c.name} loading="lazy"
                                                        style={{ transition: 'all 0.2s', border: '2px solid transparent' }}
                                                        onMouseOver={e => e.target.style.borderColor = 'var(--primary)'}
                                                        onMouseOut={e => e.target.style.borderColor = 'transparent'}
                                                    />
                                                    : <div className="cast-avatar-fallback"
                                                        style={{ transition: 'all 0.2s' }}
                                                        onMouseOver={e => e.target.style.outline = '2px solid var(--primary)'}
                                                        onMouseOut={e => e.target.style.outline = 'none'}
                                                    >{c.name[0]}</div>
                                                }
                                                {/* Hover overlay */}
                                                <div style={{
                                                    position: 'absolute', inset: 0, borderRadius: '50%',
                                                    background: 'rgba(229,9,20,0)',
                                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                    fontSize: 18, transition: 'all 0.2s',
                                                }}
                                                    onMouseOver={e => { e.currentTarget.style.background = 'rgba(229,9,20,0.3)'; }}
                                                    onMouseOut={e => { e.currentTarget.style.background = 'rgba(229,9,20,0)'; }}
                                                >
                                                </div>
                                            </div>
                                            <div className="cast-name" style={{ color: 'var(--text)' }}>{c.name}</div>
                                            <div className="cast-char">{c.character}</div>
                                            <div style={{ fontSize: 9, color: 'var(--primary)', fontWeight: 600, marginTop: 2 }}>View Profile →</div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        <div className="modal-section">
                            <h3>⭐ User Reviews</h3>
                            {user ? (
                                <div className="review-form">
                                    <div className="star-picker">
                                        {[1, 2, 3, 4, 5].map(n => (
                                            <span key={n} className="star-pick"
                                                style={{ color: n <= (hoverStar || starRating) ? '#f5c518' : 'var(--surface3)' }}
                                                onMouseEnter={() => setHoverStar(n)}
                                                onMouseLeave={() => setHoverStar(0)}
                                                onClick={() => setStarRating(n)}
                                            >★</span>
                                        ))}
                                        {starRating > 0 && <span style={{ fontSize: 14, color: 'var(--muted)', marginLeft: 8 }}>{starRating}/5</span>}
                                    </div>
                                    <textarea
                                        className="review-input"
                                        placeholder="Share your thoughts about this movie..."
                                        value={reviewText}
                                        onChange={e => setReviewText(e.target.value)}
                                    />
                                    <button className="review-submit" onClick={submitReview}>
                                        {submitted ? '✓ Submitted!' : 'Post Review'}
                                    </button>
                                </div>
                            ) : (
                                <div className="login-prompt">
                                    <span style={{ color: 'var(--primary)', fontWeight: 600, cursor: 'pointer' }}>Sign in</span> to leave a review
                                </div>
                            )}

                            {reviews.length === 0 && !user && (
                                <p style={{ color: 'var(--muted)', fontSize: 14, marginTop: 12 }}>No reviews yet. Be the first!</p>
                            )}
                            {reviews.map(r => (
                                <div key={r.id} className="review-card">
                                    <div className="review-card-header">
                                        <span className="review-user">👤 {r.username}</span>
                                        <span className="review-date">{r.date}</span>
                                    </div>
                                    <div className="review-stars">{'★'.repeat(r.rating)}{'☆'.repeat(5 - r.rating)}</div>
                                    <p className="review-text">{r.comment}</p>
                                </div>
                            ))}
                        </div>

                        {similar.length > 0 && (
                            <div className="modal-section">
                                <h3>Similar Movies</h3>
                                <div className="movie-row-inner">
                                    {similar.map(m => <MovieCard key={m.id} movie={m} />)}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Actor Profile Modal - stacked on top */}
            {selectedActor && (
                <ActorModal
                    actor={selectedActor}
                    onClose={() => setSelectedActor(null)}
                    onMovieClick={(m) => { closeMovie(); openMovie(m); }}
                />
            )}
        </>
    );
}
