"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";

// ─── Types ────────────────────────────────────────────────────────────────────
type GamePhase = "start" | "playing" | "result";
type AnswerStatus = "ok" | "no" | "timeout";

interface Question {
  topic: string;
  text: string;
  opts: string[];
  ans: number;
}

interface QuestionResult {
  question: string;
  status: AnswerStatus;
  pts: number;
  time: number;
}

// ─── Data ─────────────────────────────────────────────────────────────────────
const QUESTIONS: Question[] = [
  { topic: "MECHANICS",     text: "วัตถุมวล 5 kg ตกอย่างอิสระจากที่สูง 20 m (g = 10 m/s²) ความเร็วขณะถึงพื้นคือเท่าใด?", opts: ["10 m/s", "20 m/s", "30 m/s", "40 m/s"], ans: 1 },
  { topic: "ENERGY",        text: "งานที่ทำเมื่อออกแรง 50 N เคลื่อนวัตถุ 4 m ในแนวแรง มีค่าเท่าใด?", opts: ["100 J", "150 J", "200 J", "250 J"], ans: 2 },
  { topic: "WAVES",         text: "คลื่นเสียงมีความถี่ 340 Hz ความเร็วเสียงในอากาศ 340 m/s ความยาวคลื่นคือเท่าใด?", opts: ["0.5 m", "1 m", "2 m", "5 m"], ans: 1 },
  { topic: "ELECTRICITY",   text: "ตัวต้านทาน 3 ตัว ค่าละ 6 Ω ต่อขนานกัน ความต้านทานรวมคือเท่าใด?", opts: ["2 Ω", "3 Ω", "6 Ω", "18 Ω"], ans: 0 },
  { topic: "NEWTON'S LAW",  text: "วัตถุมวล 10 kg ต้องออกแรงสุทธิเท่าใดจึงทำให้เร่ง 3 m/s²?", opts: ["10 N", "20 N", "30 N", "40 N"], ans: 2 },
  { topic: "OPTICS",        text: "แสงเดินทางจากน้ำ (n=1.33) สู่แก้ว (n=1.50) แสงจะ...", opts: ["หักเหออกจากเส้นปกติ", "หักเหเข้าหาเส้นปกติ", "ไม่หักเห", "สะท้อนกลับหมด"], ans: 1 },
  { topic: "KINEMATICS",    text: "รถเร่งจาก 0 เป็น 30 m/s ใน 10 วินาที ความเร่งเฉลี่ยคือเท่าใด?", opts: ["2 m/s²", "3 m/s²", "5 m/s²", "10 m/s²"], ans: 1 },
  { topic: "THERMODYNAMICS",text: "กฎข้อที่ศูนย์ของอุณหพลศาสตร์กล่าวถึงสิ่งใด?", opts: ["พลังงานสร้างใหม่ไม่ได้", "สมดุลความร้อน", "เอนโทรปีเพิ่มขึ้น", "อุณหภูมิสัมบูรณ์"], ans: 1 },
  { topic: "GRAVITY",       text: "น้ำหนักของวัตถุ 70 kg บนดวงจันทร์ (g = 1.6 m/s²) คือเท่าใด?", opts: ["56 N", "112 N", "700 N", "1120 N"], ans: 1 },
  { topic: "MOMENTUM",      text: "วัตถุมวล 2 kg เคลื่อนที่ด้วยความเร็ว 5 m/s โมเมนตัมของวัตถุคือเท่าใด?", opts: ["5 kg·m/s", "10 kg·m/s", "15 kg·m/s", "20 kg·m/s"], ans: 1 },
];

const LETTERS = ["A", "B", "C", "D"];
const TIME_PER_Q = 30; // ✅ แก้เป็น 30 วิ

function gradeInfo(acc: number) {
  if (acc >= 90) return { title: "PERFECT!", badge: "🏆", sub: "ฟิสิกส์เจ้า! ระดับ A+" };
  if (acc >= 70) return { title: "GREAT!",   badge: "⚡", sub: "เก่งมาก! ฝึกฝนต่อไปเรื่อยๆ" };
  if (acc >= 50) return { title: "NOT BAD",  badge: "📡", sub: "พอใช้ได้ ลองทบทวนอีกครั้ง" };
  return           { title: "TRY AGAIN", badge: "💫", sub: "ไม่เป็นไร! ฝึกฝนแล้วจะดีขึ้น" };
}

// ─── Main ─────────────────────────────────────────────────────────────────────
export default function SpeedQuizPage() {
  const router = useRouter();

  const [phase,       setPhase]       = useState<GamePhase>("start");
  const [qIndex,      setQIndex]      = useState(0);
  const [score,       setScore]       = useState(0);
  const [timeLeft,    setTimeLeft]    = useState(TIME_PER_Q);
  const [selectedIdx, setSelectedIdx] = useState<number | null>(null);
  const [results,     setResults]     = useState<QuestionResult[]>([]);

  const timerRef    = useRef<ReturnType<typeof setInterval> | null>(null);
  const qStartRef   = useRef(Date.now());
  const answeredRef = useRef(false);
  // ✅ ใช้ ref เก็บ index จริง — ป้องกัน stale closure ใน advance
  const qIndexRef   = useRef(0);

  const currentQ = QUESTIONS[qIndex] ?? QUESTIONS[0];

  // cleanup on unmount
  useEffect(() => () => { if (timerRef.current) clearInterval(timerRef.current); }, []);

  // ✅ advance ไม่ depend on qIndex state แล้ว — อ่านจาก ref แทน
  const advance = useCallback((result: QuestionResult) => {
    const nextIndex = qIndexRef.current + 1;
    qIndexRef.current = nextIndex;
    setResults(prev => [...prev, result]);
    if (nextIndex >= QUESTIONS.length) {
      setTimeout(() => setPhase("result"), 1600);
    } else {
      setTimeout(() => setQIndex(nextIndex), 1600);
    }
  }, []);

  const handleTimeout = useCallback(() => {
    if (answeredRef.current) return;
    answeredRef.current = true;
    advance({
      question: currentQ.text.substring(0, 55) + "…",
      status: "timeout",
      pts: 0,
      time: TIME_PER_Q,
    });
  }, [advance, currentQ]);

  // start timer whenever qIndex changes (while playing)
  useEffect(() => {
    if (phase !== "playing") return;
    answeredRef.current = false;
    setSelectedIdx(null);
    setTimeLeft(TIME_PER_Q);
    qStartRef.current = Date.now();
    timerRef.current = setInterval(() => {
      setTimeLeft(t => {
        if (t <= 1) { clearInterval(timerRef.current!); handleTimeout(); return 0; }
        return t - 1;
      });
    }, 1000);
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [qIndex, phase, handleTimeout]);

  const handleAnswer = useCallback((idx: number) => {
    if (answeredRef.current) return;
    answeredRef.current = true;
    if (timerRef.current) clearInterval(timerRef.current);
    const elapsed = (Date.now() - qStartRef.current) / 1000;
    setSelectedIdx(idx);
    let pts = 0, status: AnswerStatus = "no";
    if (idx === currentQ.ans) {
      pts = 50 + Math.max(0, Math.floor((timeLeft / TIME_PER_Q) * 150));
      status = "ok";
      setScore(s => s + pts);
    }
    advance({
      question: currentQ.text.substring(0, 55) + "…",
      status,
      pts,
      time: Math.min(elapsed, TIME_PER_Q),
    });
  }, [advance, currentQ, timeLeft]);

  const startGame = () => {
    qIndexRef.current = 0; // ✅ reset ref ด้วย
    setPhase("playing");
    setQIndex(0);
    setScore(0);
    setResults([]);
    setSelectedIdx(null);
  };

  const timerColor = timeLeft <= 5 ? "#ef4444" : timeLeft <= 10 ? "#fbbf24" : "#00e5ff";
  const revealed   = selectedIdx !== null || timeLeft === 0;

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Anuphan:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;600&family=Bebas+Neue&display=swap');
        @keyframes fadeUp { from{opacity:0;transform:translateY(14px)} to{opacity:1;transform:none} }
        @keyframes scan   { 0%{top:0} 100%{top:100%} }
        @keyframes blink  { 0%,100%{opacity:1} 50%{opacity:0.2} }
        .sq-fadein   { animation: fadeUp 0.35s ease both; }
        .sq-scan     { position:absolute;left:0;right:0;height:2px;background:linear-gradient(90deg,transparent,rgba(0,229,255,0.18),transparent);animation:scan 3s linear infinite;pointer-events:none;z-index:1; }
        .sq-livedot  { animation:blink 1s infinite; }
        .sq-opt      { transition:all 0.18s; }
        .sq-opt:hover:not(:disabled) { background:rgba(13,46,77,0.9) !important; border-color:rgba(0,229,255,0.3) !important; color:#c8dff0 !important; }
        .sq-opt:disabled { cursor:not-allowed; }
        .sq-primary:hover   { background:#fff !important; }
        .sq-secondary:hover { border-color:rgba(0,229,255,0.25) !important; color:#c8dff0 !important; }
      `}</style>

      <div style={{ minHeight: "100vh", background: "#050810", display: "flex", alignItems: "center", justifyContent: "center", padding: "1.5rem", position: "relative", fontFamily: "'Anuphan',sans-serif" }}>

        {/* BG glows */}
        <div style={{ position: "fixed", inset: 0, pointerEvents: "none", zIndex: 0 }}>
          <div style={{ position: "absolute", top: "-5%", left: "-10%", width: 600, height: 600, borderRadius: "50%", background: "radial-gradient(circle,rgba(0,229,255,0.05) 0%,transparent 70%)", filter: "blur(60px)" }} />
          <div style={{ position: "absolute", bottom: "5%", right: "-5%", width: 500, height: 500, borderRadius: "50%", background: "radial-gradient(circle,rgba(167,139,250,0.04) 0%,transparent 70%)", filter: "blur(60px)" }} />
        </div>

        {/* Card shell */}
        <div style={{ position: "relative", width: "100%", maxWidth: 480, background: "rgba(8,13,26,0.96)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 20, overflow: "hidden", zIndex: 1 }}>
          <div style={{ position: "absolute", inset: 0, pointerEvents: "none", backgroundImage: "linear-gradient(rgba(0,229,255,0.025) 1px,transparent 1px),linear-gradient(90deg,rgba(0,229,255,0.025) 1px,transparent 1px)", backgroundSize: "40px 40px" }} />
          <div className="sq-scan" />

          {/* ── START ── */}
          {phase === "start" && (
            <div className="sq-fadein" style={{ position: "relative", zIndex: 2, padding: "2.5rem 2rem 2rem", textAlign: "center" }}>
              <div style={{ display: "inline-flex", alignItems: "center", gap: 6, background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.28)", borderRadius: 99, padding: "4px 14px", marginBottom: "1.25rem" }}>
                <span className="sq-livedot" style={{ width: 6, height: 6, borderRadius: "50%", background: "#ef4444", display: "inline-block" }} />
                <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: "0.58rem", letterSpacing: "0.18em", color: "#ef4444" }}>LIVE NOW</span>
              </div>

              <div style={{ fontFamily: "'Bebas Neue',cursive", fontSize: "clamp(3rem,10vw,4.5rem)", lineHeight: 1, color: "#e8edf5", letterSpacing: "0.05em" }}>SPEED</div>
              <div style={{ fontFamily: "'Bebas Neue',cursive", fontSize: "clamp(3rem,10vw,4.5rem)", lineHeight: 1, color: "#00e5ff", letterSpacing: "0.05em", marginBottom: "0.625rem" }}>QUIZ</div>
              <p style={{ fontSize: "0.88rem", color: "#5a6480", marginBottom: "2rem", fontWeight: 300 }}>
                ตอบโจทย์ฟิสิกส์ให้เร็วที่สุด • ยิ่งเร็วยิ่งได้คะแนนมาก
              </p>

              {/* ✅ stat label อัปเดตเป็น 30วิ */}
              <div style={{ display: "flex", justifyContent: "center", gap: "0.75rem", marginBottom: "2rem" }}>
                {[{ num: "10", lbl: "คำถาม" }, { num: "30วิ", lbl: "ต่อข้อ" }, { num: "200", lbl: "XP สูงสุด" }].map(({ num, lbl }) => (
                  <div key={lbl} style={{ background: "rgba(13,31,51,0.8)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 12, padding: "0.875rem 1.1rem", textAlign: "center" }}>
                    <div style={{ fontFamily: "'Bebas Neue',cursive", fontSize: "1.5rem", color: "#00e5ff", letterSpacing: "0.05em", lineHeight: 1 }}>{num}</div>
                    <div style={{ fontSize: "0.68rem", color: "#3a4460", marginTop: 4 }}>{lbl}</div>
                  </div>
                ))}
              </div>

              <button className="sq-primary" onClick={startGame}
                style={{ width: "100%", padding: "0.875rem", background: "#00e5ff", border: "none", borderRadius: 10, color: "#050810", fontWeight: 700, fontSize: "1rem", cursor: "pointer", transition: "background 0.2s", boxShadow: "0 0 24px rgba(0,229,255,0.28)", letterSpacing: "0.02em" }}>
                ⚡ เริ่มเลย
              </button>
            </div>
          )}

          {/* ── PLAYING ── ✅ ครอบด้วย {} และใช้ && อย่างถูกต้อง */}
          {phase === "playing" && currentQ !== undefined && (
            <div className="sq-fadein" style={{ position: "relative", zIndex: 2, padding: "1.5rem" }}>

              {/* Top bar */}
              <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "1.25rem" }}>
                <div style={{ flex: 1 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                    <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: "0.58rem", color: "#3a4460", letterSpacing: "0.1em" }}>
                      ข้อ {qIndex + 1}/{QUESTIONS.length}
                    </span>
                    <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: "0.58rem", color: "#fbbf24" }}>⭐ {score} pts</span>
                  </div>
                  <div style={{ height: 5, background: "rgba(255,255,255,0.05)", borderRadius: 99, overflow: "hidden" }}>
                    <div style={{ height: "100%", width: `${((qIndex + 1) / QUESTIONS.length) * 100}%`, background: "#00e5ff", borderRadius: 99, transition: "width 0.5s ease", boxShadow: "0 0 8px rgba(0,229,255,0.45)" }} />
                  </div>
                </div>
                <div style={{ background: "rgba(13,31,51,0.9)", border: `1px solid ${timerColor}55`, borderRadius: 10, padding: "0.5rem 0.875rem", textAlign: "center", minWidth: 58, transition: "border-color 0.3s" }}>
                  <div style={{ fontFamily: "'Bebas Neue',cursive", fontSize: "1.75rem", color: timerColor, lineHeight: 1, letterSpacing: "0.05em", transition: "color 0.3s" }}>{timeLeft}</div>
                  <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: "0.48rem", color: "#3a4460", letterSpacing: "0.1em" }}>วินาที</div>
                </div>
              </div>

              {/* Question */}
              <div style={{ background: "rgba(9,21,38,0.85)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 14, padding: "1.125rem 1.25rem 1rem", marginBottom: "1rem", position: "relative", overflow: "hidden" }}>
                <div style={{ position: "absolute", top: 0, left: "20%", right: "20%", height: 1, background: "linear-gradient(90deg,transparent,rgba(0,229,255,0.4),transparent)", borderRadius: 99 }} />
                <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: "0.55rem", letterSpacing: "0.18em", color: "#00e5ff", marginBottom: "0.6rem" }}>{currentQ.topic}</div>
                <p style={{ fontSize: "0.95rem", color: "#e8edf5", lineHeight: 1.65, fontWeight: 400, margin: 0 }}>{currentQ.text}</p>
              </div>

              {/* Options */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.55rem", marginBottom: "0.875rem" }}>
                {currentQ.opts.map((opt, i) => {
                  const isCorrect  = i === currentQ.ans;
                  const isSelected = i === selectedIdx;
                  let bg = "rgba(13,31,51,0.8)", border = "rgba(255,255,255,0.07)", color = "#8a94b0";
                  if (revealed) {
                    if (isCorrect)       { bg = "rgba(13,51,32,0.9)";  border = "rgba(0,255,157,0.35)";   color = "#00ff9d"; }
                    else if (isSelected) { bg = "rgba(45,15,15,0.9)";  border = "rgba(239,68,68,0.35)";   color = "#ef4444"; }
                    else                 { bg = "rgba(9,21,38,0.5)";   border = "rgba(255,255,255,0.04)"; color = "#3a4460"; }
                  }
                  return (
                    <button key={i} className="sq-opt" disabled={revealed} onClick={() => handleAnswer(i)}
                      style={{ background: bg, border: `1px solid ${border}`, borderRadius: 10, color, fontSize: "0.88rem", padding: "0.875rem", textAlign: "left", cursor: "pointer", fontWeight: 500, fontFamily: "'Anuphan',sans-serif" }}>
                      <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: "0.62rem", color: revealed ? color : "#00e5ff", marginRight: 7, opacity: 0.85, fontWeight: 600 }}>{LETTERS[i]}</span>
                      {opt}
                    </button>
                  );
                })}
              </div>

              {/* Feedback */}
              {revealed && (() => {
                const isTimeout = selectedIdx === null;
                const isCorrect = selectedIdx === currentQ.ans;
                let bg: string, border: string, color: string, text: string;
                if (isTimeout)      { bg = "rgba(45,31,10,0.9)"; border = "rgba(251,191,36,0.3)"; color = "#fbbf24"; text = `⏱ หมดเวลา! คำตอบคือ ${LETTERS[currentQ.ans]}: ${currentQ.opts[currentQ.ans]}`; }
                else if (isCorrect) { bg = "rgba(13,51,32,0.9)"; border = "rgba(0,255,157,0.3)";  color = "#00ff9d"; text = "✓ ถูกต้อง!"; }
                else                { bg = "rgba(45,15,15,0.9)"; border = "rgba(239,68,68,0.3)";  color = "#ef4444"; text = `✗ ผิด! คำตอบคือ ${LETTERS[currentQ.ans]}: ${currentQ.opts[currentQ.ans]}`; }
                return (
                  <div className="sq-fadein" style={{ background: bg, border: `1px solid ${border}`, borderRadius: 10, padding: "0.6rem 1rem", textAlign: "center", fontSize: "0.82rem", fontWeight: 600, color }}>
                    {text}
                  </div>
                );
              })()}
            </div>
          )}

          {/* ── RESULT ── */}
          {phase === "result" && (() => {
            const correct  = results.filter(r => r.status === "ok").length;
            const acc      = Math.round((correct / results.length) * 100);
            const avgTime  = (results.reduce((a, r) => a + r.time, 0) / results.length).toFixed(1);
            const xp       = Math.round(50 + (score / 2000) * 150);
            const { title, badge, sub } = gradeInfo(acc);
            return (
              <div className="sq-fadein" style={{ position: "relative", zIndex: 2, padding: "1.75rem 1.5rem" }}>
                <div style={{ textAlign: "center", marginBottom: "1.5rem" }}>
                  <div style={{ fontSize: "2.5rem", marginBottom: "0.4rem" }}>{badge}</div>
                  <div style={{ fontFamily: "'Bebas Neue',cursive", fontSize: "2rem", letterSpacing: "0.08em", color: "#e8edf5", marginBottom: "0.2rem" }}>{title}</div>
                  <div style={{ fontSize: "0.85rem", color: "#5a6480", marginBottom: "0.875rem", fontWeight: 300 }}>{sub}</div>
                  <div style={{ display: "inline-flex", alignItems: "center", gap: 6, background: "rgba(251,191,36,0.1)", border: "1px solid rgba(251,191,36,0.22)", borderRadius: 99, padding: "5px 16px", fontFamily: "'JetBrains Mono',monospace", fontSize: "0.72rem", color: "#fbbf24", fontWeight: 600 }}>
                    ⚡ +{xp} XP
                  </div>
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: "0.6rem", marginBottom: "1.125rem" }}>
                  {[
                    { val: String(score), lbl: "คะแนนรวม", color: "#fbbf24" },
                    { val: `${acc}%`,     lbl: "ความแม่นยำ", color: "#00e5ff" },
                    { val: `${avgTime}วิ`,lbl: "เฉลี่ย/ข้อ", color: "#00ff9d" },
                  ].map(({ val, lbl, color }) => (
                    <div key={lbl} style={{ background: "rgba(9,21,38,0.8)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 12, padding: "0.875rem 0.5rem", textAlign: "center" }}>
                      <div style={{ fontFamily: "'Bebas Neue',cursive", fontSize: "1.6rem", color, letterSpacing: "0.05em", lineHeight: 1 }}>{val}</div>
                      <div style={{ fontSize: "0.65rem", color: "#3a4460", marginTop: 4 }}>{lbl}</div>
                    </div>
                  ))}
                </div>

                <div style={{ background: "rgba(9,21,38,0.8)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 14, padding: "1rem", marginBottom: "1.125rem" }}>
                  <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: "0.53rem", letterSpacing: "0.15em", color: "#3a4460", marginBottom: "0.75rem" }}>สรุปรายข้อ</div>
                  <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                    {results.map((r, i) => {
                      const m = {
                        ok:      { icon: "✓", bg: "rgba(13,51,32,0.9)",  color: "#00ff9d" },
                        no:      { icon: "✗", bg: "rgba(45,15,15,0.9)",  color: "#ef4444" },
                        timeout: { icon: "⏱", bg: "rgba(45,31,10,0.9)", color: "#fbbf24" },
                      }[r.status];
                      return (
                        <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: "0.6rem" }}>
                          <div style={{ width: 20, height: 20, flexShrink: 0, borderRadius: 5, background: m.bg, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.58rem", color: m.color, fontWeight: 700, marginTop: 1 }}>{m.icon}</div>
                          <div style={{ flex: 1, fontSize: "0.78rem", color: "#5a6480", lineHeight: 1.5 }}>ข้อ {i + 1}: {r.question}</div>
                          <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: "0.7rem", color: "#fbbf24", flexShrink: 0, fontWeight: 600 }}>{r.pts > 0 ? `+${r.pts}` : "0"}</div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div style={{ display: "flex", gap: "0.6rem" }}>
                  <button className="sq-primary" onClick={startGame}
                    style={{ flex: 1, padding: "0.825rem", background: "#00e5ff", border: "none", borderRadius: 10, color: "#050810", fontWeight: 700, fontSize: "0.95rem", cursor: "pointer", transition: "background 0.2s", boxShadow: "0 0 16px rgba(0,229,255,0.22)", fontFamily: "'Anuphan',sans-serif" }}>
                    ⚡ เล่นอีกครั้ง
                  </button>
                  <button className="sq-secondary" onClick={() => router.push("/game")}
                    style={{ flex: 1, padding: "0.825rem", background: "transparent", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 10, color: "#5a6480", fontWeight: 500, fontSize: "0.95rem", cursor: "pointer", transition: "all 0.2s", fontFamily: "'Anuphan',sans-serif" }}>
                    กลับหน้าหลัก
                  </button>
                </div>
              </div>
            );
          })()}

        </div>
      </div>
    </>
  );
}