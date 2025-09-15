const express = require('express');
const router = express.Router();

// POST /api/search
router.post('/', (req, res) => {
  const body = req.body || {};
  // simple validation (mirror Java DTO @NotBlank)
  const errors = {};
  ['prefecture','city','industry','businessDescription'].forEach(f => {
    if (!body[f] || String(body[f]).trim() === '') errors[f] = '空白は許可されていません';
  });
  if (Object.keys(errors).length) {
    return res.status(400).json({ status:400, errors });
  }

  // create dummy results similar to Java SearchService
  const now = new Date().toISOString();
  const results = [
    {
      title: '（ダミー）省エネ設備導入補助',
      area: `${body.prefecture || ''}${body.city || ''}`,
      industry: body.industry || null,
      subsidyAmount: '上限50万円（2/3補助）',
      url: 'https://example.local/subsidy/1',
      summary: 'ECサイト構築・機器購入を支援する補助金の例です。',
      confidence: 0.82,
      source: 'デモソース',
      publishedAt: now.split('T')[0]
    },
    {
      title: '（ダミー）テレワーク環境整備補助２',
      area: '全国',
      industry: body.industry || null,
      subsidyAmount: '上限100万円（1/2補助）',
      url: 'https://example.local/subsidy/2',
      summary: 'リモートワーク用の機器・ソフト導入支援の例です。',
      confidence: 0.72,
      source: 'デモソース',
      publishedAt: now.split('T')[0]
    }
  ];

  const meta = { count: results.length, elapsedMs: 12, generatedAt: now };
  const response = { queryEcho: body, results, meta };
  res.json(response);
});

module.exports = router;
