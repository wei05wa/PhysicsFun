'use client';

import Link from 'next/link';
import React, { useEffect, useRef, useState, useCallback } from 'react';

// ─── Types ────────────────────────────────────────────────────────────────────
interface Ball {
  x: number; y: number; r: number;
  vx: number; vy: number;
  color: string;
  trail: { x: number; y: number }[];
}

// ─── Static Data ──────────────────────────────────────────────────────────────
const ARTICLES = [
  { id: 1, title: 'ทำไมเราถึงไม่รู้สึกว่าโลกหมุน?', image: '🌍', desc: 'โลกหมุนรอบแกนด้วยความเร็ว 1,670 km/h แต่เราไม่รู้สึกอะไรเลย เพราะสิ่งแวดล้อมรอบตัวเราหมุนไปพร้อมกันทั้งหมด ไม่มีการเปลี่ยนแปลงสัมพัทธ์ระหว่างเรากับสิ่งของรอบข้าง นักฟิสิกส์เรียกปรากฏการณ์นี้ว่า "กรอบอ้างอิงเฉื่อย" ซึ่งเป็นรากฐานของทฤษฎีสัมพัทธภาพ', concept: 'กรอบอ้างอิงเฉื่อย และ ทฤษฎีสัมพัทธภาพ' },
  { id: 2, title: 'เหตุใดท้องฟ้าจึงเป็นสีฟ้า?', image: '☀️', desc: 'แสงอาทิตย์ประกอบด้วยทุกสีในสเปกตรัม เมื่อผ่านชั้นบรรยากาศ โมเลกุลอากาศจะกระเจิงแสงสีฟ้าออกมาในทุกทิศทางมากกว่าสีอื่น เรียกว่า "การกระเจิงเรย์ลี" นั่นทำให้เมื่อมองท้องฟ้า เราเห็นแสงสีฟ้าที่กระเจิงมาจากทุกทิศทาง', concept: 'การกระเจิงแสง (Rayleigh Scattering)' },
  { id: 3, title: 'เสียงเดินทางในอวกาศได้ไหม?', image: '🚀', desc: 'เสียงเป็นคลื่นกลที่ต้องการตัวกลางในการเดินทาง เช่น อากาศ น้ำ หรือของแข็ง ในอวกาศที่แทบไม่มีโมเลกุลใดเลย เสียงจึงไม่สามารถเดินทางได้ นั่นคือเหตุผลที่ภาพยนตร์วิทยาศาสตร์หลายเรื่องผิดพลาดเมื่อมีเสียงระเบิดในอวกาศ', concept: 'คลื่นกล และ ตัวกลาง (Mechanical Waves)' },
  { id: 4, title: 'ทำไมแม่เหล็กจึงดูดกัน?', image: '🧲', desc: 'แรงแม่เหล็กเกิดจากการเคลื่อนที่ของอิเล็กตรอนภายในอะตอม ในวัสดุแม่เหล็ก อิเล็กตรอนของอะตอมหลายๆ ตัวหมุนในทิศทางเดียวกัน ทำให้เกิดสนามแม่เหล็กสุทธิ ขั้วเหนือและขั้วใต้เกิดจากทิศทางสนามที่ต่างกัน ขั้วตรงข้ามดูดกัน ขั้วเดียวกันผลักกัน', concept: 'สนามแม่เหล็ก และ สปินของอิเล็กตรอน' },
  { id: 5, title: 'E=mc² หมายความว่าอะไร?', image: '⚡', desc: 'สมการของไอน์สไตน์บอกว่ามวล (m) และพลังงาน (E) คือสิ่งเดียวกันในรูปแบบที่ต่างกัน ตัวคูณคือ c² ซึ่งเป็นความเร็วแสงยกกำลังสอง มีค่ามหาศาลมาก หมายความว่ามวลเพียงเล็กน้อยแปลงเป็นพลังงานได้มหาศาล นี่คือหลักการเบื้องหลังพลังงานนิวเคลียร์', concept: 'ทฤษฎีสัมพัทธภาพพิเศษ (Special Relativity)' },
];

const TOPICS = [
  { num: '01', icon: '⚙️', title: 'กลศาสตร์', desc: 'รากฐานของฟิสิกส์ทั้งหมด เรียนรู้การเคลื่อนที่ แรง และพลังงานในชีวิตจริง', accent: '#00e5ff', lessons: [{ title: 'การเคลื่อนที่แนวตรง', detail: 'ความเร็ว ความเร่ง สมการ SUVAT' }, { title: 'กฎการเคลื่อนที่ของนิวตัน', detail: 'F=ma และการประยุกต์กับแรงต่างๆ' }, { title: 'งานและพลังงาน', detail: 'พลังงานจลน์ ศักย์ และการอนุรักษ์พลังงาน' }, { title: 'โมเมนตัมและการชน', detail: 'กฎอนุรักษ์โมเมนตัม elastic vs inelastic' }] },
  { num: '02', icon: '🌊', title: 'คลื่นและเสียง', desc: 'ทำความเข้าใจธรรมชาติของคลื่น ตั้งแต่เสียงในอากาศไปถึงคลื่นแม่เหล็กไฟฟ้า', accent: '#a78bfa', lessons: [{ title: 'สมบัติของคลื่น', detail: 'ความถี่ แอมพลิจูด ความยาวคลื่น ความเร็ว' }, { title: 'การแทรกสอดและการเลี้ยวเบน', detail: 'Constructive / Destructive interference' }, { title: 'เสียงและการได้ยิน', detail: 'ระดับเสียง dB ปรากฏการณ์ดอปเปลอร์' }, { title: 'คลื่นนิ่ง', detail: 'Harmonic, overtone และการสั่นพ้อง' }] },
  { num: '03', icon: '⚡', title: 'ไฟฟ้าและแม่เหล็ก', desc: 'หัวใจของเทคโนโลยีสมัยใหม่ ตั้งแต่วงจรพื้นฐานจนถึงสนามแม่เหล็ก', accent: '#fbbf24', lessons: [{ title: 'ประจุและสนามไฟฟ้า', detail: 'กฎของคูลอมบ์ และ Electric field lines' }, { title: 'วงจรไฟฟ้ากระแสตรง', detail: 'กฎของโอห์ม วงจรอนุกรม/ขนาน' }, { title: 'สนามแม่เหล็ก', detail: 'แรงบนตัวนำ และกฎมือขวา' }, { title: 'การเหนี่ยวนำแม่เหล็กไฟฟ้า', detail: 'กฎของฟาราเดย์ และ Lenzs law' }] },
  { num: '04', icon: '🔭', title: 'แสงและทัศนศาสตร์', desc: 'สำรวจธรรมชาติของแสง การสะท้อน การหักเห และอุปกรณ์ออปติก', accent: '#34d399', lessons: [{ title: 'การสะท้อนของแสง', detail: 'กฎการสะท้อน กระจกเว้าและนูน' }, { title: 'การหักเหของแสง', detail: 'กฎของสเนลล์ การสะท้อนภายในทั้งหมด' }, { title: 'เลนส์และการเกิดภาพ', detail: 'เลนส์นูน เลนส์เว้า สมการเลนส์บาง' }, { title: 'แสงและสี', detail: 'สเปกตรัม การกระจายแสง และโพลาไรเซชัน' }] },
  { num: '05', icon: '🔥', title: 'ความร้อนและอุณหพลศาสตร์', desc: 'เรียนรู้พลังงานความร้อน กฎของก๊าซ และกระบวนการทางอุณหพลศาสตร์', accent: '#f472b6', lessons: [{ title: 'อุณหภูมิและความร้อน', detail: 'ความจุความร้อน การถ่ายเทความร้อน 3 แบบ' }, { title: 'กฎของก๊าซ', detail: 'Boyle, Charles, Gay-Lussac และ Ideal Gas Law' }, { title: 'กฎข้อที่ 1 ของอุณหพลศาสตร์', detail: 'การอนุรักษ์พลังงานในระบบความร้อน' }, { title: 'กฎข้อที่ 2 ของอุณหพลศาสตร์', detail: 'เอนโทรปี และประสิทธิภาพของเครื่องจักร' }] },
  { num: '06', icon: '🔬', title: 'ฟิสิกส์สมัยใหม่', desc: 'ก้าวเข้าสู่โลกของควอนตัมและสัมพัทธภาพ ฟิสิกส์ที่เปลี่ยนโลก', accent: '#60a5fa', lessons: [{ title: 'ทฤษฎีสัมพัทธภาพพิเศษ', detail: 'E=mc² การขยายเวลา และการหดตัวของความยาว' }, { title: 'ฟิสิกส์ควอนตัม', detail: 'คลื่น-อนุภาค สมการของชเรอดิงเงอร์' }, { title: 'ฟิสิกส์นิวเคลียร์', detail: 'โครงสร้างนิวเคลียส การสลายกัมมันตรังสี' }, { title: 'อนุภาคมูลฐาน', detail: 'Standard Model, quarks และ fundamental forces' }] },
];

const FEATURES = [
  { num: '01', icon: '🔁', title: 'เรียนแบบ Micro-Learning', subtitle: 'Bite-size + Repeat', desc: 'เรียนแบบ Interactive ใช้เวลานิดเดียว ด้วย Animation และ Simulation', accent: '#a78bfa', hoverContent: { title: 'Session วันนี้', preview: [], steps: ['⚡ Quick Quiz: 3 นาที', '🔁 Review: สิ่งที่กำลังจะลืม', '🎯 New Concept: 5 นาที', '✅ Done! +120 XP'] } },
  { num: '02', icon: '🧩', title: 'ทำโจทย์ ฝึกแก้ปัญหา', subtitle: 'Problem-First Learning', desc: 'ทำโจทย์จริง มี hint ค่อยๆ ไขข้อสงสัย เห็นภาพทีละขั้น ไม่ท่องจำแต่เข้าใจลึก', accent: '#00e5ff', hoverContent: { title: 'ลองเลย', preview: [{ q: 'ลูกบอลมวล 2 kg ตกจากที่สูง 10 m ความเร็วตอนแตะพื้นเป็นเท่าไร?', hint: 'ใช้ v² = u² + 2as โดย a = g = 9.8 m/s²' }], steps: ['Step 1: ระบุตัวแปร', 'Step 2: เลือกสมการ', 'Step 3: แทนค่า', '✓ คำตอบ: 14 m/s'] } },
  { num: '03', icon: '🎮', title: 'เล่นเกม & แข่งขัน', subtitle: 'Game Mode + Community', desc: 'แข่งกับเพื่อน สะสม reward ปลดล็อก achievement', accent: '#34d399', hoverContent: { title: 'Leaderboard วันนี้', preview: [], steps: ['🥇 PhysicsKing  — 4,280 XP', '🥈 StarStudent  — 3,950 XP', '🥉 You  — 3,210 XP', '🏆 Badge ใหม่ปลดล็อกแล้ว!'] } },
];

// ─── Hero Background Canvas ───────────────────────────────────────────────────
function HeroBgCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d')!;
    let raf: number;

    const resize = () => { canvas.width = window.innerWidth; canvas.height = window.innerHeight; initParticles(); };

    interface Particle { x: number; y: number; vx: number; vy: number; r: number; baseAlpha: number; alpha: number; hue: number; pulseOffset: number; }
    const COUNT = 80, CONNECT_DIST = 160;
    let particles: Particle[] = [];
    let mouse = { x: -9999, y: -9999 };

    const initParticles = () => {
      const W = canvas.width, H = canvas.height, LEFT = W * 0.28;
      particles = Array.from({ length: COUNT }, () => ({ x: LEFT + Math.random() * (W - LEFT), y: Math.random() * H, vx: (Math.random() - 0.5) * 0.4, vy: (Math.random() - 0.5) * 0.3, r: 1.2 + Math.random() * 2.2, baseAlpha: 0.35 + Math.random() * 0.55, alpha: 0, hue: 185 + Math.random() * 85, pulseOffset: Math.random() * Math.PI * 2 }));
    };

    initParticles();
    window.addEventListener('resize', resize);
    const onMove = (e: MouseEvent) => { mouse.x = e.clientX; mouse.y = e.clientY; };
    window.addEventListener('mousemove', onMove);

    let t = 0;
    const draw = () => {
      t += 0.014;
      const W = canvas.width, H = canvas.height, LEFT = W * 0.28;
      ctx.clearRect(0, 0, W, H);

      const nb1 = ctx.createRadialGradient(W*.68, H*.42, 0, W*.68, H*.42, W*.45);
      nb1.addColorStop(0,'rgba(0,229,255,0.055)'); nb1.addColorStop(.4,'rgba(124,58,237,0.035)'); nb1.addColorStop(.7,'rgba(0,229,255,0.015)'); nb1.addColorStop(1,'transparent');
      ctx.fillStyle = nb1; ctx.fillRect(LEFT, 0, W-LEFT, H);

      const nb2 = ctx.createRadialGradient(W*.85, H*.7, 0, W*.85, H*.7, W*.28);
      nb2.addColorStop(0,'rgba(167,139,250,0.04)'); nb2.addColorStop(.5,'rgba(0,229,255,0.015)'); nb2.addColorStop(1,'transparent');
      ctx.fillStyle = nb2; ctx.fillRect(LEFT, 0, W-LEFT, H);

      ctx.strokeStyle = 'rgba(0,229,255,0.025)'; ctx.lineWidth = 0.5; ctx.beginPath();
      for (let x=LEFT; x<W; x+=60) { ctx.moveTo(x,0); ctx.lineTo(x,H); }
      for (let y=0; y<H; y+=60)    { ctx.moveTo(LEFT,y); ctx.lineTo(W,y); }
      ctx.stroke();

      const rCX = W*.72, rCY = H*.42;
      [200,300,420].forEach((radius,i) => {
        ctx.save(); ctx.translate(rCX,rCY); ctx.rotate(t*(0.08+i*0.04)*(i%2===0?1:-1));
        ctx.strokeStyle=`rgba(0,229,255,${0.07-i*0.018})`; ctx.lineWidth=1; ctx.setLineDash(i===1?[6,14]:i===2?[2,18]:[]);
        ctx.beginPath(); ctx.arc(0,0,radius,0,Math.PI*2); ctx.stroke(); ctx.setLineDash([]); ctx.restore();
        const ang=t*(1.2+i*0.4)*(i%2===0?1:-1), ex=rCX+Math.cos(ang)*radius, ey=rCY+Math.sin(ang)*radius;
        const eg=ctx.createRadialGradient(ex,ey,0,ex,ey,12); eg.addColorStop(0,`rgba(0,229,255,${0.7-i*0.15})`); eg.addColorStop(1,'transparent');
        ctx.fillStyle=eg; ctx.beginPath(); ctx.arc(ex,ey,12,0,Math.PI*2); ctx.fill();
        ctx.fillStyle=`rgba(0,229,255,${0.9-i*0.2})`; ctx.beginPath(); ctx.arc(ex,ey,3-i*0.5,0,Math.PI*2); ctx.fill();
      });

      particles.forEach(p => {
        p.x+=p.vx; p.y+=p.vy;
        if(p.x<LEFT) p.x=W; if(p.x>W) p.x=LEFT; if(p.y<0) p.y=H; if(p.y>H) p.y=0;
        const mdx=p.x-mouse.x, mdy=p.y-mouse.y, md=Math.sqrt(mdx*mdx+mdy*mdy);
        if(md<110){const f=(110-md)/110*0.7; p.vx+=(mdx/md)*f*0.045; p.vy+=(mdy/md)*f*0.045;}
        p.vx*=0.991; p.vy*=0.991;
        p.alpha=p.baseAlpha*(0.65+0.35*Math.sin(t*1.9+p.pulseOffset));
      });

      for(let i=0;i<particles.length;i++){
        for(let j=i+1;j<particles.length;j++){
          const a=particles[i],b=particles[j],dx=a.x-b.x,dy=a.y-b.y,dist=Math.sqrt(dx*dx+dy*dy);
          if(dist<CONNECT_DIST){const s=1-dist/CONNECT_DIST; ctx.globalAlpha=s*s*0.22; ctx.strokeStyle=`hsl(${(a.hue+b.hue)/2},90%,68%)`; ctx.lineWidth=s*1.1; ctx.beginPath(); ctx.moveTo(a.x,a.y); ctx.lineTo(b.x,b.y); ctx.stroke();}
        }
      }
      ctx.globalAlpha=1;

      particles.forEach(p => {
        const h=ctx.createRadialGradient(p.x,p.y,0,p.x,p.y,p.r*7);
        h.addColorStop(0,`hsla(${p.hue},100%,72%,${p.alpha*0.55})`); h.addColorStop(.5,`hsla(${p.hue},100%,65%,${p.alpha*0.15})`); h.addColorStop(1,'transparent');
        ctx.fillStyle=h; ctx.beginPath(); ctx.arc(p.x,p.y,p.r*7,0,Math.PI*2); ctx.fill();
        ctx.globalAlpha=p.alpha; ctx.fillStyle=`hsl(${p.hue},92%,80%)`; ctx.beginPath(); ctx.arc(p.x,p.y,p.r,0,Math.PI*2); ctx.fill(); ctx.globalAlpha=1;
      });

      ctx.font='12px "JetBrains Mono",monospace';
      [{ text:'F = ma',x:W*.55,y:H*.18},{ text:'E = mc²',x:W*.78,y:H*.52},{ text:'λ = h/p',x:W*.62,y:H*.80},{ text:'∇ × B = μ₀J',x:W*.88,y:H*.25},{ text:'PV = nRT',x:W*.48,y:H*.65}].forEach((l,i)=>{
        const drift=Math.sin(t*.55+i*2)*7, pa=0.12+Math.sin(t*.4+i*1.5)*0.05, hue=185+i*18;
        ctx.globalAlpha=pa*.5; ctx.fillStyle=`hsl(${hue},80%,65%)`; ctx.fillText(l.text,l.x+1,l.y+drift+1);
        ctx.globalAlpha=pa; ctx.fillStyle=`hsl(${hue},90%,78%)`; ctx.fillText(l.text,l.x,l.y+drift); ctx.globalAlpha=1;
      });

      const vig=ctx.createLinearGradient(0,0,W*.40,0);
      vig.addColorStop(0,'rgba(5,8,16,1)'); vig.addColorStop(.65,'rgba(5,8,16,0.6)'); vig.addColorStop(1,'transparent');
      ctx.fillStyle=vig; ctx.fillRect(0,0,W*.40,H);

      raf=requestAnimationFrame(draw);
    };
    draw();

    return () => { cancelAnimationFrame(raf); window.removeEventListener('resize',resize); window.removeEventListener('mousemove',onMove); };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position:'absolute', inset:0, width:'100%', height:'100%',
        pointerEvents:'none', zIndex:0,
        willChange:'transform', transform:'translateZ(0)',
      }}
    />
  );
}

// ─── Scroll Reveal Hook ───────────────────────────────────────────────────────
function useScrollReveal(threshold=0.12, rootMargin='0px 0px -40px 0px') {
  const ref = useRef<HTMLDivElement>(null);
  const [visible,setVisible] = useState(false);
  useEffect(() => {
    const el=ref.current; if(!el) return;
    const obs=new IntersectionObserver(([e])=>{ if(e.isIntersecting){setVisible(true);obs.disconnect();} },{threshold,rootMargin});
    obs.observe(el); return()=>obs.disconnect();
  },[threshold,rootMargin]);
  return {ref,visible};
}

// ─── Section Reveal ───────────────────────────────────────────────────────────
function SectionReveal({children,delay=0,style={}}: {children:React.ReactNode;delay?:number;style?:React.CSSProperties}) {
  const {ref,visible}=useScrollReveal(0.08,'0px 0px -60px 0px');
  return (
    <div ref={ref} style={{ opacity:visible?1:0, transition:`opacity 0.7s ease ${delay}s`, ...style }}>
      {children}
    </div>
  );
}

// ─── Article Carousel ─────────────────────────────────────────────────────────
function ArticleCarousel() {
  const [active,setActive]=useState(0);
  const [animDir,setAnimDir]=useState<'left'|'right'>('right');
  const [animKey,setAnimKey]=useState(0);
  const [isAnimating,setIsAnimating]=useState(false);

  const go=useCallback((dir:'prev'|'next')=>{
    if(isAnimating) return;
    setIsAnimating(true); setAnimDir(dir==='next'?'right':'left');
    setActive(p=>dir==='next'?(p+1)%ARTICLES.length:(p-1+ARTICLES.length)%ARTICLES.length);
    setAnimKey(k=>k+1); setTimeout(()=>setIsAnimating(false),450);
  },[isAnimating]);

  const article=ARTICLES[active];
  return (
    <div style={{position:'relative',maxWidth:760,margin:'0 auto'}}>
      <div key={animKey} style={{ background:'rgba(8,13,26,0.9)', border:'1px solid rgba(0,229,255,0.15)', borderRadius:16, overflow:'hidden', animation:`carouselIn 0.4s ease both`, boxShadow:'0 0 60px rgba(0,229,255,0.08), 0 24px 80px rgba(0,0,0,0.5)' }}>
        <div style={{ height:200, background:'linear-gradient(135deg,#0a1628 0%,#050810 100%)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'5rem', position:'relative', overflow:'hidden', borderBottom:'1px solid rgba(0,229,255,0.1)' }}>
          <div style={{position:'absolute',inset:0,background:'radial-gradient(ellipse at center,rgba(0,229,255,0.1) 0%,transparent 65%)',animation:'breathe 3s ease-in-out infinite'}}/>
          <div style={{position:'absolute',width:160,height:160,border:'1px solid rgba(0,229,255,0.1)',borderRadius:'50%',animation:'spinOrbit 12s linear infinite'}}/>
          <div style={{position:'absolute',width:100,height:100,border:'1px dashed rgba(0,229,255,0.07)',borderRadius:'50%',animation:'spinOrbit 8s linear infinite reverse'}}/>
          <span style={{position:'relative',zIndex:1,filter:'drop-shadow(0 0 24px rgba(0,229,255,0.5))',animation:'floatY 3s ease-in-out infinite'}}>{article.image}</span>
          <div style={{position:'absolute',top:'1rem',left:'1rem',fontFamily:"'JetBrains Mono',monospace",fontSize:'0.58rem',letterSpacing:'0.15em',color:'#00e5ff',border:'1px solid rgba(0,229,255,0.3)',padding:'0.2rem 0.6rem',borderRadius:3}}>ARTICLE {String(active+1).padStart(2,'0')}</div>
          <div style={{position:'absolute',bottom:0,left:0,right:0,height:2,background:'rgba(0,229,255,0.1)'}}>
            <div key={animKey} style={{height:'100%',background:'linear-gradient(90deg,#00e5ff,#7c3aed)',animation:'progressFill 6s linear forwards',boxShadow:'0 0 8px #00e5ff'}}/>
          </div>
        </div>
        <div style={{padding:'1.75rem 2rem'}}>
          <h3 style={{fontFamily:"'Bebas Neue',cursive",fontSize:'clamp(1.3rem,2.5vw,1.7rem)',letterSpacing:'0.03em',color:'#e8edf5',marginBottom:'0.875rem',lineHeight:1.1}}>{article.title}</h3>
          <p style={{fontFamily:"'Anuphan',sans-serif",fontSize:'0.9rem',color:'#7a8aaa',lineHeight:1.8,fontWeight:300,marginBottom:'1.25rem'}}>{article.desc}</p>
          <div style={{paddingTop:'1rem',borderTop:'1px solid rgba(255,255,255,0.06)',display:'flex',alignItems:'center',gap:'0.5rem'}}>
            <span style={{fontFamily:"'JetBrains Mono',monospace",fontSize:'0.62rem',color:'#5a6480',letterSpacing:'0.05em'}}>ความรู้ฟิสิกส์ที่ใช้ :</span>
            <span style={{fontFamily:"'JetBrains Mono',monospace",fontSize:'0.62rem',color:'#00e5ff',letterSpacing:'0.05em'}}>{article.concept}</span>
          </div>
        </div>
      </div>

      {(['prev','next'] as const).map(dir=>(
        <button key={dir} onClick={()=>go(dir)} style={{ position:'absolute', [dir==='prev'?'left':'right']:-20, top:'38%', transform:'translateY(-50%)', width:44, height:44, borderRadius:'50%', background:'rgba(8,13,26,0.95)', border:'1px solid rgba(0,229,255,0.2)', color:'#7a8aaa', cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', zIndex:10, transition:'all 0.25s cubic-bezier(.16,1,.3,1)' }}
          onMouseEnter={e=>{const el=e.currentTarget;el.style.borderColor='#00e5ff';el.style.color='#00e5ff';el.style.boxShadow='0 0 20px rgba(0,229,255,0.3)';el.style.transform='translateY(-50%) scale(1.1)';}}
          onMouseLeave={e=>{const el=e.currentTarget;el.style.borderColor='rgba(0,229,255,0.2)';el.style.color='#7a8aaa';el.style.boxShadow='none';el.style.transform='translateY(-50%) scale(1)';}}>
          <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">{dir==='prev'?<polyline points="15,18 9,12 15,6"/>:<polyline points="9,18 15,12 9,6"/>}</svg>
        </button>
      ))}
      <div style={{display:'flex',justifyContent:'center',gap:6,marginTop:'1.5rem'}}>
        {ARTICLES.map((_,i)=>(
          <button key={i} onClick={()=>{if(!isAnimating){setAnimDir(i>active?'right':'left');setActive(i);setAnimKey(k=>k+1);}}} style={{ width:i===active?28:7, height:7, borderRadius:99, background:i===active?'#00e5ff':'rgba(255,255,255,0.12)', border:'none', cursor:'pointer', padding:0, transition:'width 0.4s cubic-bezier(.16,1,.3,1), background 0.3s', boxShadow:i===active?'0 0 12px rgba(0,229,255,0.8)':'none' }}/>
        ))}
      </div>
    </div>
  );
}

// ─── Topic Row ────────────────────────────────────────────────────────────────
function TopicRow({topic,index}: {topic:typeof TOPICS[0];index:number}) {
  const [open,setOpen]=useState(false);
  const {ref,visible}=useScrollReveal(0.1,'0px 0px -20px 0px');
  const aRGB=topic.accent==='#00e5ff'?'0,229,255':topic.accent==='#a78bfa'?'167,139,250':topic.accent==='#fbbf24'?'251,191,36':topic.accent==='#34d399'?'52,211,153':topic.accent==='#f472b6'?'244,114,182':'96,165,250';
  return (
    <div ref={ref} onMouseEnter={()=>setOpen(true)} onMouseLeave={()=>setOpen(false)} style={{ borderBottom:'1px solid rgba(255,255,255,0.05)', background:open?`rgba(${aRGB},0.04)`:'transparent', cursor:'pointer', opacity:visible?1:0, transition:`opacity 0.5s ease ${index*0.07}s, background 0.3s` }}>
      <div style={{display:'flex',alignItems:'center',gap:'1.5rem',padding:'1.4rem 1.75rem'}}>
        <div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:'0.65rem',color:open?topic.accent:'rgba(255,255,255,0.15)',minWidth:28,transition:'color 0.25s',letterSpacing:'0.05em'}}>{topic.num}</div>
        <div style={{fontSize:'1.3rem',lineHeight:1,flexShrink:0,opacity:open?1:0.45,transition:'opacity 0.3s'}}>{topic.icon}</div>
        <div style={{flex:1,minWidth:0}}>
          <div style={{fontFamily:"'Anuphan',sans-serif",fontWeight:600,fontSize:'clamp(0.9rem,1.5vw,1.05rem)',color:'#e8edf5',marginBottom:open?'0.25rem':0,transition:'margin 0.25s'}}>{topic.title}</div>
          <div style={{fontFamily:"'Anuphan',sans-serif",fontSize:'0.82rem',color:'#5a6480',fontWeight:300,lineHeight:1.5,maxHeight:open?40:0,overflow:'hidden',opacity:open?1:0,transition:'max-height 0.35s ease, opacity 0.3s'}}>{topic.desc}</div>
        </div>
        <div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:'0.6rem',color:open?topic.accent:'#3a4460',border:`1px solid ${open?topic.accent+'55':'rgba(255,255,255,0.07)'}`,padding:'0.2rem 0.6rem',borderRadius:4,transition:'all 0.25s',flexShrink:0,letterSpacing:'0.05em',background:open?`${topic.accent}10`:'transparent'}}>{topic.lessons.length} lessons</div>
        <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24" style={{color:open?topic.accent:'#3a4460',transition:'color 0.25s, transform 0.35s cubic-bezier(.16,1,.3,1)',transform:open?'rotate(90deg)':'none',flexShrink:0}}><polyline points="9,18 15,12 9,6"/></svg>
      </div>
      <div style={{maxHeight:open?topic.lessons.length*70:0,overflow:'hidden',transition:'max-height 0.45s cubic-bezier(0.16,1,0.3,1)'}}>
        <div style={{padding:'0 1.75rem 1.25rem 5.5rem',display:'flex',flexDirection:'column',gap:'0.5rem'}}>
          {topic.lessons.map((lesson,i)=>(
            <div key={i} style={{display:'flex',alignItems:'flex-start',gap:'0.875rem',padding:'0.625rem 0.875rem',background:'rgba(255,255,255,0.025)',borderLeft:`2px solid ${topic.accent}44`,borderRadius:'0 6px 6px 0',animation:open?`slideRight 0.3s ease ${i*0.07}s both`:'none'}}>
              <div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:'0.58rem',color:topic.accent+'88',minWidth:16,marginTop:2}}>{String(i+1).padStart(2,'0')}</div>
              <div>
                <div style={{fontFamily:"'Anuphan',sans-serif",fontSize:'0.85rem',fontWeight:500,color:'#c8d0e0',marginBottom:'0.15rem'}}>{lesson.title}</div>
                <div style={{fontFamily:"'Anuphan',sans-serif",fontSize:'0.75rem',color:'#4a5570',fontWeight:300}}>{lesson.detail}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── Feature Card ─────────────────────────────────────────────────────────────
function FeatureCard({feature,index}: {feature:typeof FEATURES[0];index:number}) {
  const [hovered,setHovered]=useState(false);
  const {ref,visible}=useScrollReveal(0.15,'0px 0px -40px 0px');
  return (
    <div ref={ref} onMouseEnter={()=>setHovered(true)} onMouseLeave={()=>setHovered(false)} style={{ position:'relative', overflow:'hidden', cursor:'default', background:hovered?'#0d1426':'#080d1a', border:`1px solid ${hovered?feature.accent+'44':'rgba(255,255,255,0.06)'}`, borderRadius:12, padding:'2.25rem', transition:'all 0.4s cubic-bezier(.16,1,.3,1)', boxShadow:hovered?`0 0 50px ${feature.accent}20, 0 24px 50px rgba(0,0,0,0.35)`:'0 4px 20px rgba(0,0,0,0.2)', transform:hovered?'translateY(-6px)':visible?'translateY(0)':'translateY(24px)', opacity:visible?1:0, transitionDelay:visible?`${index*0.1}s`:'0s' }}>
      <div style={{position:'absolute',top:0,right:0,width:120,height:120,background:`radial-gradient(circle at top right, ${feature.accent}15, transparent 70%)`,transition:'opacity 0.3s',opacity:hovered?1:0}}/>
      <div style={{position:'absolute',top:0,left:0,right:0,height:2,background:hovered?`linear-gradient(90deg,transparent,${feature.accent},transparent)`:'transparent',transition:'all 0.4s',boxShadow:hovered?`0 0 16px ${feature.accent}`:'none'}}/>
      {hovered&&<div style={{position:'absolute',top:0,left:0,width:'100%',height:'100%',pointerEvents:'none',borderRadius:12,overflow:'hidden'}}><div style={{position:'absolute',top:0,left:'-100%',width:'60%',height:'100%',background:`linear-gradient(90deg,transparent,${feature.accent}08,transparent)`,animation:'scanLine 2.5s linear infinite'}}/></div>}
      <div style={{opacity:hovered?0:1,transition:'opacity 0.2s'}}>
        <div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:'0.6rem',color:'#5a6480',letterSpacing:'0.1em',marginBottom:'0.75rem'}}>{feature.num}</div>
        <div style={{width:52,height:52,marginBottom:'1.5rem',display:'flex',alignItems:'center',justifyContent:'center',border:`1px solid ${feature.accent}22`,background:`${feature.accent}08`,fontSize:'1.6rem',borderRadius:10,boxShadow:`0 0 20px ${feature.accent}15`}}>{feature.icon}</div>
        <div style={{fontFamily:"'Bebas Neue',cursive",fontSize:'1.5rem',letterSpacing:'0.05em',marginBottom:'0.25rem',color:'#e8edf5'}}>{feature.title}</div>
        <div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:'0.58rem',color:feature.accent,letterSpacing:'0.08em',marginBottom:'0.875rem'}}>{feature.subtitle}</div>
        <p style={{fontSize:'0.85rem',color:'#5a6480',lineHeight:1.7,fontWeight:300}}>{feature.desc}</p>
      </div>
      <div style={{position:'absolute',inset:0,padding:'1.75rem',opacity:hovered?1:0,transition:'opacity 0.3s 0.1s',display:'flex',flexDirection:'column',justifyContent:'space-between',pointerEvents:hovered?'auto':'none'}}>
        <div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:'0.62rem',color:feature.accent,letterSpacing:'0.12em',marginBottom:'1rem',display:'flex',alignItems:'center',gap:6}}>
          <span style={{width:6,height:6,borderRadius:'50%',background:feature.accent,display:'inline-block',boxShadow:`0 0 10px ${feature.accent}`,animation:'pulseDot 1.5s ease-in-out infinite'}}/>
          {feature.hoverContent.title}
        </div>
        <div style={{flex:1,display:'flex',flexDirection:'column',gap:'0.6rem'}}>
          {feature.hoverContent.steps.map((step,i)=>{
            const ok=step.startsWith('✓')||step.startsWith('✅');
            return <div key={i} style={{fontFamily:"'Anuphan',sans-serif",fontSize:'0.82rem',color:ok?feature.accent:'#c8d0e0',padding:'0.5rem 0.75rem',background:ok?`${feature.accent}18`:'rgba(255,255,255,0.04)',borderRadius:6,borderLeft:`2px solid ${ok?feature.accent:'rgba(255,255,255,0.08)'}`,fontWeight:ok?500:300,animation:hovered?`fadeIn 0.3s ease ${i*0.08+0.1}s both`:'none'}}>{step}</div>;
          })}
        </div>
        <div style={{marginTop:'1rem',fontFamily:"'JetBrains Mono',monospace",fontSize:'0.6rem',color:'#3a4460',letterSpacing:'0.08em'}}>hover to explore · {feature.num} / 03</div>
      </div>
    </div>
  );
}

// ─── Animated Stat ────────────────────────────────────────────────────────────
function AnimatedStat({n,l}: {n:string;l:string}) {
  const {ref,visible}=useScrollReveal(0.3);
  const [displayed,setDisplayed]=useState('0');
  useEffect(()=>{
    if(!visible) return;
    const target=parseFloat(n.replace(/[^0-9.]/g,'')), suffix=n.replace(/[0-9.]/g,''), start=performance.now();
    const tick=(now:number)=>{ const p=Math.min((now-start)/1200,1), e=1-Math.pow(1-p,3); setDisplayed(Math.round(e*target)+suffix); if(p<1) requestAnimationFrame(tick); };
    requestAnimationFrame(tick);
  },[visible,n]);
  return (
    <div ref={ref} style={{textAlign:'center',opacity:visible?1:0,transition:'opacity 0.6s ease'}}>
      <div style={{fontFamily:"'Bebas Neue',cursive",fontSize:'2rem',color:'#00e5ff',lineHeight:1,letterSpacing:'0.04em',textShadow:'0 0 20px rgba(0,229,255,0.5)'}}>{displayed}</div>
      <div style={{fontFamily:"'Anuphan',sans-serif",fontSize:'0.72rem',color:'#4a5570',marginTop:'0.2rem'}}>{l}</div>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function Home() {
  const [loaded, setLoaded] = useState(false);
  const [pct, setPct] = useState(0);
  const [scrolled, setScrolled] = useState(false);
  const [cursorActive, setCursorActive] = useState(false);
  const [showVideo, setShowVideo] = useState(false); // ✅ เพิ่มตรงนี้

  const mouseRef = useRef({ x: 0, y: 0 });
  const ringLerpRef = useRef({ x: 0, y: 0 });

  const [cursorPos, setCursorPos] = useState({ x: 0, y: 0 });
  const [ringPos, setRingPos] = useState({ x: 0, y: 0 });
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    let p = 0;
    const iv = setInterval(() => {
      p += Math.random() * 14;
      if (p >= 100) {
        p = 100;
        clearInterval(iv);
        setTimeout(() => setLoaded(true), 600);
      }
      setPct(Math.floor(p));
    }, 70);
    return () => clearInterval(iv);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
      setScrollY(window.scrollY);
    };
    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current = { x: e.clientX, y: e.clientY };
    };
    const handleDown = () => setCursorActive(true);
    const handleUp = () => setCursorActive(false);

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mousedown', handleDown);
    window.addEventListener('mouseup', handleUp);

    let raf: number;
    const animate = () => {
      setCursorPos({ x: mouseRef.current.x, y: mouseRef.current.y });
      ringLerpRef.current.x += (mouseRef.current.x - ringLerpRef.current.x) * 0.15;
      ringLerpRef.current.y += (mouseRef.current.y - ringLerpRef.current.y) * 0.15;
      setRingPos({ x: ringLerpRef.current.x, y: ringLerpRef.current.y });
      raf = requestAnimationFrame(animate);
    };
    animate();

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mousedown', handleDown);
      window.removeEventListener('mouseup', handleUp);
      cancelAnimationFrame(raf);
    };
  }, []);

  // ปิด modal เมื่อกด ESC
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setShowVideo(false); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  const parallaxY = scrollY * 0.4;

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Anuphan:wght@300;400;500;600&family=JetBrains+Mono:wght@300;400&display=swap');
        *, *::before, *::after { margin:0; padding:0; box-sizing:border-box; }
        html { font-size:16px; scroll-behavior:smooth; scroll-padding-top:80px; -webkit-font-smoothing:antialiased; -moz-osx-font-smoothing:grayscale; }
        body { background:#050810; color:#e8edf5; font-family:'Anuphan',sans-serif; cursor:none; overflow-x:hidden; }
        * { -webkit-font-smoothing: antialiased; }
        section+section::before { content:''; display:block; height:1px; background:linear-gradient(90deg,transparent 0%,rgba(0,229,255,0.07) 40%,rgba(124,58,237,0.07) 60%,transparent 100%); margin-bottom:-1px; }
        @keyframes fadeIn        { from{opacity:0} to{opacity:1} }
        @keyframes slideUp       { from{opacity:0;transform:translateY(14px)} to{opacity:1;transform:translateY(0)} }
        @keyframes slideLeft     { from{opacity:0;transform:translateX(-10px)} to{opacity:1;transform:translateX(0)} }
        @keyframes slideRight    { from{opacity:0;transform:translateX(10px)} to{opacity:1;transform:translateX(0)} }
        @keyframes carouselIn    { from{opacity:0} to{opacity:1} }
        @keyframes progressFill  { from{width:0} to{width:100%} }
        @keyframes scanH         { from{top:-2px} to{top:100%} }
        @keyframes scanLine      { from{left:-60%} to{left:160%} }
        @keyframes pulseDot      { 0%,100%{opacity:1} 50%{opacity:0.35} }
        @keyframes breathe       { 0%,100%{opacity:0.7} 50%{opacity:1} }
        @keyframes spinOrbit     { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }
        @keyframes floatY        { 0%,100%{transform:translateY(0px)} 50%{transform:translateY(-8px)} }
        @keyframes glitchFlicker { 0%,89%,91%,100%{opacity:0} 90%{opacity:0.35} }
        .hero-tag   { animation: fadeIn 0.7s ease 1.6s both; }
        .hero-title { animation: fadeIn 0.7s ease 1.8s both; }
        .hero-sub   { animation: fadeIn 0.7s ease 2.0s both; }
        .hero-act   { animation: fadeIn 0.7s ease 2.2s both; }
        nav         { animation: fadeIn 0.6s ease 2.3s both; }
        .btn-primary { transition:transform .25s cubic-bezier(.16,1,.3,1),box-shadow .25s; }
        .btn-primary:hover { transform:translateY(-3px) scale(1.02); box-shadow:0 10px 35px rgba(0,229,255,.4); }
        .btn-ghost { transition:all .25s; }
        .btn-ghost:hover { border-color:rgba(255,255,255,.4) !important; color:#e8edf5 !important; transform:translateY(-2px); }
        @media (max-width:768px) {
          nav { padding:0.875rem 1.25rem !important; }
          nav > div.nav-links { display:none !important; }
          footer { padding:1.5rem 1.25rem !important; flex-direction:column; gap:0.5rem; text-align:center; }
        }
      `}</style>

      {/* Cursor dot */}
      <div style={{
        position: 'fixed',
        left: ringPos.x,
        top: ringPos.y,
        width: 32,
        height: 32,
        border: '1px solid #00e5ff',
        borderRadius: '50%',
        pointerEvents: 'none',
        zIndex: 9998,
        transform: `translate(-50%, -50%) scale(${cursorActive ? 0.8 : 1})`,
        transition: 'transform 0.2s ease',
      }}/>
      <div style={{
        position:'fixed',
        width:cursorActive?28:36, height:cursorActive?28:36,
        border:`1px solid rgba(0,229,255,${cursorActive?0.8:0.5})`,
        borderRadius:'50%',
        transform:`translate(${ringPos.x-(cursorActive?14:18)}px,${ringPos.y-(cursorActive?14:18)}px) translateZ(0)`,
        pointerEvents:'none', zIndex:9998,
        transition:'width 0.2s, height 0.2s, border-color 0.2s',
        willChange:'transform',
      }}/>

      {/* Loading screen */}
      <div style={{ position:'fixed',inset:0,background:'#050810',zIndex:9000,display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center', opacity:loaded?0:1, visibility:loaded?'hidden':'visible', transition:'opacity 0.8s ease, visibility 0.8s ease', overflow:'hidden', isolation:'isolate', willChange:'opacity' }}>
        <div style={{position:'absolute',left:0,right:0,height:1,background:'rgba(0,229,255,0.25)',animation:'scanH 1.5s linear infinite',pointerEvents:'none'}}/>
        <div style={{fontFamily:"'Bebas Neue',cursive",fontSize:'clamp(3rem,8vw,6rem)',letterSpacing:'0.15em',position:'relative'}}>
          PHYS<span style={{color:'#00e5ff',textShadow:'0 0 40px rgba(0,229,255,0.6)'}}>FUN</span>
          {pct>60&&<>
            <div style={{position:'absolute',inset:0,color:'#ff6b35',fontFamily:"'Bebas Neue',cursive",fontSize:'inherit',letterSpacing:'inherit',animation:'glitchFlicker 3s ease infinite'}}>PHYSFUN</div>
            <div style={{position:'absolute',inset:0,color:'#a78bfa',fontFamily:"'Bebas Neue',cursive",fontSize:'inherit',letterSpacing:'inherit',animation:'glitchFlicker 2s ease 0.5s infinite'}}>PHYSFUN</div>
          </>}
        </div>
        <div style={{marginTop:'2.5rem',width:'min(300px,65vw)',height:1,background:'rgba(255,255,255,.06)',position:'relative',overflow:'hidden',borderRadius:1}}>
          <div style={{height:'100%',background:'linear-gradient(90deg,#7c3aed,#00e5ff)',width:`${pct}%`,boxShadow:'0 0 16px #00e5ff',transition:'width .05s linear'}}/>
        </div>
        <div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:'0.7rem',color:'#5a6480',marginTop:'0.875rem',letterSpacing:'0.12em',display:'flex',gap:'1.5rem',alignItems:'center'}}>
          <span style={{color:'#00e5ff'}}>{pct}%</span><span>INITIALIZING PHYSICS ENGINE</span>
        </div>
        <div style={{position:'absolute',bottom:'2rem',display:'flex',gap:'0.3rem'}}>
          {[0,1,2,3,4].map(i=><div key={i} style={{width:3,height:3,borderRadius:'50%',background:pct>i*20?'#00e5ff':'rgba(255,255,255,0.1)',transition:'background 0.3s',boxShadow:pct>i*20?'0 0 8px #00e5ff':'none'}}/>)}
        </div>
      </div>

      {/* Nav */}
      <nav style={{
        position:'fixed',top:0,left:0,right:0,zIndex:100,
        padding:'1rem 2.5rem',display:'flex',alignItems:'center',justifyContent:'space-between',
        borderBottom:`1px solid ${scrolled?'rgba(0,229,255,.1)':'transparent'}`,
        background:scrolled?'rgba(5,8,16,.92)':'rgba(5,8,16,0.01)',
        backdropFilter:'blur(20px)',
        WebkitBackdropFilter:'blur(20px)',
        transition:'background 0.4s ease, border-color 0.4s ease',
        isolation:'isolate',
        willChange:'transform',
      }}>
        <a href="#hero" style={{fontFamily:"'Bebas Neue',cursive",fontSize:'1.6rem',letterSpacing:'0.1em',color:'#e8edf5',textDecoration:'none'}}>
          PHYS<span style={{color:'#00e5ff',textShadow:scrolled?'0 0 20px rgba(0,229,255,0.5)':'none',transition:'text-shadow 0.4s'}}>FUN</span>
        </a>
        <div className="nav-links" style={{display:'flex',gap:'2.5rem'}}>
          {[{label:'Feature',href:'#features'},{label:'content-บทความ',href:'#articles'},{label:'ตัวอย่างการใช้งาน',href:'#demo'},{label:'เริ่มต้นใช้งาน',href:'#cta'}].map(item=>(
            <a key={item.label} href={item.href} style={{fontSize:'0.78rem',letterSpacing:'0.08em',color:'#5a6480',textDecoration:'none',fontWeight:400,transition:'color .2s',whiteSpace:'nowrap'}} onMouseEnter={e=>(e.currentTarget.style.color='#e8edf5')} onMouseLeave={e=>(e.currentTarget.style.color='#5a6480')}>{item.label}</a>
          ))}
        </div>
        <a href="#cta" style={{fontFamily:"'JetBrains Mono',monospace",fontSize:'0.72rem',letterSpacing:'0.1em',padding:'0.55rem 1.4rem',border:'1px solid #00e5ff',color:'#00e5ff',textDecoration:'none',textTransform:'uppercase',transition:'all 0.25s'}}
          onMouseEnter={e=>{e.currentTarget.style.background='#00e5ff';e.currentTarget.style.color='#050810';e.currentTarget.style.boxShadow='0 0 20px rgba(0,229,255,0.4)';}}
          onMouseLeave={e=>{e.currentTarget.style.background='transparent';e.currentTarget.style.color='#00e5ff';e.currentTarget.style.boxShadow='none';}}>
          เริ่มเรียนฟรี
        </a>
      </nav>

      {/* ── Hero ─────────────────────────────────────────────────────────── */}
      <section id="hero" style={{minHeight:'100vh',display:'flex',alignItems:'center',position:'relative',padding:'6rem clamp(1.5rem,8vw,8rem) 4rem',overflow:'hidden'}}>
        <HeroBgCanvas/>
        <div style={{position:'relative',zIndex:1,width:'100%',maxWidth:640,transform:`translateY(${-parallaxY*0.12}px)`}}>
          <div className="hero-tag" style={{fontFamily:"'JetBrains Mono',monospace",fontSize:'0.65rem',letterSpacing:'0.2em',color:'#00e5ff',textTransform:'uppercase',marginBottom:'1.75rem',border:'1px solid rgba(0,229,255,.3)',padding:'0.35rem 0.9rem',display:'inline-flex',alignItems:'center',gap:'0.5rem',background:'rgba(0,229,255,0.04)'}}>
            <span style={{width:6,height:6,borderRadius:'50%',background:'#00e5ff',display:'inline-block',boxShadow:'0 0 10px #00e5ff',animation:'pulseDot 2s ease-in-out infinite'}}/>
            Physics Learning Platform
          </div>
          <h1 className="hero-title" style={{fontFamily:"'Bebas Neue',cursive",fontSize:'clamp(5rem,12vw,10.5rem)',lineHeight:0.88,letterSpacing:'0.02em',marginBottom:'0.3em',color:'#e8edf5'}}>
            PHYS<span style={{color:'#00e5ff',textShadow:'0 0 60px rgba(0,229,255,.6),0 0 120px rgba(0,229,255,.25)'}}>FUN</span>
          </h1>
          <p className="hero-sub" style={{fontFamily:"'Anuphan',sans-serif",fontSize:'clamp(1rem,2vw,1.25rem)',color:'#7a8aaa',fontWeight:300,lineHeight:1.75,marginBottom:'2.5rem',maxWidth:520}}>
            Platform เรียนฟิสิกส์ สนุกได้สาระ เข้าใจง่าย<br/><span style={{color:'#5a6480',fontSize:'0.9em'}}>ด้วยเวลาอันสั้น</span>
          </p>
          <div className="hero-act" style={{display:'flex',gap:'0.875rem',alignItems:'center',flexWrap:'wrap'}}>
            <a href="#cta" className="btn-primary" style={{padding:'0.95rem 2.2rem',background:'#00e5ff',color:'#050810',fontFamily:"'JetBrains Mono',monospace",fontWeight:600,fontSize:'0.8rem',letterSpacing:'0.1em',textTransform:'uppercase',textDecoration:'none',display:'inline-flex',alignItems:'center',gap:'0.5rem',clipPath:'polygon(0 0,calc(100% - 10px) 0,100% 10px,100% 100%,10px 100%,0 calc(100% - 10px))'}}>
              เริ่มต้นใช้งาน<svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12,5 19,12 12,19"/></svg>
            </a>
            <a href="#demo" className="btn-ghost" style={{padding:'0.95rem 2.2rem',border:'1px solid rgba(255,255,255,.15)',color:'#7a8aaa',fontFamily:"'JetBrains Mono',monospace",fontSize:'0.8rem',letterSpacing:'0.1em',textTransform:'uppercase',textDecoration:'none'}}>Demo</a>
          </div>
        </div>
      </section>

      {/* ── Features ─────────────────────────────────────────────────────── */}
      <section id="features" style={{padding:'clamp(5rem,10vw,8rem) clamp(1.5rem,5vw,3rem)',background:'#080d1a'}}>
        <div style={{maxWidth:1100,margin:'0 auto'}}>
          <SectionReveal>
            <div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:'0.65rem',letterSpacing:'0.22em',color:'#00e5ff',textTransform:'uppercase',marginBottom:'1rem',display:'flex',alignItems:'center',gap:'0.75rem'}}>
              <span style={{width:24,height:1,background:'linear-gradient(to right,transparent,#00e5ff)',display:'inline-block'}}/>Feature
            </div>
            <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'2.5rem',alignItems:'start',marginBottom:'3.5rem'}}>
              <h2 style={{fontFamily:"'Bebas Neue',cursive",fontSize:'clamp(1.8rem,3.5vw,3rem)',lineHeight:1.1,letterSpacing:'0.02em'}}>ทำไม PhysFun<br/><span style={{color:'#00e5ff'}}>ถึงต่างออกไป</span></h2>
              <p style={{color:'#5a6480',fontSize:'0.92rem',fontWeight:300,lineHeight:1.8,alignSelf:'end'}}>ไม่ใช่แค่จำสูตร แต่เรียนรู้ผ่านการลงมือทำ เล่น และแลกเปลี่ยนความรู้เชื่อมต่อกับเพื่อนทั่วโลก</p>
            </div>
          </SectionReveal>
          <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(280px,1fr))',gap:'1.25rem'}}>
            {FEATURES.map((f,i)=><FeatureCard key={f.num} feature={f} index={i}/>)}
          </div>
        </div>
      </section>

      {/* ── Topics ───────────────────────────────────────────────────────── */}
      <section id="topics" style={{padding:'clamp(5rem,10vw,8rem) clamp(1.5rem,5vw,3rem)'}}>
        <div style={{maxWidth:1100,margin:'0 auto'}}>
          <SectionReveal>
            <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'3rem',alignItems:'start',marginBottom:'3rem'}}>
              <div>
                <div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:'0.65rem',letterSpacing:'0.22em',color:'#00e5ff',textTransform:'uppercase',marginBottom:'1rem',display:'flex',alignItems:'center',gap:'0.75rem'}}>
                  <span style={{width:24,height:1,background:'linear-gradient(to right,transparent,#00e5ff)',display:'inline-block'}}/>เนื้อหาฟิสิกส์
                </div>
                <h2 style={{fontFamily:"'Bebas Neue',cursive",fontSize:'clamp(1.8rem,3.5vw,3rem)',lineHeight:1.1,letterSpacing:'0.02em',marginBottom:'1rem'}}>ครอบคลุมทุก<span style={{color:'#00e5ff'}}>หมวด</span></h2>
              </div>
              <p style={{color:'#5a6480',fontSize:'0.92rem',fontWeight:300,lineHeight:1.8,paddingTop:'0.5rem'}}>ฟิสิกส์ระดับมัธยมถึงมหาวิทยาลัยปี 1 ครบทุก topic เรียงตามลำดับที่เหมาะสม hover แต่ละหมวดเพื่อดูบทย่อยภายใน</p>
            </div>
          </SectionReveal>
          <div style={{border:'1px solid rgba(255,255,255,0.07)',borderRadius:12,overflow:'hidden',background:'rgba(8,13,26,0.5)'}}>
            {TOPICS.map((t,i)=><TopicRow key={t.num} topic={t} index={i}/>)}
          </div>
        </div>
      </section>

      {/* ── Demo ─────────────────────────────────────────────────────────── */}
      <section id="demo" style={{padding:'clamp(5rem,10vw,8rem) clamp(1.5rem,5vw,3rem)',background:'#080d1a'}}>
        <div style={{maxWidth:900,margin:'0 auto',textAlign:'center'}}>
          <div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:'0.65rem',letterSpacing:'0.22em',color:'#00e5ff',textTransform:'uppercase',marginBottom:'1rem',display:'flex',alignItems:'center',justifyContent:'center',gap:'0.75rem'}}>
            <span style={{width:24,height:1,background:'linear-gradient(to right,transparent,#00e5ff)',display:'inline-block'}}/>ตัวอย่างการใช้งาน<span style={{width:24,height:1,background:'linear-gradient(to left,transparent,#00e5ff)',display:'inline-block'}}/>
          </div>
          <h2 style={{fontFamily:"'Bebas Neue',cursive",fontSize:'clamp(1.8rem,3.5vw,3rem)',lineHeight:1.1,letterSpacing:'0.02em',marginBottom:'1rem'}}>ดูก่อน<span style={{color:'#00e5ff'}}>ตัดสินใจ</span></h2>
          <p style={{color:'#5a6480',fontSize:'0.9rem',fontWeight:300,marginBottom:'3rem'}}>ชม demo ว่า PhysFun ทำงานยังไง ก่อนเริ่มใช้งานจริง</p>

          {/* ── Video Modal ── */}
          {showVideo && (
            <div
              onClick={() => setShowVideo(false)}
              style={{position:'fixed',inset:0,background:'rgba(0,0,0,0.88)',zIndex:9999,display:'flex',alignItems:'center',justifyContent:'center'}}
            >
              <div onClick={e => e.stopPropagation()} style={{width:'min(900px,90vw)',aspectRatio:'16/9',position:'relative'}}>
                <iframe
                  src="https://www.youtube.com/embed/h-9VUH5OayE?autoplay=1&rel=0"
                  style={{width:'100%',height:'100%',border:'none',borderRadius:12}}
                  allowFullScreen
                  allow="autoplay; encrypted-media"
                />
                <button
                  onClick={() => setShowVideo(false)}
                  style={{position:'absolute',top:-40,right:0,background:'none',border:'none',color:'#7a8aaa',fontFamily:"'JetBrains Mono',monospace",fontSize:'0.75rem',cursor:'pointer',letterSpacing:'0.1em'}}
                >[ ESC / CLOSE ]</button>
              </div>
            </div>
          )}

          {/* ── Thumbnail / Play button ── */}
          <div
            onClick={() => setShowVideo(true)}
            style={{position:'relative',aspectRatio:'16/9',background:'#020508',border:'1px solid rgba(0,229,255,0.15)',borderRadius:16,overflow:'hidden',cursor:'pointer',transition:'box-shadow 0.3s, border-color 0.3s'}}
            onMouseEnter={e=>{e.currentTarget.style.boxShadow='0 0 60px rgba(0,229,255,0.12)';e.currentTarget.style.borderColor='rgba(0,229,255,0.3)';(e.currentTarget.querySelector('.play-btn') as HTMLElement)!.style.transform='translate(-50%,-50%) scale(1.12)';}}
            onMouseLeave={e=>{e.currentTarget.style.boxShadow='none';e.currentTarget.style.borderColor='rgba(0,229,255,0.15)';(e.currentTarget.querySelector('.play-btn') as HTMLElement)!.style.transform='translate(-50%,-50%) scale(1)';}}>

            {/* YouTube thumbnail */}
            <img
              src="https://img.youtube.com/vi/h-9VUH5OayE/maxresdefault.jpg"
              style={{width:'100%',height:'100%',objectFit:'cover',opacity:0.6}}
              alt="PhysFun Demo"
            />
            <div style={{position:'absolute',inset:0,background:'linear-gradient(to top,rgba(5,8,16,0.7) 0%,transparent 60%)'}}/>

            {/* Play button */}
            <div className="play-btn" style={{position:'absolute',top:'50%',left:'50%',transform:'translate(-50%,-50%)',width:76,height:76,background:'rgba(0,229,255,0.12)',border:'2px solid #00e5ff',borderRadius:'50%',display:'flex',alignItems:'center',justifyContent:'center',transition:'transform 0.3s cubic-bezier(.16,1,.3,1)',boxShadow:'0 0 40px rgba(0,229,255,0.35)'}}>
              <svg width="26" height="26" fill="#00e5ff" viewBox="0 0 24 24" style={{marginLeft:4}}><polygon points="5,3 19,12 5,21"/></svg>
            </div>

            {/* Duration badge */}
            <div style={{position:'absolute',bottom:'1.25rem',right:'1.25rem',fontFamily:"'JetBrains Mono',monospace",fontSize:'0.6rem',color:'#00e5ff',border:'1px solid rgba(0,229,255,0.3)',padding:'0.2rem 0.6rem',borderRadius:3,background:'rgba(0,229,255,0.06)'}}>
              3:00
            </div>
          </div>

          {/* Stats */}
          <div style={{display:'flex',gap:'2rem',justifyContent:'center',marginTop:'2.5rem',paddingTop:'2rem',borderTop:'1px solid rgba(255,255,255,0.06)',flexWrap:'wrap'}}>
            
          </div>

        </div>
      </section>

      {/* ── Articles ─────────────────────────────────────────────────────── */}
      <section id="articles" style={{padding:'clamp(5rem,10vw,8rem) clamp(1.5rem,5vw,3rem)',position:'relative',overflow:'hidden'}}>
        <div style={{position:'absolute',top:'50%',left:'50%',transform:'translate(-50%,-50%)',width:600,height:400,background:'radial-gradient(ellipse,rgba(0,229,255,0.04) 0%,transparent 70%)',pointerEvents:'none'}}/>
        <div style={{maxWidth:1100,margin:'0 auto',position:'relative',zIndex:1}}>
          <SectionReveal>
            <div style={{textAlign:'center',marginBottom:'3.5rem'}}>
              <div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:'0.65rem',letterSpacing:'0.22em',color:'#00e5ff',textTransform:'uppercase',marginBottom:'1rem',display:'flex',alignItems:'center',justifyContent:'center',gap:'0.75rem'}}>
                <span style={{width:24,height:1,background:'linear-gradient(to right,transparent,#00e5ff)',display:'inline-block'}}/>content-บทความ<span style={{width:24,height:1,background:'linear-gradient(to left,transparent,#00e5ff)',display:'inline-block'}}/>
              </div>
              <h2 style={{fontFamily:"'Bebas Neue',cursive",fontSize:'clamp(1.8rem,3.5vw,3rem)',lineHeight:1.1,letterSpacing:'0.02em',marginBottom:'0.75rem'}}>เกร็ดความรู้<span style={{color:'#00e5ff'}}>ฟิสิกส์</span></h2>
              <p style={{color:'#5a6480',fontSize:'0.9rem',fontWeight:300}}>เรื่องราวฟิสิกส์ในชีวิตประจำวันที่คุณอาจไม่เคยรู้ — ใช้เวลาอ่านไม่เกิน 2 นาที</p>
            </div>
          </SectionReveal>
          <SectionReveal delay={0.1}><ArticleCarousel/></SectionReveal>
        </div>
      </section>

      {/* ── CTA ──────────────────────────────────────────────────────────── */}
      <section id="cta" style={{padding:'clamp(5rem,10vw,8rem) clamp(1.5rem,5vw,3rem)',textAlign:'center',position:'relative',overflow:'hidden',background:'#080d1a'}}>
        <div style={{position:'absolute',top:'50%',left:'50%',transform:'translate(-50%,-50%)',width:700,height:700,background:'radial-gradient(circle,rgba(0,229,255,.07) 0%,transparent 70%)',pointerEvents:'none'}}/>
        <div style={{position:'relative',zIndex:1}}>
          <SectionReveal>
            <div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:'0.65rem',letterSpacing:'0.22em',color:'#00e5ff',textTransform:'uppercase',marginBottom:'1.5rem',display:'flex',alignItems:'center',justifyContent:'center',gap:'0.75rem'}}>
              <span style={{width:24,height:1,background:'linear-gradient(to right,transparent,#00e5ff)',display:'inline-block'}}/>เริ่มต้นใช้งาน<span style={{width:24,height:1,background:'linear-gradient(to left,transparent,#00e5ff)',display:'inline-block'}}/>
            </div>
            <h2 style={{fontFamily:"'Bebas Neue',cursive",fontSize:'clamp(2.5rem,6vw,5.5rem)',lineHeight:1,letterSpacing:'0.02em',marginBottom:'1rem'}}>
              มาเริ่มเรียน<br/><span style={{color:'#00e5ff',textShadow:'0 0 40px rgba(0,229,255,.4)'}}>กันเลย</span>
            </h2>
            <p style={{color:'#5a6480',fontSize:'1rem',fontWeight:300,lineHeight:1.8,maxWidth:480,margin:'0 auto 3rem'}}>เรียนฟิสิกส์สนุกๆ ไม่น่าเบื่อ พร้อม simulation และโจทย์ interactive ฟรี — ไม่ต้องสมัครสมาชิก</p>
            <div style={{display:'flex',gap:'1rem',justifyContent:'center',flexWrap:'wrap'}}>
              <Link href="/Home" className="btn-primary" style={{padding:'1rem 2.75rem',background:'#00e5ff',color:'#050810',fontFamily:"'JetBrains Mono',monospace",fontWeight:600,fontSize:'0.85rem',letterSpacing:'0.1em',textTransform:'uppercase',textDecoration:'none',display:'inline-flex',alignItems:'center',gap:'0.5rem',clipPath:'polygon(0 0,calc(100% - 12px) 0,100% 12px,100% 100%,12px 100%,0 calc(100% - 12px))'}}>
                START MISSION<svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12,5 19,12 12,19"/></svg>
              </Link>
              <a href="#features" className="btn-ghost" style={{padding:'1rem 2.75rem',border:'1px solid rgba(255,255,255,.15)',color:'#5a6480',fontFamily:"'JetBrains Mono',monospace",fontSize:'0.85rem',letterSpacing:'0.1em',textTransform:'uppercase',textDecoration:'none',transition:'border-color .2s, color .2s'}}>รู้จัก PhysFun</a>
            </div>
          </SectionReveal>
        </div>
      </section>

      {/* ── Footer ───────────────────────────────────────────────────────── */}
      <footer style={{borderTop:'1px solid rgba(0,229,255,.12)',padding:'2rem 3rem',display:'flex',alignItems:'center',justifyContent:'space-between'}}>
        <p style={{fontFamily:"'JetBrains Mono',monospace",fontSize:'0.75rem',color:'#5a6480'}}>© 2026 PhysFun. All rights reserved.</p>
        <p style={{fontFamily:"'JetBrains Mono',monospace",fontSize:'0.75rem',color:'#00e5ff'}}>PHYSICS UNLEASHED</p>
      </footer>

      {/* Corner decorations */}
      <div style={{position:'fixed',top:0,left:0,width:200,height:200,borderTop:'2px solid rgba(0,229,255,.15)',borderLeft:'2px solid rgba(0,229,255,.15)',pointerEvents:'none',zIndex:50}}/>
      <div style={{position:'fixed',bottom:0,right:0,width:200,height:200,borderBottom:'2px solid rgba(124,58,237,.15)',borderRight:'2px solid rgba(124,58,237,.15)',pointerEvents:'none',zIndex:50}}/>
    </>
  );
}