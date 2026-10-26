// NODO: a continuous, visitor-controlled brand composition. Native scrolling stays intact.
import * as THREE from 'three';
import {RoomEnvironment} from './assets/RoomEnvironment.js';
const section=document.querySelector('.motion-story');
const clamp=(x,a=0,b=1)=>Math.max(a,Math.min(b,x));
const smooth=x=>{x=clamp(x);return x*x*(3-2*x)};
let paused=document.body.classList.contains('motion-off');
const slider=section.querySelector('#story-slider');
let target=0,progress=0,frame=0,last=0,active=false;
const captions=[['01 / EL ORIGEN','Dos formas.','Una intención.'],['02 / EL SISTEMA','Una identidad.','Infinitas formas.'],['03 / LA CONEXIÓN','Todo vuelve','a conectar.']];
const title=section.querySelector('h2'),label=section.querySelector('.story-label');
const steps=[...section.querySelectorAll('.story-step')];
let chapter=-1;
function measure(){target=clamp(Number(slider.value)/100);slider.style.setProperty('--fill',slider.value+'%');slider.setAttribute('aria-valuetext',(target<.28?'Origen':target<.72?'Sistema':'Conexión')+', '+slider.value+' por ciento');}
function caption(){const n=progress<.28?0:progress<.72?1:2;if(n===chapter)return;chapter=n;title.innerHTML=captions[n][1]+'<br><em>'+captions[n][2]+'</em>';label.textContent=captions[n][0];steps.forEach((s,i)=>s.classList.toggle('current',i===n));if(!paused)title.animate([{opacity:0,transform:'translateY(18px)',filter:'blur(6px)'},{opacity:1,transform:'translateY(0)',filter:'blur(0)'}],{duration:650,easing:'cubic-bezier(.16,1,.3,1)'});}
let render=()=>{};
try{
 const canvas=section.querySelector('canvas');
 const renderer=new THREE.WebGLRenderer({canvas,alpha:true,antialias:true,powerPreference:'low-power'});
 renderer.setPixelRatio(Math.min(devicePixelRatio,1.5));renderer.outputColorSpace=THREE.SRGBColorSpace;renderer.toneMapping=THREE.ACESFilmicToneMapping;renderer.toneMappingExposure=1.15;
 const scene=new THREE.Scene(),camera=new THREE.PerspectiveCamera(38,1,.1,80);camera.position.z=9;
 const pmrem=new THREE.PMREMGenerator(renderer),room=new RoomEnvironment(),env=pmrem.fromScene(room,.04);scene.environment=env.texture;room.dispose();pmrem.dispose();
 const light=new THREE.DirectionalLight(0xffe4cc,3);light.position.set(-4,5,7);scene.add(light,new THREE.AmbientLight(0xffffff,1.6));
 const shape=new THREE.Shape(),X=x=>(x-72)/50,Y=y=>(72-y)/50;
 shape.moveTo(X(93),Y(10));shape.lineTo(X(62),Y(10));shape.bezierCurveTo(X(30),Y(10),X(10),Y(30),X(10),Y(62));shape.lineTo(X(10),Y(112));shape.lineTo(X(42),Y(112));shape.lineTo(X(42),Y(64));shape.bezierCurveTo(X(42),Y(50),X(50),Y(42),X(64),Y(42));shape.lineTo(X(93),Y(42));shape.closePath();
 const geometry=new THREE.ExtrudeGeometry(shape,{depth:.3,bevelEnabled:true,bevelThickness:.06,bevelSize:.045,bevelSegments:4,curveSegments:28});geometry.translate(0,0,-.15);
 const copper=new THREE.MeshPhysicalMaterial({color:0xb77a58,metalness:.8,roughness:.24,clearcoat:.7});
 const ivory=new THREE.MeshPhysicalMaterial({color:0xf3f0e8,metalness:.25,roughness:.28,clearcoat:.4});
 const whole=new THREE.Group();scene.add(whole);const pairs=[];
 for(let i=0;i<9;i++){const group=new THREE.Group(),a=new THREE.Mesh(geometry,copper),b=new THREE.Mesh(geometry,ivory);b.rotation.z=Math.PI;group.add(a,b);whole.add(group);pairs.push({group,a,b});}
 function resize(){const box=canvas.getBoundingClientRect();renderer.setSize(box.width,box.height,false);camera.aspect=box.width/box.height;camera.updateProjectionMatrix();render();}
 render=()=>{
  const spread=smooth((progress-.12)/.33)*(1-smooth((progress-.68)/.29));
  const turn=smooth(progress)*Math.PI*2;
  whole.rotation.set(.12,Math.sin(progress*Math.PI)*.35,Math.sin(progress*Math.PI)*.3);
  whole.scale.setScalar(innerWidth>700?.8:.55);
  whole.position.x=innerWidth>700?1.9:0;
  whole.position.y=innerWidth>700?-.35:-.6;
  pairs.forEach(({group,a,b},i)=>{
   if(i===0){group.scale.setScalar(1-spread*.45);group.rotation.set(.15,-.35+turn,-.2);group.position.set(0,0,0);}
   else{const angle=(i-1)/8*Math.PI*2+turn*.32;const radius=1.95*spread;group.position.set(Math.cos(angle)*radius,Math.sin(angle)*radius,Math.sin(angle*2+turn)*spread*.5);group.scale.setScalar(spread*.38);group.rotation.set(Math.sin(angle)*.35,angle+turn,angle*.5);}
   const open=Math.sin(progress*Math.PI)*.5;
   a.position.set(-open,open*.6,open*.3);b.position.set(open,-open*.6,-open*.3);
  });
  renderer.render(scene,camera);
 };
 new ResizeObserver(resize).observe(canvas);resize();section.classList.add('story-ready');
}catch{section.classList.add('story-static');}
function tick(now){frame=0;if(document.hidden||!active)return;const dt=Math.min((now-last)/1000,.05)||.016;last=now;const ease=1-Math.exp(-dt*7);progress=paused?target:progress+(target-progress)*ease;caption();section.style.setProperty('--journey',progress);render();if(!paused&&Math.abs(target-progress)>.0001)frame=requestAnimationFrame(tick);}
function start(){if(!frame&&active&&!document.hidden){last=performance.now();frame=requestAnimationFrame(tick);}}
slider.addEventListener('input',()=>{measure();start()});

new IntersectionObserver(([e])=>{active=e.isIntersecting;if(active)start();else{cancelAnimationFrame(frame);frame=0;}},{rootMargin:'50px'}).observe(section);
addEventListener('nodo-motion',e=>{paused=e.detail.paused;measure();start()});document.addEventListener('visibilitychange',start);measure();caption();

// Spring-like magnetic feedback; touch and reduced motion retain stationary controls.
const fine=matchMedia('(pointer:fine)').matches;
if(fine){document.querySelectorAll('.nav-contact,.contact-circle,.round-link .circle,.story-link').forEach(el=>{
 el.addEventListener('pointermove',e=>{if(paused)return;const b=el.getBoundingClientRect();el.style.translate=`${(e.clientX-b.left-b.width/2)*.2}px ${(e.clientY-b.top-b.height/2)*.2}px`;});el.addEventListener('pointerleave',()=>el.style.translate='0 0');
 });
 document.querySelectorAll('.lab,.process-card').forEach(el=>{el.addEventListener('pointermove',e=>{if(paused)return;const b=el.getBoundingClientRect();el.style.setProperty('--rx',((e.clientY-b.top)/b.height-.5)*-3+'deg');el.style.setProperty('--ry',((e.clientX-b.left)/b.width-.5)*4+'deg');el.style.setProperty('--light-x',(e.clientX-b.left)/b.width*100+'%');el.style.setProperty('--light-y',(e.clientY-b.top)/b.height*100+'%');});el.addEventListener('pointerleave',()=>{el.style.setProperty('--rx','0deg');el.style.setProperty('--ry','0deg');});});
}
document.querySelectorAll('.lab-tabs button').forEach(btn=>btn.addEventListener('click',()=>{if(paused)return;const panel=document.querySelector('#panel-'+btn.dataset.panel);panel.animate([{opacity:0,transform:'translateY(30px) scale(.96)',filter:'blur(7px)'},{opacity:1,transform:'translateY(0) scale(1)',filter:'blur(0)'}],{duration:700,easing:'cubic-bezier(.16,1,.3,1)'});}));
