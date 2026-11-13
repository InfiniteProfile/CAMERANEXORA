const BATCH=48,BASE=10n**17n,$=i=>document.getElementById(i);
function hash(s){let h=2166136261;for(let i=0;i<s.length;i++){h^=s.charCodeAt(i);h=Math.imul(h,16777619)}return h>>>0}
function rng(a){return()=>{a|=0;a=a+0x6D2B79F5|0;let t=Math.imul(a^a>>>15,1|a);t=t+Math.imul(t^t>>>7,61|t)^t;return((t^t>>>14)>>>0)/4294967296}}
const A=['Nex','Lum','Opt','Vor','Kai','Zen','Aur','Cryo','Hel','Pri','Ond','Tav'],B=['ora','ix','on','ar','el','ium','ex','ia'],BR=[];A.forEach(a=>B.forEach(b=>BR.push(a+b)));
const CT=['Republic of Norvale','Kingdom of Aldmere','Federation of Tessara','Union of Kareth','Free State of Orlyn','Dominion of Vessin'];
// world: name, drawing kinds, year range, subcategories, formats, digital?, purpose
const W=[
['Photography World',['slr','rangefinder'],[1950,2070],['Full-frame DSLR','Mirrorless','Medium-format','Rangefinder'],['Full-frame sensor','APS-C sensor','Medium-format sensor'],1,'general photography'],
['Cinematography World',['cine'],[1960,2080],['Digital cinema','Film motion-picture','Broadcast','High-speed'],['Super 35 sensor','Large-format sensor','35mm film','16mm film'],1,'motion-picture production'],
['Digital Camera World',['slr','compact'],[1995,2080],['Compact','Bridge','Superzoom','Modular'],['1-inch sensor','APS-C sensor','Full-frame sensor'],1,'everyday digital capture'],
['Film Camera World',['slr','rangefinder','folding'],[1930,2000],['35mm SLR','Medium-format','Instant film','Panoramic'],['35mm film','120 film','Instant film'],0,'film photography'],
['Infrared World',['thermal'],[1990,2080],['Near-infrared','Short-wave infrared','Full-spectrum','Multispectral'],['InGaAs sensor','Modified CMOS sensor'],1,'imaging beyond visible light'],
['Thermal Imaging World',['thermal'],[1985,2080],['Long-wave thermal','Mid-wave thermal','Night vision'],['Microbolometer array','Cooled detector'],1,'heat visualization'],
['Scientific Camera World',['micro','box2'],[1970,2080],['Scientific CMOS','Radiation imaging','Hyperspectral'],['Back-illuminated sensor','CCD sensor'],1,'laboratory research'],
['Surveillance World',['bullet','dome'],[1980,2080],['Dome','Bullet','PTZ','Doorbell'],['1/2.8-inch sensor','1/3-inch sensor'],1,'monitoring and security'],
['Toy Camera World',['toy'],[1960,2080],['Plastic-lens toy','Children\'s digital','Keychain','Cardboard'],['Plastic-lens film','Tiny CMOS sensor'],1,'play and learning'],
['Vintage Camera World',['box','folding','tlr'],[1839,1935],['Box camera','Wet-plate','Twin-lens reflex','Folding'],['Glass plate','Roll film','Sheet film'],0,'early photography'],
['Underwater Camera World',['action','slr'],[1960,2080],['Deep-sea housing','Waterproof compact','Diving camera'],['1-inch sensor','Full-frame sensor'],1,'underwater imaging'],
['Space Camera World',['space'],[1960,2090],['Telescope camera','Spacecraft camera','Earth observation'],['Large CCD mosaic','Hybrid CMOS array'],1,'orbital and deep-space imaging'],
['Experimental Camera World',['tlr','box2','toy'],[1900,2100],['Pinhole array','Light-field','Prototype optics'],['Custom sensor','Pinhole plane'],1,'optical experiments'],
['Microscopic Camera World',['micro'],[1980,2080],['Digital microscope','Endoscope','Dental'],['Small CMOS sensor','Cooled CCD'],1,'close-up and medical imaging'],
['Aerial Camera World',['drone'],[1990,2090],['Drone gimbal','Mapping','Photogrammetry'],['1-inch sensor','Mapping sensor'],1,'aerial surveying']];
const FE=['weather sealing','a fast prime lens','focus peaking','a folding viewfinder','a modular lens mount','long-exposure mode','dual memory slots','a built-in light meter','vibration damping','a rotating lens turret','low-light enhancement','a swappable back','GPS tagging','burst capture','a mechanical shutter'],ST=['Fictional prototype','Fictional production model','Fictional discontinued model','Fictional concept'];
function make(id){const r=rng(hash(id)),p=a=>a[r()*a.length|0],w=p(W),brand=p(BR),kind=p(w[1]),sub=p(w[3]),year=w[2][0]+(r()*(w[2][1]-w[2][0]+1)|0),
model=p(['A','K','M','X','V','Z','R','T'])+p(['','X','Z'])+(10+(r()*990|0))+p(['','S','II','Pro','Mark III']),
f1=p(FE),f2=p(FE),fmt=p(w[4]);
return{id,name:model,brand,world:w[0],sub,year:String(year),country:p(CT),format:fmt,res:w[5]?(4+r()*196).toFixed(1)+' MP':'Not applicable (film)',lens:p(['Fixed lens','Fictional Nx bayonet','Fictional Q-thread mount','Interchangeable: Vor-5']),
zoom:p(['None (prime)','3x optical','10x optical','24x optical, 4x digital']),video:w[5]?p(['4K 30p','6K 60p','8K 24p','1080p 120p']):'None',
status:p(ST),purpose:w[6],feats:f1+', '+f2,kind,seed:hash(id),
desc:`The ${brand} ${model} is a fictional ${sub.toLowerCase()} camera imagined for ${w[6]}. It is built around a ${fmt.toLowerCase()} and offers ${f1} and ${f2}.`,
hist:`Fictional history: said to have been introduced in ${year} by ${brand}, a made-up manufacturer from the ${p(CT)}.`}}
function lens(x,y,R,c){return`<circle cx="${x}" cy="${y}" r="${R}" fill="#06090b" stroke="#7d8d97" stroke-width="2"/><circle cx="${x}" cy="${y}" r="${R*.8}" fill="#10181d" stroke="#2b3b44"/><circle cx="${x}" cy="${y}" r="${R*.55}" fill="${c}" opacity=".35"/><circle cx="${x}" cy="${y}" r="${R*.3}" fill="#02080b" stroke="${c}"/><circle cx="${x-R*.25}" cy="${y-R*.25}" r="${R*.1}" fill="#fff" opacity=".7"/>`}
const rc=(x,y,w,h,f,rx=4)=>`<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${rx}" fill="${f}" stroke="#0a0e11"/>`;
function art(p){const r=rng(p.seed^0x9e3779b9),bd=['#262d33','#1b2126','#38424a','#4a545c'][r()*4|0],ac=['#5cc8f0','#9fe3ff','#7fb7d6'][r()*3|0],k=p.kind,L=(x,y,R)=>lens(x,y,R,ac);let s='';
const tx=(x,y)=>`<text x="${x}" y="${y}" font-size="7" fill="${ac}" font-family="sans-serif" letter-spacing="1">${p.brand.toUpperCase()}</text>`;
if(k=='slr')s=rc(22,52,156,68,bd,9)+`<path d="M68 52 L78 32 H124 L134 52Z" fill="${bd}" stroke="#0a0e11"/>`+rc(30,44,22,8,'#6b7a84')+L(100,88,31)+tx(32,66);
else if(k=='rangefinder')s=rc(14,46,172,72,bd,6)+rc(14,46,172,14,'#7d8d97',4)+rc(34,66,18,10,'#aab8c0',2)+rc(148,66,18,10,'#aab8c0',2)+L(100,88,28)+tx(78,112);
else if(k=='compact')s=rc(30,52,140,66,bd,12)+L(80,85,24)+rc(120,60,36,12,'#aab8c0',3)+`<circle cx="150" cy="95" r="6" fill="${ac}"/>`+tx(110,112);
else if(k=='box'||k=='box2')s=rc(48,32,104,100,bd,6)+rc(78,22,44,10,'#6b7a84',2)+L(100,78,24)+`<circle cx="158" cy="70" r="5" fill="#aab8c0"/>`+tx(70,122);
else if(k=='tlr')s=rc(58,12,84,126,bd,8)+L(100,44,20)+L(100,98,25)+rc(70,2,60,10,'#6b7a84',2)+tx(76,132);
else if(k=='cine')s=rc(36,52,106,68,bd,5)+`<ellipse cx="90" cy="38" rx="42" ry="16" fill="${bd}" stroke="#0a0e11"/>`+rc(142,66,30,40,'#10181d',3)+L(176,86,22)+rc(60,120,60,8,'#6b7a84',2)+tx(46,70);
else if(k=='bullet')s=rc(34,62,112,40,bd,18)+L(150,82,19)+rc(60,102,12,26,'#6b7a84',2)+rc(30,126,60,6,'#6b7a84',2)+tx(50,86);
else if(k=='dome')s=rc(54,104,92,12,'#6b7a84',3)+`<path d="M58 104 A42 42 0 0 1 142 104Z" fill="#10181d" stroke="#7d8d97" stroke-width="2"/>`+L(100,92,14)+tx(84,124);
else if(k=='drone')s=`<path d="M100 70 L30 40 M100 70 L170 40 M100 70 L30 100 M100 70 L170 100" stroke="#6b7a84" stroke-width="5"/>`+[[30,40],[170,40],[30,100],[170,100]].map(a=>`<ellipse cx="${a[0]}" cy="${a[1]}" rx="22" ry="4" fill="${ac}" opacity=".5"/>`).join('')+rc(80,56,40,26,bd,8)+`<path d="M100 82 V92" stroke="#6b7a84" stroke-width="3"/>`+L(100,104,14);
else if(k=='action')s=rc(52,42,96,66,bd,12)+L(100,75,21)+rc(58,48,22,12,'#10181d',3)+`<circle cx="136" cy="54" r="4" fill="${ac}"/>`+tx(112,102);
else if(k=='space')s=rc(72,48,60,56,bd,8)+L(102,76,20)+[8,140].map(x=>rc(x,52,52,48,'#12304a',2)+[1,2,3].map(i=>`<path d="M${x+i*13} 52 V100" stroke="${ac}" opacity=".4"/>`).join('')).join('')+`<path d="M52 76 H72 M132 76 H140" stroke="#6b7a84" stroke-width="3"/>`;
else if(k=='micro')s=rc(50,124,100,12,'#6b7a84',3)+rc(88,40,24,84,bd,4)+rc(84,22,32,18,'#aab8c0',3)+L(100,100,10)+rc(66,112,68,6,ac,2);
else if(k=='toy')s=rc(30,46,140,76,['#e8e8ea','#9fe3ff','#c9d6de'][r()*3|0],18)+L(100,86,26)+`<circle cx="52" cy="62" r="8" fill="${bd}"/>`+rc(126,56,28,12,bd,6);
else if(k=='thermal')s=rc(28,48,144,72,bd,8)+`<circle cx="70" cy="84" r="30" fill="#06090b" stroke="#7d8d97" stroke-width="2"/><circle cx="70" cy="84" r="20" fill="${ac}" opacity=".25"/><circle cx="70" cy="84" r="10" fill="#041016" stroke="${ac}"/>`+rc(116,58,46,32,'#041016',3)+`<path d="M122 82 l8 -10 l8 6 l8 -12" stroke="${ac}" fill="none"/>`+tx(116,108);
else s=rc(24,84,152,36,bd,4)+`<path d="M60 84 L72 60 H140 L152 84" fill="#10181d" stroke="#6b7a84"/>`+rc(152,60,22,60,bd,3)+L(163,90,12)+tx(40,106);
return`<svg viewBox="0 0 200 150" role="img" aria-label="Fictional ${p.brand} ${p.name}" xmlns="http://www.w3.org/2000/svg"><circle cx="100" cy="76" r="60" fill="${ac}" opacity=".06"/>${s}</svg>`}
let list=[],shown=0,cur=0n,scans=0,seen=new Set(),sel={w:'',m:'',q:''};
function match(p){const q=sel.q.toLowerCase();return(!sel.w||p.world==sel.w)&&(!sel.m||p.brand==sel.m)&&(!q||[p.id,p.name,p.brand,p.world,p.sub,p.year,p.format,p.country].join(' ').toLowerCase().includes(q))}
function fill(){let n=0;const need=shown+BATCH*3;while(list.length<need&&n<3000&&scans<400000){const p=make(String(BASE+cur));cur++;n++;scans++;if(!seen.has(p.id)&&match(p)){seen.add(p.id);list.push(p)}}
if(list.length<need&&scans<400000)setTimeout(pump,20)}
function card(p){const c=document.createElement('div');c.className='card';const im=document.createElement('div');im.className='img';im.innerHTML=art(p);
const i=document.createElement('div');i.className='info';[['b',p.brand+' '+p.name],['small',p.world+' · '+p.year],['small','ID '+p.id+' · FICTIONAL']].forEach(([t,x])=>{const e=document.createElement(t);e.textContent=x;i.append(e)});c.append(im,i);c.onclick=()=>show(p);return c}
let lastAdded=0;function more(n){const f=document.createDocumentFragment();list.slice(shown,shown+n).forEach(p=>f.append(card(p)));shown=Math.min(list.length,shown+n);$('feed').append(f)}
function pump(){fill();if(shown<list.length&&near())more(BATCH)}
function near(){return $('sentinel').getBoundingClientRect().top<innerHeight*4}
function show(p){const d=$('detail');d.innerHTML='';const h=document.createElement('h2');h.textContent=p.brand+' '+p.name;const a=document.createElement('div');a.className='img big';a.innerHTML=art(p);d.append(h,a);
const dl=document.createElement('dl');[['Profile ID',p.id],['Reality','Entirely fictional. Not a real camera.'],['Manufacturer',p.brand+' (fictional)'],['World',p.world],['Subcategory',p.sub],['Year (fictional)',p.year],['Country (fictional)',p.country],['Sensor / film format',p.format],['Resolution',p.res],['Lens / mount',p.lens],['Zoom',p.zoom],['Video',p.video],['Special features',p.feats],['Intended purpose',p.purpose],['Status',p.status],['History',p.hist],['Description',p.desc],['Image','Procedurally drawn SVG, not a photograph. No license needed.']].forEach(([k,v])=>{const x=document.createElement('dt'),y=document.createElement('dd');x.textContent=k;y.textContent=v;dl.append(x,y)});d.append(dl);$('modal').hidden=false}
function reset(){list=[];shown=0;cur=0n;scans=0;seen=new Set();$('feed').innerHTML='';const q=sel.q;
if(/^\d+$/.test(q)){const p=make(q.replace(/^0+(?=\d)/,''));if(match({...p,id:p.id})||1){seen.add(p.id);list.push(p)}}
fill();more(Math.min(BATCH,list.length));pump()}
$('w').innerHTML='<option value="">All worlds</option>'+W.map(w=>`<option>${w[0]}</option>`).join('');$('m').innerHTML='<option value="">All manufacturers</option>'+[...BR].sort().map(x=>`<option>${x}</option>`).join('');
$('worlds').innerHTML=W.map(w=>`<button data-w="${w[0]}">${w[0]}</button>`).join('');$('stats').textContent='∞ fictional profiles, generated endlessly';
$('x').onclick=()=>$('modal').hidden=true;$('q').oninput=e=>{sel.q=e.target.value.trim();reset()};$('w').onchange=e=>{sel.w=e.target.value;reset()};$('m').onchange=e=>{sel.m=e.target.value;reset()};
$('worlds').onclick=e=>{const w=e.target.dataset.w;if(w!==undefined){sel.w=w;$('w').value=w;reset()}};
if('IntersectionObserver'in window)new IntersectionObserver(e=>{if(e[0].isIntersecting)pump()},{rootMargin:'3000px'}).observe($('sentinel'));
addEventListener('scroll',pump,{passive:true});setInterval(()=>{if(near())pump()},500);reset();
