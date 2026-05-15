'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

// ─── Types ────────────────────────────────────────────────────────────────────
type NodeStatus = 'completed' | 'available' | 'locked';

interface LessonNode {
  id: string;
  title: string;
  titleEn: string;
  emoji: string;
  xp: number;
  status: NodeStatus;
  chapter: string;
  lessons: number;
  completedLessons: number;
  col: number;
  href?: string; // ← เพิ่ม optional route
}

// ─── Data ─────────────────────────────────────────────────────────────────────
const CHAPTERS = [
  {
    id: 'mechanics',
    title: 'กลศาสตร์',
    titleEn: 'Mechanics',
    color: '#00e5ff',
    nodes: [
      { id: 'n1', title: 'การเคลื่อนที่เบื้องต้น', titleEn: 'Basic Motion', emoji: '🚀', xp: 120, status: 'completed' as NodeStatus, lessons: 5, completedLessons: 5, col: 1 },
      { id: 'n2', title: 'ความเร็วและความเร่ง', titleEn: 'Velocity & Acceleration', emoji: '⚡', xp: 150, status: 'completed' as NodeStatus, lessons: 6, completedLessons: 6, col: 0 },
      { id: 'n3', title: 'กฎนิวตัน', titleEn: "Newton's Laws", emoji: '🍎', xp: 180, status: 'available' as NodeStatus, lessons: 8, completedLessons: 3, col: 2, href: '/lesson/newton' }, // ← link
      { id: 'n4', title: 'แรงและการเคลื่อนที่', titleEn: 'Force & Motion', emoji: '💪', xp: 200, status: 'locked' as NodeStatus, lessons: 7, completedLessons: 0, col: 1 },
      { id: 'n5', title: 'โมเมนตัม', titleEn: 'Momentum', emoji: '🎱', xp: 220, status: 'locked' as NodeStatus, lessons: 6, completedLessons: 0, col: 0 },
      { id: 'n6', title: 'พลังงานและงาน', titleEn: 'Energy & Work', emoji: '🔋', xp: 250, status: 'locked' as NodeStatus, lessons: 8, completedLessons: 0, col: 2 },
    ],
  },
  {
    id: 'waves',
    title: 'คลื่นและเสียง',
    titleEn: 'Waves & Sound',
    color: '#a78bfa',
    nodes: [
      { id: 'n7', title: 'ธรรมชาติของคลื่น', titleEn: 'Nature of Waves', emoji: '🌊', xp: 160, status: 'locked' as NodeStatus, lessons: 5, completedLessons: 0, col: 1 },
      { id: 'n8', title: 'เสียงและการสั่น', titleEn: 'Sound & Vibration', emoji: '🎵', xp: 180, status: 'locked' as NodeStatus, lessons: 6, completedLessons: 0, col: 2 },
      { id: 'n9', title: 'การสะท้อนและหักเห', titleEn: 'Reflection & Refraction', emoji: '🪞', xp: 200, status: 'locked' as NodeStatus, lessons: 7, completedLessons: 0, col: 0 },
    ],
  },
  {
    id: 'electricity',
    title: 'ไฟฟ้าและแม่เหล็ก',
    titleEn: 'Electricity & Magnetism',
    color: '#fbbf24',
    nodes: [
      { id: 'n10', title: 'ประจุไฟฟ้า', titleEn: 'Electric Charge', emoji: '⚡', xp: 170, status: 'locked' as NodeStatus, lessons: 5, completedLessons: 0, col: 1 },
      { id: 'n11', title: 'วงจรไฟฟ้า', titleEn: 'Electric Circuits', emoji: '🔌', xp: 200, status: 'locked' as NodeStatus, lessons: 7, completedLessons: 0, col: 0 },
      { id: 'n12', title: 'แม่เหล็กไฟฟ้า', titleEn: 'Electromagnetism', emoji: '🧲', xp: 240, status: 'locked' as NodeStatus, lessons: 8, completedLessons: 0, col: 2 },
    ],
  },
];

const QUIZ_QUESTIONS = [
  { q: 'ความเร่งของวัตถุที่มีแรงสุทธิ 10 N มวล 2 kg คือ?', options: ['2 m/s²', '5 m/s²', '10 m/s²', '20 m/s²'], answer: 1 },
  { q: 'กฎข้อที่ 1 ของนิวตัน กล่าวถึงอะไร?', options: ['แรงและความเร่ง', 'ความเฉื่อย', 'แรงปฏิกิริยา', 'แรงโน้มถ่วง'], answer: 1 },
  { q: 'หน่วยของแรงในระบบ SI คือ?', options: ['kg', 'Joule', 'Newton', 'Pascal'], answer: 2 },
];

// ─── Placement Test Modal ─────────────────────────────────────────────────────
function PlacementModal({ node, onClose, onPass }: {
  node: LessonNode;
  onClose: () => void;
  onPass: () => void;
}) {
  const [step, setStep] = useState<'intro' | 'quiz' | 'result'>('intro');
  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [answers, setAnswers] = useState<boolean[]>([]);
  const [shake, setShake] = useState(false);

  const q = QUIZ_QUESTIONS[current];
  const score = answers.filter(Boolean).length;
  const passed = score >= 2;

  const handleAnswer = (idx: number) => {
    if (selected !== null) return;
    setSelected(idx);
    const correct = idx === q.answer;
    if (!correct) { setShake(true); setTimeout(() => setShake(false), 500); }
    setTimeout(() => {
      const newAnswers = [...answers, correct];
      setAnswers(newAnswers);
      if (current < QUIZ_QUESTIONS.length - 1) {
        setCurrent(c => c + 1);
        setSelected(null);
      } else {
        setStep('result');
      }
    }, 800);
  };

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 200, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
      <div onClick={onClose} style={{ position: 'absolute', inset: 0, background: 'rgba(2,4,12,0.85)', backdropFilter: 'blur(8px)' }} />
      <div style={{
        position: 'relative', zIndex: 1, background: '#0a0f1e',
        border: '1px solid rgba(0,229,255,0.2)', borderRadius: 20, padding: '2rem',
        width: '100%', maxWidth: 500,
        boxShadow: '0 0 60px rgba(0,229,255,0.08), 0 32px 64px rgba(0,0,0,0.5)',
        animation: 'modalIn 0.35s cubic-bezier(.16,1,.3,1)',
      }}>
        <div style={{ position: 'absolute', top: 0, left: '20%', right: '20%', height: 1, background: 'linear-gradient(90deg,transparent,#00e5ff80,transparent)', borderRadius: 99 }} />

        {step === 'intro' && (
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>{node.emoji}</div>
            <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: '0.65rem', letterSpacing: '0.18em', color: '#00e5ff', marginBottom: '0.5rem' }}>PLACEMENT TEST</div>
            <h2 style={{ fontFamily: "'Anuphan',sans-serif", fontWeight: 700, fontSize: '1.4rem', color: '#e8edf5', marginBottom: '0.75rem' }}>
              ข้ามไปเรียน<br />{node.title}?
            </h2>
            <p style={{ fontFamily: "'Anuphan',sans-serif", fontSize: '0.88rem', color: '#5a6480', lineHeight: 1.7, marginBottom: '1.75rem' }}>
              ทำแบบทดสอบ {QUIZ_QUESTIONS.length} ข้อ ผ่าน {Math.ceil(QUIZ_QUESTIONS.length * 0.6)} ข้อขึ้นไป<br />เพื่อปลดล็อกบทเรียนนี้ทันที
            </p>
            <div style={{ display: 'flex', gap: '0.75rem' }}>
              <button onClick={onClose} style={{ flex: 1, padding: '0.75rem', background: 'transparent', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 10, color: '#5a6480', fontFamily: "'Anuphan',sans-serif", fontSize: '0.9rem', cursor: 'pointer' }}>
                ยกเลิก
              </button>
              <button onClick={() => setStep('quiz')} style={{ flex: 2, padding: '0.75rem', background: '#00e5ff', border: 'none', borderRadius: 10, color: '#050810', fontFamily: "'Anuphan',sans-serif", fontWeight: 700, fontSize: '0.9rem', cursor: 'pointer' }}>
                เริ่มทดสอบ →
              </button>
            </div>
          </div>
        )}

        {step === 'quiz' && (
          <div>
            <div style={{ display: 'flex', gap: '0.4rem', marginBottom: '1.5rem' }}>
              {QUIZ_QUESTIONS.map((_, i) => (
                <div key={i} style={{ flex: 1, height: 4, borderRadius: 99, background: i < current ? '#00e5ff' : i === current ? 'rgba(0,229,255,0.3)' : 'rgba(255,255,255,0.07)', transition: 'background 0.3s' }} />
              ))}
            </div>
            <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: '0.62rem', color: '#3a4460', letterSpacing: '0.12em', marginBottom: '0.75rem' }}>
              ข้อ {current + 1}/{QUIZ_QUESTIONS.length}
            </div>
            <p style={{ fontFamily: "'Anuphan',sans-serif", fontSize: '1.05rem', fontWeight: 600, color: '#e8edf5', lineHeight: 1.5, marginBottom: '1.5rem', animation: shake ? 'shake 0.4s ease' : 'none' }}>
              {q.q}
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
              {q.options.map((opt, i) => {
                let bg = 'rgba(255,255,255,0.04)', border = 'rgba(255,255,255,0.08)', color = '#c8cde0';
                if (selected !== null) {
                  if (i === q.answer) { bg = 'rgba(52,211,153,0.12)'; border = '#34d399'; color = '#34d399'; }
                  else if (i === selected && selected !== q.answer) { bg = 'rgba(239,68,68,0.1)'; border = '#ef4444'; color = '#ef4444'; }
                  else { bg = 'rgba(255,255,255,0.02)'; color = '#3a4460'; }
                }
                return (
                  <button key={i} onClick={() => handleAnswer(i)} style={{
                    padding: '0.85rem 1rem', background: bg, border: `1px solid ${border}`, borderRadius: 10,
                    color, fontFamily: "'Anuphan',sans-serif", fontSize: '0.92rem', textAlign: 'left',
                    cursor: selected !== null ? 'default' : 'pointer', transition: 'all 0.25s', display: 'flex', alignItems: 'center', gap: '0.6rem',
                  }}>
                    <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: '0.65rem', color: 'inherit', opacity: 0.6 }}>{String.fromCharCode(65 + i)}.</span>
                    {opt}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {step === 'result' && (
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '3.5rem', marginBottom: '1rem' }}>{passed ? '🎉' : '😔'}</div>
            <div style={{ fontFamily: "'Bebas Neue',cursive", fontSize: '3rem', color: passed ? '#34d399' : '#ef4444', letterSpacing: '0.08em', lineHeight: 1 }}>
              {score}/{QUIZ_QUESTIONS.length}
            </div>
            <div style={{ fontFamily: "'Anuphan',sans-serif", fontSize: '0.82rem', color: '#5a6480', marginBottom: '0.75rem' }}>คะแนน</div>
            <h3 style={{ fontFamily: "'Anuphan',sans-serif", fontWeight: 700, fontSize: '1.2rem', color: '#e8edf5', marginBottom: '0.5rem' }}>
              {passed ? 'ยอดเยี่ยม! ผ่านแล้ว' : 'ยังไม่ผ่าน ลองอีกครั้ง'}
            </h3>
            <p style={{ fontFamily: "'Anuphan',sans-serif", fontSize: '0.85rem', color: '#5a6480', marginBottom: '1.75rem', lineHeight: 1.6 }}>
              {passed ? `คุณปลดล็อก "${node.title}" สำเร็จ! เริ่มเรียนได้เลย` : 'ต้องผ่านอย่างน้อย 2 ข้อ แนะนำให้เรียนบทก่อนหน้าก่อน'}
            </p>
            <div style={{ display: 'flex', gap: '0.75rem' }}>
              <button onClick={onClose} style={{ flex: 1, padding: '0.75rem', background: 'transparent', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 10, color: '#5a6480', fontFamily: "'Anuphan',sans-serif", fontSize: '0.9rem', cursor: 'pointer' }}>
                ปิด
              </button>
              {passed ? (
                <button onClick={onPass} style={{ flex: 2, padding: '0.75rem', background: '#34d399', border: 'none', borderRadius: 10, color: '#050810', fontFamily: "'Anuphan',sans-serif", fontWeight: 700, fontSize: '0.9rem', cursor: 'pointer' }}>
                  เริ่มเรียนเลย! →
                </button>
              ) : (
                <button onClick={() => { setStep('quiz'); setCurrent(0); setAnswers([]); setSelected(null); }} style={{ flex: 2, padding: '0.75rem', background: '#00e5ff', border: 'none', borderRadius: 10, color: '#050810', fontFamily: "'Anuphan',sans-serif", fontWeight: 700, fontSize: '0.9rem', cursor: 'pointer' }}>
                  ลองอีกครั้ง
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Node Detail Popup ────────────────────────────────────────────────────────
function NodePopup({ node, chapterColor, onClose, onUnlock, onNavigate }: {
  node: LessonNode;
  chapterColor: string;
  onClose: () => void;
  onUnlock: () => void;
  onNavigate: () => void; // ← ใหม่: navigate ไปหน้าบทเรียน
}) {
  const pct = node.lessons > 0 ? Math.round((node.completedLessons / node.lessons) * 100) : 0;

  return (
    <div style={{
      position: 'absolute', bottom: '110%', left: '50%', transform: 'translateX(-50%)',
      background: '#0c1120', border: `1px solid ${chapterColor}33`,
      borderRadius: 14, padding: '1.25rem', width: 240, zIndex: 50,
      boxShadow: `0 8px 40px rgba(0,0,0,0.5), 0 0 0 1px ${chapterColor}15`,
      animation: 'popIn 0.2s cubic-bezier(.16,1,.3,1)',
    }}>
      <div style={{ position: 'absolute', top: 0, left: '20%', right: '20%', height: 1, background: `linear-gradient(90deg,transparent,${chapterColor}60,transparent)`, borderRadius: 99 }} />

      <div style={{ fontFamily: "'Anuphan',sans-serif", fontWeight: 700, fontSize: '1rem', color: '#e8edf5', marginBottom: '0.25rem' }}>{node.title}</div>
      <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: '0.6rem', color: chapterColor, letterSpacing: '0.1em', marginBottom: '0.875rem' }}>{node.titleEn}</div>

      {node.status !== 'locked' && (
        <div style={{ marginBottom: '0.875rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.3rem' }}>
            <span style={{ fontFamily: "'Anuphan',sans-serif", fontSize: '0.75rem', color: '#5a6480' }}>{node.completedLessons}/{node.lessons} บท</span>
            <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: '0.65rem', color: chapterColor }}>{pct}%</span>
          </div>
          <div style={{ height: 4, background: 'rgba(255,255,255,0.07)', borderRadius: 99, overflow: 'hidden' }}>
            <div style={{ height: '100%', width: `${pct}%`, background: chapterColor, borderRadius: 99, transition: 'width 0.6s ease', boxShadow: `0 0 8px ${chapterColor}80` }} />
          </div>
        </div>
      )}

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.875rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
          <span style={{ fontSize: '0.8rem' }}>⭐</span>
          <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: '0.7rem', color: '#fbbf24' }}>{node.xp} XP</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
          <span style={{ fontSize: '0.8rem' }}>📖</span>
          <span style={{ fontFamily: "'Anuphan',sans-serif", fontSize: '0.75rem', color: '#5a6480' }}>{node.lessons} บทเรียน</span>
        </div>
      </div>

      {node.status === 'locked' ? (
        <button onClick={onUnlock} style={{
          width: '100%', padding: '0.65rem', background: 'transparent',
          border: `1px solid ${chapterColor}55`, borderRadius: 8,
          color: chapterColor, fontFamily: "'Anuphan',sans-serif", fontWeight: 600, fontSize: '0.82rem',
          cursor: 'pointer', transition: 'background 0.2s',
        }}
          onMouseEnter={e => (e.currentTarget.style.background = `${chapterColor}15`)}
          onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}>
          🔓 ทำแบบทดสอบเพื่อปลดล็อก
        </button>
      ) : node.status === 'completed' ? (
        // completed + มี href → navigate ได้
        <button onClick={node.href ? onNavigate : undefined} style={{
          width: '100%', padding: '0.65rem', background: `${chapterColor}15`,
          border: `1px solid ${chapterColor}40`, borderRadius: 8,
          color: chapterColor, fontFamily: "'Anuphan',sans-serif", fontWeight: 600, fontSize: '0.82rem',
          cursor: node.href ? 'pointer' : 'default',
        }}>
          ✓ ทบทวนบทเรียน
        </button>
      ) : (
        // available → ปุ่มเรียนต่อ navigate ทันที
        <button onClick={onNavigate} style={{
          width: '100%', padding: '0.65rem', background: chapterColor,
          border: 'none', borderRadius: 8,
          color: '#050810', fontFamily: "'Anuphan',sans-serif", fontWeight: 700, fontSize: '0.82rem', cursor: 'pointer',
        }}>
          เรียนต่อ →
        </button>
      )}

      <div style={{ position: 'absolute', bottom: -7, left: '50%', transform: 'translateX(-50%)', width: 14, height: 14, background: '#0c1120', border: `1px solid ${chapterColor}33`, borderTop: 'none', borderLeft: 'none', rotate: '45deg' }} />
    </div>
  );
}

// ─── Skill Node ───────────────────────────────────────────────────────────────
function SkillNode({ node, chapterColor, onUnlockRequest, onNavigate }: {
  node: LessonNode;
  chapterColor: string;
  onUnlockRequest: (node: LessonNode) => void;
  onNavigate: (href: string) => void; // ← ใหม่
}) {
  const [showPopup, setShowPopup] = useState(false);
  const pct = node.lessons > 0 ? Math.round((node.completedLessons / node.lessons) * 100) : 0;

  const ringColor = node.status === 'completed' ? chapterColor : node.status === 'available' ? chapterColor : 'rgba(255,255,255,0.1)';
  const bgColor = node.status === 'completed' ? `${chapterColor}22` : node.status === 'available' ? `${chapterColor}10` : 'rgba(255,255,255,0.03)';
  const emojiOpacity = node.status === 'locked' ? 0.25 : 1;

  return (
    <div style={{ position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <button
        onClick={() => setShowPopup(v => !v)}
        style={{
          position: 'relative', width: 72, height: 72, borderRadius: '50%',
          background: bgColor, border: `2.5px solid ${ringColor}`,
          boxShadow: node.status !== 'locked' ? `0 0 20px ${chapterColor}30, inset 0 0 20px ${chapterColor}08` : 'none',
          cursor: 'pointer', transition: 'transform 0.2s, box-shadow 0.2s',
          display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column',
          fontSize: '1.6rem',
        }}
        onMouseEnter={e => { e.currentTarget.style.transform = 'scale(1.08)'; }}
        onMouseLeave={e => { e.currentTarget.style.transform = 'scale(1)'; }}
      >
        {node.status === 'completed' && (
          <div style={{ position: 'absolute', inset: -4, borderRadius: '50%', border: `1px solid ${chapterColor}30`, animation: 'ringPulse 2.5s infinite' }} />
        )}
        {node.status === 'available' && pct > 0 && pct < 100 && (
          <svg style={{ position: 'absolute', inset: -4, width: 80, height: 80, transform: 'rotate(-90deg)' }} viewBox="0 0 80 80">
            <circle cx="40" cy="40" r="36" fill="none" stroke={`${chapterColor}20`} strokeWidth="3" />
            <circle cx="40" cy="40" r="36" fill="none" stroke={chapterColor} strokeWidth="3"
              strokeDasharray={`${2 * Math.PI * 36}`}
              strokeDashoffset={`${2 * Math.PI * 36 * (1 - pct / 100)}`}
              strokeLinecap="round" style={{ transition: 'stroke-dashoffset 1s ease' }} />
          </svg>
        )}
        <span style={{ opacity: emojiOpacity, fontSize: '1.5rem', lineHeight: 1 }}>{node.emoji}</span>
        {node.status === 'locked' && (
          <div style={{ position: 'absolute', bottom: -2, right: -2, width: 22, height: 22, borderRadius: '50%', background: '#0a0f1e', border: '1.5px solid rgba(255,255,255,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.65rem' }}>🔒</div>
        )}
        {node.status === 'completed' && (
          <div style={{ position: 'absolute', bottom: -2, right: -2, width: 22, height: 22, borderRadius: '50%', background: chapterColor, border: `1.5px solid ${chapterColor}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.6rem', color: '#050810', fontWeight: 700 }}>✓</div>
        )}
      </button>

      <div style={{ marginTop: '0.5rem', fontFamily: "'Anuphan',sans-serif", fontSize: '0.75rem', fontWeight: 600, color: node.status === 'locked' ? '#2a3450' : '#8a94b0', textAlign: 'center', maxWidth: 90, lineHeight: 1.3 }}>
        {node.title}
      </div>

      {showPopup && (
        <>
          <div onClick={() => setShowPopup(false)} style={{ position: 'fixed', inset: 0, zIndex: 40 }} />
          <NodePopup
            node={node}
            chapterColor={chapterColor}
            onClose={() => setShowPopup(false)}
            onUnlock={() => {
              setShowPopup(false);
              onUnlockRequest(node);
            }}
            onNavigate={() => {
              setShowPopup(false);
              if (node.href) onNavigate(node.href);
            }}
          />
        </>
      )}
    </div>
  );
}

// ─── Chapter Tree ─────────────────────────────────────────────────────────────
function ChapterTree({ chapter, onUnlockRequest, onNavigate }: {
  chapter: typeof CHAPTERS[0];
  onUnlockRequest: (node: LessonNode) => void;
  onNavigate: (href: string) => void;
}) {
  const colPositions = ['16%', '50%', '84%'];

  return (
    <div style={{ marginBottom: '3rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '2rem', padding: '0 1rem' }}>
        <div style={{ flex: 1, height: 1, background: `linear-gradient(90deg, transparent, ${chapter.color}40)` }} />
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
          <div style={{ width: 8, height: 8, borderRadius: '50%', background: chapter.color, boxShadow: `0 0 10px ${chapter.color}` }} />
          <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: '0.65rem', letterSpacing: '0.18em', color: chapter.color, textTransform: 'uppercase' }}>{chapter.titleEn}</span>
          <span style={{ fontFamily: "'Anuphan',sans-serif", fontSize: '0.8rem', color: '#3a4460' }}>· {chapter.title}</span>
        </div>
        <div style={{ flex: 1, height: 1, background: `linear-gradient(90deg, ${chapter.color}40, transparent)` }} />
      </div>

      <div style={{ position: 'relative' }}>
        <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none', overflow: 'visible' }} preserveAspectRatio="none">
          {chapter.nodes.slice(0, -1).map((node, i) => {
            const next = chapter.nodes[i + 1];
            const fromX = parseFloat(colPositions[node.col]);
            const toX = parseFloat(colPositions[next.col]);
            const nodeH = 120;
            const fromY = i * nodeH + 36;
            const toY = (i + 1) * nodeH + 36;
            const isDone = node.status === 'completed' && next.status !== 'locked';
            return (
              <line key={i}
                x1={`${fromX}%`} y1={fromY} x2={`${toX}%`} y2={toY}
                stroke={isDone ? chapter.color : 'rgba(255,255,255,0.07)'}
                strokeWidth={isDone ? 2 : 1.5}
                strokeDasharray={isDone ? 'none' : '5 5'}
                style={{ transition: 'stroke 0.4s' }}
              />
            );
          })}
        </svg>

        {chapter.nodes.map((node, i) => (
          <div key={node.id} style={{
            position: 'relative', height: 120, display: 'flex', alignItems: 'center',
            justifyContent: colPositions[node.col] === '50%' ? 'center' : colPositions[node.col] === '16%' ? 'flex-start' : 'flex-end',
            paddingLeft: colPositions[node.col] === '16%' ? '5%' : undefined,
            paddingRight: colPositions[node.col] === '84%' ? '5%' : undefined,
            animation: `fadeUp 0.5s cubic-bezier(.16,1,.3,1) ${i * 0.07}s both`,
          }}>
            <SkillNode
              node={{ ...node, chapter: chapter.id }}
              chapterColor={chapter.color}
              onUnlockRequest={onUnlockRequest}
              onNavigate={onNavigate}
            />
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function LessonPage() {
  const router = useRouter(); // ← เพิ่ม
  const [chapters, setChapters] = useState(CHAPTERS);
  const [testNode, setTestNode] = useState<(LessonNode & { chapterColor: string }) | null>(null);

  const handleUnlockRequest = (node: LessonNode, chapterColor: string) => {
    setTestNode({ ...node, chapterColor });
  };

  // เมื่อ placement test ผ่าน → unlock แล้ว navigate ทันที (ถ้ามี href)
  const handlePass = () => {
    if (!testNode) return;
    setChapters(prev => prev.map(ch => ({
      ...ch,
      nodes: ch.nodes.map(n => n.id === testNode!.id ? { ...n, status: 'available' as NodeStatus } : n),
    })));
    const dest = testNode.href;
    setTestNode(null);
    if (dest) router.push(dest); // ← navigate หลัง unlock
  };

  // navigate จาก NodePopup ปุ่ม "เรียนต่อ"
  const handleNavigate = (href: string) => {
    router.push(href);
  };

  const totalXp = CHAPTERS.flatMap(c => c.nodes).filter(n => n.status === 'completed').reduce((a, n) => a + n.xp, 0);
  const completedCount = CHAPTERS.flatMap(c => c.nodes).filter(n => n.status === 'completed').length;
  const totalNodes = CHAPTERS.flatMap(c => c.nodes).length;

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Anuphan:wght@300;400;500;600;700&family=JetBrains+Mono:wght@300;400;600&display=swap');
        * { margin:0; padding:0; box-sizing:border-box; }
        body { background:#050810; color:#e8edf5; font-family:'Anuphan',sans-serif; overflow-x:hidden; }
        @keyframes fadeUp   { from{opacity:0;transform:translateY(16px)} to{opacity:1;transform:translateY(0)} }
        @keyframes modalIn  { from{opacity:0;transform:translateY(20px) scale(0.97)} to{opacity:1;transform:none} }
        @keyframes popIn    { from{opacity:0;transform:translateX(-50%) translateY(6px) scale(0.96)} to{opacity:1;transform:translateX(-50%) translateY(0) scale(1)} }
        @keyframes ringPulse{ 0%,100%{opacity:0.4;transform:scale(1)} 50%{opacity:0.1;transform:scale(1.15)} }
        @keyframes shake    { 0%,100%{transform:translateX(0)} 20%,60%{transform:translateX(-6px)} 40%,80%{transform:translateX(6px)} }
        @keyframes pulse    { 0%,100%{opacity:0.5} 50%{opacity:1} }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.08); border-radius: 99px; }
      `}</style>

      <div style={{ minHeight: '100vh', background: '#050810', position: 'relative', overflow: 'hidden' }}>
        {/* BG glow */}
        <div style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 0 }}>
          <div style={{ position: 'absolute', top: '-10%', left: '-5%', width: 600, height: 600, borderRadius: '50%', background: 'radial-gradient(circle,rgba(0,229,255,0.05) 0%,transparent 70%)', filter: 'blur(40px)' }} />
          <div style={{ position: 'absolute', bottom: '20%', right: '-5%', width: 500, height: 500, borderRadius: '50%', background: 'radial-gradient(circle,rgba(167,139,250,0.05) 0%,transparent 70%)', filter: 'blur(40px)' }} />
        </div>

        {/* Nav */}
        <nav style={{ position: 'sticky', top: 0, zIndex: 50, borderBottom: '1px solid rgba(255,255,255,0.06)', background: 'rgba(5,8,16,0.85)', backdropFilter: 'blur(16px)', padding: '0.875rem 2rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <a href="/" style={{ fontFamily: "'Bebas Neue',cursive", fontSize: '1.4rem', letterSpacing: '0.1em', color: '#e8edf5', textDecoration: 'none', marginRight: 'auto' }}>
            PHYS<span style={{ color: '#00e5ff' }}>FUN</span>
          </a>
          {[{ label: 'Lesson', href: '/lesson' }, { label: 'Practice', href: '/practice' }, { label: 'Challenge', href: '/game' }].map(l => (
            <a key={l.href} href={l.href}
              style={{ fontFamily: "'Anuphan',sans-serif", fontSize: '0.88rem', color: l.label === 'Lesson' ? '#e8edf5' : '#5a6480', textDecoration: 'none', padding: '0.4rem 0.75rem', borderRadius: 6, background: l.label === 'Lesson' ? 'rgba(255,255,255,0.06)' : 'transparent', transition: 'color 0.2s, background 0.2s' }}
              onMouseEnter={e => { if (l.label !== 'Lesson') { e.currentTarget.style.color = '#e8edf5'; e.currentTarget.style.background = 'rgba(255,255,255,0.05)'; } }}
              onMouseLeave={e => { if (l.label !== 'Lesson') { e.currentTarget.style.color = '#5a6480'; e.currentTarget.style.background = 'transparent'; } }}>
              {l.label}
            </a>
          ))}
          <div style={{ width: 1, height: 20, background: 'rgba(255,255,255,0.08)', margin: '0 0.25rem' }} />
          <a href="/login" style={{ fontFamily: "'Anuphan',sans-serif", fontSize: '0.85rem', color: '#5a6480', textDecoration: 'none', padding: '0.4rem 0.75rem' }}>เข้าสู่ระบบ</a>
          <a href="/register" style={{ fontFamily: "'Anuphan',sans-serif", fontSize: '0.85rem', fontWeight: 500, color: '#050810', background: '#00e5ff', textDecoration: 'none', padding: '0.45rem 1.1rem', borderRadius: 8, transition: 'opacity 0.2s' }}
            onMouseEnter={e => (e.currentTarget.style.opacity = '0.85')}
            onMouseLeave={e => (e.currentTarget.style.opacity = '1')}>
            สมัครฟรี
          </a>
        </nav>

        {/* Layout */}
        <div style={{ position: 'relative', zIndex: 1, display: 'flex', maxWidth: 1100, margin: '0 auto', padding: '2rem 1.5rem', gap: '2rem', alignItems: 'flex-start' }}>

          {/* Skill Tree */}
          <main style={{ flex: 1, minWidth: 0 }}>
            <div style={{ marginBottom: '2.5rem', animation: 'fadeUp 0.6s ease both' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.75rem' }}>
                <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#34d399', animation: 'pulse 2s infinite' }} />
                <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: '0.65rem', letterSpacing: '0.18em', color: '#34d399' }}>SKILL TREE</span>
              </div>
              <h1 style={{ fontFamily: "'Anuphan',sans-serif", fontWeight: 700, fontSize: 'clamp(1.5rem,3vw,2.2rem)', color: '#e8edf5', lineHeight: 1.2, marginBottom: '0.4rem' }}>
                บทเรียนฟิสิกส์
              </h1>
              <p style={{ fontFamily: "'Anuphan',sans-serif", fontSize: '0.9rem', color: '#5a6480', fontWeight: 300 }}>
                เรียนตามลำดับหรือทำแบบทดสอบเพื่อข้ามบท
              </p>
            </div>

            <div style={{ maxWidth: 520, margin: '0 auto' }}>
              {chapters.map(ch => (
                <ChapterTree
                  key={ch.id}
                  chapter={ch}
                  onUnlockRequest={(node) => handleUnlockRequest(node, ch.color)}
                  onNavigate={handleNavigate}
                />
              ))}
              <div style={{ textAlign: 'center', padding: '2rem 0', animation: 'fadeUp 0.5s 0.5s ease both' }}>
                <div style={{ display: 'inline-flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem', padding: '1.25rem 2rem', background: 'rgba(255,255,255,0.03)', border: '1px dashed rgba(255,255,255,0.1)', borderRadius: 16 }}>
                  <span style={{ fontSize: '2rem' }}>🏁</span>
                  <span style={{ fontFamily: "'Anuphan',sans-serif", fontSize: '0.85rem', color: '#3a4460' }}>บทเรียนเพิ่มเติมเร็วๆ นี้</span>
                </div>
              </div>
            </div>
          </main>

          {/* Sidebar */}
          <aside style={{ width: 240, flexShrink: 0, position: 'sticky', top: '5rem', display: 'flex', flexDirection: 'column', gap: '1rem', animation: 'fadeUp 0.6s 0.1s ease both' }}>
            <div style={{ background: 'rgba(8,13,26,0.8)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 14, padding: '1.25rem' }}>
              <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: '0.6rem', letterSpacing: '0.15em', color: '#3a4460', marginBottom: '0.75rem' }}>MY PROGRESS</div>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.3rem', marginBottom: '0.2rem' }}>
                <span style={{ fontFamily: "'Bebas Neue',cursive", fontSize: '2.2rem', color: '#fbbf24', letterSpacing: '0.05em' }}>{totalXp}</span>
                <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: '0.65rem', color: '#5a6480' }}>XP</span>
              </div>
              <div style={{ fontFamily: "'Anuphan',sans-serif", fontSize: '0.78rem', color: '#3a4460', marginBottom: '1rem' }}>คะแนนสะสม</div>
              <div style={{ display: 'flex', gap: '0.75rem' }}>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontFamily: "'Bebas Neue',cursive", fontSize: '1.4rem', color: '#00e5ff', letterSpacing: '0.05em' }}>{completedCount}</div>
                  <div style={{ fontFamily: "'Anuphan',sans-serif", fontSize: '0.68rem', color: '#3a4460' }}>บทสำเร็จ</div>
                </div>
                <div style={{ width: 1, background: 'rgba(255,255,255,0.07)' }} />
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontFamily: "'Bebas Neue',cursive", fontSize: '1.4rem', color: '#a78bfa', letterSpacing: '0.05em' }}>{totalNodes - completedCount}</div>
                  <div style={{ fontFamily: "'Anuphan',sans-serif", fontSize: '0.68rem', color: '#3a4460' }}>เหลืออยู่</div>
                </div>
              </div>
              <div style={{ marginTop: '1rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.35rem' }}>
                  <span style={{ fontFamily: "'Anuphan',sans-serif", fontSize: '0.72rem', color: '#5a6480' }}>ความก้าวหน้ารวม</span>
                  <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: '0.65rem', color: '#00e5ff' }}>{Math.round(completedCount / totalNodes * 100)}%</span>
                </div>
                <div style={{ height: 5, background: 'rgba(255,255,255,0.06)', borderRadius: 99, overflow: 'hidden' }}>
                  <div style={{ height: '100%', width: `${completedCount / totalNodes * 100}%`, background: 'linear-gradient(90deg,#00e5ff,#a78bfa)', borderRadius: 99 }} />
                </div>
              </div>
            </div>

            <div style={{ background: 'rgba(8,13,26,0.8)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 14, padding: '1.25rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
                <span style={{ fontSize: '1.2rem' }}>🔥</span>
                <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: '0.6rem', letterSpacing: '0.15em', color: '#3a4460' }}>STREAK</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.3rem' }}>
                <span style={{ fontFamily: "'Bebas Neue',cursive", fontSize: '2rem', color: '#fb923c', letterSpacing: '0.05em' }}>7</span>
                <span style={{ fontFamily: "'Anuphan',sans-serif", fontSize: '0.8rem', color: '#5a6480' }}>วันติดต่อกัน</span>
              </div>
              <div style={{ display: 'flex', gap: '0.3rem', marginTop: '0.875rem' }}>
                {['จ', 'อ', 'พ', 'พฤ', 'ศ', 'ส', 'อา'].map((d, i) => (
                  <div key={d} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.25rem' }}>
                    <div style={{ width: '100%', aspectRatio: '1', borderRadius: 6, background: i < 7 ? 'rgba(251,146,60,0.2)' : 'rgba(255,255,255,0.04)', border: `1px solid ${i < 7 ? 'rgba(251,146,60,0.4)' : 'rgba(255,255,255,0.06)'}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.5rem' }}>
                      {i < 7 ? '🔥' : ''}
                    </div>
                    <span style={{ fontFamily: "'Anuphan',sans-serif", fontSize: '0.5rem', color: '#2a3450' }}>{d}</span>
                  </div>
                ))}
              </div>
            </div>

            <div style={{ background: 'rgba(8,13,26,0.8)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 14, padding: '1.25rem' }}>
              <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: '0.6rem', letterSpacing: '0.15em', color: '#3a4460', marginBottom: '0.875rem' }}>LEGEND</div>
              {[
                { icon: '✓', label: 'เรียนสำเร็จ', color: '#00e5ff' },
                { icon: '▶', label: 'กำลังเรียน', color: '#a78bfa' },
                { icon: '🔒', label: 'ยังล็อกอยู่', color: '#3a4460' },
              ].map(item => (
                <div key={item.label} style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.5rem' }}>
                  <div style={{ width: 22, height: 22, borderRadius: '50%', border: `1.5px solid ${item.color}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.6rem', color: item.color, flexShrink: 0 }}>
                    {item.icon}
                  </div>
                  <span style={{ fontFamily: "'Anuphan',sans-serif", fontSize: '0.78rem', color: '#5a6480' }}>{item.label}</span>
                </div>
              ))}
            </div>
          </aside>
        </div>

        {/* Placement Test Modal */}
        {testNode && (
          <PlacementModal
            node={testNode}
            onClose={() => setTestNode(null)}
            onPass={handlePass}
          />
        )}
      </div>
    </>
  );
}