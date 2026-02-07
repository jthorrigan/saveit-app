const express = require('express');
const router = express.Router();
const db = require('../database');

// GET all saves with filtering and sorting
router.get('/', (req, res) => {
  const { sourceType, category, sortBy = 'created_at', order = 'DESC', search } = req.query;

  let query = `SELECT * FROM saves WHERE 1=1`;
  const params = [];

  if (sourceType) {
    query += ` AND source_type = ?`;
    params.push(sourceType);
  }

  if (search) {
    query += ` AND (title LIKE ? OR description LIKE ? OR notes LIKE ?)`;
    const searchTerm = `%${search}%`;
    params.push(searchTerm, searchTerm, searchTerm);
  }

  query += ` ORDER BY ${sortBy} ${order}`;

  db.all(query, params, (err, rows) => {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).json({ error: err.message });
    }
    res.json(rows || []);
  });
});

// GET single save by ID
router.get('/:id', (req, res) => {
  const { id } = req.params;

  db.get(`SELECT * FROM saves WHERE id = ?`, [id], (err, row) => {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).json({ error: err.message });
    }
    if (!row) {
      return res.status(404).json({ error: 'Save not found' });
    }
    res.json(row);
  });
});

// CREATE new save
router.post('/', (req, res) => {
  const { title, url, description, source_type, notes, categories } = req.body;

  console.log('Creating save:', { title, source_type });

  if (!title || !source_type) {
    return res.status(400).json({ error: 'Title and source_type are required' });
  }

  db.run(
    `INSERT INTO saves (title, url, description, source_type, notes)
     VALUES (?, ?, ?, ?, ?)`,
    [title, url || '', description || '', source_type, notes || ''],
    function (err) {
      if (err) {
        console.error('Database error:', err);
        return res.status(500).json({ error: err.message });
      }

      const saveId = this.lastID;
      console.log('Save created with ID:', saveId);

      res.status(201).json({ id: saveId, message: 'Save created successfully' });
    }
  );
});

// UPDATE save
router.put('/:id', (req, res) => {
  const { id } = req.params;
  const { title, url, description, source_type, notes } = req.body;

  if (!title || !source_type) {
    return res.status(400).json({ error: 'Title and source_type are required' });
  }

  db.run(
    `UPDATE saves SET title = ?, url = ?, description = ?, source_type = ?, notes = ?, updated_at = CURRENT_TIMESTAMP
     WHERE id = ?`,
    [title, url || '', description || '', source_type, notes || '', id],
    function (err) {
      if (err) {
        console.error('Database error:', err);
        return res.status(500).json({ error: err.message });
      }

      if (this.changes === 0) {
        return res.status(404).json({ error: 'Save not found' });
      }

      res.json({ message: 'Save updated successfully' });
    }
  );
});

// DELETE save
router.delete('/:id', (req, res) => {
  const { id } = req.params;

  db.run(`DELETE FROM saves WHERE id = ?`, [id], function (err) {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).json({ error: err.message });
    }

    if (this.changes === 0) {
      return res.status(404).json({ error: 'Save not found' });
    }

    res.json({ message: 'Save deleted successfully' });
  });
});

module.exports = router;
