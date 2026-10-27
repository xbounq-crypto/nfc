/* Форматы: 3D-модели (three.js), переключатель на первом экране, секция «Форматы», связка формат x содержание. */
(function(){
const $=s=>document.querySelector(s),RM=matchMedia('(prefers-reduced-motion:reduce)').matches,F=window.FORMATS,C=window.CARDS,byId=id=>C.find(c=>c.id===id)||C[0];
let ver=0,saved=null,ci=0,fi=0,hero=null,combo=null,hi=0,iv=0,tm=0;
const IM={},IMF={},FONT='Manrope,system-ui,sans-serif';
function trim(im,doTrim){const M=1024,q=Math.min(1,M/Math.max(im.naturalWidth,im.naturalHeight)),w=Math.round(im.naturalWidth*q),h=Math.round(im.naturalHeight*q),k=document.createElement('canvas');k.width=w;k.height=h;const x=k.getContext('2d');x.drawImage(im,0,0,w,h);if(!doTrim)return k;let d;try{d=x.getImageData(0,0,w,h).data}catch(e){return k}let x0=w,y0=h,x1=0,y1=0;for(let j=0;j<h;j++)for(let i=0;i<w;i++){const p=(j*w+i)*4;if(d[p+3]<16||(d[p]>244&&d[p+1]>244&&d[p+2]>244))continue;if(i<x0)x0=i;if(i>x1)x1=i;if(j<y0)y0=j;if(j>y1)y1=j}if(x1-x0<w*.3||y1-y0<h*.3)return k;const o=document.createElement('canvas');o.width=x1-x0+1;o.height=y1-y0+1;o.getContext('2d').drawImage(k,x0,y0,o.width,o.height,0,0,o.width,o.height);return o}
const lf=(f,c)=>new Promise(r=>{const i=new Image(),k=c?f.id+'-'+c.id:'biz';i.onload=()=>{try{IMF[k]=trim(i,!!f.fit)}catch(e){IMF[k]=i}r()};i.onerror=()=>r();i.src='images/faces/'+k+'.png'});
const mkFL=()=>{const a=[];F.forEach(f=>f.id==='biz'?a.push(lf(f)):C.forEach(c=>a.push(lf(f,c))));return a};
const load=c=>new Promise(r=>{if(!c.img)return r();const i=new Image();i.onload=()=>{try{IM[c.id]=trim(i,c.trim!==false)}catch(e){IM[c.id]=i}r()};i.onerror=()=>r();i.src=c.img});
function wrap(x,t,mx){let l='',o=[];t.split(' ').forEach(s=>{const n=l?l+' '+s:s;if(x.measureText(n).width>mx&&l){o.push(l);l=s}else l=n});o.push(l);return o}
function nfc(x,cx,cy,r,col){x.strokeStyle=x.fillStyle=col;x.lineWidth=r*.16;x.lineCap='round';x.beginPath();x.arc(cx,cy,r*.1,0,7);x.fill();[.45,.85].forEach(k=>[[-.7,.7],[Math.PI-.7,Math.PI+.7]].forEach(a=>{x.beginPath();x.arc(cx,cy,r*k,a[0],a[1]);x.stroke()}))}
/* лицевая сторона: картинка из images/ или рисунок из цветов карточки */
function face(f,c){const df=IMF[f.id==='biz'?'biz':f.id+'-'+c.id];if(df){const k=document.createElement('canvas');k.width=df.width;k.height=df.height;k.getContext('2d').drawImage(df,0,0);return k}if(f.fit&&IM[c.id]){const im=IM[c.id],k=document.createElement('canvas');k.width=im.width;k.height=im.height;k.getContext('2d').drawImage(im,0,0);return k}const w=1024,h=Math.round(w*f.h/f.w),k=document.createElement('canvas');k.width=w;k.height=h;const x=k.getContext('2d'),im=IM[c.id],L=w/h>1.2;x.textBaseline='top';
if(f.id==='biz'){x.fillStyle='#efede3';x.fillRect(0,0,w,h);x.fillStyle='#302f2c';x.fillRect(0,0,w*.025,h);const m=h,p=w*.08;x.font='700 '+m*.1+'px '+FONT;x.fillText('Название компании',p,h*.12);x.globalAlpha=.55;x.font='500 '+m*.05+'px '+FONT;x.fillText('Чем занимается компания',p,h*.12+m*.13);x.globalAlpha=1;x.font='600 '+m*.065+'px '+FONT;x.fillText('Имя Фамилия',p,h*.52);x.globalAlpha=.6;x.font='500 '+m*.048+'px '+FONT;x.fillText('Должность',p,h*.52+m*.09);x.fillText('+7 000 000-00-00',p,h*.74);x.fillText('company.ru',p,h*.74+m*.07);x.globalAlpha=1;nfc(x,w-m*.2,h-m*.2,m*.12,'#302f2c');return k}
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
S.set=(id,c)=>{const f=F.find(x=>x.id===id),g=objs[id],u=g.userData,key=id+'|'+(c.id||'')+'|'+ver;let e=S.cache[key];
if(!e){const df=IMF[f.id==='biz'?'biz':f.id+'-'+c.id],im=df||(f.fit&&IM[c.id]),a=im?im.width/im.height:f.w/f.h,W=a>=1?1.5:1.5*a,H=a>=1?1.5/a:1.5,t=new THREE.CanvasTexture(face(f,c));t.encoding=THREE.sRGBEncoding;t.anisotropy=4;t.repeat.set(1/W,1/H);t.offset.set(.5,.5);e=S.cache[key]={t,W,H,geo:slab(W,H,f.t,0,f.bv)}}
u.body.geometry=e.geo;u.W=e.W;u.H=e.H;if(u.base){u.base.position.y=-e.H/2+.08;u.base.scale.x=e.W/1.2}
u.cap.map=e.t;u.cap.needsUpdate=true;if(id==='card'&&c.c)u.sd.color.set(c.c).multiplyScalar(1.6);if(S.cur!==g){S.cur=g;u.sp=RM?0:-1.3}if(RM)S.f(0)};
S.f=t=>{S.t=t;const k=RM?0:1,tx=S.on?S.py*.5:Math.sin(t/1400)*.08*k,ty=S.on?S.px*.65:Math.sin(t/1800)*.18*k;rx+=(tx-rx)*.08;ry+=(ty-ry)*.08;
const gv=n=>parseFloat(cv.style.getPropertyValue(n)),gx=(gv('--gx')||0)*Math.PI/180,gy=(gv('--gy')||0)*Math.PI/180,gs=gv('--gs')||1;
Object.values(objs).forEach(g=>{const u=g.userData;u.s+=((g===S.cur?1:0)-u.s)*(RM?1:.14);u.sp*=.9;g.visible=u.s>.01;g.scale.setScalar(Math.max(.001,u.s)*gs);g.rotation.set(rx+gx,ry+gy+u.sp,0)});
pl.position.x+=((S.on?S.px*1.6:Math.sin(t/1600)*.9)-pl.position.x)*.1;pl.position.y+=((S.on?-S.py*1.6:Math.cos(t/2100)*.6)-pl.position.y)*.1;R.render(sc,cam)};
new ResizeObserver(size).observe(cv);size();V.push(S);return S}
/* первый экран: чипы форматов и смена модели */
const fch=$('#fch'),hs=i=>{hi=i;fch.querySelectorAll('button').forEach((b,j)=>b.setAttribute('aria-selected',j==i));hero&&hero.set(F[i].id,F[i].id==='biz'?{}:byId(F[i].demo))},
auto=()=>{clearInterval(iv);if(!RM)iv=setInterval(()=>hs((hi+1)%F.length),3800)};
F.forEach((f,i)=>{const b=document.createElement('button');b.role='tab';b.textContent=f.k;b.onclick=()=>{hs(i);clearInterval(iv);clearTimeout(tm);tm=setTimeout(auto,9000)};fch.append(b)});hs(0);
/* связка формат x содержание */
const ft=$('#ftabs');F.forEach((f,i)=>{const b=document.createElement('button');b.role='tab';b.textContent=f.k;b.onclick=()=>{fi=i;gBuild();upd()};ft.append(b)});
function upd(){const f=F[fi];ft.querySelectorAll('button').forEach((b,j)=>b.setAttribute('aria-selected',j==fi));const biz=f.id==='biz',tb=$('#tabs');tb.hidden=biz;tb.previousElementSibling.hidden=biz;
if(biz){if(!saved)saved=[$('#sw-h').textContent,$('#sw-p').textContent,$('#sw-o').textContent];$('#sw-h').textContent='Визитка вашей компании';$('#sw-p').textContent='Обычная визитка с NFC-чипом: коснулись телефоном, и открылись сайт, соцсети или запись.';$('#sw-o').textContent='Оформление и ссылка под вашу компанию.'}
else if(saved){$('#sw-h').textContent=saved[0];$('#sw-p').textContent=saved[1];$('#sw-o').textContent=saved[2];saved=null}
combo&&combo.set(f.id,biz?{}:C[ci])}
/* галерея под моделью: 3D, фото 1-3, снова 3D */
const gp=$('#gp'),gd=$('#gd');let gi=0;
function gShow(){[...gp.children].forEach((d,i)=>d.hidden=i!==gi-1);gp.classList.toggle('on',gi>0);[...gd.children].forEach((b,i)=>b.setAttribute('aria-current',i==gi));if(combo)combo.hold=gi>0;const cv=$('#sw');if(cv)cv.style.opacity=gi>0?0:1}
function gBuild(){const f=F[fi],ph=[1,2,3].map(n=>'images/photos/'+(f.id==='biz'?'biz-':f.id+'-'+C[ci].id+'-')+n+'.jpg');gp.innerHTML='';gd.innerHTML='';
ph.forEach((s,i)=>{const d=document.createElement('div');d.className='gs';d.hidden=true;const im=new Image();im.alt=f.h+', фото '+(i+1);im.onload=()=>d.classList.add('ok');im.onerror=()=>im.remove();im.src=s;d.append(im);gp.append(d)});
['3D'].concat(ph.map((_,i)=>'Фото '+(i+1))).forEach((t,i)=>{const b=document.createElement('button');b.textContent=t;b.onclick=()=>{gi=i;gShow()};gd.append(b)});gi=0;gShow()}
window.gal=d=>{const n=4;gi=(gi+d+n)%n;gShow()};
window.swSet=i=>{ci=i;gBuild();upd()};gBuild();upd();
/* 3D запускается, когда загружены шрифты и картинки */
/* 3D запускается сразу, как загружена картинка первого экрана; остальное подгружается позже, камера второго блока создаётся при подходе к нему */
const heroC=byId(F[0].demo),refresh=()=>{ver++;V.forEach(s=>s.clear&&s.clear());hs(hi);upd()};
Promise.all([load(heroC),lf(F[0],heroC)]).then(()=>{if(!window.THREE)return;
hero=View($('#ht'),{zone:document.querySelector('.hero')});hs(hi);auto();
const io=new IntersectionObserver(es=>es.forEach(e=>{const s=V.find(v=>v.cv===e.target);if(s)s.vis=e.isIntersecting}));if(hero.cv)io.observe(hero.cv);
const cio=new IntersectionObserver((es,o)=>{if(es.some(e=>e.isIntersecting)){o.disconnect();combo=View($('#sw'),{});io.observe(combo.cv);upd()}},{rootMargin:'600px'});cio.observe($('#sw'));
setTimeout(()=>Promise.all(C.filter(c=>c!==heroC).map(load).concat(mkFL())).then(refresh),500);
document.fonts.ready.then(refresh);
if(!RM)(function L(t){V.forEach(s=>s.vis&&!s.hold&&s.f&&s.f(t));requestAnimationFrame(L)})(0)});
})();
