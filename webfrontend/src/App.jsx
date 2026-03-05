import React, { useState, useEffect, useRef } from 'react';
import './App.css';
import { api, IMG } from './api';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import MovieModal from './components/MovieModal';
import SearchPage from './pages/SearchPage';

export const AppContext = React.createContext({});

export default function App() {
  const [page, setPage] = useState('home'); // home | search | trending | profile
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [userReviews, setUserReviews] = useState({});
  const [watchlist, setWatchlist] = useState([]);
  const [user, setUser] = useState(null);

  const openMovie = (movie) => setSelectedMovie(movie);
  const closeMovie = () => setSelectedMovie(null);
  const toggleWatchlist = (movie) => {
    setWatchlist(prev =>
      prev.find(m => m.id === movie.id)
        ? prev.filter(m => m.id !== movie.id)
        : [...prev, movie]
    );
  };
  const addReview = (movieId, rating, comment) => {
    setUserReviews(prev => ({
      ...prev,
      [movieId]: [...(prev[movieId] || []), {
        id: Date.now(),
        rating,
        comment,
        username: user?.username || 'Anonymous',
        date: new Date().toLocaleDateString()
      }]
    }));
  };

  const ctx = { openMovie, closeMovie, toggleWatchlist, watchlist, userReviews, addReview, user, setUser, setPage, page };

  return (
    <AppContext.Provider value={ctx}>
      <div className="app">
        <Navbar />
        <main className="main-content">
          {page === 'home' && <Home />}
          {page === 'search' && <SearchPage />}
          {page === 'trending' && <Home category="trending" title="🔥 Trending This Week" />}
          {page === 'toprated' && <Home category="topRated" title="⭐ Top Rated" />}
        </main>
        {selectedMovie && <MovieModal movie={selectedMovie} />}
      </div>
    </AppContext.Provider>
  );
}
