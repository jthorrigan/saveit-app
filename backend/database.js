const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = process.env.DATABASE_PATH || path.join(__dirname, 'database.db');
const db = new sqlite3.Database(dbPath);

// Initialize database tables
db.serialize(() => {
  // Creates table
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
  `);

  // Categories table
  db.run(`
    CREATE TABLE IF NOT EXISTS categories (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL UNIQUE,
      description TEXT
    )
  `);

  // Junction table for many-to-many relationship
  db.run(`
    CREATE TABLE IF NOT EXISTS saves_categories (
      save_id INTEGER NOT NULL,
      category_id INTEGER NOT NULL,
      PRIMARY KEY (save_id, category_id),
      FOREIGN KEY (save_id) REFERENCES saves(id) ON DELETE CASCADE,
      FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE CASCADE
    )
  `);

  // Create indexes for faster queries
  db.run(`CREATE INDEX IF NOT EXISTS idx_saves_source_type ON saves(source_type)`);
  db.run(`CREATE INDEX IF NOT EXISTS idx_saves_created_at ON saves(created_at)`);
  db.run(`CREATE INDEX IF NOT EXISTS idx_saves_categories_save_id ON saves_categories(save_id)`);
});

module.exports = db;
