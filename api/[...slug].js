// Vercel catch-all: forward any /api/* request to the Express app via serverless-http
const serverless = require('serverless-http');
const app = require('../api-node/src/index.js');

// Wrap the serverless handler and forward the request directly to the Express app.
const handler = serverless(app);

module.exports = async (req, res) => {
	try {
		console.log('[vercel catchall] incoming', { url: req.url, method: req.method, headers: { host: req.headers.host } });

		// Fast-path OPTIONS preflight to reduce overhead
		if (req.method === 'OPTIONS') {
			res.statusCode = 204;
			res.setHeader('Content-Length', '0');
			return res.end();
		}

		// Delegate to serverless handler and wait for completion.
		// serverless-http returns a function that may be async; await ensures we observe errors.
		await handler(req, res);
	} catch (err) {
		console.error('[vercel catchall] unexpected error', err && err.stack ? err.stack : err);
		try { res.statusCode = 500; res.end('internal_error'); } catch(e){ /* noop */ }
	}
};
