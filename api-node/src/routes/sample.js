const express = require('express');
const router = express.Router();

// This mirrors the Java SearchController behavior: POST /api/search
router.post('/', (req,res)=>{
  // Return a dummy SearchResponse similar to Java implementation
  const response = {
    meta: { total: 2 },
    results: [
      { id: 'D-EN-LED-001', title: '（ダミー）省エネ設備導入補助', description: '高効率空調・LED・断熱改修などの省エネ投資を支援。' },
      { id: 'D-TW-IT-003', title: '（ダミー）テレワーク環境整備補助', description: 'ノートPC・ディスプレイ・VPN・グループウェア等の導入支援。' }
    ]
  };
  res.json(response);
});

module.exports = router;
