document.addEventListener('DOMContentLoaded', function(){
  var pages = { wizard: document.getElementById('page-wizard'), results: document.getElementById('page-results') };
  function show(name){
    Object.keys(pages).forEach(function(k){ pages[k] && pages[k].classList.remove('active'); });
    pages[name] && pages[name].classList.add('active');
    if(name==='results'){ history.pushState({page:'results'},'', '#/result'); } else { history.pushState({page:'wizard'},'', '#/'); }
    window.scrollTo({top:0, behavior:'smooth'});
  }
  var steps = Array.prototype.slice.call(document.querySelectorAll('.step'));
  var dots  = Array.prototype.slice.call(document.querySelectorAll('.step-dot'));
  var bar   = document.getElementById('bar');
  function setStep(n){
    steps.forEach(function(s){ s.classList.toggle('active', Number(s.getAttribute('data-step'))===n); });
    dots.forEach(function(d){ d.classList.toggle('active', Number(d.getAttribute('data-dot'))<=n); });
    if(bar){ bar.style.width = ((n-1)/3*100)+'%'; }
    window.scrollTo({top:0, behavior:'smooth'});
  }
  setStep(0);
  function $(q){ return document.querySelector(q); }
  var n1=$('#next1'), n2=$('#next2'), n3=$('#next3');
  if(n1) n1.addEventListener('click', function(){ if(!$('#pref').value){ alert('都道府県を選択してください'); return;} setStep(2); });
  if(n2) n2.addEventListener('click', function(){ if(!$('#industry').value){ alert('業種を選択してください'); return;} setStep(3); });
  if(n3) n3.addEventListener('click', function(){ if(!$('#desc').value.trim()){ alert('事業内容を入力してください'); return;} setStep(4); });
  Array.prototype.slice.call(document.querySelectorAll('[data-back]')).forEach(function(b){ b.addEventListener('click', function(){ setStep(Number(b.getAttribute('data-back'))); }); });
  var form = document.getElementById('diagForm');
  if(form){ form.addEventListener('submit', function(){ setTimeout(function(){ show('results'); }, 0); }); }
  var back = document.getElementById('backToEdit'); if(back){ back.addEventListener('click', function(){ show('wizard'); }); }
  window.addEventListener('popstate', function(){ show(location.hash.indexOf('result')>-1 ? 'results' : 'wizard'); });

  // Startボタン: クリックでステップを順に進める（4の次は1に戻る）
  var startBtn = document.getElementById('startBtn');
  if(startBtn){
    startBtn.addEventListener('click', function(){
  // data-dot 属性を読み取り、0->1 に移動、以降は 1-4 を循環で進める
  var cur = Number(startBtn.getAttribute('data-dot') || '0');
  var next = cur === 0 ? 1 : (cur < 4 ? cur + 1 : 1);

      // バリデーション: 未入力必須項目がある場合はアラートして進まない
      if(next===2 && !$('#pref').value){ alert('都道府県を選択してください'); return; }
      if(next===3 && !$('#industry').value){ alert('業種を選択してください'); return; }
      if(next===4 && !$('#desc').value.trim()){ alert('事業内容を入力してください'); return; }

      // setStep を呼び、ボタンの data-dot 属性を更新
      setStep(next);
      startBtn.setAttribute('data-dot', String(next));

      // フォーカス移動
      if(next===2) $('#industry').focus();
      if(next===3) $('#desc').focus();
      if(next===4) $('#product').focus();
    });
  }
});
