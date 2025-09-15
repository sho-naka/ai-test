// Vercel catch-all: forward any /api/* request to the Express app via serverless-http
const serverless = require('serverless-http');
const app = require('../api-node/src/index.js');

module.exports = serverless(app);
