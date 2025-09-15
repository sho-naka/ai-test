const express = require('express');
const router = express.Router();

const health = require('./health');
const directSearch = require('./direct-search');

// Only direct-search is exposed now
router.use('/direct-search', directSearch);
router.use('/health', health);

module.exports = router;
