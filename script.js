const BATCH=60,all=[],ids=new Set();let list=[],shown=0,sel={w:'',m:'',q:''};
const $=i=>document.getElementById(i),F=['id','name','brand','world','sub','year','country','format','status','ref','image','license','desc'];
function parse(t){t.split(/\r?\n/).forEach(l=>{if(!l.trim()||l[0]=='#')return;const p=l.split('|');if(p.length<13)return;
const r={};F.forEach((k,i)=>r[k]=(p[i]||'').trim());if(!/^\d+$/.test(r.id)||!r.name||!r.brand||!r.world||ids.has(r.id))return;ids.add(r.id);all.push(r)})}
async function load(){for(let n=1;n<100;n++){try{const r=await fetch('data/cameras-'+String(n).padStart(3,'0')+'.txt');if(!r.ok)break;parse(await r.text())}catch(e){break}}
stat();opts();apply();pump()}
function opts(){const u=k=>[...new Set(all.map(r=>r[k]))].sort();
$('w').innerHTML='<option value="">All worlds</option>'+u('world').map(x=>`<option>${x}</option>`).join('');
$('m').innerHTML='<option value="">All manufacturers</option>'+u('brand').map(x=>`<option>${x}</option>`).join('');
$('worlds').innerHTML=u('world').map(w=>`<button data-w="${w}">${w} (${all.filter(r=>r.world==w).length})</button>`).join('');}
function apply(){const q=sel.q.toLowerCase();list=all.filter(r=>(!sel.w||r.world==sel.w)&&(!sel.m||r.brand==sel.m)&&(!q||Object.values(r).join(' ').toLowerCase().includes(q)));
$('feed').innerHTML='';shown=0;more();}
function more(){const f=document.createDocumentFragment();list.slice(shown,shown+BATCH).forEach(r=>{const c=document.createElement('div');c.className='card';
const im=document.createElement('div');im.className='img';
if(r.image){const i=new Image();i.loading='lazy';i.alt=r.name;i.src=r.image;i.onerror=()=>{im.textContent='Photograph not yet available'};im.append(i)}else im.textContent='Photograph not yet available';
const inf=document.createElement('div');inf.className='info';
[['b',r.brand+' '+r.name],['small',r.sub+(r.year&&r.year!='Unknown'?' · '+r.year:'')],['small','ID '+r.id]].forEach(([t,x])=>{const e=document.createElement(t);e.textContent=x;inf.append(e)});
c.append(im,inf);c.onclick=()=>show(r);f.append(c)});shown=Math.min(list.length,shown+BATCH);$('feed').append(f);}
function show(r){const d=$('detail');d.innerHTML='';const h=document.createElement('h2');h.textContent=r.brand+' '+r.name;d.append(h);
const dl=document.createElement('dl');[['ID',r.id],['World',r.world],['Subcategory',r.sub],['Year',r.year],['Country',r.country],['Format',r.format],['Status',r.status],['Reference',r.ref],['Image source / license',r.image?r.license||'Not documented':'No photograph yet'],['Description',r.desc]].forEach(([k,v])=>{const a=document.createElement('dt'),b=document.createElement('dd');a.textContent=k;if(/^https?:/.test(v)){const l=document.createElement('a');l.href=v;l.textContent=v;l.rel='noopener';b.append(l)}else b.textContent=v||'Unknown';dl.append(a,b)});d.append(dl);$('modal').hidden=false}
$('x').onclick=()=>$('modal').hidden=true;
$('q').oninput=e=>{sel.q=e.target.value.trim();apply()};$('w').onchange=e=>{sel.w=e.target.value;apply()};$('m').onchange=e=>{sel.m=e.target.value;apply()};
$('worlds').onclick=e=>{const w=e.target.dataset.w;if(w!==undefined){sel.w=w;$('w').value=w;apply()}};
function near(){return $('sentinel').getBoundingClientRect().top<innerHeight*3}
if('IntersectionObserver'in window)new IntersectionObserver(e=>{if(e[0].isIntersecting)pump()},{rootMargin:'2000px'}).observe($('sentinel'));
addEventListener('scroll',()=>{if(near())pump()},{passive:true});

let off=0,busy=false,done=false,fails=0,remoteN=0;const PAGE=100,localN=()=>all.length-remoteN;
function stat(){$('stats').textContent=localN()+' curated profiles + '+remoteN+' loaded from Wikidata / Wikimedia Commons'}
function pump(){if(shown<list.length)more();if(list.length-shown<BATCH*2)remote()}
function match(r){const q=sel.q.toLowerCase();return(!sel.w||r.world==sel.w)&&(!sel.m||r.brand==sel.m)&&(!q||Object.values(r).join(' ').toLowerCase().includes(q))}
async function remote(){if(busy||done)return;busy=true;
const q=`SELECT ?item ?itemLabel ?img ?mfrLabel ?inc ?cLabel ?classLabel WHERE{?item wdt:P31 ?class.?class wdt:P279* wd:Q15328.?item wdt:P18 ?img.OPTIONAL{?item wdt:P176 ?mfr}OPTIONAL{?item wdt:P571 ?inc}OPTIONAL{?item wdt:P495 ?c}SERVICE wikibase:label{bd:serviceParam wikibase:language "en".}}LIMIT ${PAGE} OFFSET ${off}`;
try{const r=await fetch('https://query.wikidata.org/sparql?format=json&query='+encodeURIComponent(q),{headers:{Accept:'application/sparql-results+json'}});
if(!r.ok)throw 0;const rows=(await r.json()).results.bindings;fails=0;
if(!rows.length)done=true;else{off+=PAGE;const add=[];
rows.forEach(b=>{const qn=b.item.value.split('/').pop().slice(1),name=b.itemLabel.value;if(!/^\d+$/.test(qn)||/^Q\d+$/.test(name))return;
const id='9'+qn;if(ids.has(id))return;ids.add(id);
const file=decodeURIComponent(b.img.value.split('/Special:FilePath/').pop());
const rec={id,name,brand:b.mfrLabel&&!/^Q\d+$/.test(b.mfrLabel.value)?b.mfrLabel.value:'Unknown',world:'Community Camera World (Wikidata)',sub:b.classLabel?b.classLabel.value:'Unknown',year:b.inc?b.inc.value.slice(0,4).replace(/^0+/,''):'Unknown',country:b.cLabel?b.cLabel.value:'Unknown',format:'Not documented',status:'Not documented',ref:b.item.value,image:'https://commons.wikimedia.org/wiki/Special:FilePath/'+encodeURIComponent(file)+'?width=600',license:'Photo: Wikimedia Commons, see https://commons.wikimedia.org/wiki/File:'+encodeURIComponent(file)+' for author and license',desc:'Record from Wikidata (community-maintained, not manually verified here).'};
all.push(rec);remoteN++;if(match(rec))list.push(rec)});
opts2();stat()}}
catch(e){fails++;setTimeout(pump,Math.min(60000,2000*2**fails))}
busy=false;if(!done&&fails==0){setTimeout(pump,300)}}
function opts2(){const w=$('w').value,m=$('m').value,sw=[...new Set(all.map(r=>r.world))].sort(),sm=[...new Set(all.map(r=>r.brand))].sort();
$('w').innerHTML='<option value="">All worlds</option>'+sw.map(x=>`<option>${x}</option>`).join('');$('m').innerHTML='<option value="">All manufacturers</option>'+sm.map(x=>`<option>${x}</option>`).join('');$('w').value=w;$('m').value=m;
$('worlds').innerHTML=sw.map(x=>`<button data-w="${x}">${x}</button>`).join('')}
load();
