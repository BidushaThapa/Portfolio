import { useState, useEffect, useRef } from "react";
import emailjs from "@emailjs/browser";

// ─── Framer Motion mock (inline lightweight animation via CSS + Intersection Observer) ───
// Since we're in artifact mode, we use a custom hook + CSS transitions

function useInView(threshold = 0.15) {
  const ref = useRef(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setInView(true); }, { threshold });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);
  return [ref, inView];
}

function Reveal({ children, delay = 0, className = "" }) {
  const [ref, inView] = useInView();
  return (
    <div ref={ref} className={className} style={{
      opacity: inView ? 1 : 0,
      transform: inView ? "translateY(0)" : "translateY(32px)",
      transition: `opacity 0.7s ease ${delay}s, transform 0.7s ease ${delay}s`,
    }}>
      {children}
    </div>
  );
}

// ─── Data ───────────────────────────────────────────────────────────────────
const SECTIONS = ["home", "about", "skills", "projects", "journey", "contact"];

const SKILLS = {
  "Programming": [
      { name: "C" },
    { name: "C++" },
    { name: "JavaScript" },
    { name: "TypeScript" },
    { name: "Python" },

  ],
  "Web": [
    { name: "React" },
    { name: "Next.js" },
    { name: "HTML & CSS" },
  ],
  "Tools": [
    { name: "Git & GitHub" },
    { name: "VS Code" },
    { name: "Linux / CLI" },
  ],
  "Core-Concepts": [
    { name: "Data Structures & Algorithms - DSA" },
    { name: "Database Systems - MySQL" },]
};

const PROJECTS = [
  {
    title: "AgriTogether (Farmers App)",
    desc: "AgriTogether is a smart farming coordination platform built to reduce market over-saturation. It helps farmers plan crops with shared visibility and simple insights before planting season begins.",
    features: [
      { icon: "👥", text: "Farmers can see what crops others are planning to grow" },
      { icon: "📊", text: "Identify overgrown and undergrown crops using clear data signals" },
      { icon: "💡", text: "Support informed planting decisions with practical local insights" },
      { icon: "🌱", text: "Promote community-based crop planning and collaboration" },
    ],
    impact: [
      "Reduces crop overproduction",
      "Helps stabilize local prices",
      "Supports better income planning for farmers",
    ],
    tech: ["React", "Node.js"],
    emoji: "🌾",
    accent: "#22c55e",
    github: "https://github.com",
  },
  {
    title: "E-Commerce Web Application",
    desc: "A responsive e-commerce web application built with modern frontend practices and a component-based architecture focused on maintainability and scalability.",
    features: [
      { icon: "🔐", text: "User authentication flow with signup and login" },
      { icon: "🧩", text: "Reusable product listing components for clean structure" },
      { icon: "📄", text: "Pagination for smooth and efficient product browsing" },
      { icon: "🛒", text: "Shopping cart functionality for end-to-end user flow" },
      { icon: "📱", text: "Clean, responsive UI across mobile and desktop" },
    ],
    impact: [
      "Structured for long-term maintainability",
      "Frontend patterns designed for scale",
    ],
    tech: ["React", "Zustand/Redux", "REST API", "CSS"],
    emoji: "🛍️",
    accent: "#0ea5e9",
    github: "https://github.com",
  },
  {
    title: "Yatra (Travel App)",
    desc: "Yatra is a travel platform that bridges users with meaningful travel experiences by combining trip discovery, social planning, and booking in one place.",
    features: [
      { icon: "🤝", text: "Find compatible travel mates for shared journeys" },
      { icon: "🥾", text: "Discover trekking and tour guides by destination" },
      { icon: "🗺️", text: "Explore curated itineraries for different trips" },
      { icon: "🎟️", text: "Book trips directly through the platform" },
    ],
    impact: [
      "Simplifies travel planning",
      "Connects people with shared travel interests",
      "Makes trips more accessible and organized",
    ],
    tech: ["React", "Firebase", "Node.js", "Maps API"],
    emoji: "🧭",
    accent: "#f97316",
    github: "https://github.com",
  },
  {
    title: "VayuSwasthya (Health Monitoring App)",
    desc: "VayuSwasthya is a smart health monitoring platform focused on preventive healthcare and medicine sustainability, helping users track vital health metrics, manage medicines, and monitor overall wellness.",
    features: [
      { icon: "💊", text: "Track medicines with expiry alerts and low-stock notifications" },
      { icon: "❤️", text: "Monitor vital health metrics like Blood Pressure and BMI" },
      { icon: "📊", text: "Visualize health trends through interactive dashboard graphs" },
      { icon: "🔔", text: "Receive timely health alerts and medication reminders" },
    ],
    impact: [
      "Promotes proactive health monitoring",
      "Encourages responsible medicine management",
      "Supports sustainable healthcare practices",
    ],
    tech: ["Flutter", "Node.js", "React", "MongoDB"],
    emoji: "🏥",
    accent: "#10b981",
    github: "https://github.com",
  },
];

const JOURNEY = [
  { year: "2022", title: "Started CSIT Program", desc: "Enrolled in BSc. CSIT — foundations in algorithms, data structures, and systems.", icon: "🎓" },
  // { year: "2023", title: "First Lines of Code", desc: "Fell in love with Python and C. Started building small tools and solving problems daily.", icon: "💻" },
  { year: "2024", title: "Diving into Web Dev", desc: "Picked up React, Next.js, and modern CSS. Built first full-stack applications.", icon: "🌐" },
  { year: "2025", title: "Data Systems Focus", desc: "Started exploring databases, distributed systems, and backend architecture.", icon: "⚙️" },
];

// ─── Typing Effect ────────────────────────────────────────────────────────────
function TypedText({ words, dark }) {
  const [idx, setIdx] = useState(0);
  const [text, setText] = useState("");
  const [deleting, setDeleting] = useState(false);
  useEffect(() => {
    const w = words[idx % words.length];
    const speed = deleting ? 50 : 90;
    const timeout = setTimeout(() => {
      if (!deleting && text === w) {
        setTimeout(() => setDeleting(true), 1400);
        return;
      }
      if (deleting && text === "") {
        setDeleting(false);
        setIdx(i => i + 1);
        return;
      }
      setText(deleting ? text.slice(0, -1) : w.slice(0, text.length + 1));
    }, speed);
    return () => clearTimeout(timeout);
  }, [text, deleting, idx, words]);

  return (
    <span style={{ color: dark ? "#818cf8" : "#4f46e5" }}>
      {text}<span style={{ animation: "blink 1s step-end infinite", borderRight: `2px solid ${dark ? "#818cf8" : "#4f46e5"}` }}></span>
    </span>
  );
}

// ─── Navbar ───────────────────────────────────────────────────────────────────
function Navbar({ active, scrollTo, dark, setDark }) {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", h);
    return () => window.removeEventListener("scroll", h);
  }, []);

  const bg = dark
    ? scrolled ? "rgba(10,10,20,0.92)" : "transparent"
    : scrolled ? "rgba(255,255,255,0.92)" : "transparent";

  return (
    <nav style={{
      position: "fixed", top: 0, left: 0, right: 0, zIndex: 100,
      background: bg,
      backdropFilter: scrolled ? "blur(12px)" : "none",
      borderBottom: scrolled ? `1px solid ${dark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.06)"}` : "none",
      transition: "all 0.3s ease",
      padding: "0 2rem",
    }}>
      <div style={{ maxWidth: 1100, margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "space-between", height: 64 }}>
        {/* Logo */}
        <button onClick={() => scrollTo("home")} style={{ background: "none", border: "none", cursor: "pointer", display: "flex", alignItems: "center", gap: 8 }}>
          <div style={{
            width: 34, height: 34, borderRadius: 10,
            background: "linear-gradient(135deg, #4f46e5, #818cf8)",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontFamily: "'Playfair Display', serif", color: "#fff", fontWeight: 700, fontSize: 16,
          }}>B</div>
          <span style={{ fontFamily: "'Playfair Display', serif", fontWeight: 700, fontSize: 17, color: dark ? "#f1f5f9" : "#1e293b", letterSpacing: "-0.02em" }}>Bidusha</span>
        </button>

        {/* Desktop Nav */}
        <div style={{ display: "flex", alignItems: "center", gap: 4 }} className="desktop-nav">
          {SECTIONS.map(s => (
            <NavLink key={s} label={s} active={active === s} onClick={() => scrollTo(s)} dark={dark} />
          ))}
          <DarkToggle dark={dark} setDark={setDark} />
        </div>

        {/* Mobile */}
        <div style={{ display: "flex", gap: 8, alignItems: "center" }} className="mobile-nav">
          <DarkToggle dark={dark} setDark={setDark} />
          <button onClick={() => setOpen(o => !o)} style={{
            background: "none", border: "none", cursor: "pointer", padding: 8,
            color: dark ? "#e2e8f0" : "#334155", fontSize: 22,
          }}>{open ? "✕" : "☰"}</button>
        </div>
      </div>

      {/* Mobile Menu */}
      {open && (
        <div style={{
          background: dark ? "rgba(10,10,20,0.97)" : "rgba(255,255,255,0.97)",
          backdropFilter: "blur(16px)",
          padding: "1rem 2rem 1.5rem",
          display: "flex", flexDirection: "column", gap: 8,
          borderBottom: `1px solid ${dark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.08)"}`,
        }}>
          {SECTIONS.map(s => (
            <button key={s} onClick={() => { scrollTo(s); setOpen(false); }} style={{
              background: "none", border: "none", cursor: "pointer", textAlign: "left",
              padding: "10px 12px", borderRadius: 10,
              color: active === s ? "#6366f1" : dark ? "#94a3b8" : "#475569",
              fontFamily: "'DM Sans', sans-serif", fontSize: 15,
              background: active === s ? (dark ? "rgba(99,102,241,0.12)" : "rgba(99,102,241,0.08)") : "transparent",
              fontWeight: active === s ? 600 : 400,
              textTransform: "capitalize",
            }}>{s}</button>
          ))}
        </div>
      )}
    </nav>
  );
}

function NavLink({ label, active, onClick, dark }) {
  const [hovered, setHovered] = useState(false);
  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: "none", border: "none", cursor: "pointer",
        padding: "6px 14px", borderRadius: 8,
        color: active ? "#6366f1" : dark ? "#94a3b8" : "#475569",
        fontFamily: "'DM Sans', sans-serif", fontSize: 14, fontWeight: active ? 600 : 400,
        position: "relative", transition: "color 0.2s",
        textTransform: "capitalize",
        background: hovered || active ? (dark ? "rgba(99,102,241,0.1)" : "rgba(99,102,241,0.07)") : "transparent",
      }}
    >
      {label}
    </button>
  );
}

function DarkToggle({ dark, setDark }) {
  return (
    <button
      onClick={() => setDark(d => !d)}
      title="Toggle dark mode"
      style={{
        background: dark ? "rgba(99,102,241,0.2)" : "rgba(99,102,241,0.1)",
        border: "none", cursor: "pointer", borderRadius: 10,
        width: 36, height: 36, fontSize: 17,
        display: "flex", alignItems: "center", justifyContent: "center",
        transition: "all 0.2s",
      }}
    >{dark ? "☀️" : "🌙"}</button>
  );
}

// ─── Section Arrow Navigation ─────────────────────────────────────────────────
function SectionArrows({ current, scrollTo }) {
  const ci = SECTIONS.indexOf(current);
  const prev = ci > 0 ? SECTIONS[ci - 1] : null;
  const next = ci < SECTIONS.length - 1 ? SECTIONS[ci + 1] : null;

  return (
    <div style={{
      position: "fixed", right: 24, bottom: 80, zIndex: 90,
      display: "flex", flexDirection: "column", gap: 8, alignItems: "center",
    }}>
      {/* Section dots */}
      <div style={{ display: "flex", flexDirection: "column", gap: 6, marginBottom: 8 }}>
        {SECTIONS.map((s, i) => (
          <button key={s} onClick={() => scrollTo(s)} title={s} style={{
            width: 8, height: 8, borderRadius: "50%", border: "none", cursor: "pointer",
            background: current === s ? "#6366f1" : "rgba(99,102,241,0.3)",
            padding: 0, transition: "all 0.3s",
            transform: current === s ? "scale(1.4)" : "scale(1)",
          }} />
        ))}
      </div>
      {prev && (
        <ArrowBtn label="↑" onClick={() => scrollTo(prev)} title={prev} />
      )}
      {next && (
        <ArrowBtn label="↓" onClick={() => scrollTo(next)} title={next} />
      )}
    </div>
  );
}

function ArrowBtn({ label, onClick, title }) {
  const [h, setH] = useState(false);
  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setH(true)}
      onMouseLeave={() => setH(false)}
      title={title}
      style={{
        width: 38, height: 38, borderRadius: 12,
        background: h ? "#6366f1" : "rgba(99,102,241,0.15)",
        border: "1px solid rgba(99,102,241,0.3)",
        color: h ? "#fff" : "#6366f1",
        cursor: "pointer", fontSize: 16,
        display: "flex", alignItems: "center", justifyContent: "center",
        transition: "all 0.25s", transform: h ? "scale(1.1)" : "scale(1)",
      }}
    >{label}</button>
  );
}

// ─── Hero Section ─────────────────────────────────────────────────────────────
function Hero({ dark, scrollTo }) {
  return (
    <section id="home" style={{
      minHeight: "100vh", display: "flex", alignItems: "center",
      position: "relative", overflow: "hidden",
      padding: "80px 2rem 2rem",
    }}>
      {/* Animated background */}
      <div style={{ position: "absolute", inset: 0, zIndex: 0 }}>
        <div style={{
          position: "absolute", top: "10%", right: "5%",
          width: 380, height: 380, borderRadius: "50%",
          background: dark
            ? "radial-gradient(circle, rgba(99,102,241,0.18) 0%, transparent 70%)"
            : "radial-gradient(circle, rgba(99,102,241,0.12) 0%, transparent 70%)",
          animation: "float1 8s ease-in-out infinite",
        }} />
        <div style={{
          position: "absolute", bottom: "15%", left: "2%",
          width: 280, height: 280, borderRadius: "50%",
          background: dark
            ? "radial-gradient(circle, rgba(249,115,22,0.12) 0%, transparent 70%)"
            : "radial-gradient(circle, rgba(249,115,22,0.08) 0%, transparent 70%)",
          animation: "float2 10s ease-in-out infinite",
        }} />
        <div style={{
          position: "absolute", top: "45%", left: "40%",
          width: 200, height: 200, borderRadius: "50%",
          background: dark
            ? "radial-gradient(circle, rgba(14,165,233,0.1) 0%, transparent 70%)"
            : "radial-gradient(circle, rgba(14,165,233,0.07) 0%, transparent 70%)",
          animation: "float1 12s ease-in-out infinite reverse",
        }} />
        {/* Grid pattern */}
        <svg style={{ position: "absolute", inset: 0, width: "100%", height: "100%", opacity: dark ? 0.04 : 0.03 }}>
          <defs>
            <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke={dark ? "#818cf8" : "#4f46e5"} strokeWidth="1" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>
      </div>

      <div style={{ maxWidth: 1100, margin: "0 auto", width: "100%", position: "relative", zIndex: 1 }}>
        <div style={{ maxWidth: 680 }}>
          <div style={{
            display: "inline-flex", alignItems: "center", gap: 8,
            padding: "6px 16px", borderRadius: 100,
            background: dark ? "rgba(99,102,241,0.15)" : "rgba(99,102,241,0.1)",
            border: `1px solid ${dark ? "rgba(99,102,241,0.3)" : "rgba(99,102,241,0.2)"}`,
            marginBottom: 28,
            animation: "fadeIn 0.8s ease forwards",
          }}>
            <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#22c55e", boxShadow: "0 0 6px #22c55e" }} />
            <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 13, color: dark ? "#a5b4fc" : "#6366f1", fontWeight: 500 }}>
              Open to opportunities
            </span>
          </div>

          <h1 style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: "clamp(2.5rem, 6vw, 4.2rem)",
            fontWeight: 800,
            color: dark ? "#f1f5f9" : "#0f172a",
            lineHeight: 1.15,
            letterSpacing: "-0.03em",
            margin: "0 0 16px",
            animation: "slideUp 0.8s ease 0.1s both",
          }}>
            Hi, I'm Bidusha Thapa!
          </h1>

          <h2 style={{
            fontFamily: "'DM Sans', sans-serif",
            fontSize: "clamp(1.3rem, 3.5vw, 2.1rem)",
            fontWeight: 400,
            color: dark ? "#94a3b8" : "#475569",
            margin: "0 0 28px",
            lineHeight: 1.4,
            animation: "slideUp 0.8s ease 0.2s both",
          }}>
            <TypedText words={["Building Systems & Web Apps.", "Exploring Data Architecture.", "Solving Problems with Code."]} dark={dark} />
          </h2>

          <p style={{
            fontFamily: "'DM Sans', sans-serif",
            fontSize: "clamp(1rem, 2vw, 1.1rem)",
            color: dark ? "#64748b" : "#64748b",
            lineHeight: 1.75,
            maxWidth: 520,
            margin: "0 0 40px",
            animation: "slideUp 0.8s ease 0.3s both",
          }}>
            A Computer Science student passionate about data systems, clean code, and building software that actually matters. Currently studying CSIT and turning curiosity into projects.
          </p>

          <div style={{ display: "flex", gap: 14, flexWrap: "wrap", animation: "slideUp 0.8s ease 0.4s both" }}>
            <PrimaryBtn onClick={() => scrollTo("projects")} dark={dark}>View Projects</PrimaryBtn>
            <SecondaryBtn onClick={() => scrollTo("contact")} dark={dark}>Contact Me</SecondaryBtn>
          </div>
        </div>

        {/* Scroll indicator */}
        <div style={{
          position: "absolute", bottom: -40, left: "50%", transform: "translateX(-50%)",
          display: "flex", flexDirection: "column", alignItems: "center", gap: 8,
          animation: "fadeIn 1.2s ease 1s both",
        }}>
          <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 12, color: dark ? "#475569" : "#94a3b8", letterSpacing: "0.1em", textTransform: "uppercase" }}>scroll</span>
          <div style={{ width: 24, height: 38, border: `2px solid ${dark ? "#334155" : "#cbd5e1"}`, borderRadius: 12, display: "flex", justifyContent: "center", padding: "4px 0" }}>
            <div style={{ width: 4, height: 8, background: dark ? "#6366f1" : "#6366f1", borderRadius: 2, animation: "scrollDot 2s ease infinite" }} />
          </div>
        </div>
      </div>
    </section>
  );
}

function PrimaryBtn({ children, onClick, dark, disabled = false }) {
  const [h, setH] = useState(false);
  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setH(true)}
      onMouseLeave={() => setH(false)}
      disabled={disabled}
      style={{
        background: h ? "linear-gradient(135deg, #4338ca, #6366f1)" : "linear-gradient(135deg, #4f46e5, #818cf8)",
        color: "#fff", border: "none", cursor: "pointer",
        padding: "13px 28px", borderRadius: 14,
        fontFamily: "'DM Sans', sans-serif", fontWeight: 600, fontSize: 15,
        boxShadow: h ? "0 8px 24px rgba(99,102,241,0.45)" : "0 4px 12px rgba(99,102,241,0.3)",
        transition: "all 0.25s", transform: h ? "translateY(-2px) scale(1.03)" : "none",
        letterSpacing: "-0.01em",
        opacity: disabled ? 0.7 : 1,
        pointerEvents: disabled ? "none" : "auto",
      }}>{children}</button>
  );
}

function SecondaryBtn({ children, onClick, dark }) {
  const [h, setH] = useState(false);
  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setH(true)}
      onMouseLeave={() => setH(false)}
      style={{
        background: h ? (dark ? "rgba(99,102,241,0.2)" : "rgba(99,102,241,0.1)") : "transparent",
        color: dark ? "#a5b4fc" : "#4f46e5",
        border: `1.5px solid ${dark ? "rgba(99,102,241,0.4)" : "rgba(99,102,241,0.3)"}`,
        cursor: "pointer",
        padding: "13px 28px", borderRadius: 14,
        fontFamily: "'DM Sans', sans-serif", fontWeight: 600, fontSize: 15,
        transition: "all 0.25s", transform: h ? "translateY(-2px)" : "none",
        letterSpacing: "-0.01em",
      }}>{children}</button>
  );
}

// ─── About Section ────────────────────────────────────────────────────────────
function About({ dark }) {
  const highlights = [
    { icon: "🔍", label: "Curious Learner", desc: "Always exploring the 'why' behind systems" },
    { icon: "⚙️", label: "Systems Thinker", desc: "Enjoys designing clean, scalable architecture" },
    { icon: "📊", label: "Data Enthusiast", desc: "Fascinated by how data shapes decisions" },
    { icon: "🛠️", label: "Builder Mindset", desc: "Turns ideas into working, shipped projects" },
  ];

  return (
    <Section id="about" dark={dark}>
      <SectionHeader label="About Me" title="A bit about who I am" dark={dark} />
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 48, alignItems: "center", marginTop: 48 }}>
        <Reveal>
          <div style={{
            background: dark ? "rgba(30,41,59,0.6)" : "rgba(248,250,252,0.9)",
            border: `1px solid ${dark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.07)"}`,
            borderRadius: 24, padding: "2.5rem",
          }}>
            <div style={{ width: 56, height: 56, borderRadius: 18, background: "linear-gradient(135deg,#4f46e5,#818cf8)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 28, marginBottom: 24 }}>👋</div>
            <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 16, lineHeight: 1.8, color: dark ? "#94a3b8" : "#475569", marginBottom: 20 }}>
              I'm a <strong style={{ color: dark ? "#e2e8f0" : "#1e293b" }}>CSIT student</strong> with a deep interest in how data flows through systems — from databases and APIs to the UIs that make it all tangible.
            </p>
            <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 16, lineHeight: 1.8, color: dark ? "#94a3b8" : "#475569", marginBottom: 20 }}>
              I write code in <strong style={{ color: dark ? "#a5b4fc" : "#4f46e5" }}>Python, JavaScript, and C</strong>, build with React, and spend late nights debugging things I probably shouldn't have started. But I always finish.
            </p>
            <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 16, lineHeight: 1.8, color: dark ? "#94a3b8" : "#475569", margin: 0 }}>
              My goal is to build software that's not just functional — but elegant under the hood.
            </p>
          </div>
        </Reveal>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
          {highlights.map((h, i) => (
            <Reveal key={h.label} delay={i * 0.1}>
              <HighlightCard item={h} dark={dark} />
            </Reveal>
          ))}
        </div>
      </div>
    </Section>
  );
}

function HighlightCard({ item, dark }) {
  const [hov, setHov] = useState(false);
  return (
    <div
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        background: dark
          ? hov ? "rgba(99,102,241,0.15)" : "rgba(30,41,59,0.5)"
          : hov ? "rgba(99,102,241,0.07)" : "rgba(255,255,255,0.9)",
        border: `1px solid ${hov ? "rgba(99,102,241,0.4)" : dark ? "rgba(255,255,255,0.07)" : "rgba(0,0,0,0.06)"}`,
        borderRadius: 18, padding: "1.4rem",
        transition: "all 0.25s",
        transform: hov ? "translateY(-3px)" : "none",
        boxShadow: hov ? "0 8px 24px rgba(99,102,241,0.15)" : "none",
        cursor: "default",
      }}>
      <div style={{ fontSize: 26, marginBottom: 10 }}>{item.icon}</div>
      <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 14, fontWeight: 700, color: dark ? "#e2e8f0" : "#1e293b", marginBottom: 6 }}>{item.label}</div>
      <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 13, color: dark ? "#64748b" : "#64748b", lineHeight: 1.5 }}>{item.desc}</div>
    </div>
  );
}

// ─── Skills Section ────────────────────────────────────────────────────────────
function Skills({ dark }) {
  return (
    <Section id="skills" dark={dark} alt>
      <SectionHeader label="Skills" title="What I work with" dark={dark} />
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 24, marginTop: 48 }}>
        {Object.entries(SKILLS).map(([cat, skills], ci) => (
          <Reveal key={cat} delay={ci * 0.12}>
            <SkillCard category={cat} skills={skills} dark={dark} />
          </Reveal>
        ))}
      </div>
    </Section>
  );
}

function SkillCard({ category, skills, dark }) {
  const icons = { "Programming": "💻", "Web": "🌐", "Tools": "🔧", "Core-Concepts": "🧠" };
  const colors = { "Programming": "#6366f1", "Web": "#0ea5e9", "Tools": "#f97316", "Core-Concepts": "#22c55e" };
  const color = colors[category];

  return (
    <div style={{
      background: dark ? "rgba(15,23,42,0.7)" : "#fff",
      border: `1px solid ${dark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.07)"}`,
      borderRadius: 22, padding: "2rem",
      boxShadow: dark ? "none" : "0 2px 16px rgba(0,0,0,0.06)",
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 28 }}>
        <div style={{
          width: 44, height: 44, borderRadius: 14,
          background: `${color}22`,
          display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22,
        }}>{icons[category]}</div>
        <h3 style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 700, fontSize: 17, color: dark ? "#f1f5f9" : "#1e293b", margin: 0 }}>{category}</h3>
      </div>
     <div
  style={{
    display: "flex",
    flexWrap: "wrap",
    gap: 10,
  }}
>
  {skills.map(skill => (
    <SkillItem key={skill.name} skill={skill} color={color} dark={dark} />
  ))}
</div>
    </div>
  );
}

function SkillItem({ skill, color, dark }) {
  const [hover, setHover] = useState(false);

  return (
    <div
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        padding: "10px 14px",
        borderRadius: 10,
        fontFamily: "'DM Sans', sans-serif",
        fontSize: 14,
        fontWeight: 500,
        alignItems: "center",
        background: hover
          ? `${color}22`
          : dark
          ? "rgba(255,255,255,0.04)"
          : "rgba(0,0,0,0.04)",
        color: dark ? "#e2e8f0" : "#334155",
        border: `1px solid ${
          hover ? `${color}55` : dark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.08)"
        }`,
        transition: "all 0.25s",
        cursor: "default",
      }}
    >
      {skill.name}
    </div>
  );
}

// ─── Projects Section ─────────────────────────────────────────────────────────
function Projects({ dark }) {
  return (
    <Section id="projects" dark={dark}>
      <SectionHeader label="Projects" title="Things I've built" dark={dark} />
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 24, marginTop: 48 }}>
        {PROJECTS.map((p, i) => (
          <Reveal key={p.title} delay={i * 0.12}>
            <ProjectCard project={p} dark={dark} />
          </Reveal>
        ))}
      </div>
      <Reveal delay={0.3}>
        <div style={{ textAlign: "center", marginTop: 40 }}>
          <a href="https://github.com" target="_blank" rel="noreferrer" style={{
            display: "inline-flex", alignItems: "center", gap: 8,
            fontFamily: "'DM Sans', sans-serif", fontSize: 15, fontWeight: 600,
            color: dark ? "#a5b4fc" : "#4f46e5", textDecoration: "none",
            padding: "10px 22px", borderRadius: 12,
            border: `1.5px solid ${dark ? "rgba(99,102,241,0.35)" : "rgba(99,102,241,0.25)"}`,
            transition: "all 0.2s",
          }}>View all on GitHub →</a>
        </div>
      </Reveal>
    </Section>
  );
}

function ProjectCard({ project, dark }) {
  const [hov, setHov] = useState(false);
  return (
    <div
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        background: dark ? "rgba(15,23,42,0.8)" : "#fff",
        border: `1px solid ${hov ? project.accent + "55" : dark ? "rgba(255,255,255,0.07)" : "rgba(0,0,0,0.07)"}`,
        borderRadius: 22, padding: "2rem", cursor: "default",
        transition: "all 0.3s",
        transform: hov ? "translateY(-6px) scale(1.02)" : "none",
        boxShadow: hov ? `0 16px 40px ${project.accent}22` : dark ? "none" : "0 2px 12px rgba(0,0,0,0.06)",
        position: "relative", overflow: "hidden",
      }}>
      {/* Accent line */}
      <div style={{ position: "absolute", top: 0, left: 24, right: 24, height: 3, borderRadius: "0 0 6px 6px", background: project.accent, opacity: hov ? 1 : 0, transition: "opacity 0.3s" }} />

      <div style={{ fontSize: 40, marginBottom: 16 }}>{project.emoji}</div>
      <h3 style={{ fontFamily: "'Playfair Display', serif", fontWeight: 700, fontSize: 20, color: dark ? "#f1f5f9" : "#1e293b", margin: "0 0 12px" }}>{project.title}</h3>
      <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 14, lineHeight: 1.7, color: dark ? "#64748b" : "#64748b", margin: "0 0 18px" }}>{project.desc}</p>

      <div style={{ marginBottom: 18 }}>
        <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 12, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: dark ? "#94a3b8" : "#475569", marginBottom: 10 }}>
          Key Features
        </div>
        <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: 8 }}>
          {project.features.map((feature) => (
            <ProjectFeatureItem key={feature.text} feature={feature} accent={project.accent} dark={dark} />
          ))}
        </ul>
      </div>

      <div style={{ marginBottom: 20 }}>
        <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 12, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: dark ? "#94a3b8" : "#475569", marginBottom: 10 }}>
          Impact
        </div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
          {project.impact.map((item) => (
            <span key={item} style={{
              fontFamily: "'DM Sans', sans-serif", fontSize: 12, fontWeight: 600,
              padding: "4px 10px", borderRadius: 8,
              background: dark ? "rgba(16,185,129,0.12)" : "rgba(16,185,129,0.08)",
              color: dark ? "#34d399" : "#047857",
              border: dark ? "1px solid rgba(16,185,129,0.25)" : "1px solid rgba(16,185,129,0.2)",
            }}>✓ {item}</span>
          ))}
        </div>
      </div>

      <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 20 }}>
        {project.tech.map(t => (
          <span key={t} style={{
            fontFamily: "'DM Sans', sans-serif", fontSize: 12, fontWeight: 600,
            padding: "4px 10px", borderRadius: 8,
            background: `${project.accent}18`, color: project.accent,
            border: `1px solid ${project.accent}33`,
          }}>{t}</span>
        ))}
      </div>

      <a href={project.github} target="_blank" rel="noreferrer" style={{
        display: "inline-flex", alignItems: "center", gap: 6,
        fontFamily: "'DM Sans', sans-serif", fontSize: 13, fontWeight: 600,
        color: project.accent, textDecoration: "none",
      }}>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z" /></svg>
        View on GitHub
      </a>
    </div>
  );
}

function ProjectFeatureItem({ feature, accent, dark }) {
  const [hover, setHover] = useState(false);
  return (
    <li
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        display: "flex", alignItems: "center", gap: 8,
        fontFamily: "'DM Sans', sans-serif", fontSize: 13,
        color: dark ? "#cbd5e1" : "#334155",
        lineHeight: 1.5,
        padding: "7px 10px",
        borderRadius: 10,
        background: hover ? `${accent}22` : dark ? "rgba(255,255,255,0.02)" : "rgba(0,0,0,0.02)",
        border: `1px solid ${hover ? `${accent}55` : dark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.06)"}`,
        transform: hover ? "translateX(3px)" : "none",
        transition: "all 0.22s",
      }}
    >
      <span style={{ fontSize: 15 }}>{feature.icon}</span>
      <span>{feature.text}</span>
    </li>
  );
}

// ─── Journey / Timeline ────────────────────────────────────────────────────────
function Journey({ dark }) {
  return (
    <Section id="journey" dark={dark} alt>
      <SectionHeader label="Journey" title="My learning path" dark={dark} />
      <div style={{ maxWidth: 720, margin: "48px auto 0", position: "relative" }}>
        {/* Vertical line */}
        <div style={{
          position: "absolute", left: 32, top: 0, bottom: 0, width: 2,
          background: dark ? "rgba(99,102,241,0.2)" : "rgba(99,102,241,0.15)",
          borderRadius: 1,
        }} />
        <div style={{ display: "flex", flexDirection: "column", gap: 32 }}>
          {JOURNEY.map((item, i) => (
            <Reveal key={item.year} delay={i * 0.1}>
              <TimelineItem item={item} dark={dark} />
            </Reveal>
          ))}
        </div>
      </div>
    </Section>
  );
}

function TimelineItem({ item, dark }) {
  const [hov, setHov] = useState(false);
  return (
    <div
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{ display: "flex", gap: 24, alignItems: "flex-start" }}
    >
      {/* Icon bubble */}
      <div style={{
        width: 64, height: 64, borderRadius: "50%", flexShrink: 0,
        background: hov
          ? "linear-gradient(135deg, #4f46e5, #818cf8)"
          : dark ? "rgba(30,41,59,0.8)" : "rgba(248,250,252,1)",
        border: `2px solid ${hov ? "#6366f1" : dark ? "rgba(99,102,241,0.3)" : "rgba(99,102,241,0.2)"}`,
        display: "flex", alignItems: "center", justifyContent: "center",
        fontSize: 24, transition: "all 0.3s", zIndex: 1,
        boxShadow: hov ? "0 4px 20px rgba(99,102,241,0.3)" : "none",
      }}>{item.icon}</div>
      {/* Content */}
      <div style={{
        background: dark
          ? hov ? "rgba(30,41,59,0.9)" : "rgba(15,23,42,0.7)"
          : hov ? "rgba(255,255,255,1)" : "rgba(255,255,255,0.8)",
        border: `1px solid ${hov ? "rgba(99,102,241,0.35)" : dark ? "rgba(255,255,255,0.07)" : "rgba(0,0,0,0.07)"}`,
        borderRadius: 18, padding: "1.5rem 1.75rem", flex: 1,
        transition: "all 0.3s",
        boxShadow: hov ? "0 8px 24px rgba(99,102,241,0.12)" : "none",
        transform: hov ? "translateX(4px)" : "none",
      }}>
        <div style={{ display: "flex", gap: 12, alignItems: "center", marginBottom: 8 }}>
          <span style={{
            fontFamily: "'DM Sans', sans-serif", fontSize: 12, fontWeight: 700,
            color: "#6366f1", padding: "3px 10px", borderRadius: 8,
            background: "rgba(99,102,241,0.12)",
          }}>{item.year}</span>
          <h3 style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 700, fontSize: 16, color: dark ? "#f1f5f9" : "#1e293b", margin: 0 }}>{item.title}</h3>
        </div>
        <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 14, color: dark ? "#64748b" : "#64748b", lineHeight: 1.6, margin: 0 }}>{item.desc}</p>
      </div>
    </div>
  );
}

// ─── Contact Section ──────────────────────────────────────────────────────────
function Contact({ dark }) {
  const [formData, setFormData] = useState({ name: "", email: "", message: "" });
  const [sent, setSent] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [submitError, setSubmitError] = useState("");

  const serviceId = import.meta.env.VITE_EMAILJS_SERVICE_ID;
  const templateId = import.meta.env.VITE_EMAILJS_TEMPLATE_ID;
  const publicKey = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;

  const handleSubmit = async () => {
    if (isSending) return;

    const name = formData.name.trim();
    const email = formData.email.trim();
    const message = formData.message.trim();

    if (!name || !email || !message) {
      setSubmitError("Please fill out name, email, and message.");
      return;
    }

    if (!serviceId || !templateId || !publicKey) {
      setSubmitError("Contact form is not configured yet. Please set EmailJS environment variables.");
      return;
    }

    try {
      setIsSending(true);
      setSubmitError("");

      await emailjs.send(
        serviceId,
        templateId,
        {
          from_name: name,
          from_email: email,
          message,
          to_name: "Bidusha",
        },
        {
          publicKey,
        }
      );

      setSent(true);
      setFormData({ name: "", email: "", message: "" });
    } catch (error) {
      setSubmitError("Message failed to send. Please try again in a moment.");
    } finally {
      setIsSending(false);
    }
  };

  const contacts = [
    { icon: "✉️", label: "Email", value: "bidushathapa@gmail.com", href: "mailto:bidushathapa@gmail.com" },
    { icon: "🐙", label: "GitHub", value: "https://github.com/BidushaThapa", href: "https://github.com/BidushaThapa" },
    { icon: "💼", label: "LinkedIn", value: "https://www.linkedin.com/in/bidusha-thapa-b2629a35a/", href: "https://www.linkedin.com/in/bidusha-thapa-b2629a35a/" },
  ];

  return (
    <Section id="contact" dark={dark}>
      <SectionHeader label="Contact" title="Let's connect" dark={dark} />
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 40, marginTop: 48 }}>
        {/* Left: info */}
        <Reveal>
          <div>
            <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 16, lineHeight: 1.8, color: dark ? "#94a3b8" : "#475569", marginBottom: 32 }}>
              Whether you have a project idea, want to collaborate, or just want to chat about software and data systems — I'm always open to a good conversation.
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              {contacts.map(c => (
                <a key={c.label} href={c.href} target="_blank" rel="noreferrer" style={{ textDecoration: "none", display: "flex", alignItems: "center", gap: 14 }}>
                  <div style={{
                    width: 44, height: 44, borderRadius: 14,
                    background: dark ? "rgba(99,102,241,0.15)" : "rgba(99,102,241,0.1)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: 20, flexShrink: 0,
                  }}>{c.icon}</div>
                  <div>
                    <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 12, color: dark ? "#475569" : "#94a3b8", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.06em" }}>{c.label}</div>
                    <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 14, color: dark ? "#a5b4fc" : "#4f46e5", fontWeight: 500 }}>{c.value}</div>
                  </div>
                </a>
              ))}
            </div>
          </div>
        </Reveal>

        {/* Right: form */}
        <Reveal delay={0.15}>
          {sent ? (
            <div style={{
              background: dark ? "rgba(30,41,59,0.7)" : "#fff",
              border: `1px solid ${dark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.07)"}`,
              borderRadius: 22, padding: "3rem",
              textAlign: "center",
            }}>
              <div style={{ fontSize: 48, marginBottom: 16 }}>🎉</div>
              <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: 22, color: dark ? "#f1f5f9" : "#1e293b", margin: "0 0 12px" }}>Message Sent!</h3>
              <p style={{ fontFamily: "'DM Sans', sans-serif", color: dark ? "#64748b" : "#64748b", margin: 0 }}>Thanks for reaching out. I'll get back to you soon.</p>
            </div>
          ) : (
            <div style={{
              background: dark ? "rgba(15,23,42,0.8)" : "#fff",
              border: `1px solid ${dark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.07)"}`,
              borderRadius: 22, padding: "2rem",
              boxShadow: dark ? "none" : "0 2px 16px rgba(0,0,0,0.06)",
            }}>
              {["name", "email"].map(field => (
                <div key={field} style={{ marginBottom: 20 }}>
                  <label style={{ display: "block", fontFamily: "'DM Sans', sans-serif", fontSize: 13, fontWeight: 600, color: dark ? "#64748b" : "#64748b", marginBottom: 8, textTransform: "capitalize" }}>{field}</label>
                  <input
                    type={field === "email" ? "email" : "text"}
                    placeholder={field === "name" ? "Your name" : "your@email.com"}
                    value={formData[field]}
                    onChange={e => setFormData(f => ({ ...f, [field]: e.target.value }))}
                    style={{
                      width: "100%", padding: "12px 16px", borderRadius: 12,
                      background: dark ? "rgba(30,41,59,0.6)" : "rgba(248,250,252,1)",
                      border: `1.5px solid ${dark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.09)"}`,
                      color: dark ? "#e2e8f0" : "#1e293b",
                      fontFamily: "'DM Sans', sans-serif", fontSize: 14,
                      outline: "none", boxSizing: "border-box",
                    }}
                    disabled={isSending}
                  />
                </div>
              ))}
              <div style={{ marginBottom: 24 }}>
                <label style={{ display: "block", fontFamily: "'DM Sans', sans-serif", fontSize: 13, fontWeight: 600, color: dark ? "#64748b" : "#64748b", marginBottom: 8 }}>Message</label>
                <textarea
                  placeholder="What's on your mind?"
                  rows={4}
                  value={formData.message}
                  onChange={e => setFormData(f => ({ ...f, message: e.target.value }))}
                  style={{
                    width: "100%", padding: "12px 16px", borderRadius: 12,
                    background: dark ? "rgba(30,41,59,0.6)" : "rgba(248,250,252,1)",
                    border: `1.5px solid ${dark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.09)"}`,
                    color: dark ? "#e2e8f0" : "#1e293b",
                    fontFamily: "'DM Sans', sans-serif", fontSize: 14,
                    outline: "none", resize: "vertical", boxSizing: "border-box",
                  }}
                  disabled={isSending}
                />
              </div>
              {submitError && (
                <p style={{
                  margin: "0 0 16px",
                  fontFamily: "'DM Sans', sans-serif",
                  fontSize: 13,
                  color: "#ef4444",
                }}>
                  {submitError}
                </p>
              )}
              <PrimaryBtn onClick={handleSubmit} dark={dark} disabled={isSending}>
                {isSending ? "Sending..." : "Send Message"}
              </PrimaryBtn>
            </div>
          )}
        </Reveal>
      </div>
    </Section>
  );
}

// ─── Footer ───────────────────────────────────────────────────────────────────
function Footer({ dark }) {
  return (
    <footer style={{
      borderTop: `1px solid ${dark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.07)"}`,
      padding: "2rem",
      background: dark ? "rgba(5,8,16,0.9)" : "rgba(248,250,252,0.9)",
    }}>
      <div style={{ maxWidth: 1100, margin: "0 auto", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 16 }}>
        <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 14, color: dark ? "#475569" : "#94a3b8" }}>
          © 2025 <strong style={{ color: dark ? "#6366f1" : "#4f46e5" }}>Bidusha Thapa</strong>. All rights reserved.
        </div>
        <div style={{ display: "flex", gap: 12 }}>
          {[
            { label: "GitHub", href: "https://github.com", icon: "🐙" },
            { label: "LinkedIn", href: "https://linkedin.com", icon: "💼" },
            { label: "Email", href: "mailto:bidusha@example.com", icon: "✉️" },
          ].map(s => (
            <a key={s.label} href={s.href} target="_blank" rel="noreferrer" title={s.label} style={{
              width: 36, height: 36, borderRadius: 10,
              background: dark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.05)",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 17, textDecoration: "none", transition: "background 0.2s",
            }}>{s.icon}</a>
          ))}
        </div>
      </div>
    </footer>
  );
}

// ─── Shared Helpers ────────────────────────────────────────────────────────────
function Section({ id, children, dark, alt }) {
  return (
    <section id={id} style={{
      padding: "84px 2rem",
      background: alt
        ? dark ? "rgba(5,8,20,0.5)" : "rgba(248,250,252,0.85)"
        : "transparent",
    }}>
      <div style={{ maxWidth: 1100, margin: "0 auto" }}>
        {children}
      </div>
    </section>
  );
}

function SectionHeader({ label, title, dark }) {
  return (
    <Reveal>
      <div style={{ textAlign: "center" }}>
        <span style={{
          fontFamily: "'DM Sans', sans-serif", fontSize: 12, fontWeight: 700,
          color: "#6366f1", letterSpacing: "0.12em", textTransform: "uppercase",
          display: "block", marginBottom: 14,
        }}>{label}</span>
        <h2 style={{
          fontFamily: "'Playfair Display', serif",
          fontSize: "clamp(1.8rem, 4vw, 2.8rem)",
          fontWeight: 800,
          color: dark ? "#f1f5f9" : "#0f172a",
          margin: 0,
          letterSpacing: "-0.03em",
          lineHeight: 1.2,
        }}>{title}</h2>
        <div style={{ width: 50, height: 4, background: "linear-gradient(90deg, #4f46e5, #818cf8)", borderRadius: 4, margin: "16px auto 0" }} />
      </div>
    </Reveal>
  );
}

// ─── Loading Splash ────────────────────────────────────────────────────────────
function Loader({ done }) {
  return (
    <div style={{
      position: "fixed", inset: 0, zIndex: 9999,
      background: "#050810",
      display: "flex", alignItems: "center", justifyContent: "center",
      flexDirection: "column", gap: 16,
      opacity: done ? 0 : 1, pointerEvents: done ? "none" : "all",
      transition: "opacity 0.5s ease 0.1s",
    }}>
      <div style={{
        width: 60, height: 60, borderRadius: 20,
        background: "linear-gradient(135deg, #4f46e5, #818cf8)",
        display: "flex", alignItems: "center", justifyContent: "center",
        fontFamily: "'Playfair Display', serif", color: "#fff", fontWeight: 800, fontSize: 28,
        animation: "pulse 1s ease-in-out infinite",
      }}>B</div>
      <div style={{ width: 120, height: 3, background: "rgba(255,255,255,0.1)", borderRadius: 10, overflow: "hidden" }}>
        <div style={{ height: "100%", background: "linear-gradient(90deg, #4f46e5, #818cf8)", borderRadius: 10, animation: "loadBar 1.2s ease forwards" }} />
      </div>
    </div>
  );
}

// ─── Main App ─────────────────────────────────────────────────────────────────
export default function App() {
  const [dark, setDark] = useState(true);
  const [activeSection, setActiveSection] = useState("home");
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setLoaded(true), 1400);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach(e => { if (e.isIntersecting) setActiveSection(e.target.id); });
      },
      { threshold: 0.4 }
    );
    SECTIONS.forEach(s => {
      const el = document.getElementById(s);
      if (el) obs.observe(el);
    });
    return () => obs.disconnect();
  }, []);

  const scrollTo = (id) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  const bg = dark
    ? "linear-gradient(160deg, #050810 0%, #080d1a 50%, #060912 100%)"
    : "linear-gradient(160deg, #f8fafc 0%, #f0f4ff 50%, #f8fafc 100%)";

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700;800&family=DM+Sans:wght@300;400;500;600;700&display=swap');
        * { box-sizing: border-box; }
        html { scroll-behavior: smooth; }
        body { margin: 0; background: ${dark ? "#050810" : "#f8fafc"}; }
        ::-webkit-scrollbar { width: 6px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: #6366f155; border-radius: 4px; }
        @keyframes fadeIn { from { opacity: 0 } to { opacity: 1 } }
        @keyframes slideUp { from { opacity: 0; transform: translateY(24px) } to { opacity: 1; transform: translateY(0) } }
        @keyframes float1 { 0%,100% { transform: translateY(0) } 50% { transform: translateY(-24px) } }
        @keyframes float2 { 0%,100% { transform: translateY(0) } 50% { transform: translateY(20px) } }
        @keyframes scrollDot { 0%,100% { transform: translateY(0); opacity: 1 } 50% { transform: translateY(10px); opacity: 0 } }
        @keyframes pulse { 0%,100% { transform: scale(1) } 50% { transform: scale(1.08) } }
        @keyframes loadBar { from { width: 0 } to { width: 100% } }
        @keyframes blink { 50% { opacity: 0 } }
        .desktop-nav { display: flex !important; }
        .mobile-nav { display: none !important; }
        @media (max-width: 700px) {
          .desktop-nav { display: none !important; }
          .mobile-nav { display: flex !important; }
        }
      `}</style>

      <Loader done={loaded} />

      <div style={{ background: bg, minHeight: "100vh", transition: "background 0.4s" }}>
        <Navbar active={activeSection} scrollTo={scrollTo} dark={dark} setDark={setDark} />
        <Hero dark={dark} scrollTo={scrollTo} />
        <About dark={dark} />
        <Skills dark={dark} />
        <Projects dark={dark} />
        <Journey dark={dark} />
        <Contact dark={dark} />
        <Footer dark={dark} />
        <SectionArrows current={activeSection} scrollTo={scrollTo} />
      </div>
    </>
  );
}