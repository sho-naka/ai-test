// --- 1) マスター：都道府県 & 業種 ---
const PREFS = [
  '北海道','青森県','岩手県','宮城県','秋田県','山形県','福島県','茨城県','栃木県','群馬県','埼玉県','千葉県','東京都','神奈川県','新潟県','富山県','石川県','福井県','山梨県','長野県','岐阜県','静岡県','愛知県','三重県','滋賀県','京都府','大阪府','兵庫県','奈良県','和歌山県','鳥取県','島根県','岡山県','広島県','山口県','徳島県','香川県','愛媛県','高知県','福岡県','佐賀県','長崎県','熊本県','大分県','宮崎県','鹿児島県','沖縄県'
];
const INDUSTRIES = ['製造','建設','小売','飲食','IT','医療','福祉','教育','運輸','農林水産','宿泊・観光','サービス','その他'];

// --- 2) ダミー制度データ（実運用で置き換え） ---
const programs = [
  {
    id: 'D-EN-LED-001',
    title: '（ダミー）省エネ設備導入補助',
    description: '高効率空調・LED・断熱改修などの省エネ投資を支援。',
    regions: 'ALL', municipalities: 'ANY', industries: 'ALL',
    purposes: ['省エネ対策','設備投資'],
    keywords: ['LED','高効率エアコン','断熱','インバーター','空調'],
    amountMin: 50000, amountMax: 5000000, subsidyRate: 0.33
  },
  {
    id: 'D-HS-COOL-002',
    title: '（ダミー）猛暑・熱中症対策設備導入支援',
    description: '作業環境の暑熱対策（スポットクーラー、ミスト、遮熱）を補助。',
    regions: ['東京都','神奈川県','千葉県','埼玉県'], municipalities: 'ANY', industries: 'ALL',
    purposes: ['熱中症対策'],
    keywords: ['スポットクーラー','ミスト','遮熱シート','パーテーション'],
    amountMin: 30000, amountMax: 800000, subsidyRate: 0.5
  },
  {
    id: 'D-TW-IT-003',
    title: '（ダミー）テレワーク環境整備補助',
    description: 'ノートPC・ディスプレイ・VPN・グループウェア等の導入支援。',
    regions: 'ALL', municipalities: 'ANY', industries: ['IT','サービス','教育','小売','宿泊・観光'],
    purposes: ['テレワーク','省エネ対策'],
    keywords: ['ノートPC','VPN','リモート','Web会議','セキュア'],
    amountMin: null, amountMax: 1000000, subsidyRate: 0.5
  },
  {
    id: 'D-CAP-004',
    title: '（ダミー）中小企業 設備投資促進',
    description: '生産性向上に資する機械装置・IoT・自動化等を対象。',
    regions: ['愛知県','岐阜県','三重県'], municipalities: 'ANY', industries: ['製造','建設','運輸','農林水産'],
    purposes: ['設備投資'],
    keywords: ['工作機械','ロボット','IoT','センサー','自動化'],
    amountMin: 200000, amountMax: 10000000, subsidyRate: 0.4
  },
  {
    id: 'D-OKI-005',
    title: '（ダミー）沖縄県 省エネ・暑熱対策支援',
    description: '沖縄県内事業者の空調更新・遮熱塗装などを支援。',
    regions: ['沖縄県'], municipalities: 'ANY', industries: 'ALL',
    purposes: ['省エネ対策','熱中症対策'],
    keywords: ['遮熱塗装','エアコン','断熱'],
    amountMin: 50000, amountMax: 1200000, subsidyRate: 0.5
  },
  {
    id: 'D-LED-LOCAL-006',
    title: '（ダミー）市町村LED更新補助',
    description: '市町村単位での照明LED化を支援（小規模事業者向け）。',
    regions: ['東京都'], municipalities: ['渋谷区','世田谷区','八王子市'], industries: 'ALL',
    purposes: ['省エネ対策'],
    keywords: ['LED','照明'],
    amountMin: null, amountMax: 300000, subsidyRate: 0.5
  },
  {
    id: 'D-WORKSTYLE-007',
    title: '（ダミー）働き方改革・リモート導入支援',
    description: '就業環境整備やテレワークに資する機器・ソフト導入。',
    regions: ['大阪府','京都府','兵庫県','奈良県'], municipalities: 'ANY', industries: ['IT','サービス','教育','小売','宿泊・観光'],
    purposes: ['テレワーク','設備投資'],
    keywords: ['Web会議','ノートPC','VDI','ゼロトラスト'],
    amountMin: 50000, amountMax: 1500000, subsidyRate: 0.5
  },
  {
    id: 'D-FOOD-008',
    title: '（ダミー）飲食店 省エネ厨房機器更新',
    description: '飲食業の省エネ型厨房機器（IH、省エネ冷蔵庫等）更新支援。',
    regions: 'ALL', municipalities: 'ANY', industries: ['飲食','小売'],
    purposes: ['省エネ対策','設備投資'],
    keywords: ['IH','冷蔵庫','製氷機','食洗機'],
    amountMin: 100000, amountMax: 2000000, subsidyRate: 0.3
  }
];

// --- 3) UI 初期化 ---
const $ = (sel, el=document) => el.querySelector(sel);
const $$ = (sel, el=document) => Array.from(el.querySelectorAll(sel));

function initOptions(){
  const pref = $('#pref');
  pref.innerHTML = '<option value="">--選択してください--</option>' + PREFS.map(p=>`<option>${p}</option>`).join('');
  const ind = $('#industry');
  ind.insertAdjacentHTML('beforeend', INDUSTRIES.map(i=>`<option>${i}</option>`).join(''));
}

// --- 4) 診断ロジック ---
function normalizeAmount(v){
  if(v==null || v==='') return null;
  const n = Number(String(v).replace(/[,\s]/g,''));
  return Number.isFinite(n) ? n : null;
}

function matchProgram(input, program){
  const reasons = [];
  let score = 0;

  // 地域
  const regionOk = program.regions==='ALL' || (Array.isArray(program.regions) && program.regions.includes(input.pref));
  if(!regionOk){ return {eligible:false, score:0, reasons:[{label:'地域', ok:false, note:`対象地域外（${input.pref}）`}]}; }
  reasons.push({label:'地域', ok:true, note: program.regions==='ALL' ? '全国対象' : `${input.pref} 対象`});
  score += (program.regions==='ALL'?1:3);

  // 市区町村（任意）
  if(Array.isArray(program.municipalities)){
    const muniOk = input.city && program.municipalities.includes(input.city.trim());
    reasons.push({label:'市町村', ok: muniOk, note: muniOk? `${input.city} 対象` : `対象市町村は ${program.municipalities.join(' / ')} など`});
    if(!muniOk) return {eligible:false, score:0, reasons};
    score += 2;
  }else{
    reasons.push({label:'市町村', ok:true, note:'指定なし'});
    score += 1;
  }

  // 業種（任意強化）
  const industryOk = program.industries==='ALL' || (Array.isArray(program.industries) && program.industries.includes(input.industry));
  reasons.push({label:'業種', ok:industryOk, note: industryOk? (program.industries==='ALL'?'制限なし':`${input.industry} 対象`) : `対象: ${Array.isArray(program.industries)? program.industries.join(' / '):'指定なし'}`});
  if(industryOk) score += (program.industries==='ALL'?1:2);

  // 金額
  const amt = input.amount;
  let amountOk = true;
  if(amt!=null){
    if(program.amountMin!=null && amt < program.amountMin) amountOk = false;
    if(program.amountMax!=null && amt > program.amountMax) amountOk = false;
  }
  reasons.push({label:'金額', ok:amountOk, note: (function(){
    const min = program.amountMin!=null? `${program.amountMin.toLocaleString()}円以上` : '下限なし';
    const max = program.amountMax!=null? `${program.amountMax.toLocaleString()}円以下` : '上限なし';
    return `${min} / ${max}`;
  })()});
  if(!amountOk) return {eligible:false, score:0, reasons};
  if(amt!=null) score += 2;

  // キーワード（購入品名・事業内容から部分一致）
  let kwScore = 0; const kwHits=[];
  const hay = `${input.product} ${input.desc}`.toLowerCase();
  for(const kw of (program.keywords||[])){
    if(hay.includes(String(kw).toLowerCase())){ kwScore++; kwHits.push(kw); }
  }
  reasons.push({label:'キーワード', ok:kwScore>0, note: kwScore>0? `該当: ${kwHits.join(' / ')}` : '特記事項なし'});
  score += Math.min(kwScore, 3); // 上限

  return {eligible:true, score, reasons};
}

function formatProgramCard(prog, match){
  const rate = prog.subsidyRate!=null? `${Math.round(prog.subsidyRate*100)}%` : '－';
  const regionText = prog.regions==='ALL'? '全国' : prog.regions.join(' / ');
  const indText = prog.industries==='ALL'? '業種不問' : prog.industries.join(' / ');
  const min = prog.amountMin!=null? `${prog.amountMin.toLocaleString()}円` : '－';
  const max = prog.amountMax!=null? `${prog.amountMax.toLocaleString()}円` : '－';

  return `
    <div class="result">
      <h3>${escapeHtml(prog.title)} <span class="score">（合致スコア: ${match.score}）</span></h3>
      <div class="muted" style="margin-bottom:8px">${escapeHtml(prog.description)}</div>
      <div class="grid" style="margin:8px 0">
        <div class="pill">地域: ${escapeHtml(regionText)}</div>
        <div class="pill">業種: ${escapeHtml(indText)}</div>
        <div class="pill">下限: ${min}</div>
        <div class="pill">上限: ${max}</div>
        <div class="pill">補助率: ${rate}</div>
      </div>
      <details>
        <summary>適合理由</summary>
        <ul>
          ${match.reasons.map(r=>`<li>${r.ok?'<span class="badge ok">OK</span>':'<span class="badge ng">NG</span>'} <b>${r.label}</b> — ${escapeHtml(r.note)}</li>`).join('')}
        </ul>
      </details>
    </div>`;
}

// --- 5) 事件: submit ---
function onSubmit(e){
  e.preventDefault();
  // デモ用：ダミーの診断結果を表示して結果ページへ移動
  const demoHtml = [
    `<div class="result"><h3>（デモ）省エネ設備導入補助 <span class="score">（合致スコア: 85）</span></h3><div class="muted">高効率空調やLEDの導入で補助を受けられる可能性があります。</div><div class="grid" style="margin-top:8px"><div class="pill">地域: 全国</div><div class="pill">業種: 業種不問</div><div class="pill">補助率: 33%</div></div></div>` ,
    `<div class="result"><h3>（デモ）テレワーク環境整備補助 <span class="score">（合致スコア: 72）</span></h3><div class="muted">ノートPCやVPNなどテレワーク環境整備が補助対象です。</div><div class="grid" style="margin-top:8px"><div class="pill">地域: 全国</div><div class="pill">業種: IT / サービス</div><div class="pill">補助率: 50%</div></div></div>`
  ].join('');

  var resultsEl = document.getElementById('results');
  if(resultsEl) resultsEl.innerHTML = demoHtml;

  // ページ切替（results を表示）
  var pages = { wizard: document.getElementById('page-wizard'), results: document.getElementById('page-results') };
  Object.keys(pages).forEach(function(k){ pages[k] && pages[k].classList.remove('active'); });
  pages['results'] && pages['results'].classList.add('active');
}

// ユーティリティ
function escapeHtml(s){
  return String(s).replace(/[&<>\"']/g, m=>({"&":"&amp;","<":"&lt;",">":"&gt;","\"":"&quot;","'":"&#39;"}[m]));
}

// --- 起動 ---
document.addEventListener('DOMContentLoaded', ()=>{
  initOptions();
  $('#diagForm').addEventListener('submit', onSubmit);
  $('#exportJson').addEventListener('click', (e)=>{e.preventDefault(); $('#howto').showModal();});
});
