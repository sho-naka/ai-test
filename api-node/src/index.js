const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');

const routes = require('./routes');
const notFound = require('./middlewares/notFound');
const errorHandler = require('./middlewares/error');

const app = express();

// Startup log (should appear in local dev and Vercel function cold start logs)
console.log('[api-node] initializing app', { env: process.env.NODE_ENV || 'development' });

// Security & logging
app.use(helmet());
app.use(morgan('dev'));

// CORS for common local dev origins; production (Vercel) will be same-origin so no CORS needed
app.use(cors({ origin: ['http://localhost:5500','http://127.0.0.1:5500','http://localhost:3000','http://127.0.0.1:3000'] }));

// Ensure JSON body parsing is enabled
app.use(express.json());

// Simple request logger to appear in function logs
app.use((req,res,next)=>{
	console.log('[api-node] req', { method: req.method, url: req.url, ip: req.ip || req.headers['x-forwarded-for'] });
	next();
});

// Mount API routes under /api
app.use('/api', routes);

// Health endpoint (JSON)
app.get('/api/health', (req,res)=>res.json({ ok: true, env: process.env.NODE_ENV || 'development' }));

// 404 / error handlers (should be after routes)
app.use(notFound);
app.use(errorHandler);

// Optional: helper to start the server in local/dev contexts
function start(port){
	const p = Number(port || process.env.PORT || 3000);
	app.listen(p, ()=> console.log(`[api-node] listening on ${p}`));
}

// Export the Express app and helpers
module.exports = app;
module.exports.start = start;
module.exports.default = app;
