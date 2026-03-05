import React, { useState, useEffect } from 'react';
import { api, IMG } from '../api';
import MovieCard from './MovieCard';

export default function ActorModal({ actor, onClose, onMovieClick }) {
    const [details, setDetails] = useState(null);
    const [loading, setLoading] = useState(true);
    const [tab, setTab] = useState('about');

    useEffect(() => {
        setLoading(true);
        api.actor(actor.id)
            .then(setDetails)
            .finally(() => setLoading(false));
    }, [actor.id]);

    const photo = IMG(actor.profile_path, 'w342');
    const bigPhoto = details?.images?.profiles?.[0]
        ? IMG(details.images.profiles[0].file_path, 'w780')
        : photo;

    // All movies sorted by release date descending — no aggressive filtering
    const allMovies = details?.movie_credits?.cast
        ?.filter(m => m.poster_path) // only those with a poster
        ?.sort((a, b) => {
            const da = new Date(b.release_date || '1900');
            const db = new Date(a.release_date || '1900');
            return da - db;
        }) ?? [];

    const totalMovies = details?.movie_credits?.cast?.length ?? 0;

    const age = details?.birthday
        ? Math.floor((new Date() - new Date(details.birthday)) / (365.25 * 24 * 3600 * 1000))
        : null;

    return (
        <div className="modal-overlay" onClick={onClose} style={{ zIndex: 1100 }}>
            <div className="modal" style={{ maxWidth: 860 }} onClick={e => e.stopPropagation()}>

                {/* Header row with back + close */}
                <div style={{
                    position: 'absolute', top: 14, left: 14, right: 14,
                    display: 'flex', justifyContent: 'space-between', zIndex: 10,
                }}>
                    <button onClick={onClose} style={{
                        display: 'flex', alignItems: 'center', gap: 6,
                        padding: '7px 14px', borderRadius: 8,
                        background: 'rgba(0,0,0,0.65)', color: 'white',
                        fontSize: 13, fontWeight: 600, border: '1px solid rgba(255,255,255,0.15)',
                        backdropFilter: 'blur(6px)', cursor: 'pointer',
                        transition: 'background 0.2s',
                    }}
                        onMouseOver={e => e.currentTarget.style.background = 'rgba(229,9,20,0.7)'}
                        onMouseOut={e => e.currentTarget.style.background = 'rgba(0,0,0,0.65)'}
                    >
                        ← Back to Movie
                    </button>
                    <button className="modal-close" onClick={onClose} style={{ position: 'static' }}>✕</button>
                </div>

                {/* Blurred backdrop */}
                {bigPhoto && (
                    <div style={{
                        width: '100%', height: 260,
                        background: `url(${bigPhoto}) center/cover`,
                        filter: 'brightness(0.3) blur(3px)',
                        position: 'absolute', top: 0, left: 0,
                        borderRadius: '16px 16px 0 0',
                    }} />
                )}
                <div style={{ height: 260, position: 'relative' }} />

                <div className="modal-body" style={{ paddingTop: 0 }}>
                    {/* Profile header */}
                    <div style={{ display: 'flex', gap: 24, marginTop: -80, marginBottom: 24 }}>
                        {photo
                            ? <img src={photo} alt={actor.name} style={{
                                width: 120, height: 170, borderRadius: 12,
                                objectFit: 'cover', flexShrink: 0,
                                border: '3px solid var(--surface)',
                                boxShadow: '0 8px 28px rgba(0,0,0,0.7)',
                            }} />
                            : <div style={{
                                width: 120, height: 170, borderRadius: 12, flexShrink: 0,
                                background: 'linear-gradient(135deg,var(--primary),#ff6b35)',
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                fontSize: 48, fontWeight: 900, color: 'white',
                                border: '3px solid var(--surface)',
                            }}>{actor.name[0]}</div>
                        }
                        <div style={{ paddingTop: 60 }}>
                            <h2 style={{ fontSize: 26, fontWeight: 900, marginBottom: 4 }}>{actor.name}</h2>
                            {actor.character && (
                                <p style={{ color: 'var(--muted)', fontSize: 14, marginBottom: 10 }}>
                                    as <em style={{ color: 'var(--text)' }}>{actor.character}</em>
                                </p>
                            )}
                            {!loading && details && (
                                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, fontSize: 13 }}>
                                    {details.known_for_department && <Chip icon="🎬" label={details.known_for_department} />}
                                    {age && <Chip icon="🎂" label={`${age} years old`} />}
                                    {details.place_of_birth && <Chip icon="📍" label={details.place_of_birth} />}
                                    <Chip icon="🎥" label={`${totalMovies} film credits`} />
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Tabs */}
                    <div style={{ display: 'flex', gap: 4, marginBottom: 24, background: 'var(--surface2)', borderRadius: 10, padding: 4 }}>
                        {['about', 'movies'].map(t => (
                            <button key={t} onClick={() => setTab(t)} style={{
                                flex: 1, padding: '10px 0', borderRadius: 8,
                                background: tab === t ? 'var(--surface3)' : 'none',
                                color: tab === t ? 'var(--text)' : 'var(--muted)',
                                fontWeight: tab === t ? 700 : 500, fontSize: 14,
                                transition: 'all 0.2s', cursor: 'pointer',
                            }}>
                                {t === 'about' ? '📋 About' : `🎬 All Movies (${allMovies.length} with poster / ${totalMovies} total)`}
                            </button>
                        ))}
                    </div>

                    {loading ? (
                        <div style={{ display: 'flex', justifyContent: 'center', padding: 48 }}>
                            <div className="spinner" />
                        </div>
                    ) : tab === 'about' ? (
                        <div>
                            {/* Info cards grid */}
                            {(details?.birthday || details?.place_of_birth) && (
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 24 }}>
                                    {details.birthday && <InfoCard icon="🎂" label="Born" value={details.birthday} />}
                                    {details.deathday
                                        ? <InfoCard icon="🕊️" label="Died" value={details.deathday} />
                                        : age && <InfoCard icon="📅" label="Age" value={`${age} years old`} />
                                    }
                                    {details.place_of_birth && (
                                        <InfoCard icon="📍" label="Birthplace" value={details.place_of_birth} style={{ gridColumn: '1/-1' }} />
                                    )}
                                    <InfoCard icon="🎥" label="Total Film Credits" value={`${totalMovies} movies`} />
                                    <InfoCard icon="🎭" label="Known For" value={details.known_for_department || '—'} />
                                </div>
                            )}

                            {/* Biography */}
                            {details?.biography ? (
                                <div>
                                    <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 12 }}>Biography</h3>
                                    <p style={{ fontSize: 14, lineHeight: 1.85, color: '#c0c0d0', whiteSpace: 'pre-line' }}>
                                        {details.biography}
                                    </p>
                                </div>
                            ) : (
                                <div style={{ textAlign: 'center', padding: 32, color: 'var(--muted)' }}>
                                    <div style={{ fontSize: 40, marginBottom: 8 }}>📖</div>
                                    <p>No biography available.</p>
                                </div>
                            )}

                            {/* Photo gallery */}
                            {details?.images?.profiles?.length > 1 && (
                                <div style={{ marginTop: 28 }}>
                                    <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 12 }}>Photos</h3>
                                    <div style={{ display: 'flex', gap: 10, overflowX: 'auto', paddingBottom: 8 }}>
                                        {details.images.profiles.slice(0, 12).map((img, i) => (
                                            <img key={i} src={IMG(img.file_path, 'w185')} alt=""
                                                style={{ height: 140, borderRadius: 10, objectFit: 'cover', flexShrink: 0, display: 'block' }} />
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    ) : (
                        /* Movies tab — ALL movies with poster sorted by release date */
                        <div>
                            <p style={{ color: 'var(--muted)', fontSize: 13, marginBottom: 16 }}>
                                Showing {allMovies.length} movies with posters out of {totalMovies} total credits. Sorted by most recent.
                            </p>
                            {allMovies.length === 0 ? (
                                <div style={{ textAlign: 'center', padding: 40, color: 'var(--muted)' }}>
                                    <div style={{ fontSize: 40 }}>🎬</div>
                                    <p style={{ marginTop: 8 }}>No movie posters found.</p>
                                </div>
                            ) : (
                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: 16 }}>
                                    {allMovies.map(m => (
                                        <div key={`${m.id}-${m.character}`}
                                            onClick={() => { onClose(); setTimeout(() => onMovieClick(m), 200); }}
                                            style={{ cursor: 'pointer' }}
                                            title={m.character ? `as ${m.character}` : m.title}
                                        >
                                            <MovieCard movie={m} />
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

function Chip({ icon, label }) {
    return (
        <span style={{
            background: 'var(--surface2)', padding: '4px 12px',
            borderRadius: 20, color: 'var(--muted)', fontSize: 13,
        }}>{icon} {label}</span>
    );
}

function InfoCard({ icon, label, value, style = {} }) {
    return (
        <div style={{
            background: 'var(--surface2)', borderRadius: 10, padding: '12px 14px',
            border: '1px solid var(--border)', ...style,
        }}>
            <div style={{ fontSize: 11, color: 'var(--muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 4 }}>
                {icon} {label}
            </div>
            <div style={{ fontSize: 14, fontWeight: 600 }}>{value}</div>
        </div>
    );
}
