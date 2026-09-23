import React from 'react';
import '../styles/UserProfile.css';

export default function UserProfile({ profile, username }) {
  return (
    <div className="user-profile">
      <h3>👤 {profile.username}</h3>
      <div className="profile-stats">
        <div className="profile-stat">
          <span>Best Score:</span>
          <strong>{profile.bestScore}</strong>
        </div>
        <div className="profile-stat">
          <span>Games Played:</span>
          <strong>{profile.gamesPlayed}</strong>
        </div>
        {profile.lastScore && (
          <div className="profile-stat">
            <span>Last Score:</span>
            <strong>{profile.lastScore}</strong>
          </div>
        )}
      </div>
    </div>
  );
}
