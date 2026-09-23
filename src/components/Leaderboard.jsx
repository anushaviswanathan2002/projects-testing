import React, { useMemo } from 'react'
import { useAuth } from '../context/AuthContext'
import styles from './Leaderboard.module.css'

export default function Leaderboard() {
  const { user } = useAuth()

  const entries = useMemo(() => {
    const raw = localStorage.getItem('memory_users')
    if (!raw) return []
    const users = JSON.parse(raw)
    return Object.values(users)
      .filter(u => u.stats.gamesPlayed > 0 && u.stats.bestScore !== null)
      .map(u => ({
        username: u.username,
        bestScore: u.stats.bestScore,
        gamesPlayed: u.stats.gamesPlayed,
      }))
      .sort((a, b) => a.bestScore - b.bestScore)
      .slice(0, 20)
  }, [])

  const medals = ['🥇', '🥈', '🥉']

  return (
    <div className={styles.wrapper}>
      <h2 className={styles.title}>🏆 Global Leaderboard</h2>
      <p className={styles.sub}>Ranked by best score (fewest moves)</p>

      {entries.length === 0 ? (
        <div className={styles.empty}>
          <div className={styles.emptyIcon}>🏆</div>
          <p>No scores yet — be the first to claim the top spot!</p>
        </div>
      ) : (
        <div className={styles.list}>
          {entries.map((entry, i) => (
            <div
              key={entry.username}
              className={`${styles.row} ${entry.username === user?.username ? styles.rowSelf : ''} ${i < 3 ? styles.rowTop : ''}`}
            >
              <span className={styles.rank}>
                {i < 3 ? medals[i] : `#${i + 1}`}
              </span>
              <div className={styles.info}>
                <span className={styles.name}>
                  {entry.username}
                  {entry.username === user?.username && <span className={styles.youTag}>You</span>}
                </span>
                <span className={styles.games}>{entry.gamesPlayed} games played</span>
              </div>
              <div className={styles.score}>
                <span className={styles.scoreVal}>{entry.bestScore}</span>
                <span className={styles.scoreLabel}>best moves</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
