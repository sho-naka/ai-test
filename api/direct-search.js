// Minimal Vercel serverless function to respond quickly and bypass the Express app.
// This handler intentionally avoids requiring the Express app or serverless-http.
module.exports = async (req, res) => {
  try {
    if (req.method !== 'POST') {
      res.status(405).setHeader('Allow', 'POST');
      return res.end('Method Not Allowed');
    }

    console.log('[direct-search] invoked', { method: req.method, url: req.url });
    const body = req.body || {};

    // Accept prompt in multiple common fields
    const prompt = body.prompt || body.query || body.input || (typeof body === 'string' ? body : JSON.stringify(body || {}));
    if (!prompt || String(prompt).trim() === '') {
      return res.status(400).json({ ok: false, error: 'empty prompt' });
    }

    const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
    if (!OPENAI_API_KEY) {
      console.error('[direct-search] missing OPENAI_API_KEY');
      return res.status(500).json({ ok: false, error: 'server misconfiguration: OPENAI_API_KEY not set' });
    }

    // Call OpenAI Chat Completions API (gpt-3.5-turbo for broad availability)
    const openaiResp = await fetch('https://api.openai.com/v1/chat/completions', {
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

    // Forward OpenAI response (but avoid echoing API key)
    return res.status(openaiResp.ok ? 200 : 502).json({ ok: openaiResp.ok, openai: openaiJson });
  } catch (err) {
    console.error('[direct-search] error', err && err.stack ? err.stack : err);
    return res.status(500).json({ ok: false, error: 'internal', detail: String(err && err.message ? err.message : err) });
  }
};
