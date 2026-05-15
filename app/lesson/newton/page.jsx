'use client';

import { useState, useEffect, useRef, useCallback } from "react";
import { useRouter } from 'next/navigation';

// ─── STEP DATA ───────────────────────────────────────────────────────────────
const steps = [
  {
    id: 1,
    law: "กฎข้อที่ 1",
    title: "กฎความเฉื่อย",
    subtitle: "Law of Inertia",
    icon: "🛸",
    color: "#00e5ff",
    colorDim: "rgba(0,229,255,0.12)",
    concept: "วัตถุจะคงสภาพอยู่นิ่ง หรือเคลื่อนที่ด้วยความเร็วคงที่ในแนวตรง — จนกว่าจะมีแรงมากระทำ",
    formula: "ΣF = 0  →  v = คงที่",
    simType: "inertia",
    quiz: null,
    insight: "ดาวฤกษ์ที่อยู่ไกลหลายพันปีแสงยังคงเคลื่อนที่ในแนวตรงเพราะอวกาศแทบไม่มีแรงต้าน",
  },
  {
    id: 2,
    law: "กฎข้อที่ 1",
    title: "แรงและสภาพเดิม",
    subtitle: "Force breaks equilibrium",
    icon: "💥",
    color: "#00e5ff",
    colorDim: "rgba(0,229,255,0.12)",
    concept: "เมื่อมีแรงมากระทำ วัตถุจะเปลี่ยนสภาพการเคลื่อนที่ทันที — ยิ่งแรงมาก การเปลี่ยนแปลงยิ่งเร็ว",
    formula: "F ≠ 0  →  เกิดความเร่ง a",
    simType: "force_break",
    quiz: {
      question: "ลูกบอลวางนิ่งบนโต๊ะ ถ้าไม่มีแรงกระทำ มันจะ...",
      options: ["ค่อยๆ หยุดนิ่งขึ้น", "คงนิ่งอยู่เหมือนเดิม", "เริ่มกลิ้งช้าๆ", "ค่อยๆ ลอยขึ้น"],
      answer: 1,
    },
  },
  {
    id: 3,
    law: "กฎข้อที่ 2",
    title: "F = ma",
    subtitle: "Newton's Second Law",
    icon: "⚡",
    color: "#a78bfa",
    colorDim: "rgba(167,139,250,0.12)",
    concept: "แรงลัพธ์ที่กระทำต่อวัตถุ เท่ากับมวลคูณความเร่ง — เพิ่มแรง ได้ความเร่งมากขึ้น เพิ่มมวล ความเร่งลดลง",
    formula: "F = m × a",
    simType: "fma",
    quiz: null,
    insight: "ลูกบอลเทนนิส (57g) และลูกโบว์ลิ่ง (7kg) รับแรงเท่ากัน ลูกไหนเร่งมากกว่ากัน?",
  },
  {
    id: 4,
    law: "กฎข้อที่ 2",
    title: "มวลและความเร่ง",
    subtitle: "Mass vs Acceleration",
    icon: "⚖️",
    color: "#a78bfa",
    colorDim: "rgba(167,139,250,0.12)",
    concept: "มวลและความเร่งสัมพันธ์กันแบบผกผัน — มวลมาก ความเร่งน้อย ถ้าแรงเท่ากัน",
    formula: "a = F / m",
    simType: "mass_accel",
    quiz: {
      question: "ออกแรง 10N กับวัตถุมวล 2kg จะได้ความเร่งเท่าใด?",
      options: ["20 m/s²", "5 m/s²", "0.2 m/s²", "12 m/s²"],
      answer: 1,
    },
  },
  {
    id: 5,
    law: "กฎข้อที่ 3",
    title: "แรงกิริยา–ปฏิกิริยา",
    subtitle: "Action–Reaction",
    icon: "🔄",
    color: "#f59e0b",
    colorDim: "rgba(245,158,11,0.12)",
    concept: "ทุกแรงกิริยามีแรงปฏิกิริยาขนาดเท่ากัน แต่ทิศทางตรงข้าม — แรงคู่นี้กระทำต่อวัตถุคนละชิ้น",
    formula: "F₁₂ = −F₂₁",
    simType: "action_reaction",
    quiz: null,
    insight: "เมื่อคุณเดิน เท้าดันพื้นไปด้านหลัง พื้นก็ดันคุณไปด้านหน้าด้วยแรงเท่ากัน!",
  },
  {
    id: 6,
    law: "กฎข้อที่ 3",
    title: "การชน",
    subtitle: "Collision & Momentum",
    icon: "💫",
    color: "#f59e0b",
    colorDim: "rgba(245,158,11,0.12)",
    concept: "ในการชน แรงที่วัตถุ A กระทำต่อ B และแรงที่ B กระทำต่อ A มีขนาดเท่ากันเสมอ ในเวลาเดียวกัน",
    formula: "m₁Δv₁ = −m₂Δv₂",
    simType: "collision",
    quiz: {
      question: "รถบรรทุก (มวลมาก) ชนรถเล็ก (มวลน้อย) — แรงที่กระทำระหว่างกันเป็นอย่างไร?",
      options: ["รถบรรทุกออกแรงมากกว่า", "รถเล็กออกแรงมากกว่า", "แรงเท่ากันทั้งคู่", "ขึ้นอยู่กับความเร็ว"],
      answer: 2,
    },
  },
  {
    id: 7,
    law: "สรุป",
    title: "ทั้ง 3 กฎรวมกัน",
    subtitle: "All Three Laws",
    icon: "🏆",
    color: "#10b981",
    colorDim: "rgba(16,185,129,0.12)",
    concept: "กฎทั้งสามข้อทำงานร่วมกัน — กฎข้อ 1 บอกสภาวะสมดุล, กฎข้อ 2 คำนวณการเคลื่อนที่, กฎข้อ 3 บอกการส่งแรง",
    formula: "ΣF=0 | F=ma | F₁₂=−F₂₁",
    simType: "all_laws",
    quiz: {
      question: "จรวดพุ่งขึ้นโดยพ่นแก๊สลงด้านล่าง ใช้กฎข้อใด?",
      options: ["กฎข้อ 1 เท่านั้น", "กฎข้อ 2 เท่านั้น", "กฎข้อ 3 เท่านั้น", "กฎข้อ 2 และ 3 ร่วมกัน"],
      answer: 3,
    },
  },
];

// ─── PHYSICS SIMULATIONS ─────────────────────────────────────────────────────
function SimInertia({ color }) {
  const canvasRef = useRef(null);
  const stateRef = useRef({ ball: { x: 120, y: 110, vx: 0, vy: 0 }, dragging: false, dragOffX: 0, dragOffY: 0, launched: false, trail: [], animId: null });
  const launched = useRef(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const W = canvas.width, H = canvas.height;
    const s = stateRef.current;

    const draw = () => {
      ctx.clearRect(0, 0, W, H);
      // Space bg
      ctx.fillStyle = '#050810';
      ctx.fillRect(0, 0, W, H);
      // Stars
      ctx.fillStyle = 'rgba(255,255,255,0.4)';
      [[30,20],[80,50],[160,15],[220,40],[280,25],[340,55],[380,10],[420,45],[460,30],[500,18],[540,50],[570,35]].forEach(([x,y])=>{
        ctx.beginPath(); ctx.arc(x,y,1,0,Math.PI*2); ctx.fill();
      });
      // Trail
      s.trail.forEach((p, i) => {
        const a = (i / s.trail.length) * 0.5;
        ctx.beginPath(); ctx.arc(p.x, p.y, 6 * (i/s.trail.length), 0, Math.PI*2);
        ctx.fillStyle = `rgba(0,229,255,${a})`; ctx.fill();
      });
      // Ball
      const grad = ctx.createRadialGradient(s.ball.x-6, s.ball.y-6, 2, s.ball.x, s.ball.y, 18);
      grad.addColorStop(0, '#7fffff'); grad.addColorStop(1, '#0099bb');
      ctx.beginPath(); ctx.arc(s.ball.x, s.ball.y, 18, 0, Math.PI*2);
      ctx.fillStyle = grad; ctx.fill();
      ctx.strokeStyle = 'rgba(0,229,255,0.6)'; ctx.lineWidth = 1.5; ctx.stroke();

      if (!launched.current) {
        ctx.fillStyle = 'rgba(0,229,255,0.7)'; ctx.font = '12px Anuphan,sans-serif';
        ctx.textAlign = 'center'; ctx.fillText('ลากแล้วปล่อย →', s.ball.x, s.ball.y + 36);
      }
      if (launched.current && s.ball.x > 20 && s.ball.x < W-20) {
        ctx.fillStyle = 'rgba(0,229,255,0.5)'; ctx.font = '11px JetBrains Mono,monospace';
        ctx.textAlign = 'left';
        ctx.fillText(`v = ${Math.abs(s.ball.vx).toFixed(1)} px/s`, 16, H-12);
        ctx.textAlign = 'right';
        ctx.fillText('ความเร็วคงที่ — ไม่มีแรงต้าน', W-16, H-12);
      }
    };

    const tick = () => {
      const s = stateRef.current;
      if (!s.dragging && launched.current) {
        s.ball.x += s.ball.vx;
        s.ball.y += s.ball.vy;
        s.trail.push({ x: s.ball.x, y: s.ball.y });
        if (s.trail.length > 30) s.trail.shift();
        if (s.ball.x < -40 || s.ball.x > canvas.width + 40) {
          s.ball.x = 120; s.ball.y = 110; s.ball.vx = 0; s.ball.vy = 0;
          launched.current = false; s.trail = [];
        }
      }
      draw();
      s.animId = requestAnimationFrame(tick);
    };
    s.animId = requestAnimationFrame(tick);

    const getPos = (e) => {
      const r = canvas.getBoundingClientRect();
      const clientX = e.touches ? e.touches[0].clientX : e.clientX;
      const clientY = e.touches ? e.touches[0].clientY : e.clientY;
      return { x: clientX - r.left, y: clientY - r.top };
    };
    const onDown = (e) => {
      const p = getPos(e); const b = stateRef.current.ball;
      if (Math.hypot(p.x - b.x, p.y - b.y) < 26) {
        stateRef.current.dragging = true;
        stateRef.current.dragOffX = b.x - p.x;
        stateRef.current.dragOffY = b.y - p.y;
        launched.current = false; stateRef.current.trail = [];
        e.preventDefault();
      }
    };
    let lastPos = null;
    const onMove = (e) => {
      if (!stateRef.current.dragging) return;
      const p = getPos(e);
      if (lastPos) {
        stateRef.current.ball.vx = (p.x - lastPos.x) * 0.6;
        stateRef.current.ball.vy = (p.y - lastPos.y) * 0.6;
      }
      stateRef.current.ball.x = p.x + stateRef.current.dragOffX;
      stateRef.current.ball.y = p.y + stateRef.current.dragOffY;
      lastPos = p; e.preventDefault();
    };
    const onUp = () => {
      if (stateRef.current.dragging) {
        stateRef.current.dragging = false;
        launched.current = true; lastPos = null;
      }
    };
    canvas.addEventListener('mousedown', onDown); canvas.addEventListener('mousemove', onMove);
    canvas.addEventListener('mouseup', onUp); canvas.addEventListener('mouseleave', onUp);
    canvas.addEventListener('touchstart', onDown, { passive: false });
    canvas.addEventListener('touchmove', onMove, { passive: false });
    canvas.addEventListener('touchend', onUp);
    return () => { cancelAnimationFrame(s.animId); canvas.removeEventListener('mousedown', onDown); };
  }, []);

  return <canvas ref={canvasRef} width={600} height={220} style={{ width: '100%', height: 220, borderRadius: 12, cursor: 'grab', display: 'block' }} />;
}

function SimFma({ color }) {
  const canvasRef = useRef(null);
  const forceRef = useRef(5);
  const massRef = useRef(2);
  const [force, setForce] = useState(5);
  const [mass, setMass] = useState(2);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const W = canvas.width, H = canvas.height;
    let x = 80, vx = 0, animId;

    const draw = () => {
      ctx.clearRect(0, 0, W, H);
      ctx.fillStyle = '#050810'; ctx.fillRect(0, 0, W, H);
      // Floor
      ctx.fillStyle = 'rgba(255,255,255,0.06)';
      ctx.fillRect(0, H - 40, W, 40);
      ctx.strokeStyle = 'rgba(255,255,255,0.12)'; ctx.lineWidth = 1;
      ctx.beginPath(); ctx.moveTo(0, H-40); ctx.lineTo(W, H-40); ctx.stroke();
      // Grid lines
      for (let i = 60; i < W; i += 60) {
        ctx.strokeStyle = 'rgba(255,255,255,0.04)'; ctx.lineWidth = 1;
        ctx.beginPath(); ctx.moveTo(i, 0); ctx.lineTo(i, H-40); ctx.stroke();
      }
      const r = Math.max(14, Math.min(34, 14 + massRef.current * 3));
      const boxY = H - 40 - r * 2;
      // Box
      const bg = ctx.createLinearGradient(x, boxY, x + r*2, boxY + r*2);
      bg.addColorStop(0, '#5b21b6'); bg.addColorStop(1, '#7c3aed');
      ctx.fillStyle = bg;
      ctx.beginPath(); ctx.roundRect(x, boxY, r*2, r*2, 6);
      ctx.fill();
      ctx.strokeStyle = 'rgba(167,139,250,0.7)'; ctx.lineWidth = 1.5;
      ctx.stroke();
      ctx.fillStyle = '#fff'; ctx.font = `${Math.max(10,r-2)}px JetBrains Mono,monospace`;
      ctx.textAlign = 'center'; ctx.fillText(`${massRef.current}kg`, x + r, boxY + r + 4);
      // Force arrow
      const f = forceRef.current;
      const arrowLen = f * 12;
      const ay = boxY + r;
      ctx.strokeStyle = '#f59e0b'; ctx.lineWidth = 3;
      ctx.beginPath(); ctx.moveTo(x - 10, ay); ctx.lineTo(x - 10 + arrowLen, ay); ctx.stroke();
      ctx.fillStyle = '#f59e0b';
      ctx.beginPath(); ctx.moveTo(x - 10 + arrowLen, ay - 7); ctx.lineTo(x - 10 + arrowLen + 14, ay); ctx.lineTo(x - 10 + arrowLen, ay + 7); ctx.fill();
      ctx.fillStyle = '#f59e0b'; ctx.font = '11px JetBrains Mono,monospace';
      ctx.textAlign = 'center'; ctx.fillText(`F=${f}N`, x - 10 + arrowLen/2, ay - 10);
      // a = F/m readout
      const a = f / massRef.current;
      ctx.fillStyle = 'rgba(167,139,250,0.9)'; ctx.font = '13px JetBrains Mono,monospace';
      ctx.textAlign = 'left'; ctx.fillText(`a = ${f}/${massRef.current} = ${a.toFixed(1)} m/s²`, 12, 22);
    };

    const tick = () => {
      const a = forceRef.current / massRef.current;
      vx += a * 0.04;
      x += vx * 0.5;
      if (x > W + 40) { x = 80; vx = 0; }
      draw();
      animId = requestAnimationFrame(tick);
    };
    animId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(animId);
  }, []);

  return (
    <div>
      <canvas ref={canvasRef} width={600} height={200} style={{ width: '100%', height: 200, borderRadius: 12, display: 'block' }} />
      <div style={{ display: 'flex', gap: 24, marginTop: 14 }}>
        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
            <span style={{ color: '#f59e0b', fontSize: 13, fontFamily: 'JetBrains Mono,monospace' }}>แรง F</span>
            <span style={{ color: '#f59e0b', fontSize: 13, fontFamily: 'JetBrains Mono,monospace', fontWeight: 600 }}>{force} N</span>
          </div>
          <input type="range" min={1} max={20} value={force} step={1} style={{ width: '100%', accentColor: '#f59e0b' }}
            onChange={e => { const v = +e.target.value; setForce(v); forceRef.current = v; }} />
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
            <span style={{ color: '#a78bfa', fontSize: 13, fontFamily: 'JetBrains Mono,monospace' }}>มวล m</span>
            <span style={{ color: '#a78bfa', fontSize: 13, fontFamily: 'JetBrains Mono,monospace', fontWeight: 600 }}>{mass} kg</span>
          </div>
          <input type="range" min={1} max={10} value={mass} step={1} style={{ width: '100%', accentColor: '#a78bfa' }}
            onChange={e => { const v = +e.target.value; setMass(v); massRef.current = v; }} />
        </div>
      </div>
    </div>
  );
}

function SimActionReaction({ color }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const W = canvas.width, H = canvas.height;
    let t = 0, animId;

    const draw = () => {
      ctx.clearRect(0, 0, W, H);
      ctx.fillStyle = '#050810'; ctx.fillRect(0, 0, W, H);
      // Floor
      ctx.fillStyle = 'rgba(255,255,255,0.05)'; ctx.fillRect(0, H-35, W, 35);
      ctx.strokeStyle = 'rgba(255,255,255,0.1)'; ctx.lineWidth=1;
      ctx.beginPath(); ctx.moveTo(0,H-35); ctx.lineTo(W,H-35); ctx.stroke();

      const mid = W / 2;
      const gap = 8 + Math.abs(Math.sin(t * 0.04)) * 12;
      const push = Math.sin(t * 0.04) * 6;

      // Block A (left)
      const axRight = mid - gap - push;
      ctx.fillStyle = '#1d4ed8';
      ctx.beginPath(); ctx.roundRect(axRight - 70, H-35-60, 70, 60, 6); ctx.fill();
      ctx.strokeStyle = '#3b82f6'; ctx.lineWidth=2; ctx.stroke();
      ctx.fillStyle = '#93c5fd'; ctx.font = '13px Anuphan,sans-serif'; ctx.textAlign='center';
      ctx.fillText('A', axRight - 35, H-35-60+36);
      ctx.fillStyle = '#60a5fa'; ctx.font = '10px JetBrains Mono,monospace';
      ctx.fillText('m=5kg', axRight - 35, H-35-60+50);

      // Block B (right)
      const bxLeft = mid + gap - push;
      ctx.fillStyle = '#7c3aed';
      ctx.beginPath(); ctx.roundRect(bxLeft, H-35-45, 70, 45, 6); ctx.fill();
      ctx.strokeStyle = '#a78bfa'; ctx.lineWidth=2; ctx.stroke();
      ctx.fillStyle = '#c4b5fd'; ctx.font = '13px Anuphan,sans-serif'; ctx.textAlign='center';
      ctx.fillText('B', bxLeft + 35, H-35-45+27);
      ctx.fillStyle = '#a78bfa'; ctx.font = '10px JetBrains Mono,monospace';
      ctx.fillText('m=3kg', bxLeft + 35, H-35-45+41);

      // Action arrow (A→B)
      const arrowY = H - 35 - 80;
      const f = 20 + Math.abs(Math.sin(t * 0.04)) * 15;
      ctx.strokeStyle = '#f59e0b'; ctx.lineWidth = 2.5;
      ctx.beginPath(); ctx.moveTo(axRight - 2, arrowY); ctx.lineTo(bxLeft - 10, arrowY); ctx.stroke();
      ctx.fillStyle = '#f59e0b';
      ctx.beginPath(); ctx.moveTo(bxLeft - 10, arrowY - 6); ctx.lineTo(bxLeft + 4, arrowY); ctx.lineTo(bxLeft - 10, arrowY + 6); ctx.fill();
      ctx.fillStyle = '#fbbf24'; ctx.font = '11px JetBrains Mono,monospace'; ctx.textAlign = 'center';
      ctx.fillText(`F₁₂ = ${f.toFixed(0)}N →`, mid, arrowY - 8);

      // Reaction arrow (B→A)
      const arrowY2 = H - 35 - 98;
      ctx.strokeStyle = '#10b981'; ctx.lineWidth = 2.5;
      ctx.beginPath(); ctx.moveTo(bxLeft + 2, arrowY2); ctx.lineTo(axRight + 8, arrowY2); ctx.stroke();
      ctx.fillStyle = '#10b981';
      ctx.beginPath(); ctx.moveTo(axRight + 8, arrowY2 - 6); ctx.lineTo(axRight - 6, arrowY2); ctx.lineTo(axRight + 8, arrowY2 + 6); ctx.fill();
      ctx.fillStyle = '#34d399'; ctx.font = '11px JetBrains Mono,monospace'; ctx.textAlign = 'center';
      ctx.fillText(`← F₂₁ = ${f.toFixed(0)}N`, mid, arrowY2 - 8);

      ctx.fillStyle = 'rgba(255,255,255,0.3)'; ctx.font = '11px Anuphan,sans-serif'; ctx.textAlign = 'center';
      ctx.fillText('|F₁₂| = |F₂₁|  แต่ทิศทางตรงข้าม', mid, 18);
    };

    const tick = () => { t++; draw(); animId = requestAnimationFrame(tick); };
    animId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(animId);
  }, []);

  return <canvas ref={canvasRef} width={600} height={200} style={{ width: '100%', height: 200, borderRadius: 12, display: 'block' }} />;
}

function SimCollision() {
  const canvasRef = useRef(null);
  const phaseRef = useRef('before'); // before | collide | after
  const tRef = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const W = canvas.width, H = canvas.height;
    let animId;

    const balls = [
      { x: 80, vx: 3.5, r: 28, m: 4, color: '#3b82f6', label: '4kg' },
      { x: W - 80, vx: -2, r: 20, m: 2, color: '#a78bfa', label: '2kg' },
    ];

    const draw = () => {
      ctx.clearRect(0, 0, W, H);
      ctx.fillStyle = '#050810'; ctx.fillRect(0, 0, W, H);
      ctx.strokeStyle = 'rgba(255,255,255,0.06)'; ctx.lineWidth = 1;
      ctx.beginPath(); ctx.moveTo(0, H/2+30); ctx.lineTo(W, H/2+30); ctx.stroke();

      balls.forEach(b => {
        const g = ctx.createRadialGradient(b.x - b.r*0.3, H/2 - b.r*0.3, 2, b.x, H/2, b.r);
        g.addColorStop(0, b.color + 'ff'); g.addColorStop(1, b.color + '55');
        ctx.beginPath(); ctx.arc(b.x, H/2, b.r, 0, Math.PI*2);
        ctx.fillStyle = g; ctx.fill();
        ctx.strokeStyle = b.color; ctx.lineWidth = 1.5; ctx.stroke();
        ctx.fillStyle = '#fff'; ctx.font = `${b.r > 22 ? 12 : 10}px JetBrains Mono,monospace`;
        ctx.textAlign = 'center'; ctx.fillText(b.label, b.x, H/2 + 4);
        // velocity arrow
        if (Math.abs(b.vx) > 0.1) {
          const aLen = b.vx * 14;
          const ay = H/2 - b.r - 16;
          ctx.strokeStyle = '#f59e0b'; ctx.lineWidth = 2;
          ctx.beginPath(); ctx.moveTo(b.x, ay); ctx.lineTo(b.x + aLen, ay); ctx.stroke();
          ctx.fillStyle = '#f59e0b';
          const dir = aLen > 0 ? 1 : -1;
          ctx.beginPath(); ctx.moveTo(b.x + aLen, ay - 5); ctx.lineTo(b.x + aLen + dir*10, ay); ctx.lineTo(b.x + aLen, ay + 5); ctx.fill();
          ctx.fillStyle = '#fbbf24'; ctx.font = '10px JetBrains Mono,monospace'; ctx.textAlign = 'center';
          ctx.fillText(`${b.vx > 0 ? '+' : ''}${b.vx.toFixed(1)}`, b.x + aLen/2, ay - 8);
        }
      });
    };

    const tick = () => {
      tRef.current++;
      const [a, b] = balls;
      const dist = Math.abs(a.x - b.x);
      const minDist = a.r + b.r;
      if (dist <= minDist) {
        // elastic collision
        const va = a.vx, vb = b.vx, ma = a.m, mb = b.m;
        a.vx = ((ma - mb) * va + 2 * mb * vb) / (ma + mb);
        b.vx = ((mb - ma) * vb + 2 * ma * va) / (ma + mb);
        a.x = b.x - minDist - 1;
      }
      a.x += a.vx; b.x += b.vx;
      if (a.x - a.r < 0) { a.x = a.r; a.vx = Math.abs(a.vx); }
      if (b.x + b.r > W) { b.x = W - b.r; b.vx = -Math.abs(b.vx); }
      if (a.x + a.r > W) { a.x = W - a.r; a.vx = -Math.abs(a.vx); }
      if (b.x - b.r < 0) { b.x = b.r; b.vx = Math.abs(b.vx); }
      draw();
      animId = requestAnimationFrame(tick);
    };
    animId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(animId);
  }, []);

  return <canvas ref={canvasRef} width={600} height={180} style={{ width: '100%', height: 180, borderRadius: 12, display: 'block' }} />;
}

function SimAllLaws() {
  const canvasRef = useRef(null);
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const W = canvas.width, H = canvas.height;
    let t = 0, animId;
    // Rocket sim
    let ry = H - 50, vy = 0, thrust = 0;
    const draw = () => {
      ctx.clearRect(0, 0, W, H);
      ctx.fillStyle = '#050810'; ctx.fillRect(0, 0, W, H);
      // Stars
      [[40,20],[120,35],[200,12],[300,28],[400,18],[500,40],[560,15]].forEach(([x, y]) => {
        const a = 0.3 + Math.sin(t*0.05 + x)*0.3;
        ctx.fillStyle = `rgba(255,255,255,${a})`; ctx.beginPath(); ctx.arc(x,y,1,0,Math.PI*2); ctx.fill();
      });
      // Ground
      ctx.fillStyle = 'rgba(16,185,129,0.15)'; ctx.fillRect(0, H-30, W, 30);
      ctx.strokeStyle = 'rgba(16,185,129,0.4)'; ctx.lineWidth=1;
      ctx.beginPath(); ctx.moveTo(0,H-30); ctx.lineTo(W,H-30); ctx.stroke();

      // Rocket body
      const rx = W / 2;
      ctx.save(); ctx.translate(rx, ry);
      // Exhaust flame
      if (thrust > 0.1) {
        const fl = thrust * 40;
        const fg = ctx.createLinearGradient(0, 20, 0, 20 + fl);
        fg.addColorStop(0, 'rgba(245,158,11,0.9)'); fg.addColorStop(0.5, 'rgba(239,68,68,0.6)'); fg.addColorStop(1, 'transparent');
        ctx.fillStyle = fg;
        ctx.beginPath(); ctx.moveTo(-8, 20); ctx.lineTo(8, 20); ctx.lineTo(4, 20+fl); ctx.lineTo(-4, 20+fl); ctx.closePath(); ctx.fill();
      }
      // Body
      ctx.fillStyle = '#e2e8f0';
      ctx.beginPath(); ctx.roundRect(-10, -30, 20, 50, 4); ctx.fill();
      ctx.fillStyle = '#94a3b8'; ctx.fillRect(-10, -5, 20, 10);
      // Nose
      ctx.fillStyle = '#ef4444';
      ctx.beginPath(); ctx.moveTo(-10,-30); ctx.lineTo(10,-30); ctx.lineTo(0,-50); ctx.closePath(); ctx.fill();
      // Fins
      ctx.fillStyle = '#64748b';
      ctx.beginPath(); ctx.moveTo(-10,15); ctx.lineTo(-22,30); ctx.lineTo(-10,25); ctx.closePath(); ctx.fill();
      ctx.beginPath(); ctx.moveTo(10,15); ctx.lineTo(22,30); ctx.lineTo(10,25); ctx.closePath(); ctx.fill();
      ctx.restore();

      // Law labels
      const labels = [
        { x: 60, y: 80, text: 'กฎ 2: F=ma', sub: 'แรงเผาไหม้ → ความเร่ง', c: '#a78bfa' },
        { x: W-100, y: 80, text: 'กฎ 3: ปฏิกิริยา', sub: 'แก๊สลง → จรวดขึ้น', c: '#f59e0b' },
        { x: W/2, y: H-55, text: 'กฎ 1: ความเฉื่อย', sub: 'สมดุลก่อนจุดระเบิด', c: '#00e5ff' },
      ];
      labels.forEach(l => {
        ctx.fillStyle = l.c; ctx.font = '12px Anuphan,sans-serif'; ctx.textAlign = 'center';
        ctx.fillText(l.text, l.x, l.y);
        ctx.fillStyle = 'rgba(255,255,255,0.35)'; ctx.font = '10px Anuphan,sans-serif';
        ctx.fillText(l.sub, l.x, l.y + 15);
      });
    };

    const tick = () => {
      t++;
      const cycleLen = 180;
      const phase = t % cycleLen;
      if (phase < 80) {
        thrust = Math.min(1, (phase - 20) / 15);
        const g = 0.15, thrustForce = thrust * 0.45;
        vy += (thrustForce - g); ry -= vy;
      } else {
        thrust = 0; vy -= 0.2;
        ry -= vy;
      }
      if (ry > H - 50) { ry = H - 50; vy = 0; }
      if (ry < 20) { ry = 20; vy = -vy * 0.3; }
      draw();
      animId = requestAnimationFrame(tick);
    };
    animId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(animId);
  }, []);
  return <canvas ref={canvasRef} width={600} height={220} style={{ width: '100%', height: 220, borderRadius: 12, display: 'block' }} />;
}

function SimForceBreak() {
  const canvasRef = useRef(null);
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const W = canvas.width, H = canvas.height;
    let t = 0, animId;
    let bx = 120, bvx = 0, phase = 'wait';
    let forceActive = false, forceTimer = 0;

    const draw = () => {
      ctx.clearRect(0, 0, W, H);
      ctx.fillStyle = '#050810'; ctx.fillRect(0, 0, W, H);
      // Table
      ctx.fillStyle = 'rgba(100,74,50,0.5)'; ctx.fillRect(0, H-40, W, 40);
      ctx.strokeStyle = 'rgba(180,130,80,0.4)'; ctx.lineWidth=1;
      ctx.beginPath(); ctx.moveTo(0,H-40); ctx.lineTo(W,H-40); ctx.stroke();
      // wood grain
      for(let i=0;i<5;i++){ctx.strokeStyle=`rgba(100,70,40,0.2)`;ctx.beginPath();ctx.moveTo(0,H-40+i*8);ctx.lineTo(W,H-40+i*8);ctx.stroke();}

      // Ball
      const by = H - 40 - 20;
      const g = ctx.createRadialGradient(bx-6, by-6, 2, bx, by, 20);
      g.addColorStop(0, '#fef3c7'); g.addColorStop(1, '#f59e0b');
      ctx.beginPath(); ctx.arc(bx, by, 20, 0, Math.PI*2);
      ctx.fillStyle = g; ctx.fill();
      ctx.strokeStyle = '#fbbf24'; ctx.lineWidth=2; ctx.stroke();

      if (forceActive) {
        const aLen = 60;
        ctx.strokeStyle = '#ef4444'; ctx.lineWidth = 3;
        ctx.beginPath(); ctx.moveTo(bx - aLen - 15, by); ctx.lineTo(bx - 22, by); ctx.stroke();
        ctx.fillStyle = '#ef4444';
        ctx.beginPath(); ctx.moveTo(bx - 22, by - 7); ctx.lineTo(bx - 8, by); ctx.lineTo(bx - 22, by + 7); ctx.fill();
        ctx.fillStyle = '#fca5a5'; ctx.font = '11px JetBrains Mono,monospace'; ctx.textAlign = 'center';
        ctx.fillText('F = 15N', bx - aLen/2 - 15, by - 12);
      }

      if (phase === 'wait') {
        ctx.fillStyle = 'rgba(0,229,255,0.6)'; ctx.font = '12px Anuphan,sans-serif'; ctx.textAlign = 'center';
        ctx.fillText('วัตถุนิ่ง — ยังไม่มีแรง', W/2, 30);
        ctx.fillStyle = 'rgba(255,255,255,0.2)'; ctx.font = '11px Anuphan,sans-serif';
        ctx.fillText('ΣF = 0', W/2, 48);
      } else {
        ctx.fillStyle = '#a78bfa'; ctx.font = '12px JetBrains Mono,monospace'; ctx.textAlign = 'left';
        ctx.fillText(`v = ${bvx.toFixed(1)} px/s`, 14, 24);
        ctx.fillStyle = 'rgba(255,255,255,0.3)'; ctx.font = '11px Anuphan,sans-serif'; ctx.textAlign = 'right';
        ctx.fillText('วัตถุเคลื่อนที่เมื่อมีแรงกระทำ', W-14, 24);
      }
    };

    const tick = () => {
      t++;
      if (t === 60) { phase = 'force'; forceActive = true; forceTimer = 0; }
      if (phase === 'force') {
        forceTimer++;
        bvx += 0.3;
        if (forceTimer > 30) { forceActive = false; phase = 'moving'; }
      }
      if (phase === 'moving') { bx += bvx; if (bx > W + 40) { bx = 120; bvx = 0; phase = 'wait'; t = 0; } }
      draw();
      animId = requestAnimationFrame(tick);
    };
    animId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(animId);
  }, []);
  return <canvas ref={canvasRef} width={600} height={200} style={{ width: '100%', height: 200, borderRadius: 12, display: 'block' }} />;
}

function SimMassAccel() {
  const canvasRef = useRef(null);
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const W = canvas.width, H = canvas.height;
    let t = 0, animId;
    let ax = 40, bx = 40;
    const F = 10;
    const mA = 1, mB = 5;
    const aA = F / mA, aB = F / mB;
    let vA = 0, vB = 0;

    const draw = () => {
      ctx.clearRect(0, 0, W, H);
      ctx.fillStyle = '#050810'; ctx.fillRect(0, 0, W, H);
      // Tracks
      ctx.strokeStyle = 'rgba(255,255,255,0.07)'; ctx.lineWidth = 1;
      ctx.beginPath(); ctx.moveTo(0, H/2-5); ctx.lineTo(W, H/2-5); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(0, H/2+65); ctx.lineTo(W, H/2+65); ctx.stroke();

      // Lane A label
      ctx.fillStyle = '#00e5ff'; ctx.font = '11px JetBrains Mono,monospace'; ctx.textAlign = 'left';
      ctx.fillText(`m=${mA}kg  a=${aA.toFixed(0)}m/s²`, 12, H/2 - 12);
      // Ball A
      const gA = ctx.createRadialGradient(ax-5, H/2-28, 2, ax, H/2-25, 18);
      gA.addColorStop(0,'#7fffff'); gA.addColorStop(1,'#0088aa');
      ctx.beginPath(); ctx.arc(ax, H/2-25, 18, 0, Math.PI*2);
      ctx.fillStyle = gA; ctx.fill();
      ctx.strokeStyle='#00e5ff';ctx.lineWidth=1.5;ctx.stroke();
      ctx.fillStyle='#fff';ctx.font='10px JetBrains Mono,monospace';ctx.textAlign='center';
      ctx.fillText(`${mA}kg`,ax,H/2-21);

      // Lane B label
      ctx.fillStyle = '#a78bfa'; ctx.font = '11px JetBrains Mono,monospace'; ctx.textAlign = 'left';
      ctx.fillText(`m=${mB}kg  a=${aB.toFixed(1)}m/s²`, 12, H/2 + 52);
      // Ball B (bigger)
      const gB = ctx.createRadialGradient(bx-7, H/2+28, 3, bx, H/2+32, 26);
      gB.addColorStop(0,'#c4b5fd'); gB.addColorStop(1,'#5b21b6');
      ctx.beginPath(); ctx.arc(bx, H/2+32, 26, 0, Math.PI*2);
      ctx.fillStyle = gB; ctx.fill();
      ctx.strokeStyle='#a78bfa';ctx.lineWidth=1.5;ctx.stroke();
      ctx.fillStyle='#fff';ctx.font='11px JetBrains Mono,monospace';ctx.textAlign='center';
      ctx.fillText(`${mB}kg`,bx,H/2+36);

      // Same force arrows
      [[ax, H/2-25, '#00e5ff'],[bx, H/2+32, '#a78bfa']].forEach(([x,y,c])=>{
        ctx.strokeStyle=c;ctx.lineWidth=2;
        ctx.beginPath();ctx.moveTo(x-50,y);ctx.lineTo(x-22,y);ctx.stroke();
        ctx.fillStyle=c;ctx.beginPath();ctx.moveTo(x-22,y-5);ctx.lineTo(x-10,y);ctx.lineTo(x-22,y+5);ctx.fill();
        ctx.fillStyle=c;ctx.font='10px JetBrains Mono,monospace';ctx.textAlign='center';
        ctx.fillText(`${F}N`,x-36,y-8);
      });
    };

    const tick = () => {
      t++;
      vA += aA * 0.008; ax += vA;
      vB += aB * 0.008; bx += vB;
      if (ax > W + 40) { ax = 40; vA = 0; }
      if (bx > W + 40) { bx = 40; vB = 0; }
      draw();
      animId = requestAnimationFrame(tick);
    };
    animId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(animId);
  }, []);
  return <canvas ref={canvasRef} width={600} height={160} style={{ width: '100%', height: 160, borderRadius: 12, display: 'block' }} />;
}

function Simulation({ type, color }) {
  if (type === 'inertia') return <SimInertia color={color} />;
  if (type === 'force_break') return <SimForceBreak />;
  if (type === 'fma') return <SimFma color={color} />;
  if (type === 'mass_accel') return <SimMassAccel />;
  if (type === 'action_reaction') return <SimActionReaction color={color} />;
  if (type === 'collision') return <SimCollision />;
  if (type === 'all_laws') return <SimAllLaws />;
  return null;
}

// ─── PROGRESS BAR ─────────────────────────────────────────────────────────────
function ProgressBar({ current, total, color }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
      <div style={{ flex: 1, height: 6, background: 'rgba(255,255,255,0.07)', borderRadius: 99, overflow: 'hidden' }}>
        <div style={{ height: '100%', width: `${(current / total) * 100}%`, background: color, borderRadius: 99, transition: 'width 0.5s cubic-bezier(0.34,1.56,0.64,1)' }} />
      </div>
      <span style={{ fontFamily: 'JetBrains Mono,monospace', fontSize: 12, color: 'rgba(255,255,255,0.35)', minWidth: 40 }}>
        {current}/{total}
      </span>
    </div>
  );
}

// ─── QUIZ MINI-SIM: canvas that reacts live to which option is hovered/selected ──
function QuizMiniSim({ quizId, hoveredOption, selectedOption, confirmed, isCorrect, answerIdx }) {
  const canvasRef = useRef(null);
  const stateRef = useRef({ particles: [], t: 0, shakeX: 0, shakeDecay: 0, burstDone: false });
  const animRef = useRef(null);

  // Spawn particle burst
  const spawnBurst = useCallback((cx, cy, color, count = 28) => {
    const p = stateRef.current.particles;
    for (let i = 0; i < count; i++) {
      const angle = (Math.PI * 2 * i) / count + Math.random() * 0.4;
      const speed = 2.5 + Math.random() * 4;
      p.push({ x: cx, y: cy, vx: Math.cos(angle) * speed, vy: Math.sin(angle) * speed - 1.5, life: 1, decay: 0.022 + Math.random() * 0.018, r: 3 + Math.random() * 4, color });
    }
  }, []);

  const triggerShake = useCallback(() => {
    stateRef.current.shakeX = 7;
    stateRef.current.shakeDecay = 0.72;
  }, []);

  // Notify parent to trigger effects
  useEffect(() => {
    if (!confirmed) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const W = canvas.width, H = canvas.height;
    if (isCorrect) {
      spawnBurst(W / 2, H / 2, '#10b981', 40);
      spawnBurst(W / 2 - 40, H / 2 + 20, '#34d399', 20);
      spawnBurst(W / 2 + 40, H / 2 - 20, '#6ee7b7', 20);
    } else {
      triggerShake();
      spawnBurst(W / 2, H / 2, '#ef4444', 22);
    }
  }, [confirmed, isCorrect, spawnBurst, triggerShake]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const W = canvas.width, H = canvas.height;

    // Quiz-specific sim configs: what each option "looks like" physically
    const simConfigs = {
      // Q1: ball on table — options 0..3
      q1: [
        { label: 'ค่อยๆ หยุด', draw: (t, opt) => drawBallSlowing(ctx, W, H, t) },
        { label: 'คงนิ่ง ✓', draw: (t, opt) => drawBallStill(ctx, W, H, t) },
        { label: 'กลิ้งช้าๆ', draw: (t, opt) => drawBallRolling(ctx, W, H, t) },
        { label: 'ลอยขึ้น', draw: (t, opt) => drawBallFloat(ctx, W, H, t) },
      ],
      // Q2: F=ma options
      q2: [
        { label: 'a=20 m/s²', draw: (t) => drawFmaScene(ctx, W, H, t, 10, 1, '#f59e0b') },
        { label: 'a=5 m/s² ✓', draw: (t) => drawFmaScene(ctx, W, H, t, 10, 2, '#10b981') },
        { label: 'a=0.2 m/s²', draw: (t) => drawFmaScene(ctx, W, H, t, 10, 50, '#ef4444') },
        { label: 'a=12 m/s²', draw: (t) => drawFmaScene(ctx, W, H, t, 10, 0.83, '#a78bfa') },
      ],
      // Q3: collision options
      q3: [
        { label: 'บรรทุกมากกว่า', draw: (t) => drawCollisionForce(ctx, W, H, t, 'truck') },
        { label: 'เล็กมากกว่า', draw: (t) => drawCollisionForce(ctx, W, H, t, 'small') },
        { label: 'เท่ากัน ✓', draw: (t) => drawCollisionForce(ctx, W, H, t, 'equal') },
        { label: 'ขึ้นกับความเร็ว', draw: (t) => drawCollisionForce(ctx, W, H, t, 'vary') },
      ],
      // Q4: rocket options
      q4: [
        { label: 'กฎ 1', draw: (t) => drawRocketLaw(ctx, W, H, t, 1) },
        { label: 'กฎ 2', draw: (t) => drawRocketLaw(ctx, W, H, t, 2) },
        { label: 'กฎ 3', draw: (t) => drawRocketLaw(ctx, W, H, t, 3) },
        { label: 'กฎ 2+3 ✓', draw: (t) => drawRocketLaw(ctx, W, H, t, 23) },
      ],
    };

    const configs = simConfigs[quizId] || simConfigs.q1;
    const activeOpt = confirmed ? answerIdx : (selectedOption !== null ? selectedOption : hoveredOption);

    const tick = () => {
      stateRef.current.t++;
      const t = stateRef.current.t;
      const s = stateRef.current;

      // Shake
      if (s.shakeX > 0.3) { s.shakeX *= s.shakeDecay; } else { s.shakeX = 0; }
      const sx = s.shakeX > 0.3 ? (Math.sin(t * 1.8) * s.shakeX) : 0;

      ctx.clearRect(0, 0, W, H);
      ctx.save();
      ctx.translate(sx, 0);

      // Background
      ctx.fillStyle = '#050810';
      ctx.fillRect(-10, 0, W + 20, H);

      if (activeOpt !== null && configs[activeOpt]) {
        configs[activeOpt].draw(t, activeOpt);
      } else {
        // Idle: show all 4 option dots
        drawIdleGrid(ctx, W, H, t, configs);
      }

      // Particles
      s.particles = s.particles.filter(p => p.life > 0);
      s.particles.forEach(p => {
        p.x += p.vx; p.y += p.vy; p.vy += 0.12; p.vx *= 0.97;
        p.life -= p.decay;
        const a = Math.max(0, p.life);
        ctx.beginPath(); ctx.arc(p.x, p.y, p.r * a, 0, Math.PI * 2);
        ctx.fillStyle = p.color + Math.floor(a * 255).toString(16).padStart(2, '0');
        ctx.fill();
      });

      ctx.restore();
      animRef.current = requestAnimationFrame(tick);
    };
    animRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(animRef.current);
  }, [quizId, hoveredOption, selectedOption, confirmed, isCorrect, answerIdx]);

  return (
    <canvas ref={canvasRef} width={560} height={130}
      style={{ width: '100%', height: 130, borderRadius: 10, display: 'block', background: '#050810' }} />
  );
}

// ── mini-sim draw helpers ────────────────────────────────────────────────────
function drawIdleGrid(ctx, W, H, t, configs) {
  const cols = ['#00e5ff','#a78bfa','#f59e0b','#10b981'];
  configs.forEach((_, i) => {
    const x = (W / 4) * i + W / 8;
    const y = H / 2;
    const pulse = 1 + Math.sin(t * 0.05 + i * 1.2) * 0.15;
    ctx.beginPath(); ctx.arc(x, y, 10 * pulse, 0, Math.PI * 2);
    ctx.fillStyle = cols[i] + '40'; ctx.fill();
    ctx.strokeStyle = cols[i] + '80'; ctx.lineWidth = 1.5; ctx.stroke();
  });
  ctx.fillStyle = 'rgba(255,255,255,0.2)'; ctx.font = '11px Anuphan,sans-serif'; ctx.textAlign = 'center';
  ctx.fillText('hover คำตอบเพื่อดู simulation', W / 2, H - 10);
}

function drawBallStill(ctx, W, H, t) {
  const bx = W / 2, by = H - 35;
  // Table
  ctx.fillStyle = 'rgba(100,74,50,0.4)'; ctx.fillRect(0, H - 30, W, 30);
  ctx.strokeStyle = 'rgba(180,130,80,0.3)'; ctx.lineWidth = 1;
  ctx.beginPath(); ctx.moveTo(0, H - 30); ctx.lineTo(W, H - 30); ctx.stroke();
  // Ball (absolutely still)
  const g = ctx.createRadialGradient(bx - 5, by - 5, 2, bx, by, 18);
  g.addColorStop(0, '#fef3c7'); g.addColorStop(1, '#f59e0b');
  ctx.beginPath(); ctx.arc(bx, by, 18, 0, Math.PI * 2);
  ctx.fillStyle = g; ctx.fill();
  ctx.strokeStyle = '#fbbf24'; ctx.lineWidth = 1.5; ctx.stroke();
  // ΣF=0 label
  ctx.fillStyle = '#10b981'; ctx.font = 'bold 13px JetBrains Mono,monospace'; ctx.textAlign = 'center';
  ctx.fillText('ΣF = 0  →  v = 0', W / 2, 22);
  const pulse = 0.5 + Math.abs(Math.sin(t * 0.04)) * 0.5;
  ctx.fillStyle = `rgba(16,185,129,${pulse})`; ctx.font = '11px Anuphan,sans-serif';
  ctx.fillText('วัตถุคงนิ่งอยู่เหมือนเดิม ✓', W / 2, 40);
}

function drawBallSlowing(ctx, W, H, t) {
  const bx = 80 + (t % 200) * 0.5, by = H - 35;
  ctx.fillStyle = 'rgba(100,74,50,0.4)'; ctx.fillRect(0, H - 30, W, 30);
  ctx.strokeStyle = 'rgba(180,130,80,0.3)'; ctx.lineWidth = 1;
  ctx.beginPath(); ctx.moveTo(0, H - 30); ctx.lineTo(W, H - 30); ctx.stroke();
  const g = ctx.createRadialGradient(bx - 5, by - 5, 2, bx % W, by, 18);
  g.addColorStop(0, '#fecaca'); g.addColorStop(1, '#ef4444');
  ctx.beginPath(); ctx.arc(bx % W, by, 18, 0, Math.PI * 2);
  ctx.fillStyle = g; ctx.fill();
  ctx.strokeStyle = '#ef4444'; ctx.lineWidth = 1.5; ctx.stroke();
  ctx.fillStyle = '#ef4444'; ctx.font = '12px JetBrains Mono,monospace'; ctx.textAlign = 'center';
  ctx.fillText('กฎนิวตันข้อ 1 บอกว่า ไม่เป็นเช่นนั้น', W / 2, 22);
}

function drawBallRolling(ctx, W, H, t) {
  const bx = (t * 0.8) % (W + 40) - 20, by = H - 35;
  ctx.fillStyle = 'rgba(100,74,50,0.4)'; ctx.fillRect(0, H - 30, W, 30);
  ctx.strokeStyle = 'rgba(180,130,80,0.3)'; ctx.lineWidth = 1;
  ctx.beginPath(); ctx.moveTo(0, H - 30); ctx.lineTo(W, H - 30); ctx.stroke();
  // Rolling ball with rotation lines
  ctx.save(); ctx.translate(bx, by);
  const g = ctx.createRadialGradient(-5, -5, 2, 0, 0, 18);
  g.addColorStop(0, '#fef3c7'); g.addColorStop(1, '#f59e0b');
  ctx.beginPath(); ctx.arc(0, 0, 18, 0, Math.PI * 2);
  ctx.fillStyle = g; ctx.fill(); ctx.strokeStyle = '#fbbf24'; ctx.lineWidth = 1.5; ctx.stroke();
  // rotation indicator
  ctx.rotate(t * 0.08);
  ctx.strokeStyle = 'rgba(255,255,255,0.4)'; ctx.lineWidth = 1.5;
  ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(0, -14); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(12, 8); ctx.stroke();
  ctx.restore();
  ctx.fillStyle = '#f59e0b'; ctx.font = '12px JetBrains Mono,monospace'; ctx.textAlign = 'center';
  ctx.fillText('ต้องมีแรงกระทำก่อนถึงจะกลิ้ง', W / 2, 22);
}

function drawBallFloat(ctx, W, H, t) {
  const by = H - 35 - Math.abs(Math.sin(t * 0.04)) * 60;
  ctx.fillStyle = 'rgba(100,74,50,0.4)'; ctx.fillRect(0, H - 30, W, 30);
  ctx.strokeStyle = 'rgba(180,130,80,0.3)'; ctx.lineWidth = 1;
  ctx.beginPath(); ctx.moveTo(0, H - 30); ctx.lineTo(W, H - 30); ctx.stroke();
  const g = ctx.createRadialGradient(W/2 - 5, by - 5, 2, W/2, by, 18);
  g.addColorStop(0, '#e0f2fe'); g.addColorStop(1, '#7dd3fc');
  ctx.beginPath(); ctx.arc(W/2, by, 18, 0, Math.PI * 2);
  ctx.fillStyle = g; ctx.fill(); ctx.strokeStyle = '#38bdf8'; ctx.lineWidth = 1.5; ctx.stroke();
  ctx.fillStyle = '#38bdf8'; ctx.font = '12px JetBrains Mono,monospace'; ctx.textAlign = 'center';
  ctx.fillText('ไม่มีแรงยกขึ้น — ไม่เกิดขึ้นจริง', W / 2, 22);
}

function drawFmaScene(ctx, W, H, t, F, m, color) {
  const a = F / m;
  const maxV = 8;
  const vNorm = Math.min(a / 15, 1);
  const bx = 60 + ((t * vNorm * 1.5) % (W - 80));
  const by = H - 38;
  const r = Math.max(14, Math.min(30, 10 + m * 1.2));
  // Floor
  ctx.fillStyle = 'rgba(255,255,255,0.05)'; ctx.fillRect(0, H - 28, W, 28);
  ctx.strokeStyle = 'rgba(255,255,255,0.1)'; ctx.lineWidth = 1;
  ctx.beginPath(); ctx.moveTo(0, H - 28); ctx.lineTo(W, H - 28); ctx.stroke();
  // Box
  const bg = ctx.createLinearGradient(bx, by - r, bx + r * 2, by);
  bg.addColorStop(0, color + 'cc'); bg.addColorStop(1, color + '66');
  ctx.fillStyle = bg;
  ctx.beginPath(); ctx.roundRect(bx - r, by - r * 2, r * 2, r * 2, 4); ctx.fill();
  ctx.strokeStyle = color; ctx.lineWidth = 1.5; ctx.stroke();
  ctx.fillStyle = '#fff'; ctx.font = `${Math.max(9, r - 4)}px JetBrains Mono,monospace`;
  ctx.textAlign = 'center'; ctx.fillText(`${m}kg`, bx, by - r + 4);
  // Force arrow
  const aLen = F * 5;
  ctx.strokeStyle = '#f59e0b'; ctx.lineWidth = 2.5;
  ctx.beginPath(); ctx.moveTo(bx - r - 6, by - r); ctx.lineTo(bx - r - 6 + aLen, by - r); ctx.stroke();
  ctx.fillStyle = '#f59e0b';
  ctx.beginPath(); ctx.moveTo(bx - r - 6 + aLen, by - r - 6); ctx.lineTo(bx - r + 10, by - r); ctx.lineTo(bx - r - 6 + aLen, by - r + 6); ctx.fill();
  // Readout
  ctx.fillStyle = color; ctx.font = '12px JetBrains Mono,monospace'; ctx.textAlign = 'center';
  ctx.fillText(`F=${F}N  m=${m}kg  →  a=${a.toFixed(1)}m/s²`, W / 2, 20);
}

function drawCollisionForce(ctx, W, H, t, mode) {
  const mid = W / 2;
  const gap = 6 + Math.abs(Math.sin(t * 0.05)) * 8;
  const pulse = Math.abs(Math.sin(t * 0.05));
  ctx.fillStyle = 'rgba(255,255,255,0.04)'; ctx.fillRect(0, H - 24, W, 24);
  ctx.strokeStyle = 'rgba(255,255,255,0.08)'; ctx.lineWidth = 1;
  ctx.beginPath(); ctx.moveTo(0, H - 24); ctx.lineTo(W, H - 24); ctx.stroke();

  // Truck (left)
  ctx.fillStyle = '#1d4ed8'; ctx.beginPath(); ctx.roundRect(mid - gap - 80, H - 24 - 52, 80, 52, 5); ctx.fill();
  ctx.strokeStyle = '#3b82f6'; ctx.lineWidth = 1.5; ctx.stroke();
  ctx.fillStyle = '#93c5fd'; ctx.font = '11px Anuphan,sans-serif'; ctx.textAlign = 'center';
  ctx.fillText('รถบรรทุก', mid - gap - 40, H - 24 - 52 + 30);

  // Small car (right)
  ctx.fillStyle = '#7c3aed'; ctx.beginPath(); ctx.roundRect(mid + gap, H - 24 - 36, 60, 36, 5); ctx.fill();
  ctx.strokeStyle = '#a78bfa'; ctx.lineWidth = 1.5; ctx.stroke();
  ctx.fillStyle = '#c4b5fd'; ctx.font = '11px Anuphan,sans-serif'; ctx.textAlign = 'center';
  ctx.fillText('รถเล็ก', mid + gap + 30, H - 24 - 36 + 22);

  const arrowY = H - 24 - 65;
  if (mode === 'truck') {
    ctx.strokeStyle = '#ef4444'; ctx.lineWidth = 3;
    ctx.beginPath(); ctx.moveTo(mid - gap - 80, arrowY); ctx.lineTo(mid - gap - 6, arrowY); ctx.stroke();
    ctx.fillStyle = '#ef4444'; ctx.beginPath(); ctx.moveTo(mid - gap - 6, arrowY - 6); ctx.lineTo(mid - gap + 6, arrowY); ctx.lineTo(mid - gap - 6, arrowY + 6); ctx.fill();
    ctx.strokeStyle = 'rgba(255,255,255,0.15)'; ctx.lineWidth = 1.5;
    ctx.beginPath(); ctx.moveTo(mid + gap + 60, arrowY); ctx.lineTo(mid + gap + 6, arrowY); ctx.stroke();
    ctx.fillStyle = 'rgba(255,255,255,0.3)'; ctx.font = '11px Anuphan,sans-serif'; ctx.textAlign = 'center';
    ctx.fillText('ไม่เท่ากัน ✗', W / 2, 20);
  } else if (mode === 'small') {
    ctx.strokeStyle = '#ef4444'; ctx.lineWidth = 3;
    ctx.beginPath(); ctx.moveTo(mid + gap + 60, arrowY); ctx.lineTo(mid + gap + 6, arrowY); ctx.stroke();
    ctx.fillStyle = '#ef4444'; ctx.beginPath(); ctx.moveTo(mid + gap + 6, arrowY - 6); ctx.lineTo(mid + gap - 6, arrowY); ctx.lineTo(mid + gap + 6, arrowY + 6); ctx.fill();
    ctx.fillStyle = 'rgba(255,255,255,0.3)'; ctx.font = '11px Anuphan,sans-serif'; ctx.textAlign = 'center';
    ctx.fillText('ไม่เท่ากัน ✗', W / 2, 20);
  } else if (mode === 'equal') {
    const fLen = 44 + pulse * 12;
    ctx.strokeStyle = '#10b981'; ctx.lineWidth = 3;
    ctx.beginPath(); ctx.moveTo(mid - gap - 80, arrowY); ctx.lineTo(mid - gap - 6, arrowY); ctx.stroke();
    ctx.fillStyle = '#10b981'; ctx.beginPath(); ctx.moveTo(mid - gap - 6, arrowY - 6); ctx.lineTo(mid - gap + 6, arrowY); ctx.lineTo(mid - gap - 6, arrowY + 6); ctx.fill();
    ctx.strokeStyle = '#f59e0b'; ctx.lineWidth = 3;
    ctx.beginPath(); ctx.moveTo(mid + gap + 60, arrowY); ctx.lineTo(mid + gap + 6, arrowY); ctx.stroke();
    ctx.fillStyle = '#f59e0b'; ctx.beginPath(); ctx.moveTo(mid + gap + 6, arrowY - 6); ctx.lineTo(mid + gap - 6, arrowY); ctx.lineTo(mid + gap + 6, arrowY + 6); ctx.fill();
    ctx.fillStyle = '#10b981'; ctx.font = 'bold 12px JetBrains Mono,monospace'; ctx.textAlign = 'center';
    ctx.fillText('|F₁₂| = |F₂₁|  แรงเท่ากัน ✓', W / 2, 20);
  } else {
    ctx.fillStyle = 'rgba(255,255,255,0.25)'; ctx.font = '11px Anuphan,sans-serif'; ctx.textAlign = 'center';
    ctx.fillText('กฎข้อ 3 ไม่ขึ้นกับความเร็ว', W / 2, 20);
  }
}

function drawRocketLaw(ctx, W, H, t, law) {
  const phase = t % 140;
  const ry = law === 23 ? (H - 50 - Math.abs(Math.sin(phase / 140 * Math.PI)) * (H - 70)) :
             law === 2  ? (H - 50 - phase * 0.35) :
             law === 3  ? (H - 50) : (H - 50);
  const clampY = Math.max(20, Math.min(H - 50, ry));
  const thrust = law === 23 || law === 2 ? Math.max(0, Math.sin(phase / 140 * Math.PI)) : 0;

  ctx.fillStyle = 'rgba(16,185,129,0.1)'; ctx.fillRect(0, H - 24, W, 24);
  ctx.strokeStyle = 'rgba(16,185,129,0.3)'; ctx.lineWidth = 1;
  ctx.beginPath(); ctx.moveTo(0, H - 24); ctx.lineTo(W, H - 24); ctx.stroke();

  const rx = W / 2;
  ctx.save(); ctx.translate(rx, clampY);
  if (thrust > 0.05) {
    const fl = thrust * 35;
    for (let i = 0; i < 3; i++) {
      const spread = (i - 1) * 5;
      ctx.fillStyle = `rgba(245,158,11,${thrust * (0.6 - i * 0.1)})`;
      ctx.beginPath(); ctx.moveTo(-6 + spread, 18); ctx.lineTo(6 + spread, 18); ctx.lineTo(spread * 0.4, 18 + fl); ctx.closePath(); ctx.fill();
    }
  }
  // Rocket body
  ctx.fillStyle = '#e2e8f0'; ctx.beginPath(); ctx.roundRect(-8, -24, 16, 40, 3); ctx.fill();
  ctx.fillStyle = '#ef4444'; ctx.beginPath(); ctx.moveTo(-8, -24); ctx.lineTo(8, -24); ctx.lineTo(0, -40); ctx.closePath(); ctx.fill();
  ctx.fillStyle = '#64748b';
  ctx.beginPath(); ctx.moveTo(-8, 12); ctx.lineTo(-18, 24); ctx.lineTo(-8, 20); ctx.closePath(); ctx.fill();
  ctx.beginPath(); ctx.moveTo(8, 12); ctx.lineTo(18, 24); ctx.lineTo(8, 20); ctx.closePath(); ctx.fill();
  ctx.restore();

  const colors = { 1: '#5a6480', 2: '#a78bfa', 3: '#f59e0b', 23: '#10b981' };
  const labels = { 1: 'กฎ 1: ความเฉื่อย (ไม่ขึ้น)', 2: 'กฎ 2: F=ma (ขึ้นได้)', 3: 'กฎ 3: ปฏิกิริยา (ขึ้นได้)', 23: 'กฎ 2+3: ขึ้นจริง ✓' };
  ctx.fillStyle = colors[law]; ctx.font = '12px JetBrains Mono,monospace'; ctx.textAlign = 'center';
  ctx.fillText(labels[law], W / 2, 18);
}

// ─── QUIZ COMPONENT ───────────────────────────────────────────────────────────
// quizId maps step index → sim key
const QUIZ_SIM_IDS = { 1: 'q1', 3: 'q2', 5: 'q3', 6: 'q4' };

function Quiz({ quiz, onPass, stepIndex }) {
  const [selected, setSelected] = useState(null);
  const [hovered, setHovered] = useState(null);
  const [confirmed, setConfirmed] = useState(false);
  const [shakeKey, setShakeKey] = useState(0);
  const wrapRef = useRef(null);
  const isCorrect = selected === quiz.answer;
  const quizId = QUIZ_SIM_IDS[stepIndex] || 'q1';

  const handleConfirm = () => {
    if (selected === null) return;
    setConfirmed(true);
    if (!isCorrect) {
      setShakeKey(k => k + 1);
    } else {
      setTimeout(onPass, 1100);
    }
  };

  const handleRetry = () => {
    setSelected(null);
    setConfirmed(false);
  };

  return (
    <div style={{ marginTop: 28 }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
        <div style={{ height: 1.5, flex: 1, background: 'rgba(255,255,255,0.06)' }} />
        <span style={{ fontFamily: "'Bebas Neue',cursive", fontSize: 11, letterSpacing: '0.2em', color: 'rgba(255,255,255,0.25)' }}>CHECKPOINT</span>
        <div style={{ height: 1.5, flex: 1, background: 'rgba(255,255,255,0.06)' }} />
      </div>

      {/* Mini sim canvas */}
      <div style={{ marginBottom: 14, borderRadius: 10, overflow: 'hidden', border: '1px solid rgba(255,255,255,0.06)' }}>
        <QuizMiniSim
          quizId={quizId}
          hoveredOption={hovered}
          selectedOption={selected}
          confirmed={confirmed}
          isCorrect={isCorrect}
          answerIdx={quiz.answer}
        />
      </div>

      {/* Question */}
      <p style={{ fontSize: '1rem', fontWeight: 600, color: '#e8edf5', lineHeight: 1.65, marginBottom: 14 }}>
        {quiz.question}
      </p>

      {/* Options */}
      <style>{`
        @keyframes quizShake {
          0%,100%{transform:translateX(0)}
          15%{transform:translateX(-6px)}
          30%{transform:translateX(6px)}
          45%{transform:translateX(-5px)}
          60%{transform:translateX(5px)}
          75%{transform:translateX(-3px)}
          90%{transform:translateX(3px)}
        }
        @keyframes quizPop {
          0%{transform:scale(1)}
          40%{transform:scale(1.04)}
          70%{transform:scale(0.97)}
          100%{transform:scale(1)}
        }
        @keyframes correctGlow {
          0%,100%{box-shadow:0 0 0 0 rgba(16,185,129,0)}
          50%{box-shadow:0 0 0 6px rgba(16,185,129,0.18)}
        }
        .quiz-opt-correct { animation: correctGlow 1.2s ease 0.1s; }
      `}</style>

      <div
        key={shakeKey}
        style={{
          display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 14,
          animation: shakeKey > 0 ? 'quizShake 0.45s ease' : 'none',
        }}
      >
        {quiz.options.map((opt, i) => {
          const isThis = selected === i;
          const isAnswer = i === quiz.answer;
          let bg = 'rgba(255,255,255,0.03)';
          let border = 'rgba(255,255,255,0.09)';
          let tc = 'rgba(255,255,255,0.65)';
          let anim = 'none';
          let extraClass = '';

          if (confirmed) {
            if (isAnswer) { bg = 'rgba(16,185,129,0.14)'; border = '#10b981'; tc = '#34d399'; extraClass = 'quiz-opt-correct'; }
            else if (isThis && !isCorrect) { bg = 'rgba(239,68,68,0.12)'; border = '#ef4444'; tc = '#f87171'; }
          } else {
            if (isThis) { bg = 'rgba(167,139,250,0.13)'; border = '#a78bfa'; tc = '#c4b5fd'; anim = 'quizPop 0.25s ease'; }
            else if (hovered === i) { bg = 'rgba(255,255,255,0.06)'; border = 'rgba(255,255,255,0.2)'; tc = '#e8edf5'; }
          }

          return (
            <button
              key={i}
              className={extraClass}
              disabled={confirmed}
              onClick={() => { setSelected(i); }}
              onMouseEnter={() => !confirmed && setHovered(i)}
              onMouseLeave={() => setHovered(null)}
              style={{
                background: bg, border: `1.5px solid ${border}`, borderRadius: 10,
                padding: '11px 14px', textAlign: 'left',
                cursor: confirmed ? 'default' : 'pointer',
                color: tc, fontSize: '0.88rem', fontFamily: 'Anuphan,sans-serif',
                transition: 'background 0.15s, border-color 0.15s, color 0.15s',
                animation: anim, lineHeight: 1.55, position: 'relative', overflow: 'hidden',
              }}
            >
              <span style={{ fontFamily: 'JetBrains Mono,monospace', fontSize: 10, opacity: 0.45, marginRight: 7, letterSpacing: '0.05em' }}>
                {['A','B','C','D'][i]}
              </span>
              {opt}
              {confirmed && isAnswer && (
                <span style={{ position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)', fontSize: 14 }}>✓</span>
              )}
              {confirmed && isThis && !isCorrect && (
                <span style={{ position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)', fontSize: 14 }}>✗</span>
              )}
            </button>
          );
        })}
      </div>

      {/* Feedback banner */}
      {confirmed && !isCorrect && (
        <div style={{ padding: '10px 14px', background: 'rgba(239,68,68,0.08)', borderRadius: 8, border: '1px solid rgba(239,68,68,0.25)', marginBottom: 12 }}>
          <p style={{ color: '#f87171', fontSize: '0.85rem', margin: 0 }}>
            ยังไม่ถูกนะ — ดู simulation ด้านบนอีกรอบแล้วลองใหม่ได้เลย
          </p>
        </div>
      )}
      {confirmed && isCorrect && (
        <div style={{ padding: '10px 14px', background: 'rgba(16,185,129,0.09)', borderRadius: 8, border: '1px solid rgba(16,185,129,0.25)', marginBottom: 12 }}>
          <p style={{ color: '#34d399', fontSize: '0.85rem', margin: 0 }}>
            ✓ ถูกต้องเลย! ไปขั้นตอนต่อไปได้เลย
          </p>
        </div>
      )}

      {/* Action button */}
      {!confirmed ? (
        <button
          onClick={handleConfirm}
          disabled={selected === null}
          style={{
            width: '100%', padding: '13px', borderRadius: 10, border: 'none',
            background: selected !== null ? '#a78bfa' : 'rgba(255,255,255,0.06)',
            color: selected !== null ? '#0d0520' : '#3a4060',
            fontFamily: 'Anuphan,sans-serif', fontWeight: 700, fontSize: '0.95rem',
            cursor: selected !== null ? 'pointer' : 'default',
            transition: 'background 0.2s, color 0.2s',
          }}
        >
          ตรวจคำตอบ
        </button>
      ) : !isCorrect ? (
        <button
          onClick={handleRetry}
          style={{
            width: '100%', padding: '13px', borderRadius: 10,
            border: '1.5px solid rgba(167,139,250,0.5)', background: 'transparent',
            color: '#a78bfa', fontFamily: 'Anuphan,sans-serif', fontWeight: 700,
            fontSize: '0.95rem', cursor: 'pointer',
          }}
        >
          ↺ ลองใหม่
        </button>
      ) : null}
    </div>
  );
}

// ─── MAIN PAGE ────────────────────────────────────────────────────────────────
const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Anuphan:wght@300;400;500;600;700&family=JetBrains+Mono:wght@300;400;600&display=swap');
  * { box-sizing: border-box; }
  .nl-root {
    --bg: #050810;
    --card: #080d1a;
    --cb: rgba(255,255,255,0.07);
    font-family: 'Anuphan', sans-serif;
    background: var(--bg);
    color: #e8edf5;
    min-height: 100vh;
  }
  .nl-layout { display: grid; grid-template-columns: 280px 1fr; min-height: calc(100vh - 57px); }
  .nl-sidebar {
    border-right: 1px solid rgba(255,255,255,0.06);
    padding: 28px 20px;
    position: sticky; top: 57px; height: calc(100vh - 57px); overflow-y: auto;
  }
  .nl-main { padding: 40px 48px 80px; max-width: 720px; }
  .nl-step-item {
    display: flex; align-items: center; gap: 12px;
    padding: 10px 12px; border-radius: 10px; cursor: pointer;
    margin-bottom: 6px; transition: background 0.2s;
    border: 1.5px solid transparent; background: none; width: 100%;
    font-family: 'Anuphan', sans-serif; text-align: left;
  }
  .nl-step-item:hover { background: rgba(255,255,255,0.04); }
  .nl-step-item.active { background: rgba(0,229,255,0.07); border-color: rgba(0,229,255,0.2); }
  .nl-step-dot {
    width: 28px; height: 28px; border-radius: 50%; border: 2px solid rgba(255,255,255,0.15);
    display: flex; align-items: center; justify-content: center;
    font-family: 'JetBrains Mono', monospace; font-size: 11px; color: #5a6480;
    flex-shrink: 0; transition: all 0.2s;
  }
  .nl-step-dot.done { background: #10b981; border-color: #10b981; color: #fff; }
  .nl-step-dot.current { border-color: #00e5ff; color: #00e5ff; }
  .nl-step-name { font-size: 0.85rem; color: #5a6480; line-height: 1.3; }
  .nl-step-name.active { color: #e8edf5; }
  .nl-step-law { font-family: 'JetBrains Mono', monospace; font-size: 0.65rem; letter-spacing: 0.1em; opacity: 0.5; }
  .nl-sim-box {
    background: #07091a; border: 1.5px solid rgba(255,255,255,0.06);
    border-radius: 16px; padding: 20px; margin-bottom: 28px; overflow: hidden;
  }
  .nl-formula-box {
    background: rgba(0,0,0,0.35); border-radius: 10px;
    padding: 14px 20px; margin-bottom: 20px;
    border-left: 3px solid; font-family: 'JetBrains Mono', monospace;
    font-size: 1.1rem; letter-spacing: 0.05em;
  }
  .nl-insight { background: rgba(255,255,255,0.03); border-radius: 10px; padding: 14px 16px; margin-top: 20px; }
  @keyframes slideIn { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
  .nl-content { animation: slideIn 0.35s ease both; }
  @media (max-width: 768px) {
    .nl-layout { grid-template-columns: 1fr; }
    .nl-sidebar { display: none; }
    .nl-main { padding: 24px 20px 60px; }
  }
`;

export default function NewtonLesson() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(0);
  const [completed, setCompleted] = useState(new Set());
  const [quizPassed, setQuizPassed] = useState(false);
  const [done, setDone] = useState(false);
  const step = steps[currentStep];

  const goNext = () => {
    const newCompleted = new Set(completed);
    newCompleted.add(currentStep);
    setCompleted(newCompleted);
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
      setQuizPassed(false);
    } else {
      setDone(true);
    }
  };

  const canProceed = !step.quiz || quizPassed;

  if (done) return (
    <div className="nl-root" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh' }}>
      <style>{styles}</style>
      <div style={{ textAlign: 'center', maxWidth: 460, padding: '0 24px' }}>
        <div style={{ fontSize: '4rem', marginBottom: 20 }}>🏆</div>
        <p style={{ fontFamily: "'Bebas Neue',cursive", fontSize: '0.8rem', letterSpacing: '0.2em', color: '#10b981', marginBottom: 12 }}>LESSON COMPLETE</p>
        <h1 style={{ fontSize: '2rem', fontWeight: 700, marginBottom: 14 }}>คุณเรียนกฎนิวตันครบทั้ง 3 ข้อแล้ว!</h1>
        <p style={{ color: '#5a6480', lineHeight: 1.7, marginBottom: 32 }}>ยอดเยี่ยมมาก! คุณเข้าใจกฎความเฉื่อย F=ma และกิริยา–ปฏิกิริยาแล้ว</p>
        <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
          <button onClick={() => { setCurrentStep(0); setCompleted(new Set()); setDone(false); }}
            style={{ padding: '12px 28px', borderRadius: 10, border: '1.5px solid rgba(255,255,255,0.15)', background: 'transparent', color: '#e8edf5', fontFamily: 'Anuphan,sans-serif', fontWeight: 600, cursor: 'pointer' }}>
            เริ่มใหม่
          </button>
          <button onClick={() => router.push('/lesson')}
            style={{ padding: '12px 28px', borderRadius: 10, border: 'none', background: '#10b981', color: '#fff', fontFamily: 'Anuphan,sans-serif', fontWeight: 700, cursor: 'pointer', display: 'inline-flex', alignItems: 'center' }}>
            กลับหน้าบทเรียน →
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="nl-root">
      <style>{styles}</style>

      {/* Navbar */}
      <nav style={{ position: 'sticky', top: 0, zIndex: 50, borderBottom: '1px solid rgba(255,255,255,0.06)', background: 'rgba(5,8,16,0.9)', backdropFilter: 'blur(16px)', padding: '0 2rem', height: 57, display: 'flex', alignItems: 'center', gap: 16 }}>
        <a href="/" style={{ fontFamily: "'Bebas Neue',cursive", fontSize: '1.3rem', letterSpacing: '0.1em', color: '#e8edf5', textDecoration: 'none', marginRight: 'auto' }}>
          PHYS<span style={{ color: '#00e5ff' }}>FUN</span>
        </a>
        <div style={{ flex: 1, maxWidth: 240 }}>
          <ProgressBar current={completed.size} total={steps.length} color={step.color} />
        </div>
        <span style={{ fontFamily: 'JetBrains Mono,monospace', fontSize: 12, color: 'rgba(255,255,255,0.3)' }}>กฎนิวตัน</span>
        <button onClick={() => router.back()}
          style={{ padding: '6px 14px', borderRadius: 7, border: '1px solid rgba(255,255,255,0.12)', color: 'rgba(255,255,255,0.4)', fontSize: '0.82rem', fontFamily: 'Anuphan,sans-serif', background: 'transparent', cursor: 'pointer', transition: 'all 0.2s' }}>
          ออก
        </button>
      </nav>

      <div className="nl-layout">
        {/* Sidebar */}
        <aside className="nl-sidebar">
          <p style={{ fontFamily: "'Bebas Neue',cursive", fontSize: '0.7rem', letterSpacing: '0.2em', color: 'rgba(255,255,255,0.25)', marginBottom: 16 }}>NEWTON'S LAWS</p>
          {steps.map((s, i) => (
            <button key={s.id} className={`nl-step-item ${i === currentStep ? 'active' : ''}`}
              onClick={() => { if (i <= Math.max(...Array.from(completed)) + 1 || completed.has(i-1) || i === 0) { setCurrentStep(i); setQuizPassed(false); } }}>
              <div className={`nl-step-dot ${completed.has(i) ? 'done' : i === currentStep ? 'current' : ''}`}>
                {completed.has(i) ? '✓' : i + 1}
              </div>
              <div>
                <div className={`nl-step-name ${i === currentStep ? 'active' : ''}`}>{s.title}</div>
                <div className="nl-step-law">{s.law}</div>
              </div>
            </button>
          ))}
          <div style={{ marginTop: 24, padding: '14px', background: 'rgba(255,255,255,0.03)', borderRadius: 10, border: '1px solid rgba(255,255,255,0.06)' }}>
            <p style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.3)', marginBottom: 8, fontFamily: 'JetBrains Mono,monospace', letterSpacing: '0.1em' }}>PROGRESS</p>
            <p style={{ fontSize: '1.6rem', fontFamily: 'JetBrains Mono,monospace', fontWeight: 700, color: step.color, marginBottom: 2 }}>{Math.round((completed.size / steps.length) * 100)}%</p>
            <p style={{ fontSize: '0.8rem', color: '#5a6480' }}>{completed.size} จาก {steps.length} บท</p>
          </div>
        </aside>

        {/* Main content */}
        <main className="nl-main">
          <div key={currentStep} className="nl-content">
            {/* Step header */}
            <div style={{ marginBottom: 28 }}>
              <p style={{ fontFamily: "'Bebas Neue',cursive", fontSize: '0.75rem', letterSpacing: '0.2em', color: step.color, marginBottom: 8, opacity: 0.8 }}>{step.law} • STEP {currentStep + 1} OF {steps.length}</p>
              <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 8 }}>
                <span style={{ fontSize: '2rem' }}>{step.icon}</span>
                <div>
                  <h1 style={{ fontSize: '1.8rem', fontWeight: 700, margin: 0, lineHeight: 1.2 }}>{step.title}</h1>
                  <p style={{ color: '#5a6480', fontSize: '0.88rem', margin: 0, fontFamily: 'JetBrains Mono,monospace' }}>{step.subtitle}</p>
                </div>
              </div>
            </div>

            {/* Simulation */}
            <div className="nl-sim-box">
              <Simulation type={step.simType} color={step.color} />
            </div>

            {/* Formula */}
            <div className="nl-formula-box" style={{ borderLeftColor: step.color, color: step.color }}>
              {step.formula}
            </div>

            {/* Concept */}
            <p style={{ color: 'rgba(255,255,255,0.8)', lineHeight: 1.8, fontSize: '1rem', marginBottom: 0 }}>
              {step.concept}
            </p>

            {/* Insight */}
            {step.insight && (
              <div className="nl-insight">
                <p style={{ fontSize: '0.82rem', fontFamily: 'JetBrains Mono,monospace', color: step.color, marginBottom: 6, letterSpacing: '0.08em' }}>💡 รู้ไหม?</p>
                <p style={{ color: 'rgba(255,255,255,0.55)', fontSize: '0.88rem', lineHeight: 1.7, margin: 0 }}>{step.insight}</p>
              </div>
            )}

            {/* Quiz */}
            {step.quiz && !quizPassed && (
              <Quiz quiz={step.quiz} onPass={() => setQuizPassed(true)} stepIndex={currentStep} />
            )}
            {step.quiz && quizPassed && (
              <div style={{ padding: '12px 16px', background: 'rgba(16,185,129,0.1)', borderRadius: 10, border: '1px solid rgba(16,185,129,0.25)', marginTop: 20 }}>
                <p style={{ color: '#34d399', fontSize: '0.9rem', margin: 0 }}>✓ ผ่าน checkpoint แล้ว!</p>
              </div>
            )}

            {/* Next button */}
            <div style={{ marginTop: 32, display: 'flex', gap: 12, alignItems: 'center' }}>
              {currentStep > 0 && (
                <button onClick={() => { setCurrentStep(currentStep - 1); setQuizPassed(false); }}
                  style={{ padding: '12px 22px', borderRadius: 10, border: '1.5px solid rgba(255,255,255,0.1)', background: 'transparent', color: '#5a6480', fontFamily: 'Anuphan,sans-serif', fontWeight: 600, cursor: 'pointer', transition: 'all 0.2s' }}>
                  ← ย้อนกลับ
                </button>
              )}
              <button onClick={goNext} disabled={!canProceed}
                style={{ flex: 1, padding: '14px', borderRadius: 10, border: 'none', background: canProceed ? step.color : 'rgba(255,255,255,0.07)', color: canProceed ? (step.color === '#f59e0b' || step.color === '#10b981' ? '#050810' : '#050810') : '#5a6480', fontFamily: 'Anuphan,sans-serif', fontWeight: 700, fontSize: '1rem', cursor: canProceed ? 'pointer' : 'default', transition: 'all 0.3s', transform: canProceed ? 'none' : 'none' }}>
                {currentStep === steps.length - 1 ? '🏆 จบบทเรียน' : `ต่อไป: ${steps[currentStep + 1]?.title} →`}
              </button>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}