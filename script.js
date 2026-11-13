const BATCH=60,all=[],ids=new Set();let list=[],shown=0,sel={w:'',m:'',q:''};
const $=i=>document.getElementById(i),F=['id','name','brand','world','sub','year','country','format','status','ref','image','license','desc'];
function parse(t){t.split(/\r?\n/).forEach(l=>{if(!l.trim()||l[0]=='#')return;const p=l.split('|');if(p.length<13)return;
const r={};F.forEach((k,i)=>r[k]=(p[i]||'').trim());if(!/^\d+$/.test(r.id)||!r.name||!r.brand||!r.world||ids.has(r.id))return;ids.add(r.id);all.push(r)})}
async function load(){for(let n=1;n<100;n++){try{const r=await fetch('data/cameras-'+String(n).padStart(3,'0')+'.txt');if(!r.ok)break;parse(await r.text())}catch(e){break}}
$('stats').textContent=all.length+' verified profiles';opts();apply()}
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
if('IntersectionObserver'in window)new IntersectionObserver(e=>{if(e[0].isIntersecting&&shown<list.length)more()},{rootMargin:'2000px'}).observe($('sentinel'));
addEventListener('scroll',()=>{if(shown<list.length&&near())more()},{passive:true});
load();
