// Serverless wrapper for Vercel: export a handler that wraps the Express app.
const serverless = require('serverless-http');
const app = require('../api-node/src/index.js');

module.exports = serverless(app);
