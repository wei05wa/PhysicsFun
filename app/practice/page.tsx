'use client';

import { useState } from "react";

type PracticeMode = "free" | "guided";
type Difficulty = "Easy" | "Medium" | "Hard" | "Exam";

const categories = [
  { emoji: "⚙️", name: "กลศาสตร์", count: 180 },
  { emoji: "🌊", name: "คลื่นและเสียง", count: 95 },
  { emoji: "⚡", name: "ไฟฟ้าและแม่เหล็ก", count: 145 },
  { emoji: "🌡️", name: "ความร้อนและเทอร์โม", count: 78 },
  { emoji: "🔬", name: "ฟิสิกส์อะตอม", count: 62 },
  { emoji: "💡", name: "แสงและทัศนศาสตร์", count: 90 },
];

const difficulties: Difficulty[] = ["Easy", "Medium", "Hard", "Exam"];

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Anuphan:wght@300;400;500;600;700&family=JetBrains+Mono:wght@300;400;600&display=swap');

  .physfun-root {
    --bg: #050810;
    --card: #080d1a;
    --card-border: rgba(255,255,255,0.07);
    --cyan: #00e5ff;
    --purple: #a78bfa;
    --text: #e8edf5;
    --muted: #5a6480;
    font-family: 'Anuphan', sans-serif;
    background: var(--bg);
    color: var(--text);
    min-height: 100vh;
  }

  .pf-main {
    max-width: 1100px;
    margin: 0 auto;
    padding: 48px 32px 80px;
  }

  .pf-breadcrumb {
    display: flex;
    align-items: center;
    gap: 6px;
    color: var(--cyan);
    font-size: 0.9rem;
    margin-bottom: 32px;
    cursor: pointer;
    width: fit-content;
    background: none;
    border: none;
    font-family: 'Anuphan', sans-serif;
    transition: opacity 0.2s;
  }
  .pf-breadcrumb:hover { opacity: 0.75; }

  .pf-page-label {
    font-family: 'JetBrains Mono', monospace;
    font-size: 0.72rem;
    letter-spacing: 0.15em;
    color: var(--cyan);
    margin-bottom: 8px;
  }

  .pf-page-title {
    display: flex;
    align-items: center;
    gap: 16px;
    margin-bottom: 10px;
  }

  .pf-page-title h1 {
    font-size: 2.4rem;
    font-weight: 700;
    color: var(--text);
    line-height: 1.2;
    margin: 0;
  }

  .pf-page-sub {
    color: var(--muted);
    font-size: 1rem;
    margin-bottom: 40px;
  }

  .pf-practice-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 20px;
    margin-bottom: 48px;
    animation: fadeUp 0.4s ease both;
  }

  .pf-card {
    background: var(--card);
    border: 1.5px solid var(--card-border);
    border-radius: 16px;
    padding: 32px;
    cursor: pointer;
    transition: border-color 0.2s, transform 0.2s, box-shadow 0.2s;
    position: relative;
    overflow: hidden;
    text-align: left;
    width: 100%;
    font-family: 'Anuphan', sans-serif;
  }

  .pf-card::before {
    content: '';
    position: absolute;
    inset: 0;
    border-radius: 16px;
    opacity: 0;
    transition: opacity 0.3s;
    pointer-events: none;
  }

  .pf-card-free::before {
    background: radial-gradient(ellipse at top left, rgba(0,229,212,0.07) 0%, transparent 60%);
  }
  .pf-card-guided::before {
    background: radial-gradient(ellipse at top left, rgba(155,109,255,0.07) 0%, transparent 60%);
  }

  .pf-card:hover::before { opacity: 1; }
  .pf-card:hover { transform: translateY(-2px); box-shadow: 0 8px 32px rgba(0,0,0,0.3); }

  .pf-card-free.pf-card-selected {
    border-color: var(--cyan);
    box-shadow: 0 0 0 1px rgba(0,229,212,0.2), 0 8px 32px rgba(0,0,0,0.3);
  }
  .pf-card-guided.pf-card-selected {
    border-color: var(--purple);
    box-shadow: 0 0 0 1px rgba(155,109,255,0.2), 0 8px 32px rgba(0,0,0,0.3);
  }
  .pf-card-selected::before { opacity: 1; }

  .pf-card-header {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    margin-bottom: 20px;
  }

  .pf-card-icon-title {
    display: flex;
    align-items: center;
    gap: 14px;
  }

  .pf-card-emoji {
    width: 48px;
    height: 48px;
    border-radius: 12px;
    background: rgba(255,255,255,0.05);
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1.6rem;
    flex-shrink: 0;
  }

  .pf-card-type {
    font-family: 'JetBrains Mono', monospace;
    font-size: 0.68rem;
    letter-spacing: 0.12em;
    margin-bottom: 4px;
  }
  .pf-card-free .pf-card-type { color: var(--cyan); }
  .pf-card-guided .pf-card-type { color: var(--purple); }

  .pf-card-name {
    font-size: 1.3rem;
    font-weight: 700;
    color: var(--text);
  }

  .pf-radio {
    width: 22px;
    height: 22px;
    border-radius: 50%;
    border: 2px solid var(--card-border);
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    margin-top: 2px;
    transition: border-color 0.2s;
  }
  .pf-card-free.pf-card-selected .pf-radio { border-color: var(--cyan); }
  .pf-card-guided.pf-card-selected .pf-radio { border-color: var(--purple); }

  .pf-radio-inner {
    width: 10px;
    height: 10px;
    border-radius: 50%;
    transition: transform 0.2s;
    transform: scale(0);
  }
  .pf-card-free .pf-radio-inner { background: var(--cyan); }
  .pf-card-guided .pf-radio-inner { background: var(--purple); }
  .pf-card-selected .pf-radio-inner { transform: scale(1); }

  .pf-card-desc {
    color: var(--muted);
    font-size: 0.92rem;
    line-height: 1.65;
    margin-bottom: 28px;
  }

  .pf-card-stats {
    display: flex;
    gap: 28px;
  }

  .pf-stat-num {
    font-family: 'JetBrains Mono', monospace;
    font-size: 1.4rem;
    font-weight: 700;
    line-height: 1;
    margin-bottom: 4px;
  }
  .pf-card-free .pf-stat-num { color: var(--cyan); }
  .pf-card-guided .pf-stat-num { color: var(--purple); }

  .pf-stat-label {
    color: var(--muted);
    font-size: 0.82rem;
  }

  .pf-section-title {
    font-size: 1rem;
    font-weight: 600;
    color: var(--text);
    margin-bottom: 16px;
  }

  .pf-diff-row {
    display: flex;
    gap: 10px;
    margin-bottom: 40px;
    flex-wrap: wrap;
    animation: fadeUp 0.4s 0.1s ease both;
  }

  .pf-diff-btn {
    padding: 8px 22px;
    border-radius: 24px;
    border: 1.5px solid var(--card-border);
    background: transparent;
    color: var(--muted);
    font-family: 'Anuphan', sans-serif;
    font-size: 0.9rem;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.2s;
  }
  .pf-diff-btn:hover { border-color: rgba(0,229,212,0.4); color: var(--text); }
  .pf-diff-btn.pf-diff-active {
    border-color: var(--cyan);
    color: var(--cyan);
    background: rgba(0,229,212,0.08);
  }

  .pf-cat-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 14px;
    animation: fadeUp 0.4s 0.2s ease both;
  }

  .pf-cat-card {
    background: var(--card);
    border: 1.5px solid var(--card-border);
    border-radius: 12px;
    padding: 18px 20px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    cursor: pointer;
    transition: all 0.2s;
    font-family: 'Anuphan', sans-serif;
    text-align: left;
    width: 100%;
  }
  .pf-cat-card:hover {
    border-color: rgba(0,229,212,0.35);
    background: rgba(0,229,212,0.04);
  }
  .pf-cat-card:hover .pf-cat-arrow {
    transform: translateX(3px);
    color: var(--cyan);
  }

  .pf-cat-left {
    display: flex;
    align-items: center;
    gap: 14px;
  }

  .pf-cat-emoji {
    width: 38px;
    height: 38px;
    border-radius: 10px;
    background: rgba(255,255,255,0.05);
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1.2rem;
    flex-shrink: 0;
  }

  .pf-cat-name {
    font-size: 0.98rem;
    font-weight: 600;
    color: var(--text);
    margin-bottom: 2px;
  }
  .pf-cat-count {
    font-size: 0.8rem;
    color: var(--muted);
  }

  .pf-cat-arrow {
    color: var(--muted);
    font-size: 1.1rem;
    transition: transform 0.2s, color 0.2s;
  }

  @keyframes fadeUp {
    from { opacity: 0; transform: translateY(18px); }
    to { opacity: 1; transform: translateY(0); }
  }
`;

export default function PhysFunPractice() {
  const [mode, setMode] = useState<PracticeMode>("free");
  const [difficulty, setDifficulty] = useState<Difficulty>("Easy");

  return (
    <div className="physfun-root">
      <style>{styles}</style>

      {/* Navbar */}
      <nav style={{
        position: 'sticky', top: 0, zIndex: 50,
        borderBottom: '1px solid rgba(255,255,255,0.06)',
        background: 'rgba(5,8,16,0.85)', backdropFilter: 'blur(16px)',
        padding: '0.875rem 2rem', display: 'flex', alignItems: 'center', gap: '1rem',
      }}>
        <a href="/" style={{ fontFamily: "'Bebas Neue',cursive", fontSize: '1.4rem', letterSpacing: '0.1em', color: '#e8edf5', textDecoration: 'none', marginRight: 'auto' }}>
          PHYS<span style={{ color: '#00e5ff' }}>FUN</span>
        </a>
        {[{ label: 'Lesson', href: '/lesson' }, { label: 'Practice', href: '/practice' }, { label: 'Challenge', href: '/game' }].map(l => (
          <a key={l.href} href={l.href}
            style={{ fontFamily: "'Anuphan',sans-serif", fontSize: '0.88rem', color: '#5a6480', textDecoration: 'none', padding: '0.4rem 0.75rem', borderRadius: 6, transition: 'color 0.2s, background 0.2s' }}
            onMouseEnter={e => { e.currentTarget.style.color = '#e8edf5'; e.currentTarget.style.background = 'rgba(255,255,255,0.05)'; }}
            onMouseLeave={e => { e.currentTarget.style.color = '#5a6480'; e.currentTarget.style.background = 'transparent'; }}>
            {l.label}
          </a>
        ))}
        <div style={{ width: 1, height: 20, background: 'rgba(255,255,255,0.08)', margin: '0 0.25rem' }} />
        <a href="/login" style={{ fontFamily: "'Anuphan',sans-serif", fontSize: '0.85rem', color: '#5a6480', textDecoration: 'none', padding: '0.4rem 0.75rem' }}>
          เข้าสู่ระบบ
        </a>
        <a href="/register"
          style={{ fontFamily: "'Anuphan',sans-serif", fontSize: '0.85rem', fontWeight: 500, color: '#050810', background: '#00e5ff', textDecoration: 'none', padding: '0.45rem 1.1rem', borderRadius: 8, transition: 'opacity 0.2s' }}
          onMouseEnter={e => (e.currentTarget.style.opacity = '0.85')}
          onMouseLeave={e => (e.currentTarget.style.opacity = '1')}>
          สมัครฟรี
        </a>
      </nav>

      {/* Main */}
      <main className="pf-main">
        <button className="pf-breadcrumb">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <polyline points="15 18 9 12 15 6" />
          </svg>
          กลับหน้าหลัก
        </button>

        <div className="pf-page-label">PRACTICE</div>
        <div className="pf-page-title">
          <span style={{ fontSize: "2rem" }}>🎯</span>
          <h1>ฝึกโจทย์ฟิสิกส์</h1>
        </div>
        <p className="pf-page-sub">เลือกรูปแบบการฝึกที่เหมาะกับคุณ — ฝึกอิสระหรือตามเส้นทาง</p>

        {/* Practice Mode Cards */}
        <div className="pf-practice-grid">
          {/* Free Practice */}
          <button
            className={`pf-card pf-card-free ${mode === "free" ? "pf-card-selected" : ""}`}
            onClick={() => setMode("free")}
          >
            <div className="pf-card-header">
              <div className="pf-card-icon-title">
                <div className="pf-card-emoji">📚</div>
                <div>
                  <div className="pf-card-type">FREE PRACTICE</div>
                  <div className="pf-card-name">รวบรวมโจทย์ ฝึกเอง</div>
                </div>
              </div>
              <div className="pf-radio">
                <div className="pf-radio-inner" />
              </div>
            </div>
            <p className="pf-card-desc">
              เลือกหัวข้อและระดับความยากที่ต้องการ ฝึกโจทย์ได้อิสระตามจังหวะตัวเอง
            </p>
            <div className="pf-card-stats">
              <div>
                <div className="pf-stat-num">850+</div>
                <div className="pf-stat-label">โจทย์ทั้งหมด</div>
              </div>
              <div>
                <div className="pf-stat-num">12</div>
                <div className="pf-stat-label">หมวดหมู่</div>
              </div>
            </div>
          </button>

          {/* Guided Steps */}
          <button
            className={`pf-card pf-card-guided ${mode === "guided" ? "pf-card-selected" : ""}`}
            onClick={() => setMode("guided")}
          >
            <div className="pf-card-header">
              <div className="pf-card-icon-title">
                <div className="pf-card-emoji">🗺️</div>
                <div>
                  <div className="pf-card-type">GUIDED STEPS</div>
                  <div className="pf-card-name">ฝึกตามสเตป</div>
                </div>
              </div>
              <div className="pf-radio">
                <div className="pf-radio-inner" />
              </div>
            </div>
            <p className="pf-card-desc">
              เส้นทางการเรียนรู้ที่จัดลำดับมาให้ ฝึกทีละขั้น ค่อยๆ ยากขึ้นจนพร้อมสอบ
            </p>
            <div className="pf-card-stats">
              <div>
                <div className="pf-stat-num">8</div>
                <div className="pf-stat-label">เส้นทาง</div>
              </div>
              <div>
                <div className="pf-stat-num">120+</div>
                <div className="pf-stat-label">สเตปทั้งหมด</div>
              </div>
            </div>
          </button>
        </div>

        {/* Difficulty */}
        <p className="pf-section-title">เลือกระดับความยาก</p>
        <div className="pf-diff-row">
          {difficulties.map((d) => (
            <button
              key={d}
              className={`pf-diff-btn ${difficulty === d ? "pf-diff-active" : ""}`}
              onClick={() => setDifficulty(d)}
            >
              {d}
            </button>
          ))}
        </div>

        {/* Categories */}
        <p className="pf-section-title">เลือกหมวดหมู่</p>
        <div className="pf-cat-grid">
          {categories.map((cat) => (
            <button key={cat.name} className="pf-cat-card">
              <div className="pf-cat-left">
                <div className="pf-cat-emoji">{cat.emoji}</div>
                <div>
                  <div className="pf-cat-name">{cat.name}</div>
                  <div className="pf-cat-count">{cat.count} โจทย์</div>
                </div>
              </div>
              <span className="pf-cat-arrow">›</span>
            </button>
          ))}
        </div>
      </main>
    </div>
  );
}