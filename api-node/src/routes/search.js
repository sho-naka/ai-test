// Deprecated placeholder for /api/search
const express = require('express');
const router = express.Router();

router.all('/', (req, res) => {
  res.status(410).json({ status:410, message: 'gone', note: 'use /api/direct-search instead' });
});

module.exports = router;
