import React, { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import MemoryGame from '../components/MemoryGame'
import Leaderboard from '../components/Leaderboard'
import styles from './GamePage.module.css'

const TABS = ['game', 'scores', 'leaderboard']

export default function GamePage() {
  const { user, logout } = useAuth()
  const [activeTab, setActiveTab] = useState('game')

  return (
    <div className={styles.container}>
      {/* Decorative blobs */}
      <div className={styles.blob1} />
      <div className={styles.blob2} />

      {/* Navbar */}
      <nav className={styles.nav}>
        <div className={styles.navBrand}>
          <span className={styles.navLogo}>🃏</span>
          <span className={styles.navTitle}>Memory Game</span>
        </div>
        <div className={styles.navRight}>
          <div className={styles.userBadge}>
            <span className={styles.userAvatar}>{user.username[0].toUpperCase()}</span>
            <span className={styles.userName}>{user.username}</span>
          </div>
          <button className={styles.logoutBtn} onClick={logout}>
            Sign Out
          </button>
        </div>
      </nav>

      {/* Stats bar */}
      <div className={styles.statsBar}>
        <StatCard icon="🎮" label="Games Played" value={user.stats.gamesPlayed} />
        <StatCard icon="⚡" label="Best Score"   value={user.stats.bestScore !== null ? `${user.stats.bestScore} moves` : '—'} />
        <StatCard icon="🃏" label="Total Moves"  value={user.stats.totalMoves} />
      </div>

      {/* Tabs */}
      <div className={styles.tabBar}>
        {[
          { key: 'game',        label: '🎯 Play',       },
          { key: 'scores',      label: '📊 My Scores',  },
          { key: 'leaderboard', label: '🏆 Leaderboard',},
        ].map(t => (
          <button
            key={t.key}
            className={`${styles.tabBtn} ${activeTab === t.key ? styles.tabBtnActive : ''}`}
            onClick={() => setActiveTab(t.key)}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className={styles.content}>
        {activeTab === 'game'        && <MemoryGame />}
        {activeTab === 'scores'      && <MyScores user={user} />}
        {activeTab === 'leaderboard' && <Leaderboard />}
      </div>
    </div>
  )
}

function StatCard({ icon, label, value }) {
  return (
    <div className={styles.statCard}>
      <span className={styles.statIcon}>{icon}</span>
      <div>
        <div className={styles.statValue}>{value}</div>
        <div className={styles.statLabel}>{label}</div>
      </div>
    </div>
  )
}

function MyScores({ user }) {
  const scores = user.scores || []
  return (
    <div className={styles.scoresPanel}>
      <h2 className={styles.panelTitle}>My Recent Games</h2>
      {scores.length === 0 ? (
        <div className={styles.emptyState}>
          <div className={styles.emptyIcon}>🎯</div>
          <p>No games yet — play a round to see your scores!</p>
        </div>
      ) : (
        <div className={styles.scoresList}>
          {scores.map((s, i) => (
            <div key={i} className={styles.scoreRow}>
              <div className={styles.scoreRank}>#{i + 1}</div>
              <div className={styles.scoreDetails}>
                <span className={styles.scoreMoves}>{s.moves} moves</span>
                <span className={styles.scoreTime}>{s.time}s · {s.difficulty}</span>
              </div>
              <div className={styles.scoreDate}>
                {new Date(s.date).toLocaleDateString()}
              </div>
              {i === 0 && user.stats.bestScore === s.moves && (
                <span className={styles.scoreBest}>🏆 Best</span>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
