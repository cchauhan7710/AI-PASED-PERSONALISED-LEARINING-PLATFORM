const fs = require('fs');
const path = require('path');
const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./src/config/db');
const app = require('./src/app');

// Load env vars
dotenv.config();

// Connect Database
connectDB();

const PORT = process.env.PORT || 5000;
const clientDistPath = path.join(__dirname, '..', 'client', 'dist');

if (process.env.NODE_ENV === 'production' && fs.existsSync(clientDistPath)) {
  app.use(express.static(clientDistPath));

  app.get('*', (req, res, next) => {
    if (req.path.startsWith('/api/')) {
      return next();
    }
    return res.sendFile(path.join(clientDistPath, 'index.html'));
  });
}

app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
});
