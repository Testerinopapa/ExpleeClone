;!function(){try { var e="undefined"!=typeof globalThis?globalThis:"undefined"!=typeof global?global:"undefined"!=typeof window?window:"undefined"!=typeof self?self:{},n=(new e.Error).stack;n&&((e._debugIds|| (e._debugIds={}))[n]="423f92dd-dc9a-5a89-58ae-dce8414da8e8")}catch(e){}}();
(globalThis.TURBOPACK||(globalThis.TURBOPACK=[])).push(["object"==typeof document?document.currentScript:void 0,118620,265474,e=>{"use strict";var t=e.i(843476),i=e.i(271645);let r={numPaths:8,dotsPerPath:3,dotSize:1.5,dotPrimaryColor:"#10b981",dotSecondaryColor:"#252525",primaryDotRatio:.25,pathColor:"rgba(255, 255, 255, 0.24)",startSpread:1,finishSpread:.04,curvature:.5,speed:.5,curveType:"s-curve"};function n(e,t){let i=1-e,r=i*i,n=r*i,o=e*e,a=o*e;return{x:n*t.p0.x+3*r*e*t.p1.x+3*i*o*t.p2.x+a*t.p3.x,y:n*t.p0.y+3*r*e*t.p1.y+3*i*o*t.p2.y+a*t.p3.y}}function o(e){let t=new Float64Array(65),i=e.p0;for(let r=1;r<=64;r++){let o=n(r/64,e),a=o.x-i.x,l=o.y-i.y;t[r]=t[r-1]+Math.sqrt(a*a+l*l),i=o}let r=t[64];if(r>0)for(let e=1;e<=64;e++)t[e]/=r;return{lut:t,totalLength:r}}function a(e,t,i,r,n,o){let a,l,s,u,c=(e-(t-1)/2)/((t-1)/2),d=o/2+o/2*c*r.startSpread,f=o/2+o/2*c*r.finishSpread,m=i?n:0,h=i?0:n,p=r.curvature,g=o/2;switch(r.curveType){case"inner-curve":{a=i?m-.33*n:m+.33*n,s=i?h+.33*n:h-.33*n;let e=d+(f-d)*.33,t=d+(f-d)*.67,r=p*o*.5;l=e+(g-e>0?1:-1)*r*Math.abs(c),u=t+(g-t>0?1:-1)*r*Math.abs(c);break}case"outer-curve":{a=i?m-.33*n:m+.33*n,s=i?h+.33*n:h-.33*n;let e=d+(f-d)*.33,t=d+(f-d)*.67,r=p*o*.5;l=e-(g-e>0?1:-1)*r*Math.abs(c),u=t-(g-t>0?1:-1)*r*Math.abs(c);break}default:a=i?m-n*p:m+n*p,l=d,s=i?h+n*p:h-n*p,u=f}return{p0:{x:m,y:d},p1:{x:a,y:l},p2:{x:s,y:u},p3:{x:h,y:f}}}function l(e){let t=1e4*Math.sin(9999*e);return t-Math.floor(t)}e.s(["Flow",0,function({width:e=400,height:s=500,config:u,speedRef:c,curvatureRef:d,preserveAspectRatio:f="xMaxYMid meet",paused:m=!1}={}){let[h,p]=(0,i.useState)(!1),[g]=(0,i.useState)(()=>1e3*Math.random()),v=(0,i.useRef)(null),_=(0,i.useRef)(null),y=(0,i.useRef)([]),b=(0,i.useRef)([]),x=(0,i.useRef)(null),w=(0,i.useRef)(null),S=(0,i.useRef)({displayW:0,displayH:0}),C=(0,i.useRef)(m);C.current=m;let R={...r,...u},P=(0,i.useRef)(R);P.current=R;let E=(0,i.useRef)({width:e,height:s,preserveAspectRatio:f});E.current={width:e,height:s,preserveAspectRatio:f};let T=(0,i.useRef)(R.speed),q=c??T,A=(0,i.useRef)(R.curvature),M=(0,i.useRef)([]),O=(0,i.useRef)([]),L=(0,i.useRef)([]),U=(0,i.useMemo)(()=>{let t=[],i=[],r=[];for(let n=0;n<R.numPaths;n++){let l=a(n,R.numPaths,!1,R,e,s),{lut:u,totalLength:c}=o(l);t.push(l),i.push(u),r.push(c)}return{bezierPaths:t,arcLuts:i,arcLengths:r}},[R.numPaths,R.startSpread,R.finishSpread,R.curvature,R.curveType,e,s]);M.current=U.bezierPaths,O.current=U.arcLuts,L.current=U.arcLengths;let j=(0,i.useCallback)(()=>{let e=[];for(let t=0;t<R.numPaths;t++){let i=3+Math.abs(t-(R.numPaths-1)/2)/((R.numPaths-1)/2);for(let r=0;r<R.dotsPerPath;r++){let n=g+100*t+r,o=g+200*t+r+500,a=l(g+300*t+r+1e3)<R.primaryDotRatio,s=l(o),u=2*l(n);e.push({virtualTime:s*i*1e3,delayRemaining:1e3*u,initialFade:0,startOffset:s,delay:u,duration:i,color:a?R.dotPrimaryColor:R.dotSecondaryColor,pathIndex:t,isPrimary:a})}}return e},[R.numPaths,R.dotsPerPath,R.primaryDotRatio,R.dotPrimaryColor,R.dotSecondaryColor,g]),F=(0,i.useCallback)(()=>Array.from({length:R.numPaths},(e,t)=>({delay:.5*l(g+1e3*t),elapsed:0})),[R.numPaths,g]),z=(0,i.useRef)(()=>{}),I=(0,i.useCallback)(e=>{if(C.current){x.current=null,w.current=null;return}if(null===x.current){x.current=e,w.current=requestAnimationFrame(z.current);return}let t=e-x.current;x.current=e;let i=v.current;if(!i){w.current=requestAnimationFrame(z.current);return}_.current||(_.current=i.getContext("2d"));let r=_.current;if(!r){w.current=requestAnimationFrame(z.current);return}let{displayW:l,displayH:s}=S.current;if(0===l||0===s){w.current=requestAnimationFrame(z.current);return}let u=window.devicePixelRatio||1,c=Math.round(l*u),f=Math.round(s*u);(i.width!==c||i.height!==f)&&(i.width=c,i.height=f);let m=P.current,h=E.current,p=q.current,g=M.current,R=O.current,T=L.current,U=t/1e3,j=d?.current??m.curvature;if(j!==A.current){A.current=j;let e={...m,curvature:j};for(let t=0;t<g.length;t++){g[t]=a(t,e.numPaths,!1,e,h.width,h.height);let i=o(g[t]);R[t]=i.lut,T[t]=i.totalLength}}let{tx:F,ty:I,sx:N,sy:B}=function(e,t,i,r,n){if("none"===n)return{tx:0,ty:0,sx:e/i,sy:t/r};let o=Math.min(e/i,t/r),a=i*o,l=r*o,s=0,u=0;return n.includes("xMid")?s=(e-a)/2:n.includes("xMax")&&(s=e-a),n.includes("YMid")?u=(t-l)/2:n.includes("YMax")&&(u=t-l),{tx:s,ty:u,sx:o,sy:o}}(l,s,h.width,h.height,h.preserveAspectRatio);r.setTransform(1,0,0,1,0,0),r.clearRect(0,0,i.width,i.height),r.setTransform(N*u,0,0,B*u,F*u,I*u),r.lineWidth=1,r.lineCap="round",r.strokeStyle=m.pathColor,r.globalAlpha=.16;for(let e=0;e<g.length;e++){let t=g[e],i=b.current[e];if(!i)continue;i.elapsed+=U;let n=1-(1-Math.min(1,Math.max(0,i.elapsed-i.delay)/1.2))**3;n<=0||(n<1?r.setLineDash([n*T[e],T[e]]):r.setLineDash([]),r.beginPath(),r.moveTo(t.p0.x,t.p0.y),r.bezierCurveTo(t.p1.x,t.p1.y,t.p2.x,t.p2.y,t.p3.x,t.p3.y),r.stroke())}r.setLineDash([]),r.globalAlpha=1;let D=m.dotSize,k=2*D;for(let e=0;e<2;e++){let i=1===e;for(let e=0;e<y.current.length;e++){let o=y.current[e];if(o.isPrimary!==i)continue;let a=g[o.pathIndex],l=R[o.pathIndex];if(!a||!l)continue;if(o.delayRemaining>0){o.delayRemaining-=t;continue}o.initialFade<1&&(o.initialFade=Math.min(1,o.initialFade+t/300)),o.virtualTime+=t*p;let s=1e3*o.duration,u=o.virtualTime%s/s,c=1;if(u<.05?c=u/.05:u>.95&&(c=(1-u)/.05),(c*=o.initialFade)<=0)continue;let d=n(function(e,t){let i=e.length-1;if(t<=0)return 0;if(t>=1)return 1;let r=0,n=i;for(;r<n-1;){let i=r+n>>1;e[i]<t?r=i:n=i}let o=e[n]-e[r],a=o<1e-10?0:(t-e[r])/o;return(r+a)/i}(l,u),a);r.globalAlpha=c,r.fillStyle=o.color,r.fillRect(d.x-D,d.y-D,k,k)}}r.globalAlpha=1,w.current=requestAnimationFrame(z.current)},[q]);return(z.current=I,(0,i.useEffect)(()=>{p(!0)},[]),(0,i.useEffect)(()=>{if(!h)return;let e=v.current;if(!e)return;let t=()=>{let t=e.offsetWidth,i=e.offsetHeight,r=window.devicePixelRatio||1,n=Math.round(t*r),o=Math.round(i*r);e.width!==n&&(e.width=n),e.height!==o&&(e.height=o),S.current={displayW:t,displayH:i}},i=new ResizeObserver(t);return i.observe(e),t(),()=>i.disconnect()},[h]),(0,i.useEffect)(()=>{if(h)return y.current=j(),b.current=F(),C.current||(w.current=requestAnimationFrame(z.current)),()=>{w.current&&(cancelAnimationFrame(w.current),w.current=null)}},[h,j,F,I]),(0,i.useEffect)(()=>{h&&(m||w.current||(x.current=null,w.current=requestAnimationFrame(z.current)))},[m,h,I]),h)?(0,t.jsx)("canvas",{ref:v,className:"w-full h-full block"}):(0,t.jsx)("div",{className:"w-full h-full"})}],118620),e.s(["useIsMobile",0,function(e=768){let[t,r]=(0,i.useState)(!1),n=(0,i.useRef)(null);return(0,i.useEffect)(()=>{let t=()=>r(window.innerWidth<e);t();let i=()=>{n.current&&clearTimeout(n.current),n.current=setTimeout(t,150)};return window.addEventListener("resize",i),()=>{window.removeEventListener("resize",i),n.current&&clearTimeout(n.current)}},[e]),t}],265474)},300300,e=>{"use strict";var t=e.i(843476),i=e.i(271645);e.i(842033);var r=e.i(660032);let n=`<svg width="84" height="26" viewBox="0 0 84 26" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M0 13.1657C0 8.74971 2.63314 6.25371 6.528 6.25371C10.56 6.25371 13.1931 8.69486 13.1931 12.9189V13.7966H2.35886C2.44114 16.4571 3.84 18.4869 6.66514 18.4869C8.99657 18.4869 10.368 17.28 10.8343 15.3874H13.248C12.6994 17.9109 10.8891 20.4343 6.69257 20.4343C2.24914 20.4343 0 17.1977 0 13.1657ZM2.38629 12.0686H10.8069C10.6423 9.6 8.96914 8.17371 6.528 8.17371C4.27886 8.17371 2.57829 9.6 2.38629 12.0686Z" fill="white"/>
<path d="M13.6299 20.16L18.2379 13.3029L13.6299 6.528H16.4001L20.295 12.3703H20.7887L24.6836 6.528H27.4539L22.8733 13.3029L27.4539 20.16H24.6836L20.7887 14.3177H20.295L16.4001 20.16H13.6299Z" fill="white"/>
<path d="M29.4386 25.4811V6.528H31.8797V8.42057L31.4683 10.0389H32.154C32.73 7.92686 34.5129 6.25371 37.6397 6.25371C41.6169 6.25371 44.1129 9.29829 44.1129 13.3577C44.1129 17.3623 41.6169 20.4343 37.6397 20.4343C34.5129 20.4343 32.73 18.7337 32.154 16.6217H31.4683L31.8797 18.2674V25.4811H29.4386ZM31.8797 13.3577C31.8797 16.8686 34.1014 18.3497 36.8717 18.3497C39.6694 18.3497 41.6991 16.8137 41.6991 13.3577C41.6991 9.87428 39.6694 8.33828 36.8717 8.33828C34.1014 8.33828 31.8797 9.81943 31.8797 13.3577Z" fill="white"/>
<path d="M44.6959 20.16V18.0754H48.5085V2.08457H45.6559V0H49.5234C50.4285 0 50.9496 0.466285 50.9496 1.37143V18.0754H54.7622V20.16H44.6959Z" fill="white"/>
<path d="M55.5032 13.1657C55.5032 8.74971 58.1364 6.25371 62.0312 6.25371C66.0632 6.25371 68.6964 8.69486 68.6964 12.9189V13.7966H57.8621C57.9444 16.4571 59.3432 18.4869 62.1684 18.4869C64.4998 18.4869 65.8712 17.28 66.3375 15.3874H68.7512C68.2026 17.9109 66.3924 20.4343 62.1958 20.4343C57.7524 20.4343 55.5032 17.1977 55.5032 13.1657ZM57.8895 12.0686H66.3101C66.1455 9.6 64.4724 8.17371 62.0312 8.17371C59.7821 8.17371 58.0815 9.6 57.8895 12.0686Z" fill="white"/>
<path d="M70.7518 13.1657C70.7518 8.74971 73.3849 6.25371 77.2798 6.25371C81.3118 6.25371 83.9449 8.69486 83.9449 12.9189V13.7966H73.1106C73.1929 16.4571 74.5918 18.4869 77.4169 18.4869C79.7484 18.4869 81.1198 17.28 81.5861 15.3874H83.9998C83.4512 17.9109 81.6409 20.4343 77.4444 20.4343C73.0009 20.4343 70.7518 17.1977 70.7518 13.1657ZM73.1381 12.0686H81.5586C81.3941 9.6 79.7209 8.17371 77.2798 8.17371C75.0306 8.17371 73.3301 9.6 73.1381 12.0686Z" fill="white"/>
</svg>`,o=84/26,a={grid:{pixelSize:3,gap:1},animation:{accentPercent:24,speed:1},noise:{type:"Simplex",scale:.002,blend:.7},colors:{background:"transparent",defaultColor:"#ffffff",defaultOpacity:.04,accentColor:"#10b981"}};e.s(["WordmarkGrid",0,function(){let e=(0,i.useRef)(null),[l,s]=(0,i.useState)(null),[u,c]=(0,i.useState)(!1);return(0,i.useEffect)(()=>{let t=e.current;if(!t)return;let i=new IntersectionObserver(e=>{e.forEach(e=>c(e.isIntersecting))},{rootMargin:"200px"});return i.observe(t),()=>i.disconnect()},[]),(0,i.useEffect)(()=>{let t=e.current;if(!t)return;let i=new ResizeObserver(e=>{for(let t of e){let e=Math.round(t.contentRect.width);e>0&&s({width:e,height:Math.round(e/o)})}});return i.observe(t),()=>i.disconnect()},[]),(0,t.jsx)("div",{ref:e,className:"wordmark-grid-wrap",children:l&&u&&(0,t.jsx)(r.SVGGridRenderer,{svg:n,width:l.width,height:l.height,settings:a})})}])},90155,e=>{e.v({enter:"logos-carousel-module__Psif5a__enter",exit:"logos-carousel-module__Psif5a__exit",logo:"logos-carousel-module__Psif5a__logo",logoRow:"logos-carousel-module__Psif5a__logoRow",root:"logos-carousel-module__Psif5a__root"})},723860,e=>{"use strict";var t=e.i(843476),i=e.i(271645),r=e.i(657688),n=e.i(90155);function o({children:e,animate:i,index:r,state:a,stagger:l=.1}){return(0,t.jsx)("div",{className:n.default.logo,"data-state":a,"data-animate":i,style:{"--delay":`${r*l}s`},children:e})}e.s(["LogosCarousel",0,function({logos:e,visibleCount:a=4,stagger:l=.1,interval:s=3e3}){let[u,c]=i.useState(0),[d,f]=i.useState(!1),m=i.useMemo(()=>{let t=[];for(let i=0;i<e.length;i+=a)t.push(e.slice(i,i+a));return t},[e,a]),h=m[u]||[],p=m[(u+1)%m.length]||[];return i.useEffect(()=>{let e=setTimeout(()=>{f(!0)},500);return()=>{clearTimeout(e)}},[]),i.useEffect(()=>{if(!d||m.length<=1)return;let e=setInterval(()=>{c(e=>(e+1)%m.length)},s);return()=>{clearInterval(e)}},[d,m.length,s]),(0,t.jsxs)("div",{className:n.default.root,children:[(0,t.jsx)("div",{className:n.default.logoRow,children:h.map((e,i)=>(0,t.jsx)(o,{state:"exit",animate:d,index:i,stagger:l,children:(0,t.jsx)(r.default,{src:e.src,alt:e.alt,width:224,height:64,className:"max-h-16 w-auto object-contain"})},`${e.alt}-${i}`))},`${u}-exit`),d&&(0,t.jsx)("div",{className:n.default.logoRow,children:p.map((e,i)=>(0,t.jsx)(o,{state:"enter",animate:d,index:i,stagger:l,children:(0,t.jsx)(r.default,{src:e.src,alt:e.alt,width:224,height:64,className:"max-h-16 w-auto object-contain"})},`${e.alt}-${i}`))},`${u}-enter`)]})}])},842033,660032,e=>{"use strict";var t=e.i(843476),i=e.i(271645);let r=`
  attribute vec2 a_position;
  attribute vec2 a_texCoord;
  varying vec2 v_texCoord;
  
  void main() {
    gl_Position = vec4(a_position, 0.0, 1.0);
    v_texCoord = a_texCoord;
  }
`,n=`
  precision highp float;
  
  uniform sampler2D u_mask;
  uniform vec2 u_resolution;
  uniform float u_pixelSize;
  uniform float u_gap;
  uniform float u_time;
  uniform float u_speed;
  uniform float u_accentPercent;
  uniform vec3 u_defaultColor;
  uniform vec3 u_accentColor;
  uniform float u_defaultOpacity;
  uniform vec2 u_gridOffset;
  uniform vec2 u_gridSize;
  
  // Noise parameters
  uniform int u_noiseType;      // 0=Value, 1=Perlin, 2=Simplex, 3=Worley, 4=FBM, 5=Random
  uniform float u_noiseScale;   // Frequency/size of noise
  uniform int u_octaves;        // FBM octaves
  uniform float u_persistence;  // FBM amplitude falloff
  uniform float u_lacunarity;   // FBM frequency multiplier
  uniform float u_noiseBlend;   // Blend between static hash and animated noise
  
  // Inner-shadow parameters
  uniform int u_innerShadow;        // 0 = off, 1 = on
  uniform vec2 u_shadowOffset;      // offset in cell units
  
  // Liquid/smoke parameters
  uniform int u_liquidMode;          // 0 = off, 1 = on
  uniform int u_liquidBlobCount;     // number of metaball blobs (1-8)
  uniform float u_liquidRadius;      // blob influence radius
  uniform float u_liquidSmoothness;  // edge dither width (per-cell jitter on threshold)
  uniform float u_liquidThreshold;   // isosurface threshold
  uniform float u_liquidBlend;       // 0 = pure liquid shape, 1 = dissolved into static random
  uniform float u_liquidSpeed;       // animation speed multiplier for blob movement
  uniform float u_liquidMatterState; // 0=solid, 0.5=liquid, 1=gas
  
  varying vec2 v_texCoord;
  
  // ============ Hash Functions ============
  
  float hash(vec2 p) {
    return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
  }
  
  vec2 hash2(vec2 p) {
    p = vec2(dot(p, vec2(127.1, 311.7)), dot(p, vec2(269.5, 183.3)));
    return fract(sin(p) * 43758.5453);
  }
  
  // ============ Value Noise ============
  
  float valueNoise(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);
    f = f * f * (3.0 - 2.0 * f); // Smoothstep
    
    float a = hash(i);
    float b = hash(i + vec2(1.0, 0.0));
    float c = hash(i + vec2(0.0, 1.0));
    float d = hash(i + vec2(1.0, 1.0));
    
    return mix(mix(a, b, f.x), mix(c, d, f.x), f.y);
  }
  
  // ============ Perlin Noise ============
  
  vec2 grad(vec2 p) {
    float angle = hash(p) * 6.28318530718;
    return vec2(cos(angle), sin(angle));
  }
  
  float perlinNoise(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);
    vec2 u = f * f * (3.0 - 2.0 * f);
    
    float a = dot(grad(i), f);
    float b = dot(grad(i + vec2(1.0, 0.0)), f - vec2(1.0, 0.0));
    float c = dot(grad(i + vec2(0.0, 1.0)), f - vec2(0.0, 1.0));
    float d = dot(grad(i + vec2(1.0, 1.0)), f - vec2(1.0, 1.0));
    
    return mix(mix(a, b, u.x), mix(c, d, u.x), u.y) * 0.5 + 0.5;
  }
  
  // ============ Simplex Noise ============
  
  vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
  vec2 mod289v2(vec2 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
  vec3 permute(vec3 x) { return mod289(((x * 34.0) + 1.0) * x); }
  
  float simplexNoise(vec2 v) {
    const vec4 C = vec4(0.211324865405187, 0.366025403784439,
                        -0.577350269189626, 0.024390243902439);
    vec2 i = floor(v + dot(v, C.yy));
    vec2 x0 = v - i + dot(i, C.xx);
    vec2 i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
    vec4 x12 = x0.xyxy + C.xxzz;
    x12.xy -= i1;
    i = mod289v2(i);
    vec3 p = permute(permute(i.y + vec3(0.0, i1.y, 1.0)) + i.x + vec3(0.0, i1.x, 1.0));
    vec3 m = max(0.5 - vec3(dot(x0, x0), dot(x12.xy, x12.xy), dot(x12.zw, x12.zw)), 0.0);
    m = m * m;
    m = m * m;
    vec3 x = 2.0 * fract(p * C.www) - 1.0;
    vec3 h = abs(x) - 0.5;
    vec3 ox = floor(x + 0.5);
    vec3 a0 = x - ox;
    m *= 1.79284291400159 - 0.85373472095314 * (a0 * a0 + h * h);
    vec3 g;
    g.x = a0.x * x0.x + h.x * x0.y;
    g.yz = a0.yz * x12.xz + h.yz * x12.yw;
    return 130.0 * dot(m, g) * 0.5 + 0.5;
  }
  
  // ============ Worley (Cellular) Noise ============
  
  float worleyNoise(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);
    
    float minDist = 1.0;
    
    for (int y = -1; y <= 1; y++) {
      for (int x = -1; x <= 1; x++) {
        vec2 neighbor = vec2(float(x), float(y));
        vec2 point = hash2(i + neighbor);
        vec2 diff = neighbor + point - f;
        float dist = length(diff);
        minDist = min(minDist, dist);
      }
    }
    
    return minDist;
  }
  
  // ============ FBM (Fractal Brownian Motion) ============
  
  float fbm(vec2 p, int octaves, float persistence, float lacunarity) {
    float value = 0.0;
    float amplitude = 1.0;
    float frequency = 1.0;
    float maxValue = 0.0;
    
    for (int i = 0; i < 8; i++) {
      if (i >= octaves) break;
      value += amplitude * valueNoise(p * frequency);
      maxValue += amplitude;
      amplitude *= persistence;
      frequency *= lacunarity;
    }
    
    return value / maxValue;
  }
  
  // ============ Noise Dispatcher ============
  
  float getNoise(vec2 p, int noiseType, int octaves, float persistence, float lacunarity) {
    if (noiseType == 0) return valueNoise(p);
    if (noiseType == 1) return perlinNoise(p);
    if (noiseType == 2) return simplexNoise(p);
    if (noiseType == 3) return worleyNoise(p);
    if (noiseType == 4) return fbm(p, octaves, persistence, lacunarity);
    if (noiseType == 5) return hash(floor(p)); // Random (no interpolation)
    return valueNoise(p);
  }
  
  void main() {
    vec2 uv = v_texCoord;
    
    // Convert UV to pixel coordinates
    vec2 pixelCoord = uv * u_resolution;
    
    // Check if we're inside the grid area (accounting for offset)
    vec2 gridCoord = pixelCoord - u_gridOffset;
    
    if (gridCoord.x < 0.0 || gridCoord.y < 0.0 || 
        gridCoord.x >= u_gridSize.x || gridCoord.y >= u_gridSize.y) {
      // Outside grid area - transparent
      gl_FragColor = vec4(0.0);
      return;
    }
    
    // Calculate cell size in pixels
    float totalCell = u_pixelSize + u_gap;
    
    // Calculate which cell we're in
    vec2 cellIndex = floor(gridCoord / totalCell);
    
    // Position within the cell
    vec2 cellPos = mod(gridCoord, totalCell);
    
    // Check if we're in the gap area
    if (cellPos.x >= u_pixelSize || cellPos.y >= u_pixelSize) {
      // In the gap - transparent
      gl_FragColor = vec4(0.0);
      return;
    }
    
    // Sample the mask at the center of this cell (map grid coord back to UV)
    vec2 cellCenterGrid = (cellIndex + 0.5) * totalCell + u_gridOffset;
    vec2 cellCenterUV = cellCenterGrid / u_resolution;
    float mask = texture2D(u_mask, cellCenterUV).r;
    
    // Check if this cell should be filled (mask has content)
    bool isFilled = mask > 0.1;
    
    if (!isFilled) {
      // Empty cell - transparent
      gl_FragColor = vec4(0.0);
      return;
    }
    
    // ── Liquid / smoke mode ───────────────────────────────────────────
    // Metaball blobs on triangle-wave (bouncing) trajectories.
    // The mask naturally clips them to the SVG shape, giving the
    // appearance of liquid trapped inside and bouncing off the walls.
    //
    // matterState modulates the behaviour along a solid→liquid→gas axis.
    // At 0.5 (liquid) every multiplier is 1.0 so the user's params are
    // used as-is.  The exponential curve  pow(ratio, 2*(ms-0.5))
    // guarantees the midpoint is neutral and both extremes are symmetric.
    if (u_liquidMode == 1) {
      float ms = clamp(u_liquidMatterState, 0.0, 1.0);
      float msShift = 2.0 * (ms - 0.5);  // [-1, +1]
      
      // Effective radius: solid=3.3x (blobs merge), liquid=1x, gas=0.3x (tiny puffs)
      float effRadius = u_liquidRadius * pow(0.3, msShift);
      
      // Effective threshold: solid=0.25x (easy to pass→big mass), liquid=1x, gas=4x (scattered)
      float effThreshold = u_liquidThreshold * pow(4.0, msShift);
      
      // Effective smoothness: solid=0.15x (crisp), liquid=1x, gas=5x (very diffuse)
      float effSmoothness = u_liquidSmoothness * pow(5.0, msShift);
      
      // Effective blend: solid→pushed toward 0, gas→pushed toward 1
      float effBlend = clamp(u_liquidBlend + msShift * 0.45, 0.0, 1.0);
      
      // Movement perturbation amplitude: solid=rigid, liquid=organic, gas=chaotic
      float pertAmp = mix(0.005, 0.15, ms);
      
      // Noise turbulence added to field: none for solid, heavy for gas
      float turbulence = mix(0.0, 4.0, ms * ms);
      
      float t = u_time * u_liquidSpeed * 0.4;
      float totalCellL = u_pixelSize + u_gap;
      vec2 gridCells = floor(u_gridSize / totalCellL);
      vec2 normPos = cellIndex / max(gridCells, vec2(1.0));
      
      float influence = 0.0;
      
      for (int i = 0; i < 8; i++) {
        if (i >= u_liquidBlobCount) break;
        float fi = float(i);
        
        // Unique speeds per blob (coprime-ish for non-repeating motion)
        float speedX = 0.31 + fi * 0.097;
        float speedY = 0.24 + fi * 0.113;
        float phaseX = fi * 1.618033;  // golden ratio spacing
        float phaseY = fi * 2.39996;   // plastic constant
        
        // Triangle-wave bounce trajectory [0, 1]
        float bx = abs(mod(t * speedX + phaseX, 2.0) - 1.0);
        float by = abs(mod(t * speedY + phaseY, 2.0) - 1.0);
        
        // Noise perturbation scaled by matter state (solid=rigid, gas=chaotic)
        bx = clamp(bx + pertAmp * sin(t * 1.3 + fi * 3.7), 0.01, 0.99);
        by = clamp(by + pertAmp * cos(t * 0.9 + fi * 2.3), 0.01, 0.99);
        
        vec2 blobPos = vec2(bx, by);
        float dist = length(normPos - blobPos);
        
        // Vary blob size slightly per blob
        float blobR = effRadius * (0.8 + 0.4 * hash(vec2(fi, fi * 0.7)));
        
        // Metaball field contribution
        influence += blobR / (dist * dist + 0.0005);
      }
      
      // Noise turbulence on the field: subtle for liquid, heavy for gas
      float nVal = valueNoise(normPos * 8.0 + vec2(t * 0.5, t * 0.3));
      influence += (nVal - 0.5) * turbulence;
      
      // Smoothness: per-cell jitter on the blob boundary threshold.
      // 0 → crisp sharp edges, higher → wider noisy/dithered transition zone.
      float edgeRand = hash(cellIndex + vec2(73.0, 157.0));
      float edgeJitter = (edgeRand - 0.5) * effSmoothness;
      float liqVal = influence > (effThreshold + edgeJitter) ? 1.0 : 0.0;
      
      // Blend: dissolve liquid shape into static per-cell randomness.
      // 0 → pure liquid (clean animated metaballs), 1 → fully dissolved into static random.
      float cellRandomL = hash(cellIndex);
      float combined = mix(liqVal, cellRandomL, effBlend);
      
      // Always binary output: accent or default, no halftones
      if (combined > 0.5) {
        gl_FragColor = vec4(u_accentColor, 1.0);
      } else {
        gl_FragColor = vec4(u_defaultColor, u_defaultOpacity);
      }
      return;
    }
    
    // Generate pseudo-random value for this cell (static)
    float cellRandom = hash(cellIndex);
    
    // Animated noise threshold for accent cells
    float animTime = u_time * u_speed;
    vec2 noiseCoord = cellIndex * u_noiseScale + vec2(animTime * 0.5);
    float animatedNoise = getNoise(noiseCoord, u_noiseType, u_octaves, u_persistence, u_lacunarity);
    
    // ── Inner-shadow mode ──────────────────────────────────────────────
    // Works like Figma inner shadow (no blur):
    // Sample the mask at (current cell + offset).  If that lands outside
    // the shape, this cell is on the visible edge → accent colour.
    // The offset direction controls which side is coloured;
    // the offset magnitude controls how thick the coloured band is.
    if (u_innerShadow == 1) {
      float totalCell = u_pixelSize + u_gap;
      vec2 cellStep = vec2(totalCell) / u_resolution;
      vec2 sampleUV = cellCenterUV + u_shadowOffset * cellStep;
      
      bool outside = sampleUV.x < 0.0 || sampleUV.x > 1.0
                  || sampleUV.y < 0.0 || sampleUV.y > 1.0
                  || texture2D(u_mask, sampleUV).r < 0.1;
      
      if (outside) {
        gl_FragColor = vec4(u_accentColor, 1.0);
      } else {
        gl_FragColor = vec4(u_defaultColor, u_defaultOpacity);
      }
      return;
    }
    
    // ── Default noise-based accent mode ────────────────────────────────
    // Combine static random with animated noise
    float threshold = mix(cellRandom, animatedNoise, u_noiseBlend);
    
    // Determine if this is an accent cell
    bool isAccent = threshold < (u_accentPercent / 100.0);
    
    // Always render filled cells - default first, then accent on top
    if (isAccent) {
      gl_FragColor = vec4(u_accentColor, 1.0);
    } else {
      // Default cells - use straight alpha (not premultiplied)
      gl_FragColor = vec4(u_defaultColor, u_defaultOpacity);
    }
  }
`;function o(e,t,i){let r=e.createShader(t);return r?(e.shaderSource(r,i),e.compileShader(r),e.getShaderParameter(r,e.COMPILE_STATUS))?r:(console.error("Shader compile error:",e.getShaderInfoLog(r)),e.deleteShader(r),null):null}function a(e){let t=/^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(e);return t?[parseInt(t[1],16)/255,parseInt(t[2],16)/255,parseInt(t[3],16)/255]:[1,1,1]}let l={grid:{pixelSize:4,gap:2},animation:{accentPercent:20,speed:2},noise:{type:"Value",scale:.01,blend:.75,octaves:4,persistence:.5,lacunarity:2.3},colors:{background:"#0a0a0a",defaultColor:"#ffffff",defaultOpacity:.06,accentColor:"#10b981"},innerShadow:{enabled:!1,offsetX:0,offsetY:0},liquid:{enabled:!1,blobCount:3,radius:.05,smoothness:1,threshold:1,blend:.45,speed:2,matterState:.5}},s={Value:0,Perlin:1,Simplex:2,Worley:3,FBM:4,Random:5};e.s(["SVGGridRenderer",0,function({svg:e,settings:u,width:c,height:d,className:f,style:m,paused:h=!1}){let p=(0,i.useMemo)(()=>u?{grid:{...l.grid,...u.grid},animation:{...l.animation,...u.animation},noise:{...l.noise,...u.noise},colors:{...l.colors,...u.colors},innerShadow:{...l.innerShadow,...u.innerShadow},liquid:{...l.liquid,...u.liquid}}:l,[u]),g=(0,i.useRef)(null),v=(0,i.useRef)(null),_=(0,i.useRef)(null),y=(0,i.useRef)(null),b=(0,i.useRef)(void 0),x=(0,i.useRef)("u">typeof performance?performance.now():0),w=(0,i.useRef)(window.devicePixelRatio||1),S=(0,i.useRef)(h);S.current=h;let C=(0,i.useRef)(null),R=(0,i.useMemo)(()=>(function(e){if("u"<typeof DOMParser)return{width:512,height:512};let t=new DOMParser().parseFromString(e,"image/svg+xml").querySelector("svg");if(!t)return{width:512,height:512};let i=t.getAttribute("viewBox");if(i){let e=i.split(/[\s,]+/).map(Number);if(e.length>=4&&!isNaN(e[2])&&!isNaN(e[3]))return{width:e[2],height:e[3]}}let r=parseFloat(t.getAttribute("width")||""),n=parseFloat(t.getAttribute("height")||"");return!isNaN(r)&&!isNaN(n)&&r>0&&n>0?{width:r,height:n}:{width:512,height:512}})(e),[e]),P=c??R.width,E=d??R.height,T=(0,i.useMemo)(()=>{var e,t;let i,r,n,o,a,l,s;return i=(e=p.grid.pixelSize)+(t=p.grid.gap),r=Math.floor((P+t)/i),n=Math.floor((E+t)/i),o=r>0?r*e+(r-1)*t:0,a=n>0?n*e+(n-1)*t:0,l=Math.round((P-o)/2),s=Math.round((E-a)/2),{cols:r,rows:n,gridWidth:o,gridHeight:a,offsetX:l,offsetY:s}},[P,E,p.grid.pixelSize,p.grid.gap]),q=(0,i.useRef)({pixelSize:p.grid.pixelSize,gap:p.grid.gap,speed:p.animation.speed,accentPercent:p.animation.accentPercent,defaultColorRgb:a(p.colors.defaultColor),defaultOpacity:p.colors.defaultOpacity,accentColorRgb:a(p.colors.accentColor),gridDimensions:T,noiseType:s[p.noise.type]??0,noiseScale:p.noise.scale,octaves:p.noise.octaves,persistence:p.noise.persistence,lacunarity:p.noise.lacunarity,noiseBlend:p.noise.blend,innerShadow:p.innerShadow.enabled,shadowOffsetX:p.innerShadow.offsetX,shadowOffsetY:p.innerShadow.offsetY,liquidMode:p.liquid.enabled,liquidBlobCount:p.liquid.blobCount,liquidRadius:p.liquid.radius,liquidSmoothness:p.liquid.smoothness,liquidThreshold:p.liquid.threshold,liquidBlend:p.liquid.blend,liquidSpeed:p.liquid.speed,liquidMatterState:p.liquid.matterState}),A=(0,i.useRef)(!0);(0,i.useEffect)(()=>{q.current={pixelSize:p.grid.pixelSize,gap:p.grid.gap,speed:p.animation.speed,accentPercent:p.animation.accentPercent,defaultColorRgb:a(p.colors.defaultColor),defaultOpacity:p.colors.defaultOpacity,accentColorRgb:a(p.colors.accentColor),gridDimensions:T,noiseType:s[p.noise.type]??0,noiseScale:p.noise.scale,octaves:p.noise.octaves,persistence:p.noise.persistence,lacunarity:p.noise.lacunarity,noiseBlend:p.noise.blend,innerShadow:p.innerShadow.enabled,shadowOffsetX:p.innerShadow.offsetX,shadowOffsetY:p.innerShadow.offsetY,liquidMode:p.liquid.enabled,liquidBlobCount:p.liquid.blobCount,liquidRadius:p.liquid.radius,liquidSmoothness:p.liquid.smoothness,liquidThreshold:p.liquid.threshold,liquidBlend:p.liquid.blend,liquidSpeed:p.liquid.speed,liquidMatterState:p.liquid.matterState},A.current=!0},[p,T]);let M=(0,i.useCallback)(async(e,t)=>new Promise(i=>{let r=document.createElement("canvas"),n=window.devicePixelRatio||1;r.width=P*n,r.height=E*n;let o=r.getContext("2d");if(!o)return void i(null);let a=new Image,l=new Blob([e],{type:"image/svg+xml"}),s=URL.createObjectURL(l);a.onload=()=>{let e,n,l,u;o.clearRect(0,0,r.width,r.height);let c=a.width/a.height;c>r.width/r.height?(n=(e=r.width)/c,l=0,u=(r.height-n)/2):(e=(n=r.height)*c,l=(r.width-e)/2,u=0),o.drawImage(a,l,u,e,n);let d=o.getImageData(0,0,r.width,r.height),f=new Uint8Array(r.width*r.height);for(let e=0;e<f.length;e++){let t=d.data[4*e],i=d.data[4*e+1],r=d.data[4*e+2],n=d.data[4*e+3];f[e]=255*(n>0||t>0||i>0||r>0)}let m=t.createTexture();t.bindTexture(t.TEXTURE_2D,m),t.texParameteri(t.TEXTURE_2D,t.TEXTURE_WRAP_S,t.CLAMP_TO_EDGE),t.texParameteri(t.TEXTURE_2D,t.TEXTURE_WRAP_T,t.CLAMP_TO_EDGE),t.texParameteri(t.TEXTURE_2D,t.TEXTURE_MIN_FILTER,t.NEAREST),t.texParameteri(t.TEXTURE_2D,t.TEXTURE_MAG_FILTER,t.NEAREST),t.texImage2D(t.TEXTURE_2D,0,t.LUMINANCE,r.width,r.height,0,t.LUMINANCE,t.UNSIGNED_BYTE,f),URL.revokeObjectURL(s),i(m)},a.onerror=()=>{URL.revokeObjectURL(s),i(null)},a.src=s}),[P,E]),O=(0,i.useRef)(!1),L=(0,i.useRef)(!1),U=(0,i.useRef)(0),j=function(){let[,e]=(0,i.useState)(0);return(0,i.useCallback)(()=>e(e=>e+1),[])}();return(0,i.useEffect)(()=>{let e,t=g.current;if(!t)return;let i=t.getContext("webgl",{preserveDrawingBuffer:!1,premultipliedAlpha:!1,alpha:!0});if(!i)return void console.error("WebGL not supported");v.current=i;let a=o(i,i.VERTEX_SHADER,r),l=o(i,i.FRAGMENT_SHADER,n);if(!a||!l)return;let s=(e=i.createProgram())?(i.attachShader(e,a),i.attachShader(e,l),i.linkProgram(e),i.getProgramParameter(e,i.LINK_STATUS))?e:(console.error("Program link error:",i.getProgramInfoLog(e)),i.deleteProgram(e),null):null;if(!s)return;_.current=s,C.current={u_mask:i.getUniformLocation(s,"u_mask"),u_resolution:i.getUniformLocation(s,"u_resolution"),u_pixelSize:i.getUniformLocation(s,"u_pixelSize"),u_gap:i.getUniformLocation(s,"u_gap"),u_gridOffset:i.getUniformLocation(s,"u_gridOffset"),u_gridSize:i.getUniformLocation(s,"u_gridSize"),u_time:i.getUniformLocation(s,"u_time"),u_speed:i.getUniformLocation(s,"u_speed"),u_accentPercent:i.getUniformLocation(s,"u_accentPercent"),u_defaultColor:i.getUniformLocation(s,"u_defaultColor"),u_defaultOpacity:i.getUniformLocation(s,"u_defaultOpacity"),u_accentColor:i.getUniformLocation(s,"u_accentColor"),u_noiseType:i.getUniformLocation(s,"u_noiseType"),u_noiseScale:i.getUniformLocation(s,"u_noiseScale"),u_octaves:i.getUniformLocation(s,"u_octaves"),u_persistence:i.getUniformLocation(s,"u_persistence"),u_lacunarity:i.getUniformLocation(s,"u_lacunarity"),u_noiseBlend:i.getUniformLocation(s,"u_noiseBlend"),u_innerShadow:i.getUniformLocation(s,"u_innerShadow"),u_shadowOffset:i.getUniformLocation(s,"u_shadowOffset"),u_liquidMode:i.getUniformLocation(s,"u_liquidMode"),u_liquidBlobCount:i.getUniformLocation(s,"u_liquidBlobCount"),u_liquidRadius:i.getUniformLocation(s,"u_liquidRadius"),u_liquidSmoothness:i.getUniformLocation(s,"u_liquidSmoothness"),u_liquidThreshold:i.getUniformLocation(s,"u_liquidThreshold"),u_liquidBlend:i.getUniformLocation(s,"u_liquidBlend"),u_liquidSpeed:i.getUniformLocation(s,"u_liquidSpeed"),u_liquidMatterState:i.getUniformLocation(s,"u_liquidMatterState")};let u=new Float32Array([-1,-1,1,-1,-1,1,1,1]),c=i.createBuffer();i.bindBuffer(i.ARRAY_BUFFER,c),i.bufferData(i.ARRAY_BUFFER,u,i.STATIC_DRAW);let d=new Float32Array([0,1,1,1,0,0,1,0]),f=i.createBuffer();i.bindBuffer(i.ARRAY_BUFFER,f),i.bufferData(i.ARRAY_BUFFER,d,i.STATIC_DRAW),i.useProgram(s);let m=i.getAttribLocation(s,"a_position");i.bindBuffer(i.ARRAY_BUFFER,c),i.enableVertexAttribArray(m),i.vertexAttribPointer(m,2,i.FLOAT,!1,0,0);let h=i.getAttribLocation(s,"a_texCoord");return i.bindBuffer(i.ARRAY_BUFFER,f),i.enableVertexAttribArray(h),i.vertexAttribPointer(h,2,i.FLOAT,!1,0,0),i.disable(i.BLEND),O.current=!0,U.current++,j(),()=>{O.current=!1,b.current&&cancelAnimationFrame(b.current),y.current&&i.deleteTexture(y.current),i.deleteProgram(s)}},[]),(0,i.useEffect)(()=>{let t=v.current;if(!t||!e||!O.current)return;let i=window.devicePixelRatio||1;w.current=i;let r=g.current;r&&(r.width=P*i,r.height=E*i),A.current=!0;let n=!1;return L.current=!1,M(e,t).then(e=>{if(n){e&&t.deleteTexture(e);return}y.current&&v.current&&v.current.deleteTexture(y.current),y.current=e,e&&(L.current=!0,U.current++,j())}),()=>{n=!0}},[e,M,P,E]),(0,i.useEffect)(()=>{let e=v.current,t=_.current,i=g.current,r=C.current;if(!e||!t||!i||!r||!O.current||!L.current||h)return;A.current=!0;let n=()=>{if(S.current)return;let t=(performance.now()-x.current)/1e3,o=q.current,a=w.current;if(e.viewport(0,0,i.width,i.height),e.clearColor(0,0,0,0),e.clear(e.COLOR_BUFFER_BIT),A.current){e.uniform1i(r.u_mask,0),e.uniform2f(r.u_resolution,i.width,i.height),e.uniform1f(r.u_pixelSize,o.pixelSize*a),e.uniform1f(r.u_gap,o.gap*a),e.uniform2f(r.u_gridOffset,o.gridDimensions.offsetX*a,o.gridDimensions.offsetY*a),e.uniform2f(r.u_gridSize,o.gridDimensions.gridWidth*a,o.gridDimensions.gridHeight*a),e.uniform1f(r.u_speed,o.speed),e.uniform1f(r.u_accentPercent,o.accentPercent);let t=o.defaultColorRgb;e.uniform3f(r.u_defaultColor,t[0],t[1],t[2]),e.uniform1f(r.u_defaultOpacity,o.defaultOpacity);let n=o.accentColorRgb;e.uniform3f(r.u_accentColor,n[0],n[1],n[2]),e.uniform1i(r.u_noiseType,o.noiseType),e.uniform1f(r.u_noiseScale,o.noiseScale),e.uniform1i(r.u_octaves,o.octaves),e.uniform1f(r.u_persistence,o.persistence),e.uniform1f(r.u_lacunarity,o.lacunarity),e.uniform1f(r.u_noiseBlend,o.noiseBlend),e.uniform1i(r.u_innerShadow,+!!o.innerShadow),e.uniform2f(r.u_shadowOffset,o.shadowOffsetX,o.shadowOffsetY),e.uniform1i(r.u_liquidMode,+!!o.liquidMode),e.uniform1i(r.u_liquidBlobCount,o.liquidBlobCount),e.uniform1f(r.u_liquidRadius,o.liquidRadius),e.uniform1f(r.u_liquidSmoothness,o.liquidSmoothness),e.uniform1f(r.u_liquidThreshold,o.liquidThreshold),e.uniform1f(r.u_liquidBlend,o.liquidBlend),e.uniform1f(r.u_liquidSpeed,o.liquidSpeed),e.uniform1f(r.u_liquidMatterState,o.liquidMatterState),A.current=!1}e.uniform1f(r.u_time,t),e.activeTexture(e.TEXTURE0),y.current&&e.bindTexture(e.TEXTURE_2D,y.current),e.drawArrays(e.TRIANGLE_STRIP,0,4),b.current=requestAnimationFrame(n)};return n(),()=>{b.current&&(cancelAnimationFrame(b.current),b.current=void 0)}},[U.current,h]),(0,t.jsx)("div",{className:f,style:{position:"relative",width:P,height:E,backgroundColor:p.colors.background,...m},children:(0,t.jsx)("canvas",{ref:g,style:{display:"block",width:"100%",height:"100%"}})})}],660032),e.s([],842033)},887652,449492,e=>{"use strict";var t=e.i(486427),i=e.i(271645),r=e.i(737806),n=e.i(882323);e.s(["useMotionValue",0,function(e){let o=(0,n.useConstant)(()=>(0,t.motionValue)(e)),{isStatic:a}=(0,i.useContext)(r.MotionConfigContext);if(a){let[,t]=(0,i.useState)(e);(0,i.useEffect)(()=>o.on("change",t),[])}return o}],887652);class o{constructor(e){this.stop=()=>this.runAll("stop"),this.animations=e.filter(Boolean)}get finished(){return Promise.all(this.animations.map(e=>e.finished))}getAll(e){return this.animations[0][e]}setAll(e,t){for(let i=0;i<this.animations.length;i++)this.animations[i][e]=t}attachTimeline(e){let t=this.animations.map(t=>t.attachTimeline(e));return()=>{t.forEach((e,t)=>{e&&e(),this.animations[t].stop()})}}get time(){return this.getAll("time")}set time(e){this.setAll("time",e)}get speed(){return this.getAll("speed")}set speed(e){this.setAll("speed",e)}get state(){return this.getAll("state")}get startTime(){return this.getAll("startTime")}get duration(){return a(this.animations,"duration")}get iterationDuration(){return a(this.animations,"iterationDuration")}runAll(e){this.animations.forEach(t=>t[e]())}play(){this.runAll("play")}pause(){this.runAll("pause")}cancel(){this.runAll("cancel")}complete(){this.runAll("complete")}}function a(e,t){let i=0;for(let r=0;r<e.length;r++){let n=e[r][t];null!==n&&n>i&&(i=n)}return i}class l extends o{then(e,t){return this.finished.finally(e).then(()=>{})}}var s=e.i(133887),u=e.i(373431),c=e.i(83411),d=e.i(515923),f=e.i(997307),m=e.i(721748),h=e.i(215932),p=e.i(783920),g=e.i(763074),v=e.i(965566),_=e.i(893544);function y(e,t){var i;let r;return(0,_.isEasingArray)(e)?e[i=e.length,((t-0)%(r=i-0)+r)%r+0]:e}var b=e.i(749652);function x(e){return"object"==typeof e&&!Array.isArray(e)}function w(e,t,i,r){return null==e?[]:"string"==typeof e&&x(t)?(0,b.resolveElements)(e,i,r):e instanceof NodeList?Array.from(e):Array.isArray(e)?e.filter(e=>null!=e):[e]}function S(e,t,i,r){return"number"==typeof t?t:t.startsWith("-")||t.startsWith("+")?Math.max(0,e+parseFloat(t)):"<"===t?i:t.startsWith("<")?Math.max(0,i+parseFloat(t.slice(1))):r.get(t)??e}var C=e.i(100706);function R(e,t){return e.at!==t.at?e.at-t.at:null===e.value?1:null===t.value?-1:0}function P(e,t){return t.has(e)||t.set(e,{}),t.get(e)}function E(e,t){return t[e]||(t[e]=[]),t[e]}let T=e=>"number"==typeof e,q=e=>e.every(T);var A=e.i(768705),M=e.i(472094),O=e.i(372323),L=e.i(889026),U=e.i(836331),j=e.i(275737),F=e.i(386783),z=e.i(130162),I=e.i(617218);class N extends I.VisualElement{constructor(){super(...arguments),this.type="object"}readValueFromInstance(e,t){if(t in e){let i=e[t];if("string"==typeof i||"number"==typeof i)return i}}getBaseTargetFromProps(){}removeValueFromRenderState(e,t){delete t.output[e]}measureInstanceViewportBox(){return(0,z.createBox)()}build(e,t){Object.assign(e.output,t)}renderInstance(e,{output:t}){Object.assign(e,t)}sortInstanceNodePosition(){return 0}}function B(e){let t={presenceContext:null,props:{},visualState:{renderState:{transform:{},transformOrigin:{},style:{},vars:{},attrs:{}},latestValues:{}}},i=(0,L.isSVGElement)(e)&&!(0,U.isSVGSVGElement)(e)?new j.SVGVisualElement(t):new F.HTMLVisualElement(t);i.mount(e),M.visualElementStore.set(e,i)}function D(e){let t=new N({presenceContext:null,props:{},visualState:{renderState:{output:{}},latestValues:{}}});t.mount(e),M.visualElementStore.set(e,t)}function k(e,t,i,r){let n=[];if((0,c.isMotionValue)(e)||"number"==typeof e||"string"==typeof e&&!x(t))n.push((0,A.animateSingleValue)(e,x(t)&&t.default||t,i&&i.default||i));else{if(null==e)return n;let o=w(e,t,r),a=o.length;(0,v.invariant)(!!a,"No valid elements provided.","no-valid-elements");for(let e=0;e<a;e++){let r=o[e],l=r instanceof Element?B:D;M.visualElementStore.has(r)||l(r);let s=M.visualElementStore.get(r),u={...i};"delay"in u&&"function"==typeof u.delay&&(u.delay=u.delay(e,a)),n.push(...(0,O.animateTarget)(s,{...t,transition:u},{}))}}return n}let V=function(e={}){let{scope:t,reduceMotion:i}=e;return function(e,r,n){var o;let a,_=[];if(Array.isArray(e)&&e.some(Array.isArray)){let n;o=void 0!==i?{reduceMotion:i,...r}:r,n=[],(function(e,{defaultTransition:t={},...i}={},r,n){let o=t.duration||.3,a=new Map,l=new Map,u={},_=new Map,b=0,x=0,T=0;for(let i=0;i<e.length;i++){let a=e[i];if("string"==typeof a){_.set(a,x);continue}if(!Array.isArray(a)){_.set(a.name,S(x,a.at,b,_));continue}let[p,R,O={}]=a;void 0!==O.at&&(x=S(x,O.at,b,_));let L=0,U=(e,i,r,a=0,l=0)=>{var u;let c=Array.isArray(u=e)?u:[u],{delay:p=0,times:_=(0,d.defaultOffset)(c),type:b=t.type||"keyframes",repeat:w,repeatType:S,repeatDelay:R=0,...P}=i,{ease:E=t.ease||"easeOut",duration:A}=i,M="function"==typeof p?p(a,l):p,O=c.length,U=(0,f.isGenerator)(b)?b:n?.[b||"keyframes"];if(O<=2&&U){let e=100;2===O&&q(c)&&(e=Math.abs(c[1]-c[0]));let i={...t,...P};void 0!==A&&(i.duration=(0,g.secondsToMilliseconds)(A));let r=(0,m.createGeneratorEasing)(i,e,U);E=r.ease,A=r.duration}A??(A=o);let j=x+M;1===_.length&&0===_[0]&&(_[1]=1);let F=_.length-c.length;if(F>0&&(0,h.fillOffset)(_,F),1===c.length&&c.unshift(null),w){(0,v.invariant)(w<20,"Repeat count too high, must be less than 20","repeat-count-high"),A*=w+1;let e=[...c],t=[..._],i=[...E=Array.isArray(E)?[...E]:[E]];for(let r=0;r<w;r++){c.push(...e);for(let n=0;n<e.length;n++)_.push(t[n]+(r+1)),E.push(0===n?"linear":y(i,n-1))}for(let e=0;e<_.length;e++)_[e]=_[e]/(w+1)}let z=j+A;!function(e,t,i,r,n,o){for(let t=0;t<e.length;t++){let i=e[t];i.at>n&&i.at<o&&((0,s.removeItem)(e,i),t--)}for(let a=0;a<t.length;a++)e.push({value:t[a],at:(0,C.mixNumber)(n,o,r[a]),easing:y(i,a)})}(r,c,E,_,j,z),L=Math.max(M+A,L),T=Math.max(z,T)};if((0,c.isMotionValue)(p))U(R,O,E("default",P(p,l)));else{let e=w(p,R,r,u),t=e.length;for(let i=0;i<t;i++){let r=P(e[i],l);for(let e in R){var A,M;U(R[e],(A=O,M=e,A&&A[M]?{...A,...A[M]}:{...A}),E(e,r),i,t)}}}b=x,x+=L}return l.forEach((e,r)=>{for(let n in e){let o=e[n];o.sort(R);let l=[],s=[],u=[];for(let e=0;e<o.length;e++){let{at:t,value:i,easing:r}=o[e];l.push(i),s.push((0,p.progress)(0,T,t)),u.push(r||"easeOut")}0!==s[0]&&(s.unshift(0),l.unshift(l[0]),u.unshift("easeInOut")),1!==s[s.length-1]&&(s.push(1),l.push(null)),a.has(r)||a.set(r,{keyframes:{},transition:{}});let c=a.get(r);c.keyframes[n]=l;let{type:d,...f}=t;c.transition[n]={...f,duration:T,ease:u,times:s,...i}}}),a})(e,o,t,{spring:u.spring}).forEach(({keyframes:e,transition:t},i)=>{n.push(...k(i,e,t))}),_=n}else{let{onComplete:o,...l}=n||{};"function"==typeof o&&(a=o),_=k(e,r,void 0!==i?{reduceMotion:i,...l}:l,t)}let b=new l(_);return a&&b.finished.then(a),t&&(t.animations.push(b),b.finished.then(()=>{(0,s.removeItem)(t.animations,b)})),b}}();e.s(["animate",0,V],449492)},605500,(e,t,i)=>{"use strict";Object.defineProperty(i,"__esModule",{value:!0}),Object.defineProperty(i,"Image",{enumerable:!0,get:function(){return x}});let r=e.r(555682),n=e.r(190809),o=e.r(843476),a=n._(e.r(271645)),l=r._(e.r(174080)),s=r._(e.r(325633)),u=e.r(908927),c=e.r(987690),d=e.r(918556),f=e.r(65856),m=r._(e.r(1948)),h=e.r(818581),p={deviceSizes:[640,750,828,1080,1200,1920,2048,3840],imageSizes:[32,48,64,96,128,256,384],qualities:[75],path:"/_next/image",loader:"default",dangerouslyAllowSVG:!1,unoptimized:!1};function g(e,t,i,r,n,o,a){let l=e?.src;e&&e["data-loaded-src"]!==l&&(e["data-loaded-src"]=l,("decode"in e?e.decode():Promise.resolve()).catch(()=>{}).then(()=>{if(e.parentElement&&e.isConnected){if("empty"!==t&&n(!0),i?.current){let t=new Event("load");Object.defineProperty(t,"target",{writable:!1,value:e});let r=!1,n=!1;i.current({...t,nativeEvent:t,currentTarget:e,target:e,isDefaultPrevented:()=>r,isPropagationStopped:()=>n,persist:()=>{},preventDefault:()=>{r=!0,t.preventDefault()},stopPropagation:()=>{n=!0,t.stopPropagation()}})}r?.current&&r.current(e)}}))}function v(e){return a.use?{fetchPriority:e}:{fetchpriority:e}}"u"<typeof window&&(globalThis.__NEXT_IMAGE_IMPORTED=!0);let _="u"<typeof window?a.useEffect:a.useLayoutEffect,y=(0,a.forwardRef)(({src:e,srcSet:t,sizes:i,height:r,width:n,decoding:l,className:s,style:u,fetchPriority:c,placeholder:d,loading:f,unoptimized:m,fill:p,onLoadRef:y,onLoadingCompleteRef:b,setBlurComplete:x,setShowAltText:w,sizesInput:S,onLoad:C,onError:R,...P},E)=>{let T=(0,a.useRef)(!1),q=(0,a.useRef)(null);_(()=>{let{current:e}=T,{current:t}=q;e||null===t||(R&&(t.src=t.src),t.complete&&g(t,d,y,b,x,m,S),T.current=!0)},[e,d,y,b,R,m,S]);let A=(0,h.useMergedRef)(E,q);return(0,o.jsx)("img",{...P,...v(c),loading:f,width:n,height:r,decoding:l,"data-nimg":p?"fill":"1",className:s,style:u,sizes:i,srcSet:t,src:e,ref:A,onLoad:e=>{g(e.currentTarget,d,y,b,x,m,S)},onError:e=>{w(!0),"empty"!==d&&x(!0),R&&R(e)}})});function b({isAppRouter:e,imgAttributes:t}){let i={as:"image",imageSrcSet:t.srcSet,imageSizes:t.sizes,crossOrigin:t.crossOrigin,referrerPolicy:t.referrerPolicy,...v(t.fetchPriority)};return e&&l.default.preload?(l.default.preload(t.src,i),null):(0,o.jsx)(s.default,{children:(0,o.jsx)("link",{rel:"preload",href:t.srcSet?void 0:t.src,...i},"__nimg-"+t.src+t.srcSet+t.sizes)})}let x=(0,a.forwardRef)((e,t)=>{let i=(0,a.useContext)(f.RouterContext),r=(0,a.useContext)(d.ImageConfigContext),n=(0,a.useMemo)(()=>{let e=p||r||c.imageConfigDefault,t=[...e.deviceSizes,...e.imageSizes].sort((e,t)=>e-t),i=e.deviceSizes.sort((e,t)=>e-t),n=e.qualities?.sort((e,t)=>e-t);return{...e,allSizes:t,deviceSizes:i,qualities:n,localPatterns:"u"<typeof window?r?.localPatterns:e.localPatterns}},[r]),{onLoad:l,onLoadingComplete:s}=e,h=(0,a.useRef)(l);(0,a.useEffect)(()=>{h.current=l},[l]);let g=(0,a.useRef)(s);(0,a.useEffect)(()=>{g.current=s},[s]);let[v,_]=(0,a.useState)(!1),[x,w]=(0,a.useState)(!1),{props:S,meta:C}=(0,u.getImgProps)(e,{defaultLoader:m.default,imgConf:n,blurComplete:v,showAltText:x});return(0,o.jsxs)(o.Fragment,{children:[(0,o.jsx)(y,{...S,unoptimized:C.unoptimized,placeholder:C.placeholder,fill:C.fill,onLoadRef:h,onLoadingCompleteRef:g,setBlurComplete:_,setShowAltText:w,sizesInput:e.sizes,ref:t}),C.preload?(0,o.jsx)(b,{isAppRouter:!i,imgAttributes:S}):null]})});("function"==typeof i.default||"object"==typeof i.default&&null!==i.default)&&void 0===i.default.__esModule&&(Object.defineProperty(i.default,"__esModule",{value:!0}),Object.assign(i.default,i),t.exports=i.default)},670965,(e,t,i)=>{"use strict";function r(e,t){let i=e||75;return t?.qualities?.length?t.qualities.reduce((e,t)=>Math.abs(t-i)<Math.abs(e-i)?t:e,t.qualities[0]):i}Object.defineProperty(i,"__esModule",{value:!0}),Object.defineProperty(i,"findClosestQuality",{enumerable:!0,get:function(){return r}})},1948,(e,t,i)=>{"use strict";Object.defineProperty(i,"__esModule",{value:!0}),Object.defineProperty(i,"default",{enumerable:!0,get:function(){return a}});let r=e.r(670965),n=e.r(543369);function o({config:e,src:t,width:i,quality:a}){let l=(0,n.getDeploymentId)();if(t.startsWith("/")&&!t.startsWith("//"))if(t.includes("/_next/static/immutable")&&!(0,n.getAssetToken)())l=void 0;else{let e=t.indexOf("?");if(-1!==e){let i=new URLSearchParams(t.slice(e+1)),r=i.get("dpl");if(r){l=r,i.delete("dpl");let n=i.toString();t=t.slice(0,e)+(n?"?"+n:"")}}}if(t.startsWith("/")&&t.includes("?")&&e.localPatterns?.length===1&&"**"===e.localPatterns[0].pathname&&""===e.localPatterns[0].search)throw Object.defineProperty(Error(`Image with src "${t}" is using a query string which is not configured in images.localPatterns.
Read more: https://nextjs.org/docs/messages/next-image-unconfigured-localpatterns`),"__NEXT_ERROR_CODE",{value:"E871",enumerable:!1,configurable:!0});let s=(0,r.findClosestQuality)(a,e);return`${e.path}?url=${encodeURIComponent(t)}&w=${i}&q=${s}${t.startsWith("/")&&l?`&dpl=${l}`:""}`}o.__next_img_default=!0;let a=o},325633,(e,t,i)=>{"use strict";Object.defineProperty(i,"__esModule",{value:!0});var r={default:function(){return p},defaultHead:function(){return d}};for(var n in r)Object.defineProperty(i,n,{enumerable:!0,get:r[n]});let o=e.r(555682),a=e.r(190809),l=e.r(843476),s=a._(e.r(271645)),u=o._(e.r(775305)),c=e.r(742732);function d(){return[(0,l.jsx)("meta",{charSet:"utf-8"},"charset"),(0,l.jsx)("meta",{name:"viewport",content:"width=device-width"},"viewport")]}function f(e,t){return"string"==typeof t||"number"==typeof t?e:t.type===s.default.Fragment?e.concat(s.default.Children.toArray(t.props.children).reduce((e,t)=>"string"==typeof t||"number"==typeof t?e:e.concat(t),[])):e.concat(t)}let m=["name","httpEquiv","charSet","itemProp"];function h(e){let t,i,r,n;return e.reduce(f,[]).reverse().concat(d().reverse()).filter((t=new Set,i=new Set,r=new Set,n={},e=>{let o=!0,a=!1;if(e.key&&"number"!=typeof e.key&&e.key.indexOf("$")>0){a=!0;let i=e.key.slice(e.key.indexOf("$")+1);t.has(i)?o=!1:t.add(i)}switch(e.type){case"title":case"base":i.has(e.type)?o=!1:i.add(e.type);break;case"meta":for(let t=0,i=m.length;t<i;t++){let i=m[t];if(e.props.hasOwnProperty(i))if("charSet"===i)r.has(i)?o=!1:r.add(i);else{let t=e.props[i],r=n[i]||new Set;("name"!==i||!a)&&r.has(t)?o=!1:(r.add(t),n[i]=r)}}}return o})).reverse().map((e,t)=>{let i=e.key||t;return s.default.cloneElement(e,{key:i})})}let p=function({children:e}){let t=(0,s.useContext)(c.HeadManagerContext);return(0,l.jsx)(u.default,{reduceComponentsToState:h,headManager:t,children:e})};("function"==typeof i.default||"object"==typeof i.default&&null!==i.default)&&void 0===i.default.__esModule&&(Object.defineProperty(i.default,"__esModule",{value:!0}),Object.assign(i.default,i),t.exports=i.default)},488143,(e,t,i)=>{"use strict";function r({widthInt:e,heightInt:t,blurWidth:i,blurHeight:n,blurDataURL:o,objectFit:a}){let l=i?40*i:e,s=n?40*n:t,u=l&&s?`viewBox='0 0 ${l} ${s}'`:"";return`%3Csvg xmlns='http://www.w3.org/2000/svg' ${u}%3E%3Cfilter id='b' color-interpolation-filters='sRGB'%3E%3CfeGaussianBlur stdDeviation='20'/%3E%3CfeColorMatrix values='1 0 0 0 0 0 1 0 0 0 0 0 1 0 0 0 0 0 100 -1' result='s'/%3E%3CfeFlood x='0' y='0' width='100%25' height='100%25'/%3E%3CfeComposite operator='out' in='s'/%3E%3CfeComposite in2='SourceGraphic'/%3E%3CfeGaussianBlur stdDeviation='20'/%3E%3C/filter%3E%3Cimage width='100%25' height='100%25' x='0' y='0' preserveAspectRatio='${u?"none":"contain"===a?"xMidYMid":"cover"===a?"xMidYMid slice":"none"}' style='filter: url(%23b);' href='${o}'/%3E%3C/svg%3E`}Object.defineProperty(i,"__esModule",{value:!0}),Object.defineProperty(i,"getImageBlurSvg",{enumerable:!0,get:function(){return r}})},987690,(e,t,i)=>{"use strict";Object.defineProperty(i,"__esModule",{value:!0});var r={VALID_LOADERS:function(){return o},imageConfigDefault:function(){return a}};for(var n in r)Object.defineProperty(i,n,{enumerable:!0,get:r[n]});let o=["default","imgix","cloudinary","akamai","custom"],a={deviceSizes:[640,750,828,1080,1200,1920,2048,3840],imageSizes:[32,48,64,96,128,256,384],path:"/_next/image",loader:"default",loaderFile:"",domains:[],disableStaticImages:!1,minimumCacheTTL:14400,formats:["image/webp"],maximumDiskCacheSize:void 0,maximumRedirects:3,maximumResponseBody:5e7,dangerouslyAllowLocalIP:!1,dangerouslyAllowSVG:!1,contentSecurityPolicy:"script-src 'none'; frame-src 'none'; sandbox;",contentDispositionType:"attachment",localPatterns:void 0,remotePatterns:[],qualities:[75],unoptimized:!1,customCacheHandler:!1}},908927,(e,t,i)=>{"use strict";Object.defineProperty(i,"__esModule",{value:!0}),Object.defineProperty(i,"getImgProps",{enumerable:!0,get:function(){return u}});let r=e.r(543369),n=e.r(488143),o=e.r(987690),a=["-moz-initial","fill","none","scale-down",void 0];function l(e){return void 0!==e.default}function s(e){return void 0===e?e:"number"==typeof e?Number.isFinite(e)?e:NaN:"string"==typeof e&&/^[0-9]+$/.test(e)?parseInt(e,10):NaN}function u({src:e,sizes:t,unoptimized:i=!1,priority:c=!1,preload:d=!1,loading:f,className:m,quality:h,width:p,height:g,fill:v=!1,style:_,overrideSrc:y,onLoad:b,onLoadingComplete:x,placeholder:w="empty",blurDataURL:S,fetchPriority:C,decoding:R="async",layout:P,objectFit:E,objectPosition:T,lazyBoundary:q,lazyRoot:A,...M},O){var L;let U,j,F,{imgConf:z,showAltText:I,blurComplete:N,defaultLoader:B}=O,D=z||o.imageConfigDefault;if("allSizes"in D)U=D;else{let e=[...D.deviceSizes,...D.imageSizes].sort((e,t)=>e-t),t=D.deviceSizes.sort((e,t)=>e-t),i=D.qualities?.sort((e,t)=>e-t);U={...D,allSizes:e,deviceSizes:t,qualities:i}}if(void 0===B)throw Object.defineProperty(Error("images.loaderFile detected but the file is missing default export.\nRead more: https://nextjs.org/docs/messages/invalid-images-config"),"__NEXT_ERROR_CODE",{value:"E163",enumerable:!1,configurable:!0});let k=M.loader||B;delete M.loader,delete M.srcSet;let V="__next_img_default"in k;if(V){if("custom"===U.loader)throw Object.defineProperty(Error(`Image with src "${e}" is missing "loader" prop.
Read more: https://nextjs.org/docs/messages/next-image-missing-loader`),"__NEXT_ERROR_CODE",{value:"E252",enumerable:!1,configurable:!0})}else{let e=k;k=t=>{let{config:i,...r}=t;return e(r)}}if(P){"fill"===P&&(v=!0);let e={intrinsic:{maxWidth:"100%",height:"auto"},responsive:{width:"100%",height:"auto"}}[P];e&&(_={..._,...e});let i={responsive:"100vw",fill:"100vw"}[P];i&&!t&&(t=i)}let H="",$=s(p),G=s(g);if((L=e)&&"object"==typeof L&&(l(L)||void 0!==L.src)){let t=l(e)?e.default:e;if(!t.src)throw Object.defineProperty(Error(`An object should only be passed to the image component src parameter if it comes from a static image import. It must include src. Received ${JSON.stringify(t)}`),"__NEXT_ERROR_CODE",{value:"E460",enumerable:!1,configurable:!0});if(!t.height||!t.width)throw Object.defineProperty(Error(`An object should only be passed to the image component src parameter if it comes from a static image import. It must include height and width. Received ${JSON.stringify(t)}`),"__NEXT_ERROR_CODE",{value:"E48",enumerable:!1,configurable:!0});if(j=t.blurWidth,F=t.blurHeight,S=S||t.blurDataURL,H=t.src,!v)if($||G){if($&&!G){let e=$/t.width;G=Math.round(t.height*e)}else if(!$&&G){let e=G/t.height;$=Math.round(t.width*e)}}else $=t.width,G=t.height}let X=!c&&!d&&("lazy"===f||void 0===f);(!(e="string"==typeof e?e:H)||e.startsWith("data:")||e.startsWith("blob:"))&&(i=!0,X=!1),U.unoptimized&&(i=!0),V&&!U.dangerouslyAllowSVG&&e.split("?",1)[0].endsWith(".svg")&&(i=!0);let W=s(h),Y=Object.assign(v?{position:"absolute",height:"100%",width:"100%",left:0,top:0,right:0,bottom:0,objectFit:E,objectPosition:T}:{},I?{}:{color:"transparent"},_),Z=N||"empty"===w?null:"blur"===w?`url("data:image/svg+xml;charset=utf-8,${(0,n.getImageBlurSvg)({widthInt:$,heightInt:G,blurWidth:j,blurHeight:F,blurDataURL:S||"",objectFit:Y.objectFit})}")`:`url("${w}")`,J=a.includes(Y.objectFit)?"fill"===Y.objectFit?"100% 100%":"cover":Y.objectFit,K=Z?{backgroundSize:J,backgroundPosition:Y.objectPosition||"50% 50%",backgroundRepeat:"no-repeat",backgroundImage:Z}:{},Q=function({config:e,src:t,unoptimized:i,width:n,quality:o,sizes:a,loader:l}){if(i){if(t.startsWith("/")&&!t.startsWith("//")){let e=(0,r.getDeploymentId)();if(t.includes("/_next/static/immutable")&&!(0,r.getAssetToken)())e=void 0;else if(e){let i=t.indexOf("?");if(-1!==i){let r=new URLSearchParams(t.slice(i+1));r.get("dpl")||(r.append("dpl",e),t=t.slice(0,i)+"?"+r.toString())}else t+=`?dpl=${e}`}}return{src:t,srcSet:void 0,sizes:void 0}}let{widths:s,kind:u}=function({deviceSizes:e,allSizes:t},i,r){if(r){let i=/(^|\s)(1?\d?\d)vw/g,n=[];for(let e;e=i.exec(r);)n.push(parseInt(e[2]));if(n.length){let i=.01*Math.min(...n);return{widths:t.filter(t=>t>=e[0]*i),kind:"w"}}return{widths:t,kind:"w"}}return"number"!=typeof i?{widths:e,kind:"w"}:{widths:[...new Set([i,2*i].map(e=>t.find(t=>t>=e)||t[t.length-1]))],kind:"x"}}(e,n,a),c=s.length-1;return{sizes:a||"w"!==u?a:"100vw",srcSet:s.map((i,r)=>`${l({config:e,src:t,quality:o,width:i})} ${"w"===u?i:r+1}${u}`).join(", "),src:l({config:e,src:t,quality:o,width:s[c]})}}({config:U,src:e,unoptimized:i,width:$,quality:W,sizes:t,loader:k}),ee=X?"lazy":f;return{props:{...M,loading:ee,fetchPriority:C,width:$,height:G,decoding:R,className:m,style:{...Y,...K},sizes:Q.sizes,srcSet:Q.srcSet,src:y||Q.src},meta:{unoptimized:i,preload:d||c,placeholder:w,fill:v}}}},918556,(e,t,i)=>{"use strict";Object.defineProperty(i,"__esModule",{value:!0}),Object.defineProperty(i,"ImageConfigContext",{enumerable:!0,get:function(){return o}});let r=e.r(555682)._(e.r(271645)),n=e.r(987690),o=r.default.createContext(n.imageConfigDefault)},794909,(e,t,i)=>{"use strict";Object.defineProperty(i,"__esModule",{value:!0});var r={default:function(){return c},getImageProps:function(){return u}};for(var n in r)Object.defineProperty(i,n,{enumerable:!0,get:r[n]});let o=e.r(555682),a=e.r(908927),l=e.r(605500),s=o._(e.r(1948));function u(e){let{props:t}=(0,a.getImgProps)(e,{defaultLoader:s.default,imgConf:{deviceSizes:[640,750,828,1080,1200,1920,2048,3840],imageSizes:[32,48,64,96,128,256,384],qualities:[75],path:"/_next/image",loader:"default",dangerouslyAllowSVG:!1,unoptimized:!1}});for(let[e,i]of Object.entries(t))void 0===i&&delete t[e];return{props:t}}let c=l.Image},657688,(e,t,i)=>{t.exports=e.r(794909)},775305,(e,t,i)=>{"use strict";Object.defineProperty(i,"__esModule",{value:!0}),Object.defineProperty(i,"default",{enumerable:!0,get:function(){return l}});let r=e.r(271645),n="u"<typeof window,o=n?()=>{}:r.useLayoutEffect,a=n?()=>{}:r.useEffect;function l(e){let{headManager:t,reduceComponentsToState:i}=e;function l(){if(t&&t.mountedInstances){let e=r.Children.toArray(Array.from(t.mountedInstances).filter(Boolean));t.updateHead(i(e))}}return n&&(t?.mountedInstances?.add(e.children),l()),o(()=>(t?.mountedInstances?.add(e.children),()=>{t?.mountedInstances?.delete(e.children)})),o(()=>(t&&(t._pendingUpdate=l),()=>{t&&(t._pendingUpdate=l)})),a(()=>(t&&t._pendingUpdate&&(t._pendingUpdate(),t._pendingUpdate=null),()=>{t&&t._pendingUpdate&&(t._pendingUpdate(),t._pendingUpdate=null)})),null}}]);

//# debugId=423f92dd-dc9a-5a89-58ae-dce8414da8e8
//# sourceMappingURL=1fdelrifre303.js.map