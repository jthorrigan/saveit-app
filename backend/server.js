const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// API routes FIRST
const savesRoutes = require('./routes/saves');
const categoriesRoutes = require('./routes/categories');

app.use('/api/saves', savesRoutes);
app.use('/api/categories', categoriesRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'Server is running' });
});

// Serve static files from frontend build
const frontendPath = path.join(__dirname, '../frontend/build');
console.log('Serving static files from:', frontendPath);
app.use(express.static(frontendPath));

// For any route not matching API, serve index.html
app.get('*', (req, res) => {
  const indexPath = path.join(frontendPath, 'index.html');
  console.log('Attempting to serve index.html from:', indexPath);
  
  if (!req.path.startsWith('/api')) {
    res.sendFile(indexPath, (err) => {
      if (err) {
        console.error('Error serving index.html:', err.message);
        res.status(500).send('Error loading app');
      }
    });
  } else {
    res.status(404).json({ error: 'API route not found' });
  }
});

// Error handling
app.use((err, req, res, next) => {
  console.error('Server error:', err.message);
  res.status(500).json({ error: 'Server error: ' + err.message });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`API available at http://localhost:${PORT}/api`);
  console.log(`Frontend available at http://localhost:${PORT}`);
});
