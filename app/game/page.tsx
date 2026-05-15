'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

// ─── Types ────────────────────────────────────────────────────────────────────
type MainTab = 'games' | 'tournaments';

// ─── Data ─────────────────────────────────────────────────────────────────────
const GAMES = [
  {
    id: 'speed',
    emoji: '⚡',
    title: 'Speed Quiz',
    titleTh: 'ตอบเร็ว',
    desc: 'ตอบโจทย์ฟิสิกส์ให้เร็วที่สุด ยิ่งเร็วยิ่งได้คะแนนมาก',
    accent: '#00e5ff',
    tags: ['Solo', '60 วินาที', 'ทุกระดับ'],
    players: '2.4K',
    difficulty: 3,
    xp: '+50–200 XP',
    badge: 'HOT',
    badgeColor: '#ef4444',
  },
  {
    id: 'boss',
    emoji: '👾',
    title: 'Boss Battle',
    titleTh: 'สู้บอส',
    desc: 'เอาชนะบอสด้วยการตอบโจทย์ถูก ผิดแล้วบอสโจมตีกลับ',
    accent: '#a78bfa',
    tags: ['Solo', 'หลายด่าน', 'Medium+'],
    players: '1.1K',
    difficulty: 4,
    xp: '+100–500 XP',
    badge: 'NEW',
    badgeColor: '#34d399',
  },
  {
    id: 'memory',
    emoji: '🧠',
    title: 'Formula Match',
    titleTh: 'จับคู่สูตร',
    desc: 'จับคู่สูตรฟิสิกส์กับความหมายให้ถูก ฝึกจำสูตรแบบสนุก',
    accent: '#fbbf24',
    tags: ['Solo', 'ไม่จำกัดเวลา', 'Easy'],
    players: '890',
    difficulty: 2,
    xp: '+30–120 XP',
    badge: null,
    badgeColor: '',
  },
  {
    id: '1v1',
    emoji: '⚔️',
    title: '1v1 Duel',
    titleTh: 'ดวลสด',
    desc: 'ท้าคนอื่นแบบ real-time ตอบโจทย์ชุดเดียวกัน ใครเร็วกว่าชนะ',
    accent: '#f472b6',
    tags: ['PvP', 'Real-time', 'ทุกระดับ'],
    players: '3.2K',
    difficulty: 3,
    xp: '+80–300 XP',
    badge: 'LIVE',
    badgeColor: '#ef4444',
  },
  {
    id: 'survival',
    emoji: '💀',
    title: 'Survival',
    titleTh: 'โหมดเอาชีวิตรอด',
    desc: 'ตอบโจทย์ต่อเนื่อง ผิด 3 ครั้งจบเลย ไปได้ไกลแค่ไหน?',
    accent: '#fb923c',
    tags: ['Solo', '∞ โจทย์', 'All Level'],
    players: '1.8K',
    difficulty: 5,
    xp: '+XP ทุกข้อ',
    badge: null,
    badgeColor: '',
  },
  {
    id: 'coop',
    emoji: '🤝',
    title: 'Co-op Challenge',
    titleTh: 'ทีม 2 คน',
    desc: 'จับคู่กับเพื่อนช่วยกันตอบโจทย์ยาก แบ่งหน้าที่ ชนะด้วยกัน',
    accent: '#34d399',
    tags: ['Co-op', '2 ผู้เล่น', 'Hard'],
    players: '640',
    difficulty: 4,
    xp: '+150–600 XP',
    badge: 'BETA',
    badgeColor: '#a78bfa',
  },
];

const TOURNAMENTS = [
  {
    id: 't1',
    emoji: '🏆',
    title: 'PhysFun Open #12',
    subtitle: 'การแข่งขันรายเดือน',
    accent: '#fbbf24',
    status: 'live' as const,
    statusLabel: 'กำลังแข่ง',
    prize: '5,000 XP',
    prizeIcon: '⭐',
    players: 128,
    maxPlayers: 128,
    timeLeft: 'ปิดรับแล้ว',
    rounds: 'รอบ 4/5',
    topic: 'กลศาสตร์ + คลื่น',
    difficulty: 'Hard',
    canJoin: false,
  },
  {
    id: 't2',
    emoji: '⚡',
    title: 'Speed King Weekly',
    subtitle: 'แชมป์ความเร็วประจำสัปดาห์',
    accent: '#00e5ff',
    status: 'open' as const,
    statusLabel: 'เปิดรับสมัคร',
    prize: '2,000 XP',
    prizeIcon: '⭐',
    players: 47,
    maxPlayers: 64,
    timeLeft: 'เริ่ม 2 ชม.',
    rounds: '5 รอบ',
    topic: 'ทุกหมวด (Speed)',
    difficulty: 'Medium',
    canJoin: true,
  },
  {
    id: 't3',
    emoji: '🧪',
    title: 'Physics Olympiad Prep',
    subtitle: 'เตรียมสอบโอลิมปิก',
    accent: '#a78bfa',
    status: 'open' as const,
    statusLabel: 'เปิดรับสมัคร',
    prize: '10,000 XP + Badge',
    prizeIcon: '🏅',
    players: 23,
    maxPlayers: 32,
    timeLeft: 'เริ่ม 3 วัน',
    rounds: '7 รอบ',
    topic: 'ทุกหมวด (Olympiad)',
    difficulty: 'Exam',
    canJoin: true,
  },
  {
    id: 't4',
    emoji: '🌙',
    title: 'Night Grind',
    subtitle: 'แข่งช่วงดึก เที่ยงคืน–ตี 2',
    accent: '#34d399',
    status: 'upcoming' as const,
    statusLabel: 'เร็วๆ นี้',
    prize: '1,500 XP',
    prizeIcon: '⭐',
    players: 0,
    maxPlayers: 50,
    timeLeft: 'วันพรุ่งนี้',
    rounds: '4 รอบ',
    topic: 'ไฟฟ้า + แม่เหล็ก',
    difficulty: 'Hard',
    canJoin: false,
  },
];

const LEADERBOARD = [
  { rank: 1, name: 'ณัฐพล ว.', xp: 12480, streak: 42, badge: '👑' },
  { rank: 2, name: 'สิรินทร์ พ.', xp: 11200, streak: 35, badge: '🥈' },
  { rank: 3, name: 'ธีรภัทร จ.', xp: 10650, streak: 28, badge: '🥉' },
  { rank: 4, name: 'ปาณิสรา ม.', xp: 9800, streak: 21, badge: null },
  { rank: 5, name: 'คุณ', xp: 2430, streak: 7, badge: null, isMe: true },
];

// ─── Sub-components ───────────────────────────────────────────────────────────
function DifficultyDots({ level, color }: { level: number; color: string }) {
  return (
    <div style={{ display: 'flex', gap: 3, alignItems: 'center' }}>
      {[1, 2, 3, 4, 5].map(i => (
        <div key={i} style={{ width: 5, height: 5, borderRadius: '50%', background: i <= level ? color : 'rgba(255,255,255,0.1)', transition: 'background 0.3s' }} />
      ))}
    </div>
  );
}

// ─── Lock Icon SVG ────────────────────────────────────────────────────────────
function LockIcon() {
  return (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
      <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
    </svg>
  );
}

// ─── GameCard ─────────────────────────────────────────────────────────────────
function GameCard({ game, locked }: { game: typeof GAMES[0]; locked?: boolean }) {
  const [hovered, setHovered] = useState(false);
  const router = useRouter();

  return (
    <div
      onClick={() => !locked && router.push(`/game/${game.id}`)}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        position: 'relative',
        background: locked
          ? 'rgba(5,8,16,0.6)'
          : hovered ? 'rgba(12,17,32,0.98)' : 'rgba(8,13,26,0.8)',
        border: `1px solid ${locked ? 'rgba(255,255,255,0.05)' : hovered ? game.accent + '44' : 'rgba(255,255,255,0.07)'}`,
        borderRadius: 16,
        padding: '1.5rem',
        cursor: locked ? 'default' : 'pointer',
        transition: 'all 0.3s cubic-bezier(.16,1,.3,1)',
        transform: !locked && hovered ? 'translateY(-4px)' : 'none',
        boxShadow: !locked && hovered
          ? `0 16px 48px ${game.accent}12, 0 0 0 1px ${game.accent}18`
          : '0 4px 20px rgba(0,0,0,0.25)',
        display: 'flex', flexDirection: 'column', gap: '1rem',
        overflow: 'hidden',
      }}
    >
      {/* Top glow — only for unlocked */}
      {!locked && (
        <div style={{ position: 'absolute', top: 0, left: '15%', right: '15%', height: 1, background: hovered ? `linear-gradient(90deg,transparent,${game.accent}70,transparent)` : 'transparent', transition: 'background 0.4s', borderRadius: 99 }} />
      )}

      {/* Badge */}
      {game.badge && !locked && (
        <div style={{ position: 'absolute', top: '1rem', right: '1rem', background: game.badgeColor + '22', border: `1px solid ${game.badgeColor}44`, borderRadius: 5, padding: '0.15rem 0.5rem', fontFamily: "'JetBrains Mono',monospace", fontSize: '0.55rem', letterSpacing: '0.12em', color: game.badgeColor }}>
          {game.badge}
        </div>
      )}

      {/* Content — blurred when locked */}
      <div style={{ opacity: locked ? 0.35 : 1, filter: locked ? 'blur(1.5px)' : 'none', transition: 'opacity 0.3s, filter 0.3s', display: 'flex', flexDirection: 'column', gap: '1rem', pointerEvents: 'none' }}>
        {/* Icon + title */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.875rem' }}>
          <div style={{ width: 52, height: 52, borderRadius: 14, background: hovered && !locked ? `${game.accent}18` : 'rgba(255,255,255,0.04)', border: `1px solid ${hovered && !locked ? game.accent + '35' : 'rgba(255,255,255,0.08)'}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.6rem', transition: 'all 0.3s', flexShrink: 0 }}>
            {game.emoji}
          </div>
          <div>
            <div style={{ fontFamily: "'Anuphan',sans-serif", fontWeight: 700, fontSize: '1.05rem', color: '#e8edf5', lineHeight: 1.2 }}>{game.titleTh}</div>
            <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: '0.6rem', letterSpacing: '0.1em', color: hovered && !locked ? game.accent : '#3a4460', transition: 'color 0.3s' }}>{game.title}</div>
          </div>
        </div>

        {/* Desc */}
        <p style={{ fontFamily: "'Anuphan',sans-serif", fontSize: '0.83rem', color: '#5a6480', lineHeight: 1.65, fontWeight: 300 }}>{game.desc}</p>

        {/* Stats row */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div>
            <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: '0.58rem', color: '#2a3450', marginBottom: '0.2rem' }}>DIFFICULTY</div>
            <DifficultyDots level={game.difficulty} color={game.accent} />
          </div>
          <div style={{ width: 1, height: 28, background: 'rgba(255,255,255,0.06)' }} />
          <div>
            <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: '0.58rem', color: '#2a3450', marginBottom: '0.2rem' }}>XP REWARD</div>
            <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: '0.68rem', color: '#fbbf24' }}>{game.xp}</div>
          </div>
          <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
            <div style={{ width: 5, height: 5, borderRadius: '50%', background: '#34d399', animation: 'pulse 2s infinite' }} />
            <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: '0.62rem', color: '#3a4460' }}>{game.players}</span>
          </div>
        </div>

        {/* Tags */}
        <div style={{ display: 'flex', gap: '0.35rem', flexWrap: 'wrap' }}>
          {game.tags.map(t => (
            <span key={t} style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: '0.58rem', letterSpacing: '0.06em', color: hovered && !locked ? game.accent + 'bb' : '#2a3450', border: `1px solid ${hovered && !locked ? game.accent + '28' : 'rgba(255,255,255,0.05)'}`, padding: '0.18rem 0.5rem', borderRadius: 4, transition: 'all 0.3s' }}>
              {t}
            </span>
          ))}
        </div>

        {/* CTA */}
        <button style={{ width: '100%', padding: '0.7rem', background: hovered && !locked ? game.accent : 'rgba(255,255,255,0.04)', border: `1px solid ${hovered && !locked ? game.accent : 'rgba(255,255,255,0.08)'}`, borderRadius: 9, color: hovered && !locked ? '#050810' : '#5a6480', fontFamily: "'Anuphan',sans-serif", fontWeight: 700, fontSize: '0.88rem', cursor: 'pointer', transition: 'all 0.3s', marginTop: 'auto' }}>
          เล่นเลย →
        </button>
      </div>

      {/* ── Lock Overlay ── */}
      {locked && (
        <div style={{
          position: 'absolute', inset: 0,
          display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
          gap: '0.75rem',
          background: 'rgba(5,8,16,0.55)',
          borderRadius: 16,
          backdropFilter: 'blur(2px)',
          zIndex: 10,
        }}>
          {/* Lock icon circle */}
          <div style={{
            width: 64, height: 64, borderRadius: '50%',
            background: 'rgba(255,255,255,0.05)',
            border: '1px solid rgba(255,255,255,0.12)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: 'rgba(255,255,255,0.4)',
            boxShadow: '0 0 24px rgba(0,0,0,0.4)',
          }}>
            <LockIcon />
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontFamily: "'Anuphan',sans-serif", fontWeight: 600, fontSize: '0.9rem', color: 'rgba(255,255,255,0.5)', marginBottom: '0.25rem' }}>
              ยังไม่ปลดล็อก
            </div>
            <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: '0.62rem', color: 'rgba(255,255,255,0.2)', letterSpacing: '0.06em' }}>
              เล่น Speed Quiz เพื่อปลดล็อก
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function TournamentCard({ t }: { t: typeof TOURNAMENTS[0] }) {
  const [hovered, setHovered] = useState(false);
  const fillPct = Math.round((t.players / t.maxPlayers) * 100);

  const statusColors: Record<string, string> = { live: '#ef4444', open: '#34d399', upcoming: '#fbbf24' };
  const sc = statusColors[t.status];

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        position: 'relative', background: hovered ? 'rgba(12,17,32,0.98)' : 'rgba(8,13,26,0.8)',
        border: `1px solid ${hovered ? t.accent + '44' : 'rgba(255,255,255,0.07)'}`,
        borderRadius: 16, padding: '1.5rem',
        transition: 'all 0.3s cubic-bezier(.16,1,.3,1)',
        transform: hovered ? 'translateY(-3px)' : 'none',
        boxShadow: hovered ? `0 16px 48px ${t.accent}10, 0 0 0 1px ${t.accent}15` : '0 4px 20px rgba(0,0,0,0.25)',
        display: 'flex', flexDirection: 'column', gap: '1rem',
        overflow: 'hidden',
      }}
    >
      <div style={{ position: 'absolute', top: 0, left: '15%', right: '15%', height: 1, background: hovered ? `linear-gradient(90deg,transparent,${t.accent}70,transparent)` : 'transparent', transition: 'background 0.4s', borderRadius: 99 }} />

      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '0.75rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div style={{ width: 46, height: 46, borderRadius: 12, background: `${t.accent}14`, border: `1px solid ${t.accent}30`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.4rem', flexShrink: 0 }}>
            {t.emoji}
          </div>
          <div>
            <div style={{ fontFamily: "'Anuphan',sans-serif", fontWeight: 700, fontSize: '1rem', color: '#e8edf5', lineHeight: 1.2, marginBottom: '0.15rem' }}>{t.title}</div>
            <div style={{ fontFamily: "'Anuphan',sans-serif", fontSize: '0.75rem', color: '#3a4460' }}>{t.subtitle}</div>
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', background: `${sc}15`, border: `1px solid ${sc}30`, borderRadius: 20, padding: '0.25rem 0.65rem', flexShrink: 0 }}>
          {t.status === 'live' && <div style={{ width: 5, height: 5, borderRadius: '50%', background: sc, animation: 'pulse 1.2s infinite' }} />}
          <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: '0.58rem', letterSpacing: '0.1em', color: sc }}>{t.statusLabel}</span>
        </div>
      </div>

      {/* Info grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem 1rem' }}>
        {[
          { label: 'PRIZE', value: `${t.prizeIcon} ${t.prize}`, color: '#fbbf24' },
          { label: 'ROUNDS', value: t.rounds, color: t.accent },
          { label: 'TOPIC', value: t.topic, color: '#e8edf5' },
          { label: 'LEVEL', value: t.difficulty, color: '#5a6480' },
        ].map(item => (
          <div key={item.label}>
            <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: '0.55rem', letterSpacing: '0.12em', color: '#2a3450', marginBottom: '0.15rem' }}>{item.label}</div>
            <div style={{ fontFamily: "'Anuphan',sans-serif", fontSize: '0.82rem', fontWeight: 600, color: item.color }}>{item.value}</div>
          </div>
        ))}
      </div>

      {/* Slots bar */}
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.35rem' }}>
          <span style={{ fontFamily: "'Anuphan',sans-serif", fontSize: '0.72rem', color: '#5a6480' }}>ผู้เล่น {t.players}/{t.maxPlayers}</span>
          <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: '0.62rem', color: t.accent }}>⏰ {t.timeLeft}</span>
        </div>
        <div style={{ height: 4, background: 'rgba(255,255,255,0.06)', borderRadius: 99, overflow: 'hidden' }}>
          <div style={{ height: '100%', width: `${fillPct}%`, background: fillPct >= 100 ? '#ef4444' : t.accent, borderRadius: 99, boxShadow: `0 0 8px ${t.accent}60`, transition: 'width 0.8s ease' }} />
        </div>
      </div>

      {/* Join button */}
      <button style={{
        width: '100%', padding: '0.7rem',
        background: t.canJoin ? (hovered ? t.accent : `${t.accent}15`) : 'rgba(255,255,255,0.03)',
        border: `1px solid ${t.canJoin ? (hovered ? t.accent : `${t.accent}40`) : 'rgba(255,255,255,0.06)'}`,
        borderRadius: 9,
        color: t.canJoin ? (hovered ? '#050810' : t.accent) : '#2a3450',
        fontFamily: "'Anuphan',sans-serif", fontWeight: 700, fontSize: '0.88rem',
        cursor: t.canJoin ? 'pointer' : 'default',
        transition: 'all 0.3s',
      }}>
        {t.canJoin ? 'สมัครแข่งขัน →' : t.status === 'live' ? '🔴 กำลังดำเนินการ' : 'เร็วๆ นี้'}
      </button>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function GamePage() {
  const [tab, setTab] = useState<MainTab>('games');

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Anuphan:wght@300;400;500;600;700&family=JetBrains+Mono:wght@300;400;600&display=swap');
        * { margin:0; padding:0; box-sizing:border-box; }
        body { background:#050810; color:#e8edf5; font-family:'Anuphan',sans-serif; overflow-x:hidden; }

        @keyframes fadeUp   { from{opacity:0;transform:translateY(16px)} to{opacity:1;transform:translateY(0)} }
        @keyframes pulse    { 0%,100%{opacity:0.5} 50%{opacity:1} }
        @keyframes float    { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-6px)} }

        ::-webkit-scrollbar { width:4px; }
        ::-webkit-scrollbar-thumb { background:rgba(255,255,255,0.08); border-radius:99px; }
      `}</style>

      <div style={{ minHeight: '100vh', background: '#050810', position: 'relative', overflow: 'hidden' }}>
        {/* BG Glow */}
        <div style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 0 }}>
          <div style={{ position: 'absolute', top: '-5%', left: '-10%', width: 700, height: 700, borderRadius: '50%', background: 'radial-gradient(circle,rgba(167,139,250,0.06) 0%,transparent 70%)', filter: 'blur(50px)' }} />
          <div style={{ position: 'absolute', bottom: '10%', right: '-8%', width: 550, height: 550, borderRadius: '50%', background: 'radial-gradient(circle,rgba(0,229,255,0.05) 0%,transparent 70%)', filter: 'blur(50px)' }} />
          <div style={{ position: 'absolute', top: '40%', left: '35%', width: 400, height: 400, borderRadius: '50%', background: 'radial-gradient(circle,rgba(251,191,36,0.03) 0%,transparent 70%)', filter: 'blur(40px)' }} />
        </div>

        {/* ── Nav ── */}
        <nav style={{ position: 'sticky', top: 0, zIndex: 50, borderBottom: '1px solid rgba(255,255,255,0.06)', background: 'rgba(5,8,16,0.85)', backdropFilter: 'blur(16px)', padding: '0.875rem 2rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <a href="/" style={{ fontFamily: "'Bebas Neue',cursive", fontSize: '1.4rem', letterSpacing: '0.1em', color: '#e8edf5', textDecoration: 'none', marginRight: 'auto' }}>
            PHYS<span style={{ color: '#00e5ff' }}>FUN</span>
          </a>
          {[{ label: 'Lesson', href: '/learn' }, { label: 'Practice', href: '/practice' }, { label: 'Challenge', href: '/game' }].map(l => (
            <a key={l.href} href={l.href}
              style={{ fontFamily: "'Anuphan',sans-serif", fontSize: '0.88rem', color: l.label === 'Challenge' ? '#e8edf5' : '#5a6480', textDecoration: 'none', padding: '0.4rem 0.75rem', borderRadius: 6, background: l.label === 'Challenge' ? 'rgba(255,255,255,0.06)' : 'transparent', transition: 'color 0.2s, background 0.2s' }}
              onMouseEnter={e => { if (l.label !== 'Challenge') { e.currentTarget.style.color = '#e8edf5'; e.currentTarget.style.background = 'rgba(255,255,255,0.05)'; } }}
              onMouseLeave={e => { if (l.label !== 'Challenge') { e.currentTarget.style.color = '#5a6480'; e.currentTarget.style.background = 'transparent'; } }}>
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

        {/* ── Main ── */}
        <main style={{ position: 'relative', zIndex: 1, maxWidth: 1100, margin: '0 auto', padding: '2.5rem 1.5rem 5rem' }}>

          {/* Hero */}
          <div style={{ marginBottom: '2.5rem', animation: 'fadeUp 0.6s ease both' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.75rem' }}>
              <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#a78bfa', animation: 'pulse 2s infinite' }} />
              <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: '0.65rem', letterSpacing: '0.18em', color: '#a78bfa' }}>GAME MODE</span>
            </div>
            <h1 style={{ fontFamily: "'Anuphan',sans-serif", fontWeight: 700, fontSize: 'clamp(1.6rem,3.5vw,2.4rem)', color: '#e8edf5', lineHeight: 1.2, marginBottom: '0.4rem' }}>
              เล่น & แข่งขัน
            </h1>
            <p style={{ fontFamily: "'Anuphan',sans-serif", fontSize: '0.95rem', color: '#5a6480', fontWeight: 300 }}>
              เลือกเกมฝึกสมองหรือลงสนามแข่งขันกับผู้เล่นทั่วประเทศ
            </p>
          </div>

          {/* ── Tab Switcher ── */}
          <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '2rem', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 12, padding: '0.3rem', width: 'fit-content', animation: 'fadeUp 0.6s 0.05s ease both' }}>
            {([
              { id: 'games', label: 'รวมเกม', icon: '🎮', count: GAMES.length },
              { id: 'tournaments', label: 'การแข่งขัน', icon: '🏆', count: TOURNAMENTS.filter(t => t.canJoin).length },
            ] as const).map(t => (
              <button
                key={t.id}
                onClick={() => setTab(t.id)}
                style={{
                  display: 'flex', alignItems: 'center', gap: '0.5rem',
                  padding: '0.6rem 1.25rem', borderRadius: 9, border: 'none', cursor: 'pointer',
                  background: tab === t.id ? (t.id === 'games' ? '#a78bfa' : '#fbbf24') : 'transparent',
                  color: tab === t.id ? '#050810' : '#5a6480',
                  fontFamily: "'Anuphan',sans-serif", fontWeight: tab === t.id ? 700 : 400,
                  fontSize: '0.9rem', transition: 'all 0.25s',
                }}
              >
                <span>{t.icon}</span>
                <span>{t.label}</span>
                <span style={{
                  fontFamily: "'JetBrains Mono',monospace", fontSize: '0.6rem',
                  background: tab === t.id ? 'rgba(5,8,16,0.2)' : 'rgba(255,255,255,0.07)',
                  padding: '0.1rem 0.4rem', borderRadius: 99,
                  color: tab === t.id ? '#050810' : '#3a4460',
                }}>
                  {t.count}
                </span>
              </button>
            ))}
          </div>

          {/* ── GAMES TAB ── */}
          {tab === 'games' && (
            <div style={{ animation: 'fadeUp 0.4s ease both' }}>
              {/* Quick stats */}
              <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem', flexWrap: 'wrap' }}>
                {[
                  { label: 'ผู้เล่นออนไลน์', value: 'Connect', icon: '🟢', color: '#34d399' },
                  { label: 'เกมที่เล่นได้', value: '6', icon: '🎮', color: '#a78bfa' },
                  { label: 'XP ของฉัน', value: '2,430', icon: '⭐', color: '#fbbf24' },
                  { label: 'อันดับ', value: '#842', icon: '🏅', color: '#00e5ff' },
                ].map(s => (
                  <div key={s.label} style={{ background: 'rgba(8,13,26,0.8)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 12, padding: '0.875rem 1.25rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <span style={{ fontSize: '1.1rem' }}>{s.icon}</span>
                    <div>
                      <div style={{ fontFamily: "'Bebas Neue',cursive", fontSize: '1.35rem', color: s.color, letterSpacing: '0.05em', lineHeight: 1 }}>{s.value}</div>
                      <div style={{ fontFamily: "'Anuphan',sans-serif", fontSize: '0.7rem', color: '#3a4460' }}>{s.label}</div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Game cards grid — index 0 = unlocked, rest = locked */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.25rem' }}>
                {GAMES.map((g, i) => (
                  <div key={g.id} style={{ animation: `fadeUp 0.5s cubic-bezier(.16,1,.3,1) ${i * 0.07}s both` }}>
                    <GameCard game={g} locked={i > 0} />
                  </div>
                ))}
              </div>

              {/* Unlock hint */}
              <div style={{ marginTop: '1.75rem', padding: '1rem 1.5rem', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 12, display: 'flex', alignItems: 'center', gap: '0.875rem' }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.25)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                </svg>
                <span style={{ fontFamily: "'Anuphan',sans-serif", fontSize: '0.82rem', color: '#3a4460', fontWeight: 300 }}>
                  เล่น <span style={{ color: '#00e5ff' }}>Speed Quiz</span> ให้ครบ 3 ด่าน เพื่อปลดล็อกเกมถัดไป
                </span>
              </div>
            </div>
          )}

          {/* ── TOURNAMENTS TAB ── */}
          {tab === 'tournaments' && (
            <div style={{ animation: 'fadeUp 0.4s ease both' }}>
              <div style={{ display: 'flex', gap: '2rem', alignItems: 'flex-start' }}>
                {/* Tournament list */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ position: 'relative', background: 'linear-gradient(135deg, rgba(251,191,36,0.08) 0%, rgba(167,139,250,0.08) 100%)', border: '1px solid rgba(251,191,36,0.18)', borderRadius: 16, padding: '1.5rem 2rem', marginBottom: '1.75rem', overflow: 'hidden' }}>
                    <div style={{ position: 'absolute', top: '-20px', right: '-10px', fontSize: '5rem', opacity: 0.12, animation: 'float 4s ease-in-out infinite' }}>🏆</div>
                    <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: '0.62rem', letterSpacing: '0.15em', color: '#fbbf24', marginBottom: '0.4rem' }}>SEASON 3 · ม.ค. – มี.ค. 2026</div>
                    <h2 style={{ fontFamily: "'Anuphan',sans-serif", fontWeight: 700, fontSize: '1.3rem', color: '#e8edf5', marginBottom: '0.3rem' }}>Physics League</h2>
                    <p style={{ fontFamily: "'Anuphan',sans-serif", fontSize: '0.83rem', color: '#5a6480', fontWeight: 300 }}>แข่งขันรายสัปดาห์ สะสมคะแนนขึ้นอันดับ รางวัลรวม 50,000 XP</p>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    {TOURNAMENTS.map((t, i) => (
                      <div key={t.id} style={{ animation: `fadeUp 0.5s cubic-bezier(.16,1,.3,1) ${i * 0.08}s both` }}>
                        <TournamentCard t={t} />
                      </div>
                    ))}
                  </div>
                </div>

                {/* Leaderboard sidebar */}
                <div style={{ width: 260, flexShrink: 0, position: 'sticky', top: '5rem', animation: 'fadeUp 0.6s 0.1s ease both' }}>
                  <div style={{ background: 'rgba(8,13,26,0.8)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 16, padding: '1.25rem', overflow: 'hidden', position: 'relative' }}>
                    <div style={{ position: 'absolute', top: 0, left: '20%', right: '20%', height: 1, background: 'linear-gradient(90deg,transparent,#fbbf2460,transparent)', borderRadius: 99 }} />
                    <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: '0.6rem', letterSpacing: '0.15em', color: '#3a4460', marginBottom: '1rem' }}>🏅 LEADERBOARD</div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                      {LEADERBOARD.map((p, i) => (
                        <div key={p.rank} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.6rem 0.75rem', borderRadius: 10, background: p.isMe ? 'rgba(0,229,255,0.07)' : i < 3 ? 'rgba(255,255,255,0.03)' : 'transparent', border: p.isMe ? '1px solid rgba(0,229,255,0.2)' : '1px solid transparent', animation: `fadeUp 0.4s ${i * 0.06}s ease both` }}>
                          <div style={{ fontFamily: "'Bebas Neue',cursive", fontSize: '1rem', color: p.rank <= 3 ? '#fbbf24' : '#2a3450', width: 20, textAlign: 'center', letterSpacing: '0.05em' }}>{p.badge || p.rank}</div>
                          <div style={{ flex: 1, minWidth: 0 }}>
                            <div style={{ fontFamily: "'Anuphan',sans-serif", fontSize: '0.82rem', fontWeight: p.isMe ? 700 : 500, color: p.isMe ? '#00e5ff' : '#c8cde0', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{p.name}</div>
                            <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: '0.58rem', color: '#3a4460' }}>🔥 {p.streak} days</div>
                          </div>
                          <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: '0.65rem', color: '#fbbf24', textAlign: 'right', flexShrink: 0 }}>{p.xp.toLocaleString()}</div>
                        </div>
                      ))}
                    </div>
                    <button style={{ width: '100%', marginTop: '1rem', padding: '0.6rem', background: 'transparent', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 8, color: '#3a4460', fontFamily: "'Anuphan',sans-serif", fontSize: '0.8rem', cursor: 'pointer', transition: 'all 0.2s' }}
                      onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.15)'; e.currentTarget.style.color = '#8a94b0'; }}
                      onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.07)'; e.currentTarget.style.color = '#3a4460'; }}>
                      ดูอันดับทั้งหมด →
                    </button>
                  </div>

                  <div style={{ background: 'rgba(8,13,26,0.8)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 14, padding: '1.25rem', marginTop: '1rem' }}>
                    <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: '0.6rem', letterSpacing: '0.15em', color: '#3a4460', marginBottom: '0.875rem' }}>MY STATS</div>
                    {[
                      { label: 'การแข่งขันที่เข้าร่วม', value: '8', color: '#a78bfa' },
                      { label: 'ชนะ', value: '3', color: '#34d399' },
                      { label: 'XP จากการแข่ง', value: '6,200', color: '#fbbf24' },
                    ].map(s => (
                      <div key={s.label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                        <span style={{ fontFamily: "'Anuphan',sans-serif", fontSize: '0.75rem', color: '#5a6480' }}>{s.label}</span>
                        <span style={{ fontFamily: "'Bebas Neue',cursive", fontSize: '1.1rem', color: s.color, letterSpacing: '0.05em' }}>{s.value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </>
  );
}