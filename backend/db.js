const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.join(__dirname, 'memory_game.db');
const db = new sqlite3.Database(dbPath);

const initializeDatabase = () => {
  db.serialize(() => {
    // Create users table
    db.run(`
      CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT UNIQUE NOT NULL,
        email TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL,
        createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `, (err) => {
      if (err) console.error('Error creating users table:', err);
      else console.log('Users table initialized');
    });

    // Create game scores table
    db.run(`
      CREATE TABLE IF NOT EXISTS game_scores (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        userId INTEGER NOT NULL,
        score INTEGER NOT NULL,
        moves INTEGER NOT NULL,
        time INTEGER NOT NULL,
        createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (userId) REFERENCES users(id)
      )
    `, (err) => {
      if (err) console.error('Error creating game_scores table:', err);
      else console.log('Game scores table initialized');
    });
  });
};

module.exports = { db, initializeDatabase };
