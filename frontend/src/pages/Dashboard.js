import React, { useState, useEffect } from 'react';
import './dashboard.css';

function Dashboard() {
  const [movieTitle, setMovieTitle] = useState('');
  const [review, setReview] = useState('');
  const [reviews, setReviews] = useState([]);
  const [commentInputs, setCommentInputs] = useState({});
  const [message, setMessage] = useState('');
  const API_KEY = 'd364a04c'; // ✅ keep this as a string
  const API_URL = process.env.REACT_APP_API_URL;
 const fetchReviews = async () => {
  const res = await fetch(`${API_URL}/reviews`);
  const data = await res.json();

  const enriched = await Promise.all(
    data.map(async (r) => {
      const m = await fetch(
        `https://www.omdbapi.com/?t=${encodeURIComponent(r.movieTitle)}&apikey=${API_KEY}`
      );

      const movieData = await m.json();

      return {
        ...r,
        movieData,
      };
    })
  );

  setReviews(enriched);
};

  useEffect(() => {
    fetchReviews();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    const res = await fetch(`${API_URL}/reviews`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ movieTitle, review }),
    });
    const data = await res.json();
    if (res.ok) {
      setMessage('✅ Review added!');
      setMovieTitle('');
      setReview('');
      fetchReviews();
    } else setMessage(data.message);
  };

  const handleLike = async (id) => {
  const token = localStorage.getItem('token');

  const res = await fetch(`${API_URL}/reviews/${id}/like`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const data = await res.json();

  if (res.ok) {
    fetchReviews();
  } else {
    alert(data.message);
  }
};

  const handleCommentSubmit = async (id) => {
    const text = commentInputs[id];
    if (!text) return;
    const token = localStorage.getItem('token');
    const res = await fetch(`${API_URL}/reviews/${id}/comment`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ text }),
    });
    if (res.ok) {
      setCommentInputs({ ...commentInputs, [id]: '' });
      fetchReviews();
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    window.location.href = '/login';
  };

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <h1>CineScope 🎬</h1>
        <button className="logout-btn" onClick={handleLogout}>
          Logout
        </button>
      </header>

      <div className="review-form">
        <h2>Add a Movie Review</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Movie Title"
            value={movieTitle}
            onChange={(e) => setMovieTitle(e.target.value)}
            required
          />
          <textarea
            placeholder="Write your review..."
            value={review}
            onChange={(e) => setReview(e.target.value)}
            required
          />
          <button type="submit">Submit Review</button>
        </form>
        <p className="message">{message}</p>
      </div>

      <div className="reviews-section">
        <h2>Recent Reviews</h2>
        {reviews.map((r, i) => (
          <div key={i} className="review-card">
            {r.movieData?.Poster && r.movieData.Poster !== 'N/A' && (
              <img src={r.movieData.Poster} alt={r.movieTitle} className="movie-poster" />
            )}
            <div className="review-content">
              <h3>{r.movieTitle}</h3>
              <p><strong>Year:</strong> {r.movieData?.Year}</p>
              <p><strong>Plot:</strong> {r.movieData?.Plot}</p>
              <p className="user-review">💬 {r.review}</p>

              <div className="review-actions">
                <button onClick={() => handleLike(r._id)}>❤️ {r.likes || 0}</button>
              </div>

              <div className="comments-section">
                <h4>Comments</h4>
                {r.comments?.length > 0 ? (
                  r.comments.map((c, idx) => (
                    <div key={idx} className="comment">
                      <strong>{c.email}:</strong> {c.text}
                    </div>
                  ))
                ) : (
                  <p>No comments yet.</p>
                )}
                <div className="comment-input">
                  <input
                    type="text"
                    placeholder="Write a comment..."
                    value={commentInputs[r._id] || ''}
                    onChange={(e) =>
                      setCommentInputs({ ...commentInputs, [r._id]: e.target.value })
                    }
                  />
                  <button onClick={() => handleCommentSubmit(r._id)}>Send</button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Dashboard;
