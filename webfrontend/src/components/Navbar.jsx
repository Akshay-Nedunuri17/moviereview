import React, { useContext, useState } from 'react';
import { AppContext } from '../App';

const TABS = [
    { id: 'home', label: 'Home' },
    { id: 'trending', label: 'Trending' },
    { id: 'toprated', label: 'Top Rated' },
    { id: 'search', label: 'Search' },
];

export default function Navbar() {
    const { page, setPage, user, setUser } = useContext(AppContext);
    const [showProfile, setShowProfile] = useState(false);
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const login = () => {
        if (username.trim()) { setUser({ username: username.trim() }); setShowProfile(false); }
    };

    return (
        <>
            <nav className="navbar">
                <div className="navbar-logo" onClick={() => setPage('home')}>CINE<span>RATE</span></div>
                <div className="navbar-nav">
                    {TABS.map(t => (
                        <button key={t.id} className={`nav-btn ${page === t.id ? 'active' : ''}`} onClick={() => setPage(t.id)}>
                            {t.label}
                        </button>
                    ))}
                </div>
                <div className="navbar-right">
                    <button className="search-toggle" onClick={() => setPage('search')}>🔍</button>
                    <button className="avatar-btn" onClick={() => setShowProfile(true)}>
                        {user ? user.username[0].toUpperCase() : '?'}
                    </button>
                </div>
            </nav>

            {showProfile && (
                <div className="profile-modal" onClick={() => setShowProfile(false)}>
                    <div className="profile-box" onClick={e => e.stopPropagation()}>
                        {user ? (
                            <>
                                <div className="profile-user">
                                    <div className="profile-avatar-big">{user.username[0].toUpperCase()}</div>
                                    <div className="profile-name">{user.username}</div>
                                </div>
                                <button className="profile-btn" onClick={() => setShowProfile(false)}>Continue Watching 🎬</button>
                                <button className="profile-logout" onClick={() => { setUser(null); setShowProfile(false); }}>Sign Out</button>
                            </>
                        ) : (
                            <>
                                <div className="profile-title">Sign In to CineRate</div>
                                <input className="profile-input" placeholder="Username" value={username} onChange={e => setUsername(e.target.value)} onKeyDown={e => e.key === 'Enter' && login()} />
                                <input className="profile-input" placeholder="Password" type="password" value={password} onChange={e => setPassword(e.target.value)} onKeyDown={e => e.key === 'Enter' && login()} />
                                <button className="profile-btn" onClick={login}>Sign In / Create Account</button>
                                <button className="profile-close" onClick={() => setShowProfile(false)}>Cancel</button>
                            </>
                        )}
                    </div>
                </div>
            )}
        </>
    );
}
