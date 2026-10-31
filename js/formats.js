/* Форматы: 3D-модели (three.js), переключатель на первом экране, секция «Форматы», связка формат x содержание. */
(function(){
const $=s=>document.querySelector(s),RM=matchMedia('(prefers-reduced-motion:reduce)').matches,F=window.FORMATS,C=window.CARDS,byId=id=>C.find(c=>c.id===id)||C[0];
let ver=0,saved=null,ci=0,fi=0,hero=null,combo=null,hi=0,iv=0,tm=0;
const IM={},IMF={},FONT='Manrope,system-ui,sans-serif';
const OWN={},MM={},cls=f=>f.id==='biz'?'biz':f.id==='plate'?'plate':'sq';
const asp=(f,c)=>{const df=IMF[f.id==='biz'?'biz':f.id+'-'+c.id],im=df||(f.fit&&IM[c.id]);return im?im.width/im.height:f.w/f.h};
/* значки соцсетей для рисованных карточек */
function glyph(x,t,px,py,s){x.save();x.translate(px,py);x.fillStyle=x.strokeStyle='#fff';x.lineJoin='round';x.lineCap='round';
if(t==='ig'){x.lineWidth=s*.09;const r=s*.3;x.beginPath();x.moveTo(r,0);x.arcTo(s,0,s,s,r);x.arcTo(s,s,0,s,r);x.arcTo(0,s,0,0,r);x.arcTo(0,0,s,0,r);x.closePath();x.stroke();x.beginPath();x.arc(s/2,s/2,s*.23,0,7);x.stroke();x.beginPath();x.arc(s*.76,s*.24,s*.05,0,7);x.fill()}
else if(t==='vk'){x.font='800 '+s*.9+'px Manrope,system-ui,sans-serif';x.textBaseline='top';x.fillText('VK',-s*.02,s*.02)}
else{const k=s/100;x.beginPath();x.moveTo(95*k,10*k);x.lineTo(8*k,44*k);x.lineTo(31*k,55*k);x.lineTo(40*k,86*k);x.lineTo(55*k,67*k);x.lineTo(75*k,84*k);x.closePath();x.fill()}
x.restore()}
/* проверка PNG: подпись, порядок блоков, контрольные суммы, конец файла */
const CRCT=(()=>{const t=new Uint32Array(256);for(let n=0;n<256;n++){let c=n;for(let k=0;k<8;k++)c=c&1?0xedb88320^(c>>>1):c>>>1;t[n]=c>>>0}return t})();
const crc32=(b,s,e)=>{let c=-1;for(let i=s;i<e;i++)c=CRCT[(c^b[i])&255]^(c>>>8);return(c^-1)>>>0};
function pngCheck(buf){const b=new Uint8Array(buf),dv=new DataView(buf),sg=[137,80,78,71,13,10,26,10],bad='Файл повреждён или это не PNG';
if(b.length<57||sg.some((v,i)=>b[i]!==v))return bad;
let o=8,first=1,w=0,h=0,idat=0;
while(o+12<=b.length){const n=dv.getUint32(o),t=String.fromCharCode(b[o+4],b[o+5],b[o+6],b[o+7]);if(o+12+n>b.length)return bad;
if(crc32(b,o+4,o+8+n)!==dv.getUint32(o+8+n))return bad;
if(first){if(t!=='IHDR'||n!==13)return bad;w=dv.getUint32(o+8);h=dv.getUint32(o+12);first=0}
if(t==='IDAT')idat=1;o+=12+n;
if(t==='IEND')return(o===b.length&&idat)?{w,h}:bad}
return bad}
async function decode(buf){const bl=new Blob([buf],{type:'image/png'});if(window.createImageBitmap){try{return await createImageBitmap(bl)}catch(e){}}
return await new Promise((ok,no)=>{const u=URL.createObjectURL(bl),i=new Image();i.onload=()=>{URL.revokeObjectURL(u);ok(i)};i.onerror=()=>{URL.revokeObjectURL(u);no()};i.src=u})}
/* картинка перерисовывается на новый холст: исходный файл дальше не используется */
function toCanvas(img,a){const M=1024,W=a>=1?M:Math.round(M*a),H=a>=1?Math.round(M/a):M,k=document.createElement('canvas');k.width=W;k.height=H;const x=k.getContext('2d');x.fillStyle='#fff';x.fillRect(0,0,W,H);
const s=Math.max(W/img.width,H/img.height),dw=img.width*s,dh=img.height*s;x.imageSmoothingQuality='high';x.drawImage(img,(W-dw)/2,(H-dh)/2,dw,dh);return k}
const ratio=a=>{if(Math.abs(a-1)<.03)return'1:1';for(let q=1;q<=10;q++){const p=Math.round(a*q);if(p&&Math.abs(p/q-a)<.02)return p+':'+q}return a.toFixed(2).replace('.',',')+':1'};
const UPH=(k,a)=>({sq:'Загрузите PNG под NFC-карточку и наклейку: нужен квадрат 1:1, он покажется на обеих.',plate:'Загрузите PNG под NFC-табличку: нужны пропорции '+ratio(a)+'.',biz:'Загрузите PNG под визитку: нужны пропорции '+ratio(a)+'.'})[k];
function upUI(){const f=F[fi],k=cls(f),own=G[grp].id==='own'||f.id==='biz',up=$('#up');if(!up)return;up.hidden=!own;if(!own)return;
$('#uph').textContent=UPH(k,asp(f,f.id==='biz'?{}:byId('brand')))+' PNG до 5 МБ, от 200 px.';
$('#upx').hidden=!OWN[k];$('#ups').textContent=OWN[k]?'Готово, картинка показана на макете. Она хранится только в этом окне и пропадёт после обновления страницы.'+(MM[k]?' Пропорции отличаются от макета, поэтому края обрезаны.':''):''}
(function(){const ub=$('#upb'),uf=$('#upf'),ux=$('#upx');if(!ub)return;
ub.onclick=()=>uf.click();
ux.onclick=()=>{delete OWN[cls(F[fi])];refresh();upUI()};
uf.onchange=async()=>{const file=uf.files[0];uf.value='';if(!file)return;const st=$('#ups');st.textContent='Проверяем файл…';
try{if(file.type!=='image/png')throw'Нужен файл PNG';if(file.size>5*1048576)throw'Файл больше 5 МБ';
const buf=await file.arrayBuffer(),r=pngCheck(buf);if(typeof r==='string')throw r;
if(r.w<200||r.h<200)throw'Картинка слишком маленькая: нужно от 200 px';if(r.w>4096||r.h>4096)throw'Картинка слишком большая: до 4096 px';
const f=F[fi],a=asp(f,f.id==='biz'?{}:byId('brand')),img=await decode(buf);OWN[cls(f)]=toCanvas(img,a);if(img.close)img.close();MM[cls(f)]=Math.abs(r.w/r.h/a-1)>.12;refresh();upUI()}
catch(e){st.textContent=typeof e==='string'?e:'Не удалось открыть картинку'}}})();
/* цены: карточки и переход «Узнать цену» к выбранному формату */
(function(){const g=$('#pg');if(!g)return;const fm=n=>String(n).replace(/\B(?=(\d{3})+$)/g,'\u00a0');
g.innerHTML=F.map(x=>'<div class="card" data-f="'+x.id+'"><h3>'+x.n+'</h3><div class="pr"><small>от</small> '+(x.price?fm(x.price)+'\u00a0₽':'по запросу')+'</div><dl><dt>Размер</dt><dd>'+x.dim+'</dd><dt>Материал</dt><dd>'+x.ma+'</dd></dl><p class="mut">'+x.p+'</p></div>').join('');
let ht;window.priceGo=id=>{const s=$('#price'),c=g.querySelector('[data-f="'+id+'"]'),sm=RM?'auto':'smooth';if(!s)return;
s.scrollIntoView({behavior:sm,block:'start'});
if(c){const gr=g.getBoundingClientRect(),cr=c.getBoundingClientRect();g.scrollTo({left:Math.max(0,cr.left-gr.left+g.scrollLeft-16),behavior:sm});
g.querySelectorAll('.card').forEach(e=>e.classList.toggle('hl',e===c));clearTimeout(ht);ht=setTimeout(()=>c.classList.remove('hl'),3200)}};
const pb=$('#pricebtn');if(pb)pb.addEventListener('click',e=>{e.preventDefault();priceGo(F[fi].id)})})();
function trim(im,doTrim){const M=1024,q=Math.min(1,M/Math.max(im.naturalWidth,im.naturalHeight)),w=Math.round(im.naturalWidth*q),h=Math.round(im.naturalHeight*q),k=document.createElement('canvas');k.width=w;k.height=h;const x=k.getContext('2d');x.drawImage(im,0,0,w,h);if(!doTrim)return k;let d;try{d=x.getImageData(0,0,w,h).data}catch(e){return k}let x0=w,y0=h,x1=0,y1=0;for(let j=0;j<h;j++)for(let i=0;i<w;i++){const p=(j*w+i)*4;if(d[p+3]<16||(d[p]>244&&d[p+1]>244&&d[p+2]>244))continue;if(i<x0)x0=i;if(i>x1)x1=i;if(j<y0)y0=j;if(j>y1)y1=j}if(x1-x0<w*.3||y1-y0<h*.3)return k;const o=document.createElement('canvas');o.width=x1-x0+1;o.height=y1-y0+1;o.getContext('2d').drawImage(k,x0,y0,o.width,o.height,0,0,o.width,o.height);return o}
const lf=(f,c)=>new Promise(r=>{const i=new Image(),k=c?f.id+'-'+c.id:'biz';i.onload=()=>{try{IMF[k]=trim(i,!!f.fit)}catch(e){IMF[k]=i}r()};i.onerror=()=>r();i.src='images/faces/'+k+'.webp'});
const mkFL=()=>{const a=[];F.forEach(f=>f.id==='biz'?a.push(lf(f)):C.forEach(c=>{if(!c.logo)a.push(lf(f,c))}));return a};
const load=c=>new Promise(r=>{if(!c.img)return r();const i=new Image();i.onload=()=>{try{IM[c.id]=trim(i,c.trim!==false)}catch(e){IM[c.id]=i}r()};i.onerror=()=>r();i.src=c.img});
function wrap(x,t,mx){let l='',o=[];t.split(' ').forEach(s=>{const n=l?l+' '+s:s;if(x.measureText(n).width>mx&&l){o.push(l);l=s}else l=n});o.push(l);return o}
function nfc(x,cx,cy,r,col){x.strokeStyle=x.fillStyle=col;x.lineWidth=r*.16;x.lineCap='round';x.beginPath();x.arc(cx,cy,r*.1,0,7);x.fill();[.45,.85].forEach(k=>[[-.7,.7],[Math.PI-.7,Math.PI+.7]].forEach(a=>{x.beginPath();x.arc(cx,cy,r*k,a[0],a[1]);x.stroke()}))}
/* лицевая сторона: картинка из images/ или рисунок из цветов карточки */
function face(f,c){const ow=OWN[cls(f)];if(ow&&(f.id==='biz'||c.id==='brand')){const k=document.createElement('canvas');k.width=ow.width;k.height=ow.height;k.getContext('2d').drawImage(ow,0,0);return k}const df=IMF[f.id==='biz'?'biz':f.id+'-'+c.id];if(df){const k=document.createElement('canvas');k.width=df.width;k.height=df.height;k.getContext('2d').drawImage(df,0,0);return k}if(f.fit&&IM[c.id]){const im=IM[c.id],k=document.createElement('canvas');k.width=im.width;k.height=im.height;k.getContext('2d').drawImage(im,0,0);return k}const w=1024,h=Math.round(w*f.h/f.w),k=document.createElement('canvas');k.width=w;k.height=h;const x=k.getContext('2d'),im=IM[c.id],L=w/h>1.2;x.textBaseline='top';
if(f.id==='biz'){x.fillStyle='#efede3';x.fillRect(0,0,w,h);x.fillStyle='#302f2c';x.fillRect(0,0,w*.025,h);const m=h,p=w*.08;x.font='700 '+m*.1+'px '+FONT;x.fillText('Название компании',p,h*.12);x.globalAlpha=.55;x.font='500 '+m*.05+'px '+FONT;x.fillText('Чем занимается компания',p,h*.12+m*.13);x.globalAlpha=1;x.font='600 '+m*.065+'px '+FONT;x.fillText('Имя Фамилия',p,h*.52);x.globalAlpha=.6;x.font='500 '+m*.048+'px '+FONT;x.fillText('Должность',p,h*.52+m*.09);x.fillText('+7 000 000-00-00',p,h*.74);x.fillText('company.ru',p,h*.74+m*.07);x.globalAlpha=1;nfc(x,w-m*.2,h-m*.2,m*.12,'#302f2c');return k}
if(c.logo){const g2=x.createLinearGradient(0,0,w,h);g2.addColorStop(0,c.a);g2.addColorStop(1,c.c);x.fillStyle=g2;x.fillRect(0,0,w,h);const m=Math.min(w,h),p=m*.08;glyph(x,c.logo,p,p,m*.22);x.fillStyle='#fff';x.font='700 '+m*.085+'px '+FONT;const ls=wrap(x,c.b,w-p*2);ls.forEach((l,i)=>x.fillText(l,p,p+m*.32+i*m*.1));x.globalAlpha=.75;x.font='500 '+m*.04+'px '+FONT;x.fillText(c.s,p,p+m*.32+ls.length*m*.1+m*.02);x.globalAlpha=1;nfc(x,w-m*.2,h-m*.2,m*.13,'#fff');return k}
if(im){x.fillStyle='#fff';x.fillRect(0,0,w,h);
if(!L){const s=Math.min(w/im.width,h/im.height);x.drawImage(im,(w-im.width*s)/2,(h-im.height*s)/2,im.width*s,im.height*s)}
else{x.drawImage(im,0,0,h,h);const px=h+24,pw=w-px-40;x.fillStyle='#302f2c';x.font='600 '+h*.1+'px '+FONT;wrap(x,c.s,pw).forEach((l,i)=>x.fillText(l,px,h*.12+i*h*.12));nfc(x,px+pw/2,h*.66,h*.2,'#302f2c')}}
else{const g=x.createLinearGradient(0,0,w,h),col=c.t||'#efede3',m=Math.min(w,h);g.addColorStop(0,c.a);g.addColorStop(1,c.c);x.fillStyle=g;x.fillRect(0,0,w,h);x.fillStyle=col;x.font='600 '+m*.075+'px '+FONT;
const ls=wrap(x,c.b,w*.62);ls.forEach((l,i)=>x.fillText(l,m*.07,m*.07+i*m*.09));x.globalAlpha=.7;x.font='500 '+m*.04+'px '+FONT;x.fillText(c.s,m*.07,m*.07+ls.length*m*.09+m*.03);x.globalAlpha=1;nfc(x,w-m*.2,h-m*.2,m*.14,col)}
return k}
const slab=(W,H,T,r,bv)=>{r=r||Math.min(W,H)*.1;const s=new THREE.Shape();s.moveTo(-W/2+r,-H/2);s.lineTo(W/2-r,-H/2);s.quadraticCurveTo(W/2,-H/2,W/2,-H/2+r);s.lineTo(W/2,H/2-r);s.quadraticCurveTo(W/2,H/2,W/2-r,H/2);s.lineTo(-W/2+r,H/2);s.quadraticCurveTo(-W/2,H/2,-W/2,H/2-r);s.lineTo(-W/2,-H/2+r);s.quadraticCurveTo(-W/2,-H/2,-W/2+r,-H/2);
const g=new THREE.ExtrudeGeometry(s,{depth:T,bevelEnabled:bv>0,bevelThickness:bv,bevelSize:bv,bevelSegments:3,curveSegments:10});g.translate(0,0,-T/2);return g};
function build(f){let base;const m=Math.max(f.w,f.h),W=f.w/m*1.5,H=f.h/m*1.5,g=new THREE.Group(),mt=f.mat==='matte',
cap=new THREE.MeshPhysicalMaterial({color:mt?0xd0d0d0:0xaaaaaa,roughness:mt?.85:.5,metalness:mt?0:.1,clearcoat:mt?0:.8,clearcoatRoughness:.3,envMapIntensity:mt?.25:.5,toneMapped:false}),
sd=new THREE.MeshStandardMaterial({color:f.edge,roughness:mt?.7:.3,metalness:mt?0:.6,envMapIntensity:mt?.5:2}),body=new THREE.Mesh(slab(W,H,f.t,0,f.bv),[cap,sd]);g.add(body);
if(f.id==='plate'){body.rotation.x=-.1;const b=new THREE.Mesh(new THREE.BoxGeometry(W*.8,.1,.5),new THREE.MeshStandardMaterial({color:0x2a2926,roughness:.45,metalness:.4}));b.position.set(0,-H/2+.02,.05);g.add(b);base=b;g.children.forEach(c=>c.position.y+=.06)}
g.userData={cap,sd,body,base,W,H,s:0,sp:0};g.visible=false;return g}
const V=[];
function View(cv,o){let R;try{R=new THREE.WebGLRenderer({canvas:cv,antialias:true,alpha:true})}catch(e){const S={cv,vis:false,set(id,c){const k=face(F.find(x=>x.id===id),c);cv.width=k.width;cv.height=k.height;cv.getContext('2d').drawImage(k,0,0)}};return S}
R.setPixelRatio(Math.min(devicePixelRatio,innerWidth<860?1.25:2));R.outputEncoding=THREE.sRGBEncoding;R.toneMapping=THREE.ACESFilmicToneMapping;
const pm=new THREE.PMREMGenerator(R),es=new THREE.Scene();es.add(new THREE.Mesh(new THREE.SphereGeometry(10,24,12),new THREE.MeshBasicMaterial({color:0x1a1917,side:THREE.BackSide})));
[[-4,5,4,9,5,0xffffff],[6,1,-2,3,7,0xefede3],[0,-4,5,8,1.5,0x7d786a]].forEach(a=>{const m=new THREE.Mesh(new THREE.PlaneGeometry(a[3],a[4]),new THREE.MeshBasicMaterial({color:a[5],side:THREE.DoubleSide}));m.position.set(a[0],a[1],a[2]);m.lookAt(0,0,0);es.add(m)});
const sc=new THREE.Scene();sc.environment=pm.fromScene(es,.1).texture;
const dl=new THREE.DirectionalLight(0xffffff,.75),pl=new THREE.PointLight(0xfff1de,.45,0,2);dl.position.set(-2,3,4);pl.position.set(0,0,2.4);sc.add(dl,pl,new THREE.AmbientLight(0xffffff,.45));
const objs={};F.forEach(f=>{objs[f.id]=build(f);sc.add(objs[f.id])});
const cam=new THREE.PerspectiveCamera(28,1,.1,50),S={cv,vis:true,cur:null,px:0,py:0,on:0};let rx=0,ry=0;
function size(){const w=cv.clientWidth,h=cv.clientHeight;if(!w||!h)return;R.setSize(w,h,false);const a=w/h,t=Math.tan(14*Math.PI/180);cam.aspect=a;cam.position.set(0,0,Math.max(.98/t,.98/(t*a)));cam.updateProjectionMatrix();S.f(S.t||0)}
const zone=o.zone||cv;
zone.addEventListener('pointermove',e=>{if(RM)return;const b=cv.getBoundingClientRect(),tc=e.pointerType==='touch';let px,py;if(zone===cv){px=(e.clientX-b.left)/b.width*2-1;py=(e.clientY-b.top)/b.height*2-1}else{px=(e.clientX-b.left-b.width/2)/(b.width*.9);py=(e.clientY-b.top-b.height/2)/(b.height*.9)}S.px=Math.max(-1,Math.min(1,px))*(tc?.5:1);S.py=tc?0:Math.max(-1,Math.min(1,py));S.on=1});
['pointerleave','pointerup','pointercancel'].forEach(n=>zone.addEventListener(n,()=>S.on=0));
S.cache={};
S.clear=()=>{Object.values(S.cache).forEach(e=>{e.t.dispose();e.geo.dispose()});S.cache={}};
S.ent=(f,c,key)=>{let e=S.cache[key];
if(!e){const df=IMF[f.id==='biz'?'biz':f.id+'-'+c.id],im=df||(f.fit&&IM[c.id]),a=asp(f,c),W=a>=1?1.5:1.5*a,H=a>=1?1.5/a:1.5,t=new THREE.CanvasTexture(face(f,c));t.encoding=THREE.sRGBEncoding;t.anisotropy=4;t.repeat.set(1/W,1/H);t.offset.set(.5,.5);e=S.cache[key]={t,W,H,geo:slab(W,H,f.t,0,f.bv)}}
return e};
S.init=t=>{try{R.initTexture&&R.initTexture(t)}catch(x){}};
S.set=(id,c,spin)=>{const f=F.find(x=>x.id===id),g=objs[id],u=g.userData,key=id+'|'+(c.id||'')+'|'+ver,e=S.ent(f,c,key);
u.body.geometry=e.geo;u.W=e.W;u.H=e.H;if(u.base){u.base.position.y=-e.H/2+.08;u.base.scale.x=e.W/1.2}
u.cap.map=e.t;u.cap.needsUpdate=true;if(id==='card'&&c.c)u.sd.color.set(c.c).multiplyScalar(1.6);if(S.cur!==g||spin){S.cur=g;u.sp=RM?0:-1.3}if(RM)S.f(0)};
S.f=t=>{S.t=t;const k=RM?0:1,tx=S.on?S.py*.5:Math.sin(t/1400)*.08*k,ty=S.on?S.px*.65:Math.sin(t/1800)*.18*k;rx+=(tx-rx)*.08;ry+=(ty-ry)*.08;
const gv=n=>parseFloat(cv.style.getPropertyValue(n)),gx=(gv('--gx')||0)*Math.PI/180,gy=(gv('--gy')||0)*Math.PI/180,gs=gv('--gs')||1;
Object.values(objs).forEach(g=>{const u=g.userData;u.s+=((g===S.cur?1:0)-u.s)*(RM?1:.14);u.sp*=.9;g.visible=u.s>.01;g.scale.setScalar(Math.max(.001,u.s)*gs);g.rotation.set(rx+gx,ry+gy+u.sp,0)});
pl.position.x+=((S.on?S.px*1.6:Math.sin(t/1600)*.9)-pl.position.x)*.1;pl.position.y+=((S.on?-S.py*1.6:Math.cos(t/2100)*.6)-pl.position.y)*.1;R.render(sc,cam)};
try{R.compile(sc,cam)}catch(x){}
new ResizeObserver(size).observe(cv);size();V.push(S);return S}
/* первый экран: чипы форматов и смена модели */
const fch=$('#fch'),hs=i=>{hi=i;fch.querySelectorAll('button').forEach((b,j)=>b.setAttribute('aria-selected',j==i));hero&&hero.set(F[i].id,F[i].id==='biz'?{}:byId(F[i].demo))},
auto=()=>{clearInterval(iv);if(!RM)iv=setInterval(()=>hs((hi+1)%F.length),3800)};
F.forEach((f,i)=>{const b=document.createElement('button');b.role='tab';b.textContent=f.k;b.onclick=()=>{hs(i);clearInterval(iv);clearTimeout(tm);tm=setTimeout(auto,9000)};fch.append(b)});hs(0);
/* связка формат x содержание */
const ft=$('#ftabs');F.forEach((f,i)=>{const b=document.createElement('button');b.role='tab';b.textContent=f.k;b.onclick=()=>{fi=i;gBuild();upd()};ft.append(b)});
const G=window.GROUPS,BIZ={h:'Визитка вашей компании',p:'Обычная визитка с NFC-чипом: коснулись телефоном, и открылись сайт, соцсети или запись.',o:'Оформление и ссылка под вашу компанию.'};let grp=0,vi=0,cy=0;
const items=()=>G[grp].items.map(byId);
function txt(anim){const x=F[fi].id==='biz'?BIZ:C[ci],t=$('#sw-txt'),ap=()=>{$('#sw-h').textContent=x.h;$('#sw-p').textContent=x.p;$('#sw-o').textContent=x.o;t.style.opacity=1};if(anim){t.style.opacity=0;setTimeout(ap,150)}else ap()}
function dots(){const dt=$('#sw-dots'),it=items(),biz=F[fi].id==='biz';dt.hidden=biz||it.length<2;dt.innerHTML='';it.forEach((c,j)=>{const b=document.createElement('button');b.type='button';b.setAttribute('aria-label',c.k);b.setAttribute('aria-current',j==vi);b.onclick=()=>pick(j,1);dt.append(b)})}
function pick(j,user){vi=j;ci=C.indexOf(items()[j]);txt(true);[...$('#sw-dots').children].forEach((b,k)=>b.setAttribute('aria-current',k==vi));const f=F[fi];if(combo)combo.set(f.id,f.id==='biz'?{}:C[ci],1);if(user)cycle()}
function cycle(){clearInterval(cy);if(RM||F[fi].id==='biz'||items().length<2)return;cy=setInterval(()=>{if(document.hidden||gi>0||!combo||!combo.vis)return;pick((vi+1)%items().length)},3200)}
function upd(spin){const f=F[fi];ft.querySelectorAll('button').forEach((b,j)=>b.setAttribute('aria-selected',j==fi));const biz=f.id==='biz',tb=$('#tabs');tb.hidden=biz;tb.previousElementSibling.hidden=biz;
txt(!!spin);dots();upUI();cycle();combo&&combo.set(f.id,biz?{}:C[ci],spin)}
/* галерея под моделью: 3D, фото 1-3, снова 3D */
const gp=$('#gp'),gd=$('#gd');let gi=0;
function gShow(){[...gp.children].forEach((d,i)=>d.hidden=i!==gi-1);gp.classList.toggle('on',gi>0);[...gd.children].forEach((b,i)=>b.setAttribute('aria-current',i==gi));if(combo)combo.hold=gi>0;const cv=$('#sw');if(cv)cv.style.opacity=gi>0?0:1}
function gBuild(){const f=F[fi],ph=[1,2,3].map(n=>'images/photos/'+(f.id==='biz'?'biz-':f.id+'-'+C[ci].id+'-')+n+'.jpg');gp.innerHTML='';gd.innerHTML='';
ph.forEach((s,i)=>{const d=document.createElement('div');d.className='gs';d.hidden=true;const im=new Image();im.alt=f.h+', фото '+(i+1);im.onload=()=>d.classList.add('ok');im.onerror=()=>im.remove();im.src=s;d.append(im);gp.append(d)});
['3D'].concat(ph.map((_,i)=>'Фото '+(i+1))).forEach((t,i)=>{const b=document.createElement('button');b.textContent=t;b.onclick=()=>{gi=i;gShow()};gd.append(b)});gi=0;gShow()}
window.gal=d=>{const n=4;gi=(gi+d+n)%n;gShow()};
window.swGroup=(g,first)=>{grp=g;vi=0;ci=C.indexOf(items()[0]);gBuild();upd(!first)};gBuild();upd();
/* 3D запускается, когда загружены шрифты и картинки */
/* 3D запускается сразу, как загружена картинка первого экрана; остальное подгружается позже, камера второго блока создаётся при подходе к нему */
let wt=0;const warm=()=>{clearTimeout(wt);let i=0;const step=()=>{if(!hero||!hero.ent||i>=F.length)return;const f=F[i++],c=f.id==='biz'?{}:byId(f.demo);try{const e=hero.ent(f,c,f.id+'|'+(c.id||'')+'|'+ver);hero.init(e.t)}catch(x){}wt=setTimeout(step,110)};wt=setTimeout(step,250)};
const heroC=byId(F[0].demo),refresh=()=>{ver++;V.forEach(s=>s.clear&&s.clear());hs(hi);upd();warm()};
Promise.all([load(heroC),lf(F[0],heroC)]).then(()=>{if(!window.THREE)return;
hero=View($('#ht'),{zone:document.querySelector('.hero')});hs(hi);auto();
const io=new IntersectionObserver(es=>es.forEach(e=>{const s=V.find(v=>v.cv===e.target);if(s)s.vis=e.isIntersecting}));if(hero.cv)io.observe(hero.cv);
const cio=new IntersectionObserver((es,o)=>{if(es.some(e=>e.isIntersecting)){o.disconnect();combo=View($('#sw'),{});io.observe(combo.cv);upd()}},{rootMargin:'600px'});cio.observe($('#sw'));
setTimeout(()=>Promise.all(C.filter(c=>c!==heroC).map(load).concat(mkFL())).then(refresh),500);
document.fonts.ready.then(refresh);
if(!RM)(function L(t){if(!document.hidden)V.forEach(s=>s.vis&&!s.hold&&s.f&&s.f(t));requestAnimationFrame(L)})(0)});
})();
