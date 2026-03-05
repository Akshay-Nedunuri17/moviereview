import React, { useContext } from 'react';
import { IMG } from '../api';
import { AppContext } from '../App';

export default function MovieCard({ movie }) {
    const { openMovie } = useContext(AppContext);
    const poster = IMG(movie.poster_path, 'w342');
    const rating = movie.vote_average;
    const displayRating = rating?.toFixed(1);
    const userScore = Math.round(rating * 10);
    const scoreColor = userScore >= 70 ? '#21d07a' : userScore >= 50 ? '#d2d531' : '#db2360';

    return (
        <div className="movie-card" onClick={() => openMovie(movie)} title={movie.title}>
            <div style={{ position: 'relative' }}>
                {poster
                    ? <img className="movie-card-poster" src={poster} alt={movie.title} loading="lazy" />
                    : <div className="movie-card-poster" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 40, background: 'var(--surface2)', borderRadius: 10 }}>🎬</div>
                }
                {/* TMDb-style score badge */}
                {rating > 0 && (
                    <div style={{
                        position: 'absolute', bottom: -12, left: 8,
                        width: 36, height: 36, borderRadius: '50%',
                        background: '#081c22',
                        border: `3px solid ${scoreColor}`,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: 11, fontWeight: 900, color: scoreColor,
                        boxShadow: '0 2px 8px rgba(0,0,0,0.6)',
                        zIndex: 2,
                    }}>
                        {userScore}<sup style={{ fontSize: 7 }}>%</sup>
                    </div>
                )}
                <div className="movie-card-overlay">
                    <div className="overlay-play">▶</div>
                </div>
            </div>
            <div className="movie-card-info" style={{ paddingTop: 18 }}>
                <div className="movie-card-title">{movie.title}</div>
                <div className="movie-card-rating">
                    <span className="star">★</span>
                    <span className="score">{displayRating}</span>
                    <span style={{ marginLeft: 4, color: 'var(--muted)', fontSize: 11 }}>
                        {movie.release_date?.split('-')[0]}
                    </span>
                </div>
            </div>
        </div>
    );
}
