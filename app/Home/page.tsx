'use client';

import Link from 'next/link';
import { useState } from 'react';

// ─── Data ──────────────────────────────────────────────────────────────────────
const FEATURES = [
  {
    id: 'learn',
    num: '01',
    icon: '⚡',
    label: 'MICRO LEARNING',
    title: 'เริ่มเรียน',
    titleEn: 'Start Learning',
    desc: 'บทเรียนสั้น เข้าใจจริง ใช้เวลาไม่เกิน 10 นาทีต่อบท พร้อม simulation อธิบายทุก concept',
    accent: '#00e5ff',
    href: '/lesson',
    tags: ['กลศาสตร์', 'คลื่น', 'ไฟฟ้า', 'แสง', 'ความร้อน'],
    //stat: { value: '200+', label: 'บทเรียน' },
    preview: [
      { label: 'กฎนิวตัน ข้อ 1', pct: 100 },
      { label: 'กฎนิวตัน ข้อ 2', pct: 60 },
      { label: 'โมเมนตัม', pct: 0 },
    ],
  },
  {
    id: 'quiz',
    num: '02',
    icon: '🎯',
    label: 'CHALLENGE',
    title: 'ทำโจทย์',
    titleEn: 'Solve Problems',
    desc: 'โจทย์ฟิสิกส์หลากหลายระดับ ตั้งแต่มือใหม่ถึงเตรียมสอบแข่งขัน พร้อม hint และเฉลย',
    accent: '#a78bfa',
    href: '/practice',
    tags: ['Easy', 'Medium', 'Hard', 'Exam'],
    stat: { value: '850+', label: 'โจทย์' },
    preview: [
      { label: 'ความเร็วและความเร่ง', pct: 85 },
      { label: 'สนามไฟฟ้า', pct: 40 },
      { label: 'ทัศนศาสตร์', pct: 15 },
    ],
  },
  {
    id: 'game',
    num: '03',
    icon: '🏆',
    label: 'GAME MODE',
    title: 'เล่นเกม',
    titleEn: 'Play & Compete',
    desc: 'เกมฟิสิกส์ที่ผสมความสนุกกับ concept จริง สะสม XP ปีนอันดับ แข่งกับเพื่อน',
    accent: '#34d399',
    href: '/game',
    tags: ['XP', 'Streak', 'Leaderboard', 'Badge'],
    stat: { value: '1.2K', label: 'ผู้เล่นออนไลน์' },
    preview: [
      { label: 'Daily Streak  7 วัน', pct: 100 },
      { label: 'XP วันนี้  +360', pct: 72 },
      { label: 'อันดับ  #42', pct: 55 },
    ],
  },
];

// ─── FeatureCard ───────────────────────────────────────────────────────────────
function FeatureCard({ f }: { f: (typeof FEATURES)[0] }) {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      className="feature-card"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        /* GPU layer from the start — no pop-in on first hover */
        transform: hovered ? 'translateY(-6px) translateZ(0)' : 'translateY(0) translateZ(0)',
        willChange: 'transform',
        position: 'relative',
        background: hovered ? 'rgba(12,17,32,0.98)' : 'rgba(8,13,26,0.92)',
        border: `1px solid ${hovered ? f.accent + '55' : 'rgba(255,255,255,0.07)'}`,
        borderRadius: 16,
        padding: '2rem',
        cursor: 'pointer',
        transition:
          'background 0.3s ease, border-color 0.3s ease, transform 0.3s cubic-bezier(0.16,1,0.3,1), box-shadow 0.3s ease',
        boxShadow: hovered
          ? `0 20px 60px ${f.accent}18, 0 0 0 1px ${f.accent}22`
          : '0 4px 24px rgba(0,0,0,0.3)',
        display: 'flex',
        flexDirection: 'column',
        gap: '1.25rem',
        /* Own stacking context — prevents backdrop-filter bleed from nav */
        isolation: 'isolate',
      }}
    >
      {/* Top shine */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: '15%',
          right: '15%',
          height: 1,
          background: hovered
            ? `linear-gradient(90deg,transparent,${f.accent}80,transparent)`
            : 'transparent',
          transition: 'background 0.4s ease',
          borderRadius: 99,
          pointerEvents: 'none',
        }}
      />

      {/* Header row */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div
            style={{
              width: 44,
              height: 44,
              borderRadius: 12,
              background: hovered ? f.accent + '22' : 'rgba(255,255,255,0.04)',
              border: `1px solid ${hovered ? f.accent + '44' : 'rgba(255,255,255,0.08)'}`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '1.3rem',
              transition: 'background 0.3s ease, border-color 0.3s ease',
              flexShrink: 0,
            }}
          >
            {f.icon}
          </div>
          <div>
            <div
              style={{
                fontFamily: "'JetBrains Mono',monospace",
                fontSize: '0.58rem',
                letterSpacing: '0.18em',
                color: hovered ? f.accent : '#3a4460',
                textTransform: 'uppercase',
                marginBottom: '0.2rem',
                transition: 'color 0.3s ease',
              }}
            >
              {f.label}
            </div>
            <div
              style={{
                fontFamily: "'JetBrains Mono',monospace",
                fontSize: '0.58rem',
                color: '#2a3450',
              }}
            >
              {f.num}
            </div>
          </div>
        </div>

        {/* Stat */}
        <div style={{ textAlign: 'right' }}>
          <div
            style={{
              fontFamily: "'Bebas Neue',cursive",
              fontSize: '1.5rem',
              color: hovered ? f.accent : '#e8edf5',
              lineHeight: 1,
              transition: 'color 0.3s ease',
              letterSpacing: '0.04em',
            }}
          >
          
          </div>
          <div
            style={{
              fontFamily: "'Anuphan',sans-serif",
              fontSize: '0.65rem',
              color: '#4a5570',
              marginTop: '0.1rem',
            }}
          >
            
          </div>
        </div>
      </div>

      {/* Title + desc */}
      <div>
        <h3
          style={{
            fontFamily: "'Anuphan',sans-serif",
            fontWeight: 700,
            fontSize: 'clamp(1.4rem,2.5vw,1.75rem)',
            color: '#e8edf5',
            lineHeight: 1.1,
            marginBottom: '0.5rem',
          }}
        >
          {f.title}
        </h3>
        <p
          style={{
            fontFamily: "'Anuphan',sans-serif",
            fontSize: '0.85rem',
            color: '#5a6480',
            fontWeight: 300,
            lineHeight: 1.7,
          }}
        >
          {f.desc}
        </p>
      </div>

      {/* Progress bars */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
        {f.preview.map((item, i) => (
          <div key={i}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
              <span
                style={{
                  fontFamily: "'Anuphan',sans-serif",
                  fontSize: '0.72rem',
                  color: item.pct === 100 ? f.accent : '#4a5570',
                }}
              >
                {item.label}
              </span>
              <span
                style={{
                  fontFamily: "'JetBrains Mono',monospace",
                  fontSize: '0.62rem',
                  color: item.pct > 0 ? f.accent + 'aa' : '#2a3450',
                }}
              >
                {item.pct}%
              </span>
            </div>
            <div
              style={{
                height: 2.5,
                background: 'rgba(255,255,255,0.05)',
                borderRadius: 99,
                overflow: 'hidden',
              }}
            >
              <div
                style={{
                  height: '100%',
                  width: hovered ? `${item.pct}%` : '0%',
                  background:
                    item.pct === 100
                      ? f.accent
                      : `linear-gradient(90deg, ${f.accent}88, ${f.accent}44)`,
                  borderRadius: 99,
                  transition: `width ${0.6 + i * 0.15}s cubic-bezier(0.16,1,0.3,1) ${i * 0.08}s`,
                  boxShadow: item.pct === 100 ? `0 0 8px ${f.accent}` : 'none',
                }}
              />
            </div>
          </div>
        ))}
      </div>

      {/* Tags */}
      <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
        {f.tags.map((tag) => (
          <span
            key={tag}
            style={{
              fontFamily: "'JetBrains Mono',monospace",
              fontSize: '0.6rem',
              color: hovered ? f.accent + 'cc' : '#3a4460',
              border: `1px solid ${hovered ? f.accent + '30' : 'rgba(255,255,255,0.06)'}`,
              padding: '0.2rem 0.55rem',
              borderRadius: 4,
              transition: 'color 0.3s ease, border-color 0.3s ease',
              letterSpacing: '0.06em',
            }}
          >
            {tag}
          </span>
        ))}
      </div>

      {/* CTA button */}
      <Link
        href={f.href}
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '0.5rem',
          padding: '0.75rem',
          background: hovered ? f.accent : 'rgba(255,255,255,0.04)',
          color: hovered ? '#050810' : '#5a6480',
          fontFamily: "'JetBrains Mono',monospace",
          fontWeight: 600,
          fontSize: '0.75rem',
          letterSpacing: '0.1em',
          textTransform: 'uppercase',
          textDecoration: 'none',
          borderRadius: 8,
          border: `1px solid ${hovered ? f.accent : 'rgba(255,255,255,0.07)'}`,
          transition: 'background 0.3s ease, color 0.3s ease, border-color 0.3s ease',
          marginTop: 'auto',
        }}
      >
        {f.titleEn}
        <svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <line x1="5" y1="12" x2="19" y2="12" />
          <polyline points="12,5 19,12 12,19" />
        </svg>
      </Link>
    </div>
  );
}

// ─── Page ──────────────────────────────────────────────────────────────────────
export default function HomePage() {
   const [showVideo, setShowVideo] = useState(false);
  return (
    <>
      <style>{`
        /*
         * ANIMATION STRATEGY:
         * - translateY reduced to 12px (large values cause subpixel blur on Windows ClearType)
         * - translateZ(0) forces GPU layer promotion before frame 0
         * - opacity-only fade for hero (no transform) — safest against blur
         */
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(12px) translateZ(0); }
          to   { opacity: 1; transform: translateY(0px)  translateZ(0); }
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to   { opacity: 1; }
        }
        @keyframes pulse {
          0%, 100% { opacity: 0.45; }
          50%       { opacity: 1; }
        }

        .hero-in,
        .card-1,
        .card-2,
        .card-3 {
          opacity: 0;
          will-change: opacity, transform;
          backface-visibility: hidden;
          -webkit-backface-visibility: hidden;
          /* Prevent subpixel text blur during transform animation */
          -webkit-font-smoothing: subpixel-antialiased;
        }

        /* Hero fades in only — no translateY, zero risk of blur */
        .hero-in { animation: fadeIn  0.6s ease          0.05s forwards; }
        .card-1  { animation: fadeUp  0.6s ease-out      0.10s forwards; }
        .card-2  { animation: fadeUp  0.6s ease-out      0.20s forwards; }
        .card-3  { animation: fadeUp  0.6s ease-out      0.30s forwards; }

        /*
         * Nav: backdrop-filter REMOVED entirely.
         * Even with isolation/will-change, backdrop-filter forces the browser
         * to composite ALL overlapping layers together on first paint —
         * this is what causes the blur flash on load. Solid bg looks identical
         * at this opacity and eliminates the compositing issue completely.
         */
        .site-nav {
          position: sticky;
          top: 0;
          z-index: 50;
          border-bottom: 1px solid rgba(255,255,255,0.06);
          background: rgba(5,8,16,0.97);
          padding: 0.875rem 2rem;
          display: flex;
          align-items: center;
          gap: 1rem;
        }

        .nav-link {
          font-family: 'Anuphan', sans-serif;
          font-size: 0.88rem;
          color: #5a6480;
          text-decoration: none;
          padding: 0.4rem 0.75rem;
          border-radius: 6px;
          transition: color 0.2s ease, background 0.2s ease;
        }
        .nav-link:hover {
          color: #e8edf5;
          background: rgba(255,255,255,0.05);
        }

        /* Pre-promote card wrapper so hover transform never causes layer promotion mid-animation */
        .feature-card {
          transform: translateY(0) translateZ(0);
        }
      `}</style>

      <div
        style={{
          minHeight: '100vh',
          background: '#050810',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Background glow blobs
            Using radial-gradient instead of filter:blur() — visually identical
            but radial-gradient is GPU-composited while filter:blur is not.
            No filter here means no extra compositor layer collapse. */}
        <div
          aria-hidden
          style={{
            position: 'fixed',
            inset: 0,
            pointerEvents: 'none',
            zIndex: 0,
            isolation: 'isolate',
          }}
        >
          <div
            style={{
              position: 'absolute',
              top: '-10%',
              left: '-5%',
              width: 600,
              height: 600,
              borderRadius: '50%',
              background: 'radial-gradient(circle, rgba(0,229,255,0.07) 0%, transparent 70%)',
            }}
          />
          <div
            style={{
              position: 'absolute',
              bottom: '-10%',
              right: '-5%',
              width: 500,
              height: 500,
              borderRadius: '50%',
              background: 'radial-gradient(circle, rgba(167,139,250,0.07) 0%, transparent 70%)',
            }}
          />
        </div>

        {/* ── Nav ───────────────────────────────────────────────────────── */}
        <nav className="site-nav">
          <a
            href="/"
            style={{
              fontFamily: "'Bebas Neue',cursive",
              fontSize: '1.4rem',
              letterSpacing: '0.1em',
              color: '#e8edf5',
              textDecoration: 'none',
              marginRight: 'auto',
            }}
          >
            PHYS<span style={{ color: '#00e5ff' }}>FUN</span>
          </a>

          {[
            { label: 'Lesson',    href: '/learn' },
            { label: 'Practice', href: '/quiz' },
            { label: 'Challenge', href: '/game' },
          ].map((l) => (
            <a key={l.href} href={l.href} className="nav-link">
              {l.label}
            </a>
          ))}

          <div
            style={{
              width: 1,
              height: 20,
              background: 'rgba(255,255,255,0.08)',
              margin: '0 0.25rem',
            }}
          />

          <Link
            href="/login"
            style={{
              fontFamily: "'Anuphan',sans-serif",
              fontSize: '0.85rem',
              color: '#5a6480',
              textDecoration: 'none',
              padding: '0.4rem 0.75rem',
            }}
          >
            เข้าสู่ระบบ
          </Link>

          <Link
            href="/register"
            style={{
              fontFamily: "'Anuphan',sans-serif",
              fontSize: '0.85rem',
              fontWeight: 500,
              color: '#050810',
              background: '#00e5ff',
              textDecoration: 'none',
              padding: '0.45rem 1.1rem',
              borderRadius: 8,
              transition: 'opacity 0.2s ease',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.opacity = '0.85')}
            onMouseLeave={(e) => (e.currentTarget.style.opacity = '1')}
          >
            สมัครฟรี
          </Link>
        </nav>

        {/* ── Main ──────────────────────────────────────────────────────── */}
        <main
          style={{
            position: 'relative',
            zIndex: 1,
            maxWidth: 1100,
            margin: '0 auto',
            padding: '3rem 1.5rem 5rem',
          }}
        >
          {/* Hero */}
          <div className="hero-in" style={{ marginBottom: '3rem' }}>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.6rem',
                marginBottom: '0.875rem',
              }}
            >
              <div
                style={{
                  width: 6,
                  height: 6,
                  borderRadius: '50%',
                  background: '#34d399',
                  animation: 'pulse 2s ease-in-out infinite',
                }}
              />
              <span
                style={{
                  fontFamily: "'JetBrains Mono',monospace",
                  fontSize: '0.68rem',
                  letterSpacing: '0.18em',
                  color: '#34d399',
                  textTransform: 'uppercase',
                }}
              >
                ยินดีต้อนรับสู่ PhysFun
              </span>
            </div>
            <h1
              style={{
                fontFamily: "'Anuphan',sans-serif",
                fontWeight: 700,
                fontSize: 'clamp(1.6rem,3.5vw,2.4rem)',
                color: '#e8edf5',
                lineHeight: 1.2,
                marginBottom: '0.5rem',
              }}
            >
              วันนี้อยากเริ่มจากตรงไหน?
            </h1>
            <p
              style={{
                fontFamily: "'Anuphan',sans-serif",
                fontSize: '0.95rem',
                color: '#5a6480',
                fontWeight: 300,
              }}
            >
              เลือกโหมดที่คุณต้องการ — เรียนรู้ ฝึกโจทย์ หรือแข่งขัน
            </p>
          </div>

          {/* Feature cards grid */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
              gap: '1.25rem',
              marginBottom: '3rem',
            }}
          >
            {FEATURES.map((f, i) => (
              <div key={f.id} className={`card-${i + 1}`}>
                <FeatureCard f={f} />
              </div>
            ))}
          </div>
        </main>
      </div>
    </>
  );
}