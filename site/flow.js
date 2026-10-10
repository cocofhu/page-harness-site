(function(){
const T=window.PH_T;
const qs=new URLSearchParams(location.search);
let L=qs.get('lang')||localStorage.getItem('ph-lang')||((navigator.language||'').startsWith('zh')?'zh':'en');
if(!T[L])L='zh';
/* ---------- one easing curve: cubic-bezier(.65,0,.35,1) ---------- */
function bez(x1,y1,x2,y2){const cx=3*x1,bx=3*(x2-x1)-cx,ax=1-cx-bx,cy=3*y1,by=3*(y2-y1)-cy,ay=1-cy-by;
 const sx=t=>((ax*t+bx)*t+cx)*t,sy=t=>((ay*t+by)*t+cy)*t;
 return x=>{if(x<=0)return 0;if(x>=1)return 1;let a=0,b=1,t=x;for(let i=0;i<24;i++){t=(a+b)/2;if(sx(t)<x)a=t;else b=t}return sy(t)}}
const E=bez(.65,0,.35,1);
const cl=v=>v<0?0:v>1?1:v,R=(p,a,b)=>cl((p-a)/(b-a)),S=(p,a,b)=>E(R(p,a,b)),lerp=(a,b,t)=>a+(b-a)*t;
/* ---------- icons ---------- */
const I={
 pick:'<svg viewBox="0 0 14 14" fill="none" stroke="currentColor" stroke-width="1.3"><circle cx="7" cy="7" r="3.4"/><path d="M7 0v3.2M7 10.8V14M0 7h3.2M10.8 7H14"/></svg>',
 notes:'<svg viewBox="0 0 14 14" fill="none" stroke="currentColor" stroke-width="1.3"><path d="M2 2.5h10v7H6l-3 2.5v-2.5H2z"/></svg>',
 art:'<svg viewBox="0 0 14 14" fill="none" stroke="currentColor" stroke-width="1.3"><rect x="2" y="2" width="7.5" height="7.5" rx="1"/><path d="M4.5 12h7.5V4.5"/></svg>',
 chat:'<svg viewBox="0 0 14 14" fill="none" stroke="currentColor" stroke-width="1.3"><path d="M2 3h10v6.5H7.5L5 12V9.5H2z"/></svg>',
 cross:'<svg viewBox="0 0 10 10" fill="none" stroke="currentColor" stroke-width="1.2"><circle cx="5" cy="5" r="2.6"/><path d="M5 0v2.2M5 7.8V10M0 5h2.2M7.8 5H10"/></svg>',
 cur:c=>`<svg viewBox="0 0 16 20"><path d="M1 1l13.5 7.2-5.8 1.4L6 15.4z" fill="${c}" stroke="#fff" stroke-width="1.3" stroke-linejoin="round"/></svg>`};
const LOGO='<svg viewBox="0 0 32 32" fill="none" aria-hidden="true"><path d="M4 11V4h7M21 4h7v7M28 21v7h-7M11 28H4v-7" stroke="#0E0E10" stroke-width="3" stroke-linecap="square"/><path d="M11 10l13 5.6-5.4 1.8L16.8 23z" fill="#FF5A1F" stroke="#FF5A1F" stroke-width="1.6" stroke-linejoin="round"/></svg>';
const LOGO16='<svg viewBox="0 0 16 16" fill="none" aria-hidden="true"><path d="M1 5.5V1h4.5M10.5 1H15v4.5M15 10.5V15h-4.5M5.5 15H1v-4.5" stroke="#0E0E10" stroke-width="2"/><path d="M4.6 4.2l7.6 3.3-3.1 1.1-1.2 3.2z" fill="#FF5A1F" stroke="#FF5A1F" stroke-width="1.2" stroke-linejoin="round"/></svg>';
const AG={claude:['Claude Code','claudecode-color'],codex:['Codex','codex-color'],cursor:['Cursor CLI','cursor'],codebuddy:['CodeBuddy','codebuddy-color'],opencode:['OpenCode','opencode']};
const ai=(k,cls)=>`<img class="ai${cls?' '+cls:''}" src="site/icons/${AG[k][1]}.svg" alt="">`;
const aiSrc=k=>`site/icons/${AG[k][1]}.svg`;

const AGL=[['claude','Claude Code'],['codex','Codex'],['cursor','Cursor Agent'],['codebuddy','CodeBuddy Code'],['opencode','OpenCode']].map(([k,n])=>`<em class="an">${ai(k)}${n}</em>`).join('');
const GH='<svg class="gl" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/></svg>';
const NPM='<svg class="gl" viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="3" width="18" height="18" fill="#fff"/><path fill="#CB3837" d="M1.763 0C.786 0 0 .786 0 1.763v20.474C0 23.214.786 24 1.763 24h20.474c.977 0 1.763-.786 1.763-1.763V1.763C24 .786 23.214 0 22.237 0zM5.13 5.323l13.837.019-.009 13.836h-3.464l.01-10.382h-3.456L12.04 19.17H5.113z"/></svg>';
const LOCK='<svg viewBox="0 0 12 12" fill="none" stroke="currentColor" stroke-width="1.2" aria-hidden="true"><rect x="2.5" y="5.5" width="7" height="5" rx="1"/><path d="M4 5.5V4a2 2 0 014 0v1.5"/></svg>';
const br=(t,l)=>`<span class="br"><i class="a"></i><i class="b"></i><i class="c"></i><i class="d"></i>${t}<small>${l}</small></span>`;
/* ---------- builders ---------- */
const ROWS=[['fix: retry on 429','a3f91c2','ok','Ready','main','42s','2m ago'],['feat: usage chart','7b02e4d','fl','Failed','feat/usage','1m 08s','14m ago'],
 ['chore: bump deps','c19aa70','ok','Ready','main','39s','1h ago'],['feat: team invites','e5d1b08','ok','Ready','feat/invites','51s','3h ago'],['fix: chart tooltip','92ac4f1','bd','Canceled','main','—','5h ago']];
function orbit(){return `<div class="orb"><div class="side"><div class="ws"><i></i>Orbit</div>
 <div class="it">Overview</div><div class="it on">Deployments</div><div class="it">Logs</div><div class="it">Domains</div><div class="it">Env variables</div><div class="it">Settings</div></div>
 <div class="main"><div class="top"><h2>Deployments</h2><span class="cnt">128 total</span><span class="sp"></span><span class="btn" data-k="filter">Filter</span><span class="gap" data-k="gap"></span><span class="btn pri" data-k="deploy">Deploy</span></div>
 <div class="filters"><span class="on">All</span><span>Production</span><span>Preview</span><span>Failed</span></div>
 <table><tr><th style="width:32%">Commit</th><th style="width:24%">Status</th><th>Branch</th><th>Duration</th><th class="r">Created</th></tr>
 ${ROWS.map((r,i)=>`<tr><td>${r[0]}<br><span class="m">${r[1]}</span></td><td data-k="cell${i}"><span class="st ${r[2]}" data-k="st${i}">${r[3]}</span>${i===1?'<span class="retry" data-k="retry">Retry</span>':''}</td><td><span class="m">${r[4]}</span></td><td><span class="m">${r[5]}</span></td><td class="r"><span class="m">${r[6]}</span></td></tr>`).join('')}
 </table></div></div>`}
function chatBody(o,t,c,big){ // shared by drawer & standalone chat window
 return `<div class="tb"><span class="gr">⋮⋮</span>page-harness<span class="sp"></span><span class="x">—</span></div>
 <div class="tabs"><span class="tab on" data-k="tab1">${ai('claude')}${c.t1}</span>${big?`<span class="tab new" data-k="tab2"><img class="ai" data-k="tab2i" src="${aiSrc('claude')}" alt=""><span data-k="tab2l">${o.newChat}</span></span>`:''}<span class="tab add" data-k="add">+</span></div>
 <div class="agrow"><span class="agsel" data-k="ags"><img class="ai" data-k="agi" src="${aiSrc('claude')}" alt=""><span data-k="agl">Claude Code</span><b class="cv">▾</b></span><span class="mdl">${o.model}<b class="cv">▾</b></span>
  ${big?`<div class="amenu" data-k="am"><div class="now" data-k="am0">${ai('claude')}Claude Code<s>✓</s></div><div data-k="am1">${ai('codex')}Codex</div><div data-k="am2">${ai('cursor')}Cursor CLI</div><div class="na">${ai('codebuddy')}CodeBuddy<small>${o.na}</small></div><div class="na">${ai('opencode')}OpenCode<small>${o.na}</small></div></div>`:''}</div>
 <div class="msgs"><div data-k="h1" style="display:contents">
  <div class="mg me" data-k="m1"><span class="ref">${I.cross}span.badge</span><br>${c.m1}</div>
  <div class="mg tool" data-k="tl1">Read <span>components/StatusBadge.tsx</span></div>
  <div class="mg tool" data-k="tl2">Edit components/StatusBadge.tsx <em>+6</em> <del>−2</del></div>
  <div class="mg tool" data-k="tl3">Edit app/deployments/page.tsx <em>+4</em></div>
  <div class="mg ag" data-k="a1"><div class="who">${ai('claude')}Claude Code</div>${c.a1}</div></div>
  ${big?`<div data-k="h2" style="display:none"><div class="mg me" data-k="m2">${c.m2}</div><div class="mg tool" data-k="tl4">Edit app/deployments/page.tsx <em>+18</em> <del>−3</del></div><div class="mg ag" data-k="a2"><div class="who">${ai('codex')}Codex</div>${c.a2}</div></div>`:''}
 </div>
 <div class="inp"><span class="ref" data-k="iref" style="display:none">${I.cross}span.badge</span><div><span data-k="itx"></span><span class="car" data-k="car" style="display:none"></span><span class="ph" data-k="iph">${o.ph}</span></div><b class="snd" data-k="snd">↑</b></div>`}
function overlay(kind,t){const o=t.ov,c=t.chat,rev=kind==='rev';
 return `<div class="ov">
 <div class="hint" data-k="hint">${rev?o.tipR:o.tip}</div>
 <div class="gd h" data-k="gh"><span></span></div><div class="gd v" data-k="gv"><span></span></div>
 <div class="hov" data-k="hov"><span></span></div>
 <div class="sel${rev?' mate':''}" data-k="sel"><i class="a"></i><i class="b"></i><i class="c"></i><i class="d"></i><span class="dim"></span></div>
 <div class="pbar" data-k="pbar">${rev?`<b class="pri" data-k="pb1">${o.comment}</b>`:`<b data-k="pb1">${o.quote}</b><b class="pri">${o.comment}</b><b class="pri">${o.live}</b>`}<b class="x">×</b></div>
 <div class="toast" data-k="toast">${o.picked}</div>
 ${kind==='owner'?`<div class="dr" data-k="dr">${chatBody(o,t,c,false)}</div>`:''}
 ${rev?`<div class="pin" data-k="pin">1</div>
  <div class="thr" data-k="thr"><div class="nt"><div class="au"><i></i>Mia</div><div class="typ"><span data-k="ctx"></span><span class="car" data-k="ccar" style="display:inline-block;width:1px;height:13px;background:#0E0E10;vertical-align:-2px"></span></div></div>
   <div class="rp" data-k="rp"><div class="nt"><div class="au me"><i></i>${o.me}</div>${c.r1}</div></div>
   <div class="ac"><b data-k="tsub">${o.comment}</b><b data-k="trep" style="display:none">${o.reply}</b><b data-k="tres" style="display:none">${o.resolve}</b></div></div>
  <div class="rv" data-k="rv"><div class="tb">${o.notes}<span class="on">${o.thisPage}</span><span>${o.all}</span></div>
   <div class="apr"><b>${o.verdict}</b><span data-k="vok">${o.approve}</span><span>${o.changes}</span></div><div class="vd" data-k="vd">${o.approvedBy}</div>
   <div class="li"><i>1</i><div>${c.c1}</div><s>${o.resolved}</s></div></div>`:''}
 <div class="dock" data-k="dock"><b data-k="dpick">${I.pick}${o.pick}</b>${rev?`<b data-k="dnotes" style="display:none">${I.notes}${o.notes}<em data-k="cnt">1</em></b>`:''}<b>${I.art}${o.art}</b><b data-k="dchat">${I.chat}${rev?o.rev:o.chat}</b></div>
 <div class="cur${rev?' m':''}" data-k="cur">${I.cur(rev?'#3E63DD':'#0E0E10')}${rev?'<span style="background:#3E63DD">Mia</span>':''}<i class="ck"></i></div>
 </div>`}
function browser(k,url,kind,t,who){return `<div class="bw" data-k="${k}"><div class="chrome"><i></i><i></i><i></i><span class="url" data-k="url">${url}</span>${who?`<span class="who">${who}</span>`:''}</div>
 <div class="vp" data-k="vp"><div class="reload" data-k="rl"></div>${orbit()}${overlay(kind,t)}</div></div>`}
function term(k,lines,w){return `<div class="tm" data-k="${k}" style="width:${w||660}px"><div class="tt"><i></i><i></i><i></i><span>~/orbit — zsh</span></div><pre>${lines.map((l,i)=>`<div class="ln ln${i}" data-k="ln${i}">${l}</div>`).join('')}</pre></div>`}
const TL=(share)=>[`<span class="ps">~/orbit $</span> <span data-k="typed"></span><span class="car" data-k="tcar"></span>`,
 `<span class="cy">page-harness</span> v0.1.1`,
 `  Open     <span class="bd" data-k="open">http://localhost:17990</span>  <span class="dm">→ http://localhost:3000/</span>`,
 `  History  http://localhost:17991/__ph/history`,`  Project  /Users/you/orbit`,`  Mode     source`,
 `  Agents   <span class="bd">claude</span>  codex  cursor  <span class="dm">codebuddy (not found)  opencode (not found)</span>`].concat(share?[`  Share    <span class="bd" data-k="share">http://192.168.1.20:17991/__ph/join?t=…</span>  <span class="dm">(teammates on your network join as reviewers: comment, reply, approve; they cannot run the agent)</span>`]:[]);
function head(s){return `<div class="head" data-k="head"><div class="idx"><span><b>●</b> ${s.idx[0]}</span><span>${s.idx[1]}</span></div>
 <h2 class="h">${s.h[0]}${br(s.h[1],s.bl)}${s.h[2]}</h2><p class="sub">${s.sub}</p><ul class="spec">${s.spec.map(r=>`<li><b>${r[0]}</b><span>${r[1]==='@agents'?AGL:r[1]}</span></li>`).join('')}</ul></div>`}
const XM='<span class="xm" data-k="x0"></span><span class="xm" data-k="x1"></span><span class="xm" data-k="x2"></span><span class="xm" data-k="x3"></span>';
function build(){const t=T[L],h=t.hero,c=t.cta;
 document.documentElement.lang=L==='zh'?'zh-CN':'en';
 document.title=L==='zh'?'page-harness · 指着页面，跟 Agent 说改哪儿':'page-harness · Point at the page, tell the agent';
 const cv=document.getElementById('cv');
 cv.innerHTML=`<nav><a class="brand" href="#" data-go="0">${LOGO}page-harness</a><div class="links">${t.nav.map((n,i)=>`<a href="#" data-go="${i}" data-k="nl${i}">/${n}</a>`).join('')}</div><div class="sp"></div>
 <div class="lang"><button data-l="zh" class="${L==='zh'?'on':''}">中</button>/<button data-l="en" class="${L==='en'?'on':''}">EN</button></div>
 <a class="pill" href="https://github.com/cocofhu/page-harness-coco" target="_blank" rel="noopener">GitHub</a><a class="pill f" href="#" data-go="4">npx page-harness</a></nav>
 <section class="sc" data-k="sc0"><div class="in">
  <div class="hero" data-k="hero"><div class="idx"><span><b>●</b> ${h.idx[0]}</span><span>${h.idx[1]}</span><span>${h.idx[2]}</span><span>${h.idx[3]}</span></div>
   <h1 class="h">${h.h}${br(h.br,h.bl)}${h.tail}</h1><p class="sub">${h.sub}</p>
   <div class="ctas"><div class="cmd"><span>$</span>npx page-harness 3000<button data-copy="npx page-harness 3000">⌘C</button></div><a class="ghost" href="#" data-go="1">${h.ghost}</a></div></div>
  ${head(t.steps[0])}${browser('bw','<span data-k="u0">localhost:3000</span>/deployments','owner',t)}${term('tm',TL(false))}${XM}</div></section>
 <section class="sc" data-k="sc1"><div class="in">${head(t.steps[1])}${browser('bw','localhost:17990/deployments','owner',t)}${XM}</div></section>
 <section class="sc" data-k="sc2"><div class="in">${head(t.steps[2])}${browser('bw','192.168.1.20:17990/deployments','rev',t,t.ov.reviewer)}${term('tm',TL(true),760)}${XM}</div></section>
 <section class="sc" data-k="sc3"><div class="in">${head(t.steps[3])}<div class="cw" data-k="cw">${chatBody(t.ov,t,t.chat,true)}<div class="cur" data-k="cur">${I.cur('#0E0E10')}<i class="ck"></i></div></div>${XM}</div></section>
 <section class="sc" data-k="sc4"><div class="in"><div class="cta"><div class="idx"><span><b>●</b> ${c.idx[0]}</span><span>${c.idx[1]}</span></div>
  <h2 class="h">${c.h}${br(c.br,c.bl)}${c.tail}</h2><p class="sub">${c.sub}</p>
  <div class="cmd"><span>$</span>npx page-harness http://localhost:3000<button data-copy="npx page-harness http://localhost:3000">${c.copy}</button></div>
  <p class="reqs">${c.reqs}</p>
  <div class="cl"><a class="f" href="https://www.npmjs.com/package/page-harness" target="_blank" rel="noopener">${NPM}${c.npm}<small>npmjs.com/package/page-harness</small></a><a href="https://github.com/cocofhu/page-harness-coco" target="_blank" rel="noopener">${GH}${c.gh}<small>cocofhu/page-harness-coco</small><em class="priv">${LOCK}${c.priv}</em></a></div></div>
  <div class="ags">${[['claude','Claude Code'],['codex','Codex'],['cursor','Cursor Agent'],['codebuddy','CodeBuddy Code'],['opencode','OpenCode']].map(([k,n])=>`<span>${ai(k)}${n}</span>`).join('')}</div>
  <div class="foot"><span class="fl">${LOGO16}page-harness <i>v0.1.1</i></span><span>${c.lic}</span><span>localhost:17990 · localhost:17991</span></div></div></section>
 <div class="wipe" data-k="wipe"><span data-k="wl"></span></div>`;
 // index elements
 K={};cv.querySelectorAll('[data-k]').forEach(e=>{});
 SC=[...cv.querySelectorAll('section.sc')].map(s=>{const m={root:s};s.querySelectorAll('[data-k]').forEach(e=>{if(!m[e.dataset.k])m[e.dataset.k]=e});return m});
 G={wipe:cv.querySelector('[data-k=wipe]'),wl:cv.querySelector('[data-k=wl]'),nl:[0,1,2,3].map(i=>cv.querySelector(`[data-k=nl${i}]`))};
 cv.querySelectorAll('[data-go]').forEach(a=>a.addEventListener('click',e=>{e.preventDefault();go(+a.dataset.go)}));
 cv.querySelectorAll('.lang button').forEach(b=>b.addEventListener('click',()=>{L=b.dataset.l;localStorage.setItem('ph-lang',L);const u=new URL(location);u.searchParams.set('lang',L);history.replaceState(null,'',u);boot()}));
 cv.querySelectorAll('[data-copy]').forEach(b=>b.addEventListener('click',()=>{navigator.clipboard&&navigator.clipboard.writeText(b.dataset.copy);const o=b.textContent;b.textContent=c.copied;b.classList.add('ok');setTimeout(()=>{b.textContent=o;b.classList.remove('ok')},1400)}));
}
let K,SC,G,M=[];
/* ---------- timeline: scene lengths in screens ---------- */
const LEN=[3.4,4.2,4.6,3.6,1.0],TR=.8;
const START=[];{let u=0;LEN.forEach((l,i)=>{START.push(u);u+=l+(i<LEN.length-1?TR:0)})}
const TOTAL=START[4]+LEN[4];
function go(i){scrollTo({top:(START[i]+(i?0.02:0))*innerHeight,behavior:'smooth'})}
/* ---------- layout poses (canvas coords) ---------- */
const STEP={x:504,y:168,s:.96},BW=920,BH=600;
const pose=(el,x,y,s,o)=>{el.style.transform=`translate(${x}px,${y}px) scale(${s})`;if(o!==undefined)el.style.opacity=o};
function marks(m,x,y,w,h,o){[[x,y],[x+w,y],[x,y+h],[x+w,y+h]].forEach((c,i)=>{const e=m['x'+i];e.style.left=c[0]+'px';e.style.top=c[1]+'px';e.style.opacity=o})}
/* ---------- measuring (design px inside a viewport) ---------- */
function rel(el,root){let x=0,y=0,e=el;while(e&&e!==root){x+=e.offsetLeft;y+=e.offsetTop;e=e.offsetParent}return{x,y,w:el.offsetWidth,h:el.offsetHeight,cx:x+el.offsetWidth/2,cy:y+el.offsetHeight/2}}
function measure(){M=SC.map(m=>{const r={};if(m.vp){['filter','deploy','st0','st1','retry','dpick','dchat','dnotes','dock'].forEach(k=>{if(m[k]){const d=m[k].style.display;m[k].style.display='';r[k]=rel(m[k],m.vp);m[k].style.display=d}})}
  if(m.thr){const th=m.thr,rp=m.rp,ts=m.tsub,tr=m.tres,tp=m.trep;[th,rp].forEach(e=>e.style.transition='none');
   ts.style.display='';r.tsub=rel(ts,th);ts.style.display='none';rp.classList.add('on');tr.style.display=tp.style.display='';tr.textContent=T[L].ov.resolved;
   r.tres=rel(tr,th);rp.classList.remove('on');tr.style.display=tp.style.display='none';ts.style.display='';
   const rv=m.rv;rv.style.transition='none';r.vok=rel(m.vok,m.vp);void th.offsetWidth;[th,rp,rv].forEach(e=>e.style.transition='')}
  if(m.cw){['add','ags','am1','tab1','snd'].forEach(k=>{if(m[k])r[k]=rel(m[k],m.cw)});r.inp=rel(m.cw.querySelector('.inp'),m.cw)}
  return r});}
/* ---------- helpers ---------- */
const on=(e,c,b)=>{if(e)e.classList.toggle(c,!!b)};
const typed=(s,k)=>{const a=[...s];return a.slice(0,Math.round(a.length*k)).join('')};
function cursor(m,keys,p){const c=m.cur;if(p<keys[0][0]||p>keys[keys.length-1][0]+0.5){c.style.opacity=0;return}
 c.style.opacity=keys[0][3]===undefined?1:1;let x=keys[0][1],y=keys[0][2];
 for(let i=1;i<keys.length;i++){const a=keys[i-1],b=keys[i];if(p>=b[0]){x=b[1];y=b[2];continue}const t=S(p,a[0]+(a[4]||0),b[0]);x=lerp(a[1],b[1],t);y=lerp(a[2],b[2],t);break}
 c.style.transform=`translate(${x}px,${y}px)`;
 on(c,'click',keys.some(k=>k[3]&&p>=k[0]&&p<k[0]+.014));}
function hover(m,r,label,o){const h=m.hov;h.style.opacity=o;if(!r)return;h.style.left=r.x-3+'px';h.style.top=r.y-3+'px';h.style.width=r.w+6+'px';h.style.height=r.h+6+'px';h.firstChild.textContent=label;on(h,'ra',r.x+r.w>720)}
function guides(m,r,o){const gh=m.gh,gv=m.gv;gh.style.opacity=gv.style.opacity=o*.75;if(!r)return;
 gh.style.left='190px';gh.style.width=Math.max(0,r.x-3-190)+'px';gh.style.top=r.cy+'px';gh.firstChild.textContent='y '+Math.round(r.y);
 gv.style.left=r.cx+'px';gv.style.top='0px';gv.style.height=Math.max(0,r.y-3)+'px';gv.firstChild.textContent='x '+Math.round(r.x)}
function select(m,r,label,o,f){const s=m.sel;s.style.opacity=o;on(s,'up',f==='up');on(s,'rt',f==='rt');if(!r)return;s.style.left=r.x-3+'px';s.style.top=r.y-3+'px';s.style.width=r.w+6+'px';s.style.height=r.h+6+'px';s.querySelector('.dim').textContent=label;on(s,'ra',r.x+r.w>720&&!f)}
function typeInto(m,txt,k,ref){m.itx.textContent=typed(txt,k);m.iph.style.display=k>0||ref?'none':'';m.car.style.display=txt&&k>0?'':'none';on(m.snd,'on',!!txt&&k>=1);if(m.iref)m.iref.style.display=ref?'':'none'}
/* ---------- scenes ---------- */
function s0(m,r,p){
 const t=S(p,.08,.34);
 pose(m.hero,0,lerp(0,-150,t),1);m.hero.style.opacity=1-S(p,.08,.24);
 const bw=m.bw,hx=168,hy=528,hs=1.2;pose(bw,lerp(hx,STEP.x,t),lerp(hy,STEP.y,t),lerp(hs,STEP.s,t));
 m.head.style.opacity=S(p,.24,.36);m.head.style.transform=`translateY(${lerp(18,0,S(p,.24,.36))}px)`;
 const tt=S(p,.3,.4);pose(m.tm,480,lerp(470,440,tt),.8,tt);
 m.typed.textContent=typed('npx page-harness 3000',R(p,.4,.5));
 for(let i=1;i<7;i++)on(m['ln'+i],'on',p>.52+i*.018);
 m.tcar.style.display=p>.52?'none':'';
 on(m.open,'hl',p>.66);
 const sw=p>.72;m.u0.textContent=sw?'localhost:17990':'localhost:3000';on(m.url,'h1',sw);
 m.rl.style.width=(R(p,.72,.76)*100)+'%';m.rl.style.opacity=p<.77?1:0;
 on(m.dock,'on',p>.77);
 select(m,p>.8?{x:r.dock.x,y:r.dock.y,w:r.dock.w,h:r.dock.h}:null,'dock · Shadow DOM',S(p,.8,.84),'up');
 const bx=lerp(hx,STEP.x,t),by=lerp(hy,STEP.y,t),bs=lerp(hs,STEP.s,t);marks(m,bx,by,BW*bs,BH*bs,S(p,.3,.4));
}
function s1(m,r,p){
 pose(m.bw,STEP.x,STEP.y,STEP.s);marks(m,STEP.x,STEP.y,BW*STEP.s,BH*STEP.s,1);on(m.dock,'on',1);
 const P=r.dpick,F=r.st1,D=r.filter,O=r.st0;
 cursor(m,[[.03,560,330],[.12,P.cx,P.cy,1],[.18,D.cx,D.cy+4],[.23,O.cx,O.cy+4],[.30,F.cx+6,F.cy+4,1],[.37,F.x+42,F.y+F.h+26,1],[.5,F.x+150,F.y+F.h+120],[.58,920-36,510-30,1],[.68,330,470]],p);
 const pk=p>.12&&p<.40;on(m.dpick,'on',pk);on(m.hint,'on',pk&&p<.36);
 let tg=null,lab='';if(p>.15&&p<.205){tg=D;lab='button.btn'}else if(p>=.205&&p<.265){tg=O;lab='span.badge'}else if(p>=.265&&p<.30){tg=F;lab='span.badge'}
 hover(m,tg,lab,tg?1:0);guides(m,tg||(p>=.30&&p<.40?F:null),(tg||(p>=.30&&p<.40))?1:0);
 const U={x:F.x,y:F.y,w:r.retry.x+r.retry.w-F.x,h:F.h};select(m,p>=.30&&p<.40?F:(p>.76&&p<.95?U:null),p<.5?`${Math.round(F.w)} × ${Math.round(F.h)}`:'HMR',(p>=.30&&p<.40)||(p>.76&&p<.95)?1:0,p<.5?'rt':'up');
 const pb=m.pbar;pb.style.left=F.x-3+'px';pb.style.top=F.y+F.h+10+'px';on(pb,'on',p>.32&&p<.39);on(m.pb1,'hit',p>.37);
 on(m.toast,'on',p>.385&&p<.46);
 on(m.dr,'on',p>.41);on(m.dchat,'on',p>.41);
 const c=T[L].chat;
 typeInto(m,p<.6?c.m1:'',R(p,.45,.57),p>.395&&p<.6);
 on(m.m1,'on',p>.6);on(m.tl1,'on',p>.64);on(m.tl2,'on',p>.67);on(m.tl3,'on',p>.70);on(m.a1,'on',p>.8);
 on(m.st1,'hot',p>.76);on(m.retry,'on',p>.76);
}
function s2(m,r,p){
 on(m.st1,'hot',1);on(m.retry,'on',1);
 pose(m.bw,STEP.x,STEP.y,STEP.s);marks(m,STEP.x,STEP.y,BW*STEP.s,BH*STEP.s,1);on(m.dock,'on',1);
 const tt=S(p,.2,.28);pose(m.tm,lerp(480,480,tt),lerp(250,300,tt),.86,1-tt);m.tm.style.visibility=p>.29?'hidden':'';
 m.typed.textContent=typed('npx page-harness 3000 --share',R(p,.02,.09));m.tcar.style.display=p>.1?'none':'';
 for(let i=1;i<8;i++)on(m['ln'+i],'on',p>.1+i*.009);on(m.share,'hl',p>.18);
 const P=r.dpick,D=r.deploy,N=r.dnotes,o=T[L].ov,c=T[L].chat;
 const thx=D.x+D.w-290+6,thy=D.y+D.h+14;
 const SB={cx:thx+r.tsub.cx,cy:thy+r.tsub.cy},RB={cx:thx+r.tres.cx,cy:thy+r.tres.cy},VK=r.vok;
 cursor(m,[[.29,560,330],[.35,P.cx,P.cy,1],[.42,D.cx,D.cy+4,1],[.46,D.x+20,D.y+D.h+28,1],[.555,SB.cx,SB.cy,1],[.7,RB.cx,RB.cy,1],[.76,N.cx,N.cy,1],[.84,VK.cx,VK.cy,1],[.92,VK.cx-250,VK.cy-110]],p);
 const pk=p>.35&&p<.47;on(m.dpick,'on',pk);on(m.hint,'on',pk&&p<.42);
 hover(m,p>.38&&p<.42?D:null,'button.btn-primary',p>.38&&p<.42?1:0);guides(m,p>.38&&p<.47?D:null,p>.38&&p<.47?1:0);
 select(m,p>=.42&&p<.47?D:null,'button.btn-primary',p>=.42&&p<.47?1:0);
 const pb=m.pbar;pb.style.left=D.x-3+'px';pb.style.top=D.y+D.h+10+'px';on(pb,'on',p>.43&&p<.465);on(m.pb1,'hit',p>.455);
 const th=m.thr;th.style.left=thx+'px';th.style.top=thy+'px';on(th,'on',p>.465&&p<.74);
 m.ctx.textContent=typed(c.c1,R(p,.48,.55));m.ccar.style.display=p<.56?'inline-block':'none';
 const posted=p>.56;m.tsub.style.display=posted?'none':'';m.trep.style.display=m.tres.style.display=posted?'':'none';on(m.tsub,'hit',p>.555);
 const pin=m.pin;pin.style.left=D.x+D.w-6+'px';pin.style.top=D.y-16+'px';on(pin,'on',posted);on(pin,'done',p>.7);
 m.dnotes.style.display=posted?'':'none';on(m.cnt,'on',posted&&p<.7);
 on(m.rp,'on',p>.61);m.gap.style.width=p>.65?'16px':'0px';
 on(m.tres,'hit',p>.7);m.tres.textContent=p>.7?o.resolved:o.resolve;on(m.tres,'ok',p>.705);
 on(m.dnotes,'on',p>.76);on(m.rv,'on',p>.765);
 const V=m.vok;on(V,'hit',p>.84);on(m.vd,'on',p>.845);
}
function s3(m,r,p){
 const X=648,Y=168,cw=m.cw;pose(cw,X,Y,1);marks(m,X,Y,600,520,1);
 const A=r.add,G=r.ags,C=r.am1,TB=r.tab1,IN=r.inp;
 cursor(m,[[.03,300,420],[.12,A.cx,A.cy,1],[.2,G.cx,G.cy,1],[.29,C.cx,C.cy,1],[.36,IN.x+120,IN.cy,1],[.52,IN.x+IN.w-20,IN.y+IN.h-18,1],[.62,300,300],[.68,TB.cx,TB.cy,1],[.75,260,380]],p);
 const nw=p>.12&&p<.68;on(m.tab2,'show',p>.12);on(m.tab2,'on',nw);on(m.tab1,'on',!nw);
 m.h1.style.display=nw?'none':'contents';m.h2.style.display=nw&&p>.52?'contents':'none';
 ['m1','tl1','tl2','tl3','a1'].forEach(k=>on(m[k],'on',1));
 on(m.ags,'hit',p>.2&&p<.3);on(m.am,'on',p>.2&&p<.3);on(m.am1,'hit',p>.26);
 const codex=p>.3&&p<.68;m.agl.textContent=codex?'Codex':'Claude Code';const src=aiSrc(codex?'codex':'claude');if(m.agi.getAttribute('src')!==src)m.agi.setAttribute('src',src);const s2=aiSrc(p>.3?'codex':'claude');if(m.tab2i.getAttribute('src')!==s2)m.tab2i.setAttribute('src',s2);
 const c=T[L].chat;typeInto(m,p<.53?c.m2:'',R(p,.38,.5),false);
 on(m.m2,'on',p>.53);on(m.tl4,'on',p>.57);on(m.a2,'on',p>.61);m.tab2l.textContent=p>.55?c.t2:T[L].ov.newChat;
}
function s4(m,r,p){}
const RS=[s0,s1,s2,s3,s4];
/* ---------- brackets settle as a scene enters ---------- */
function brackets(m,q){const b=m.root.querySelectorAll('.br i');const d=lerp(18,0,q);b.forEach(e=>{const c=e.classList[0];e.style.transform=`translate(${c==='a'||c==='c'?-d:d}px,${c==='a'||c==='b'?-d:d}px)`;e.style.opacity=lerp(.2,1,q)})}
/* ---------- frame ---------- */
let scale=1,need=true,lastU=-1;
function fit(){const w=innerWidth,h=innerHeight;scale=Math.min(w/1440,h/900);const cv=document.getElementById('cv');cv.style.transform=`translate(${(w-1440*scale)/2}px,${(h-900*scale)/2}px) scale(${scale})`;
 document.getElementById('spacer').style.height=(TOTAL+1)*innerHeight+'px'}
function frame(){need=false;const u=scrollY/innerHeight;if(u===lastU)return;lastU=u;
 let cur=0;
 SC.forEach((m,i)=>{const st=START[i],en=st+LEN[i];
  const vis=u>=st-TR-1e-6&&u<=en+TR+1e-6||(i===0&&u<=en+TR);
  m.root.style.visibility=vis?'visible':'hidden';if(!vis)return;
  const p=R(u,st,en);
  let clip='none',tx=0;
  if(i>0&&u<st){const q=S(u,st-TR,st);clip=`inset(0 0 0 ${(1-q)*100}%)`;tx=(1-q)*96;brackets(m,q)}else brackets(m,1);
  if(i<SC.length-1&&u>en){const q=S(u,en,en+TR);tx=-q*96}
  m.root.style.clipPath=clip;m.root.style.zIndex=i+1;m.root.firstElementChild.style.transform=`translateX(${tx}px)`;
  if(u>=st-TR*.5)cur=i;
  RS[i](m,M[i],p);
 });
 // wipe guide
 let wi=-1,wq=0;for(let i=1;i<5;i++){if(u>=START[i]-TR&&u<START[i]){wi=i;wq=S(u,START[i]-TR,START[i])}}
 G.wipe.style.visibility=wi>0&&wq>0.001&&wq<.999?'visible':'hidden';if(wi>0){G.wipe.style.left=(1-wq)*1440+'px';G.wl.textContent=T[L].wipe[wi-1]}
 G.nl.forEach((a,i)=>on(a,'on',i===Math.min(cur,3)&&cur<4));
}
function req(){if(!need){need=true;requestAnimationFrame(frame)}}
function boot(){build();fit();lastU=-1;
 // measure with no transforms on the browsers
 SC.forEach(m=>{if(m.bw)m.bw.style.transform='none'});measure();frame()}
addEventListener('scroll',req,{passive:true});addEventListener('resize',()=>{fit();lastU=-1;req()});
document.fonts&&document.fonts.ready.then(()=>{measure();lastU=-1;req()});
window.PH={boot,start:START,total:TOTAL,len:LEN};
boot();
})();
