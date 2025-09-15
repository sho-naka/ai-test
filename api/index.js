// This file intentionally delegates to the catch-all handler at api/[...slug].js
// Keeping this file avoids accidental 404s for /api but the catch-all is preferred.
module.exports = require('./[...slug].js');
