const express = require('express');
const router = express.Router();
const db = require('../database');

// GET all saves with filtering and sorting
router.get('/', (req, res) => {
  const { sourceType, category, sortBy = 'created_at', order = 'DESC', search } = req.query;

  let query = `
    SELECT DISTINCT s.* FROM saves s
    LEFT JOIN saves_categories sc ON s.id = sc.save_id
    LEFT JOIN categories c ON sc.category_id = c.id
    WHERE 1=1
  `;
  const params = [];

  if (sourceType) {
    query += ` AND s.source_type = ?`;
    params.push(sourceType);
  }

  if (category) {
    query += ` AND c.name = ?`;
    params.push(category);
  }

  if (search) {
    query += ` AND (s.title LIKE ? OR s.description LIKE ? OR s.notes LIKE ?)`;
    const searchTerm = `%${search}%`;
    params.push(searchTerm, searchTerm, searchTerm);
  }

  query += ` ORDER BY s.${sortBy} ${order}`;

  db.all(query, params, (err, rows) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json(rows);
  });
});

// GET single save by ID
router.get('/:id', (req, res) => {
  const { id } = req.params;

  db.get(`SELECT * FROM saves WHERE id = ?`, [id], (err, row) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    if (!row) {
      return res.status(404).json({ error: 'Save not found' });
    }

    // Get categories for this save
    db.all(
      `SELECT c.* FROM categories c
       JOIN saves_categories sc ON c.id = sc.category_id
       WHERE sc.save_id = ?`,
      [id],
      (err, categories) => {
        if (err) {
          return res.status(500).json({ error: err.message });
        }
        res.json({ ...row, categories });
      }
    );
  });
});

// CREATE new save
router.post('/', (req, res) => {
  const { title, url, description, source_type, notes, categories } = req.body;

  if (!title || !source_type) {
    return res.status(400).json({ error: 'Title and source_type are required' });
  }

  db.run(
    `INSERT INTO saves (title, url, description, source_type, notes)
     VALUES (?, ?, ?, ?, ?)`,
    [title, url, description, source_type, notes],
    function (err) {
      if (err) {
        return res.status(500).json({ error: err.message });
      }

      const saveId = this.lastID;

      // Add categories if provided
      if (categories && categories.length > 0) {
        categories.forEach((categoryId) => {
          db.run(
            `INSERT INTO saves_categories (save_id, category_id) VALUES (?, ?)`,
            [saveId, categoryId],
            (err) => {
              if (err) console.error(err);
            }
          );
        });
      }

      res.status(201).json({ id: saveId, message: 'Save created successfully' });
    }
  );
});

// UPDATE save
router.put('/:id', (req, res) => {
  const { id } = req.params;
  const { title, url, description, source_type, notes, categories } = req.body;

  if (!title || !source_type) {
    return res.status(400).json({ error: 'Title and source_type are required' });
  }

  db.run(
    `UPDATE saves SET title = ?, url = ?, description = ?, source_type = ?, notes = ?, updated_at = CURRENT_TIMESTAMP
     WHERE id = ?`,
    [title, url, description, source_type, notes, id],
    function (err) {
      if (err) {
        return res.status(500).json({ error: err.message });
      }

      if (this.changes === 0) {
        return res.status(404).json({ error: 'Save not found' });
      }

      // Update categories
      db.run(`DELETE FROM saves_categories WHERE save_id = ?`, [id], (err) => {
        if (err) {
          return res.status(500).json({ error: err.message });
        }

        if (categories && categories.length > 0) {
          categories.forEach((categoryId) => {
            db.run(
              `INSERT INTO saves_categories (save_id, category_id) VALUES (?, ?)`,
              [id, categoryId],
              (err) => {
                if (err) console.error(err);
              }
            );
          });
        }

        res.json({ message: 'Save updated successfully' });
      });
    }
  );
});

// DELETE save
router.delete('/:id', (req, res) => {
  const { id } = req.params;

  db.run(`DELETE FROM saves WHERE id = ?`, [id], function (err) {
    if (err) {
      return res.status(500).json({ error: err.message });
    }

    if (this.changes === 0) {
      return res.status(404).json({ error: 'Save not found' });
    }

    res.json({ message: 'Save deleted successfully' });
  });
});

module.exports = router;
