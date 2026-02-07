const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const fs = require('fs');

const dbPath = process.env.DATABASE_PATH || path.join(__dirname, 'database.db');

// Create database file if it doesn't exist
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Error opening database:', err);
  } else {
    console.log('Connected to SQLite database at:', dbPath);
  }
});

// Enable foreign keys
db.run('PRAGMA foreign_keys = ON', (err) => {
  if (err) console.error('Error enabling foreign keys:', err);
});

// Initialize database tables
db.serialize(() => {
  // Saves table
  db.run(`
    CREATE TABLE IF NOT EXISTS saves (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      url TEXT,
      description TEXT,
      source_type TEXT NOT NULL,
      notes TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `, (err) => {
    if (err) console.error('Error creating saves table:', err);
    else console.log('Saves table ready');
  });

  // Categories table
  db.run(`
    CREATE TABLE IF NOT EXISTS categories (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL UNIQUE,
      description TEXT
    )
  `, (err) => {
    if (err) console.error('Error creating categories table:', err);
    else console.log('Categories table ready');
  });

  // Junction table for many-to-many relationship
  db.run(`
    CREATE TABLE IF NOT EXISTS saves_categories (
      save_id INTEGER NOT NULL,
      category_id INTEGER NOT NULL,
      PRIMARY KEY (save_id, category_id),
      FOREIGN KEY (save_id) REFERENCES saves(id) ON DELETE CASCADE,
      FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE CASCADE
    )
  `, (err) => {
    if (err) console.error('Error creating saves_categories table:', err);
    else console.log('Saves_categories table ready');
  });
});

// Export database connection
module.exports = db;
