const express = require('express');
const router = express.Router();

const search = require('./search');
const health = require('./health');

router.use('/search', search);
router.use('/health', health);

module.exports = router;
