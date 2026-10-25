const $=s=>document.querySelector(s),RM=matchMedia('(prefers-reduced-motion:reduce)').matches;
const hd=$('#hd');addEventListener('scroll',()=>hd.classList.toggle('s',scrollY>8),{passive:true});
const nv=$('#nv'),bg=$('#bg');bg.onclick=()=>bg.setAttribute('aria-expanded',nv.classList.toggle('o'));
nv.querySelectorAll('a').forEach(a=>a.onclick=()=>{nv.classList.remove('o');bg.setAttribute('aria-expanded','false')});
/* products */
const P=window.CARDS;
const tb=$('#tabs');let cur=0,dir=1;
function show(i,f){cur=i;const x=P[i],t=$('#sw-txt');
tb.querySelectorAll('button').forEach((b,j)=>b.setAttribute('aria-selected',j==i));
const apply=()=>{$('#sw-h').textContent=x.h;$('#sw-p').textContent=x.p;$('#sw-o').textContent=x.o;t.style.opacity=1};if(window.swSet)swSet(i);
f?apply():(t.style.opacity=0,setTimeout(apply,150))}
P.forEach((x,i)=>{const b=document.createElement('button');b.role='tab';b.textContent=x.k;b.onclick=()=>show(i);tb.append(b)});show(0,1);
/* water */
(function(){const cv=$('#water'),gl=cv.getContext('webgl',{antialias:false,alpha:true});
const fb=()=>{cv.style.background='linear-gradient(180deg,transparent,#33322e 60%,#1f1e1c)'};
if(!gl||(navigator.hardwareConcurrency||4)<3){fb();return}
const vs='attribute vec2 p;void main(){gl_Position=vec4(p,0.,1.);}';
const fs=`precision mediump float;uniform vec2 r;uniform float t;uniform vec3 rp[4];
float h(vec2 u){float v=0.;v+=sin(u.x*9.+t*.7+sin(u.y*5.+t*.4))*.5;v+=sin(u.y*14.-t*.9+u.x*3.)*.3;v+=sin((u.x+u.y)*22.+t*1.3)*.12;
for(int i=0;i<4;i++){float a=t-rp[i].z;if(a>0.&&a<4.){float d=distance(u,rp[i].xy);float w=a*.35;v+=sin((d-w)*60.)*exp(-a*1.4)*exp(-abs(d-w)*14.)*2.;}}return v;}
void main(){vec2 uv=gl_FragCoord.xy/r;uv.x*=r.x/r.y;float e=.004;float c=h(uv);
vec3 n=normalize(vec3((h(uv+vec2(e,0.))-c)/e*.07,(h(uv+vec2(0.,e))-c)/e*.07,1.));
vec3 base=mix(vec3(.08,.078,.072),vec3(.2,.195,.183),uv.y);
float s=pow(max(dot(n,normalize(vec3(-.4,.6,.7))),0.),28.);
float f=.5+n.x*1.2+n.y*.9;base=mix(base,vec3(.62,.6,.5),clamp(f,0.,1.)*.55);
gl_FragColor=vec4(base+vec3(s*.45),1.);}`;
const sh=(t,s)=>{const o=gl.createShader(t);gl.shaderSource(o,s);gl.compileShader(o);return o};
const pr=gl.createProgram();gl.attachShader(pr,sh(gl.VERTEX_SHADER,vs));gl.attachShader(pr,sh(gl.FRAGMENT_SHADER,fs));gl.linkProgram(pr);
if(!gl.getProgramParameter(pr,gl.LINK_STATUS)){fb();return}
gl.useProgram(pr);const bf=gl.createBuffer();gl.bindBuffer(gl.ARRAY_BUFFER,bf);gl.bufferData(gl.ARRAY_BUFFER,new Float32Array([-1,-1,3,-1,-1,3]),gl.STATIC_DRAW);
const lp=gl.getAttribLocation(pr,'p');gl.enableVertexAttribArray(lp);gl.vertexAttribPointer(lp,2,gl.FLOAT,false,0,0);
const U=n=>gl.getUniformLocation(pr,n),ur=U('r'),ut=U('t'),urp=U('rp');
const R=new Float32Array(12).fill(0);for(let i=0;i<4;i++)R[i*3+2]=-99;let ri=0,t0=performance.now(),lastM=0,vis=true,raf;
const sc=innerWidth<700?.4:.55;
function rs(){cv.width=Math.max(2,cv.clientWidth*sc|0);cv.height=Math.max(2,cv.clientHeight*sc|0);gl.viewport(0,0,cv.width,cv.height)}
function rip(cx,cy){const b=cv.getBoundingClientRect(),x=(cx-b.left)/b.width*(b.width/b.height),y=1-(cy-b.top)/b.height;R[ri*3]=x;R[ri*3+1]=y;R[ri*3+2]=(performance.now()-t0)/1000;ri=(ri+1)%4;if(RM&&!raf)draw()}
function draw(){const t=(performance.now()-t0)/1000;gl.uniform2f(ur,cv.width,cv.height);gl.uniform1f(ut,RM?0:t+10);gl.uniform3fv(urp,RM?new Float32Array(12).fill(0):R);gl.drawArrays(gl.TRIANGLES,0,3)}
function loop(){draw();raf=vis&&!RM?requestAnimationFrame(loop):0}
addEventListener('resize',()=>{rs();draw()});rs();
if(!RM)new IntersectionObserver(e=>{vis=e[0].isIntersecting;if(vis&&!raf)loop()}).observe(cv);
addEventListener('pointermove',e=>{const n=performance.now();if(RM||n-lastM<140)return;lastM=n;if(e.clientY<cv.getBoundingClientRect().bottom)rip(e.clientX,e.clientY)},{passive:true});
document.querySelectorAll('.btn').forEach(b=>b.addEventListener('pointerdown',e=>rip(e.clientX,e.clientY)));
loop();
})();
/* carousel, tilt, scroll scale, button fill, telegram */
const go=d=>{dir=d;show((cur+d+P.length)%P.length)};
$('#pv').onclick=()=>window.gal&&gal(-1);$('#nx').onclick=()=>window.gal&&gal(1);
let sx=null;const stg=document.querySelector('.stage');
stg.addEventListener('pointerdown',e=>sx=e.clientX);
stg.addEventListener('pointerup',e=>{if(sx!==null&&Math.abs(e.clientX-sx)>50)window.gal&&gal(e.clientX<sx?1:-1);sx=null});
document.querySelectorAll('.tab').forEach(el=>{const w=document.createElement('div');w.className='tw';el.before(w);w.append(el);
let tx=0,ty=0,tm=.5,tn=.5,ts=0,cx=0,cy=0,cm=.5,cn=.5,cs=0,raf=0,rc;
const L=(a,b,k)=>a+(b-a)*k;
const tick=()=>{cx=L(cx,tx,.12);cy=L(cy,ty,.12);cm=L(cm,tm,.18);cn=L(cn,tn,.18);cs=L(cs,ts,.1);
el.style.setProperty('--ry',cx.toFixed(2)+'deg');el.style.setProperty('--rx',cy.toFixed(2)+'deg');el.style.setProperty('--mx',(cm*100).toFixed(1)+'%');el.style.setProperty('--my',(cn*100).toFixed(1)+'%');el.style.setProperty('--sh',cs.toFixed(3));
raf=(Math.abs(cx-tx)+Math.abs(cy-ty)+Math.abs(cs-ts)>.02)?requestAnimationFrame(tick):0};
const kick=()=>{if(!raf)raf=requestAnimationFrame(tick)};
const mv=e=>{if(RM)return;const rc=w.getBoundingClientRect(),px=Math.min(1,Math.max(0,(e.clientX-rc.left)/rc.width)),py=Math.min(1,Math.max(0,(e.clientY-rc.top)/rc.height)),m=e.pointerType==='touch'?.5:1;tx=(px-.5)*56*m;ty=(.5-py)*56*m;tm=px;tn=py;ts=1;kick()};
const out=()=>{tx=ty=0;ts=0;tm=tn=.5;kick()};
w.addEventListener('pointermove',mv);w.addEventListener('pointerdown',mv);w.addEventListener('pointerleave',out);w.addEventListener('pointercancel',out);w.addEventListener('pointerup',e=>{if(e.pointerType==='touch')out()})});
const ht=$('#ht'),hero=document.querySelector('.hero');
if(window.gsap&&window.ScrollTrigger&&!RM){gsap.registerPlugin(ScrollTrigger);
const o={y:0,x:0,s:.97},ap=()=>{ht.style.setProperty('--gx',o.x+'deg');ht.style.setProperty('--gy',o.y+'deg');ht.style.setProperty('--gs',o.s)};ap();
const wide=matchMedia('(min-width:861px)').matches;
const tl=gsap.timeline({defaults:{ease:'power1.inOut'},scrollTrigger:wide?{trigger:ht,start:'top 85%',end:'bottom 10%',scrub:1}:{trigger:ht,start:'center center',end:'+=50%',scrub:1,pin:true,anticipatePin:1}});
tl.to(o,{s:1.03,duration:1,onUpdate:ap}).to(o,{y:-8,x:-6,duration:1,onUpdate:ap}).to(o,{y:8,x:6,duration:2,onUpdate:ap}).to(o,{y:0,x:0,duration:1,onUpdate:ap});
addEventListener('load',()=>ScrollTrigger.refresh())}else ht.style.setProperty('--gs',1);

const TG=(window.SITE||{}).telegram||'';const tg=$('#tg');
tg.onclick=e=>{if(!TG){e.preventDefault();$('#tgn').textContent='Ссылка на Telegram будет добавлена.'}else tg.href='https://t.me/'+TG};
/* 3D cards, three.js */
(function(){
const IT={hero:[P.find(c=>c.id===window.HERO)||P[0]],car:P};
function trim(im,doTrim){const M=1024,q=Math.min(1,M/Math.max(im.naturalWidth,im.naturalHeight)),w=Math.round(im.naturalWidth*q),h=Math.round(im.naturalHeight*q),k=document.createElement('canvas');k.width=w;k.height=h;const x=k.getContext('2d');x.drawImage(im,0,0,w,h);if(!doTrim)return k;
let d;try{d=x.getImageData(0,0,w,h).data}catch(e){return k}let x0=w,y0=h,x1=0,y1=0;
for(let j=0;j<h;j++)for(let i=0;i<w;i++){const p=(j*w+i)*4;if(d[p+3]<16||(d[p]>244&&d[p+1]>244&&d[p+2]>244))continue;if(i<x0)x0=i;if(i>x1)x1=i;if(j<y0)y0=j;if(j>y1)y1=j}
if(x1-x0<w*.3||y1-y0<h*.3)return k;const o=document.createElement('canvas');o.width=x1-x0+1;o.height=y1-y0+1;o.getContext('2d').drawImage(k,x0,y0,o.width,o.height,0,0,o.width,o.height);return o}
function load(c){return new Promise(res=>{if(!c.img||c._cv)return res();const im=new Image();im.onload=()=>{try{c._cv=trim(im,c.trim!==false);c.asp=c._cv.width/c._cv.height}catch(e){}res()};im.onerror=()=>res();im.src=c.img})}
function face(c){if(c._cv)return c._cv;const k=document.createElement('canvas');k.width=780;k.height=780;const x=k.getContext('2d'),g=x.createLinearGradient(0,0,780,780);g.addColorStop(0,c.a);g.addColorStop(1,c.c);x.fillStyle=g;x.fillRect(0,0,780,780);
const col=c.t||'#efede3';x.fillStyle=col;x.textBaseline='top';x.font='600 58px Manrope,system-ui,sans-serif';
let y=64,l='';c.b.split(' ').forEach(w=>{const n=l?l+' '+w:w;if(x.measureText(n).width>600&&l){x.fillText(l,56,y);y+=70;l=w}else l=n});x.fillText(l,56,y);
x.globalAlpha=.7;x.font='500 28px Manrope,system-ui,sans-serif';x.fillText(c.s,56,y+88);x.globalAlpha=1;
x.strokeStyle=col;x.lineWidth=12;x.lineCap='round';const cx=650,cy=650;x.beginPath();x.arc(cx,cy,9,0,7);x.fill();
[42,86].forEach(r=>{x.beginPath();x.arc(cx,cy,r,-.7,.7);x.stroke();x.beginPath();x.arc(cx,cy,r,Math.PI-.7,Math.PI+.7);x.stroke()});return k}
const all=[];
function build(cv,list,mode){
let R;try{R=new THREE.WebGLRenderer({canvas:cv,antialias:true,alpha:true})}catch(e){const x=cv.getContext('2d');if(x){const f=face(list[0]);cv.width=f.width;cv.height=f.height;x.drawImage(f,0,0)}return}
R.setPixelRatio(Math.min(devicePixelRatio,innerWidth<860?1.5:2));R.outputEncoding=THREE.sRGBEncoding;R.toneMapping=THREE.ACESFilmicToneMapping;
const pm=new THREE.PMREMGenerator(R),es=new THREE.Scene();
es.add(new THREE.Mesh(new THREE.SphereGeometry(10,24,12),new THREE.MeshBasicMaterial({color:0x1a1917,side:THREE.BackSide})));
[[-4,5,4,9,5,0xffffff],[6,1,-2,3,7,0xefede3],[0,-4,5,8,1.5,0x7d786a]].forEach(a=>{const m=new THREE.Mesh(new THREE.PlaneGeometry(a[3],a[4]),new THREE.MeshBasicMaterial({color:a[5],side:THREE.DoubleSide}));m.position.set(a[0],a[1],a[2]);m.lookAt(0,0,0);es.add(m)});
const sc=new THREE.Scene();sc.environment=pm.fromScene(es,.1).texture;
const dl=new THREE.DirectionalLight(0xffffff,.75);dl.position.set(-2,3,4);const pl=new THREE.PointLight(0xfff1de,.45,0,2);pl.position.set(0,0,2.4);sc.add(dl,pl,new THREE.AmbientLight(0xffffff,.4));
const T=.06,slab=(W,H)=>{const r=.1*Math.min(W,H),sh=new THREE.Shape();
sh.moveTo(-W/2+r,-H/2);sh.lineTo(W/2-r,-H/2);sh.quadraticCurveTo(W/2,-H/2,W/2,-H/2+r);sh.lineTo(W/2,H/2-r);sh.quadraticCurveTo(W/2,H/2,W/2-r,H/2);sh.lineTo(-W/2+r,H/2);sh.quadraticCurveTo(-W/2,H/2,-W/2,H/2-r);sh.lineTo(-W/2,-H/2+r);sh.quadraticCurveTo(-W/2,-H/2,-W/2+r,-H/2);
const g=new THREE.ExtrudeGeometry(sh,{depth:T,bevelEnabled:true,bevelThickness:.012,bevelSize:.012,bevelSegments:3,curveSegments:10});g.translate(0,0,-T/2);return g};
const ms=list.map(c=>{const fk=face(c),a=c.asp||1,W=a>=1?1:a,H=a>=1?1/a:1,t=new THREE.CanvasTexture(fk);t.encoding=THREE.sRGBEncoding;t.anisotropy=4;t.repeat.set(1/W,1/H);t.offset.set(.5,.5);
const im=!!c.img,cap=new THREE.MeshPhysicalMaterial({map:t,color:im?0xaaaaaa:0xffffff,roughness:im?.5:.42,metalness:.1,clearcoat:im?.8:1,clearcoatRoughness:.3,envMapIntensity:im?.5:2,toneMapped:!im});
const sd=new THREE.MeshStandardMaterial({color:new THREE.Color(c.c).multiplyScalar(1.6),roughness:.3,metalness:.6,envMapIntensity:2});
const m=new THREE.Mesh(slab(W,H),[cap,sd]);sc.add(m);return m});
const cam=new THREE.PerspectiveCamera(28,1,.1,50);
function size(){const w=cv.clientWidth,h=cv.clientHeight;if(!w||!h)return;R.setSize(w,h,false);cam.aspect=w/h;const a=w/h,nd=mode=='one'?[1.7,1.9]:mode=='fly'?(a<1.1?[1.7,1.6]:[2.9,1.45]):(a>1.3?[5.2,1.8]:[2.7,3.3]),t=Math.tan(14*Math.PI/180);cam.position.set(0,0,Math.max(nd[1]/2/t,nd[0]/2/(t*a)));cam.updateProjectionMatrix();S.f(S.t)}
const S={px:0,py:0,on:0,pos:0,tgt:0,vis:true,t:0};let rx=0,ry=0;
if(mode=='fly'){S.pos=S.tgt=cur;window.swSet=i=>{S.tgt=i}}
const zone=mode=='one'?(document.querySelector('.hero')||cv):cv;
zone.addEventListener('pointermove',e=>{if(RM)return;const b=cv.getBoundingClientRect(),tc=e.pointerType==='touch';let px,py;if(zone===cv){px=(e.clientX-b.left)/b.width*2-1;py=(e.clientY-b.top)/b.height*2-1}else{px=(e.clientX-b.left-b.width/2)/(b.width*.9);py=(e.clientY-b.top-b.height/2)/(b.height*.9)}S.px=Math.max(-1,Math.min(1,px))*(tc?.5:1);S.py=tc?0:Math.max(-1,Math.min(1,py));S.on=1});
['pointerleave','pointerup','pointercancel'].forEach(n=>zone.addEventListener(n,()=>S.on=0));
S.f=t=>{S.t=t;const k=RM?0:1,tx=S.on?S.py*.5:Math.sin(t/1400)*.08*k,ty=S.on?S.px*.65:Math.sin(t/1800)*.18*k;rx+=(tx-rx)*.08;ry+=(ty-ry)*.08;
const gx=(parseFloat(cv.style.getPropertyValue('--gx'))||0)*Math.PI/180,gy=(parseFloat(cv.style.getPropertyValue('--gy'))||0)*Math.PI/180,gs=parseFloat(cv.style.getPropertyValue('--gs'))||1,n=ms.length;
if(mode=='fly'){let dd=S.tgt-S.pos;dd-=n*Math.round(dd/n);S.pos+=dd*.1;S.pos=(S.pos+n)%n}
ms.forEach((m,i)=>{if(mode=='fly'){let d=i-S.pos;d-=n*Math.round(d/n);const w=Math.max(0,1-Math.abs(d)),ad=Math.abs(d);const three=cv.clientWidth/cv.clientHeight>=1.1,f=three?Math.max(0,Math.min(1,(1.7-ad)/.5)):1;m.position.set(d*(three?1.12:1.05),0,-ad*.9);m.rotation.set(rx*w,-d*.55+ry*w,0);m.scale.setScalar(Math.max(.001,(1-.1*ad)*f));m.visible=three?f>0:ad<2.3}
else if(mode=='one'){m.rotation.set(rx+gx,ry+gy,0);m.scale.setScalar(gs)}
else{const a=cv.clientWidth/cv.clientHeight,wide=a>1.3;m.position.set(wide?(i-1.5)*1.3:(i%2-.5)*1.3,wide?0:(.5-(i>>1))*1.5,0);m.rotation.set(rx*.8,ry*.8,0);m.scale.setScalar(.92)}});
const lx=S.on?S.px*1.6:Math.sin(t/1600)*.9,ly=S.on?-S.py*1.6:Math.cos(t/2100)*.6;pl.position.x+=(lx-pl.position.x)*.1;pl.position.y+=(ly-pl.position.y)*.1;
R.render(sc,cam)};
new ResizeObserver(size).observe(cv);cv._s=S;size();return S}
Promise.all([document.fonts.ready].concat(IT.hero.concat(IT.car).map(load))).then(()=>{if(!window.THREE)return;[].forEach(a=>{const c=$(a[0]);if(!c)return;const s=build(c,a[1],a[2]);if(s)all.push(s)});
const io=new IntersectionObserver(es=>es.forEach(e=>{if(e.target._s)e.target._s.vis=e.isIntersecting}));all.forEach(()=>0);['#ht','#sw'].forEach(s=>{const c=$(s);if(c&&c._s)io.observe(c)});
if(RM)all.forEach(s=>s.f(0));else(function L(t){all.forEach(s=>{if(s.vis)s.f(t)});requestAnimationFrame(L)})(0)});
})();
/* scroll reveal */
if(window.gsap&&window.ScrollTrigger&&!RM){
const els=gsap.utils.toArray('section .w>:not(.grid4):not(.steps):not(.ben):not(.sw),.grid4>*,.steps>*,.ben>li,.sw>*');
gsap.set(els,{opacity:0,y:28});
ScrollTrigger.batch(els,{start:'top 90%',onEnter:b=>gsap.to(b,{opacity:1,y:0,duration:.8,stagger:.1,ease:'power2.out',overwrite:true}),onLeaveBack:b=>gsap.to(b,{opacity:0,y:28,duration:.35,overwrite:true})})}

/* video from images/demo.mp4 */
(function(){const v=$('#vid'),b=$('#vbox');if(!v)return;const ok=()=>{if(!v.videoWidth)return;b.style.setProperty('--ar',v.videoWidth/v.videoHeight);b.style.aspectRatio=v.videoWidth+'/'+v.videoHeight;b.classList.add('ok')};v.addEventListener('loadedmetadata',ok);if(v.readyState>=1)ok()})();
