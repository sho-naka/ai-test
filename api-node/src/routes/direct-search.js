const express = require('express');
const router = express.Router();

// Resolve a fetch implementation at runtime:
// - prefer global fetch (Node 18+, or polyfilled)
// - otherwise try dynamic import of node-fetch
async function getFetch() {
  if (typeof fetch !== 'undefined') return fetch;
  try {
    const mod = await import('node-fetch');
    return mod.default || mod;
  } catch (e) {
    return null;
  }
}

// POST /api/direct-search
router.post('/', async (req, res) => {
  try {
    const body = req.body || {};
    console.log('[direct-search] request received (local)', { path: req.path, method: req.method });

    const prompt = body.prompt || body.query || body.input || (typeof body === 'string' ? body : JSON.stringify(body || {}));
    if (!prompt || String(prompt).trim() === '') {
      return res.status(400).json({ status:400, message: 'empty prompt' });
    }

    const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
    if (!OPENAI_API_KEY) {
      console.error('[direct-search] missing OPENAI_API_KEY');
      return res.status(500).json({ status:500, message: 'server misconfiguration: OPENAI_API_KEY not set' });
    }

    const fetchFn = await getFetch();
    if (!fetchFn) {
      console.error('[direct-search] no fetch available; please run `npm install node-fetch` or use Node 18+');
      return res.status(500).json({ status:500, message: 'server misconfiguration: no fetch available' });
    }

    const openaiResp = await fetchFn('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: [{ role: 'user', content: String(prompt) }],
        max_tokens: 512,
        temperature: 0.2
      })
    });

    const openaiJson = await openaiResp.json();
    return res.status(openaiResp.ok ? 200 : 502).json({ ok: openaiResp.ok, openai: openaiJson });
  } catch (err) {
    console.error('[direct-search] error', err && err.stack ? err.stack : err);
    return res.status(500).json({ status:500, message: 'internal', detail: String(err && err.message ? err.message : err) });
  }
});

module.exports = router;
