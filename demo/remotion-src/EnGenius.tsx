import {
  AbsoluteFill,
  Sequence,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
  Easing,
} from "remotion";

// ── Colour palette ──────────────────────────────────────────
const C = {
  bg: "#07101F",
  navy: "#0A1628",
  blue: "#0066CC",
  cyan: "#00C6FF",
  lightCyan: "#7FE3FF",
  white: "#FFFFFF",
  gray: "#8899AA",
  green: "#00E676",
  orange: "#FF6D00",
  red: "#FF1744",
  cardBg: "rgba(0,102,204,0.12)",
  border: "rgba(0,198,255,0.25)",
};

// ── Helpers ─────────────────────────────────────────────────
function fadeIn(frame: number, fps: number, delay = 0, dur = 0.6) {
  return interpolate(frame, [delay * fps, (delay + dur) * fps], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.quad),
  });
}

function slideUp(frame: number, fps: number, delay = 0, distance = 40) {
  const p = spring({ frame: frame - delay * fps, fps, config: { damping: 200 } });
  return interpolate(p, [0, 1], [distance, 0]);
}

// ── Shared bg ────────────────────────────────────────────────
const Background: React.FC<{ accent?: boolean }> = ({ accent }) => (
  <AbsoluteFill
    style={{
      background: accent
        ? `radial-gradient(ellipse at 50% 40%, rgba(0,102,204,0.35) 0%, ${C.bg} 65%)`
        : C.bg,
    }}
  />
);

// ── Grid lines overlay ───────────────────────────────────────
const Grid: React.FC = () => (
  <AbsoluteFill style={{ opacity: 0.06 }}>
    <svg width="100%" height="100%">
      <defs>
        <pattern id="grid" width="60" height="60" patternUnits="userSpaceOnUse">
          <path d="M 60 0 L 0 0 0 60" fill="none" stroke={C.cyan} strokeWidth="0.8" />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#grid)" />
    </svg>
  </AbsoluteFill>
);

// ════════════════════════════════════════════════════════════
// Scene 1 – Brand Intro (0–6 s)
// ════════════════════════════════════════════════════════════
const SceneIntro: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const logoScale = spring({ frame, fps, config: { damping: 14, stiffness: 120 } });
  const logoOpacity = fadeIn(frame, fps, 0, 0.4);

  const glowPulse = interpolate(
    Math.sin((frame / fps) * Math.PI * 1.8),
    [-1, 1],
    [0.5, 1.0],
  );

  const tagOpacity = fadeIn(frame, fps, 0.7, 0.8);
  const tagY = slideUp(frame, fps, 0.7);
  const subOpacity = fadeIn(frame, fps, 1.4, 0.8);

  return (
    <AbsoluteFill style={{ alignItems: "center", justifyContent: "center" }}>
      <Background accent />
      <Grid />

      {/* Outer glow ring */}
      <div
        style={{
          position: "absolute",
          width: 260,
          height: 260,
          borderRadius: "50%",
          background: `radial-gradient(circle, rgba(0,198,255,${0.18 * glowPulse}) 0%, transparent 70%)`,
          opacity: logoOpacity,
          transform: `scale(${logoScale})`,
        }}
      />

      {/* Shield icon */}
      <div style={{ opacity: logoOpacity, transform: `scale(${logoScale})` }}>
        <svg width="120" height="140" viewBox="0 0 120 140">
          <defs>
            <linearGradient id="sg" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={C.cyan} />
              <stop offset="100%" stopColor={C.blue} />
            </linearGradient>
          </defs>
          <path
            d="M60 8 L108 28 L108 72 C108 100 84 122 60 132 C36 122 12 100 12 72 L12 28 Z"
            fill="none"
            stroke="url(#sg)"
            strokeWidth="3"
          />
          <path
            d="M60 8 L108 28 L108 72 C108 100 84 122 60 132 C36 122 12 100 12 72 L12 28 Z"
            fill="rgba(0,102,204,0.15)"
          />
          {/* AI spark inside shield */}
          <circle cx="60" cy="72" r="22" fill="none" stroke={C.cyan} strokeWidth="1.5" opacity="0.6" />
          <text x="60" y="80" textAnchor="middle" fill={C.cyan} fontSize="26" fontWeight="bold">AI</text>
        </svg>
      </div>

      {/* Brand name */}
      <div
        style={{
          marginTop: 24,
          opacity: tagOpacity,
          transform: `translateY(${tagY}px)`,
          textAlign: "center",
        }}
      >
        <div
          style={{
            fontSize: 52,
            fontWeight: 800,
            fontFamily: "sans-serif",
            letterSpacing: 3,
            color: C.white,
          }}
        >
          En
          <span style={{ color: C.cyan }}>Genius</span>
        </div>
      </div>

      {/* Tagline */}
      <div
        style={{
          marginTop: 14,
          opacity: subOpacity,
          textAlign: "center",
          fontSize: 22,
          fontFamily: "sans-serif",
          color: C.lightCyan,
          letterSpacing: 6,
          fontWeight: 300,
        }}
      >
        AI CLOUD SURVEILLANCE
      </div>

      {/* Divider line */}
      <div
        style={{
          marginTop: 28,
          width: interpolate(frame, [1.6 * fps, 2.6 * fps], [0, 300], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          }),
          height: 1.5,
          background: `linear-gradient(90deg, transparent, ${C.cyan}, transparent)`,
        }}
      />
    </AbsoluteFill>
  );
};

// ════════════════════════════════════════════════════════════
// Scene 2 – AI Detection (6–12 s)
// ════════════════════════════════════════════════════════════
const DetectionBox: React.FC<{
  x: number; y: number; w: number; h: number;
  label: string; color: string; delay: number;
}> = ({ x, y, w, h, label, color, delay }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const opacity = fadeIn(frame, fps, delay, 0.4);
  const scale = spring({ frame: frame - delay * fps, fps, config: { damping: 18, stiffness: 150 } });

  return (
    <g style={{ opacity }} transform={`translate(${x},${y}) scale(${scale})`} transform-origin="center">
      <rect
        x={-w / 2} y={-h / 2} width={w} height={h}
        fill="none" stroke={color} strokeWidth="2"
        strokeDasharray="8 4"
      />
      {/* Corner accents */}
      {[[-w / 2, -h / 2], [w / 2, -h / 2], [-w / 2, h / 2], [w / 2, h / 2]].map(([cx, cy], i) => (
        <g key={i}>
          <line x1={cx} y1={cy} x2={cx + (cx < 0 ? 12 : -12)} y2={cy} stroke={color} strokeWidth="3" />
          <line x1={cx} y1={cy} x2={cx} y2={cy + (cy < 0 ? 12 : -12)} stroke={color} strokeWidth="3" />
        </g>
      ))}
      <rect x={-w / 2} y={-h / 2 - 20} width={label.length * 9 + 12} height={20} fill={color} rx={3} />
      <text x={-w / 2 + 6} y={-h / 2 - 5} fill="white" fontSize="12" fontFamily="monospace" fontWeight="bold">
        {label}
      </text>
    </g>
  );
};

const ScanLine: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const y = interpolate((frame * 2) % (fps * 2), [0, fps * 2], [0, 360]);
  return (
    <line x1="0" y1={y} x2="640" y2={y} stroke={C.cyan} strokeWidth="1.5" opacity="0.5" />
  );
};

const SceneDetection: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const titleOpacity = fadeIn(frame, fps, 0.2, 0.6);
  const titleY = slideUp(frame, fps, 0.2);
  const camOpacity = fadeIn(frame, fps, 0.4, 0.6);

  const confidenceVal = interpolate(frame, [1 * fps, 2.5 * fps], [0, 98.7], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill>
      <Background />
      <Grid />

      {/* Title */}
      <div style={{ position: "absolute", top: 60, left: 0, right: 0, textAlign: "center", opacity: titleOpacity, transform: `translateY(${titleY}px)` }}>
        <div style={{ color: C.cyan, fontSize: 14, letterSpacing: 5, fontFamily: "sans-serif", marginBottom: 8 }}>SCENE 2 OF 5</div>
        <div style={{ color: C.white, fontSize: 42, fontWeight: 700, fontFamily: "sans-serif" }}>AI-Powered Detection</div>
      </div>

      {/* Camera feed mockup */}
      <div
        style={{
          position: "absolute",
          top: 160, left: 220, width: 640, height: 360,
          borderRadius: 8,
          border: `1.5px solid ${C.border}`,
          background: "rgba(0,10,30,0.85)",
          overflow: "hidden",
          opacity: camOpacity,
        }}
      >
        <svg width="640" height="360">
          {/* Camera feed lines – simulated scene */}
          <rect width="640" height="360" fill="#040C1A" />
          {/* Ground */}
          <rect x="0" y="260" width="640" height="100" fill="#071220" />
          {/* Buildings */}
          <rect x="50" y="140" width="90" height="120" fill="#0A1830" stroke="#0D2040" strokeWidth="1" />
          <rect x="160" y="100" width="70" height="160" fill="#0A1830" stroke="#0D2040" strokeWidth="1" />
          <rect x="480" y="160" width="100" height="100" fill="#0A1830" stroke="#0D2040" strokeWidth="1" />
          {/* Person silhouettes */}
          <ellipse cx="310" cy="210" rx="14" ry="40" fill="#0E1F38" />
          <circle cx="310" cy="168" r="12" fill="#0E1F38" />
          <ellipse cx="430" cy="220" rx="12" ry="35" fill="#0E1F38" />
          <circle cx="430" cy="183" r="10" fill="#0E1F38" />
          <ellipse cx="500" cy="230" rx="10" ry="28" fill="#0E1F38" />
          <circle cx="500" cy="200" r="9" fill="#0E1F38" />

          <ScanLine />

          <DetectionBox x={310} y={200} w={64} h={90} label="PERSON 98.7%" color={C.green} delay={0.6} />
          <DetectionBox x={430} y={213} w={56} h={80} label="PERSON 95.1%" color={C.green} delay={1.0} />
          <DetectionBox x={500} y={222} w={48} h={68} label="PERSON 91.4%" color={C.orange} delay={1.5} />

          {/* Timestamp overlay */}
          <text x="10" y="20" fill={C.cyan} fontSize="11" fontFamily="monospace">CAM-04 ● REC</text>
          <text x="530" y="20" fill={C.gray} fontSize="11" fontFamily="monospace">2026-03-20</text>
          <text x="10" y="350" fill={C.gray} fontSize="10" fontFamily="monospace">AI ENGINE v3.2 ● FPS:30 ● LATENCY:12ms</text>
        </svg>
      </div>

      {/* Confidence badge */}
      <div
        style={{
          position: "absolute",
          bottom: 80, right: 220,
          background: C.cardBg,
          border: `1px solid ${C.border}`,
          borderRadius: 12,
          padding: "14px 24px",
          opacity: interpolate(frame, [1.8 * fps, 2.4 * fps], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
        }}
      >
        <div style={{ color: C.gray, fontSize: 12, fontFamily: "sans-serif", letterSpacing: 2, marginBottom: 4 }}>CONFIDENCE</div>
        <div style={{ color: C.green, fontSize: 36, fontWeight: 800, fontFamily: "monospace" }}>{confidenceVal.toFixed(1)}%</div>
      </div>
    </AbsoluteFill>
  );
};

// ════════════════════════════════════════════════════════════
// Scene 3 – Cloud Management (12–18 s)
// ════════════════════════════════════════════════════════════
const CloudNode: React.FC<{ x: number; y: number; label: string; icon: string; delay: number }> = ({ x, y, label, icon, delay }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const sc = spring({ frame: frame - delay * fps, fps, config: { damping: 18, stiffness: 130 } });
  const op = fadeIn(frame, fps, delay, 0.5);
  return (
    <g opacity={op} transform={`translate(${x},${y}) scale(${sc})`} style={{ transformOrigin: `${x}px ${y}px` }}>
      <circle r="36" fill={C.cardBg} stroke={C.border} strokeWidth="1.5" />
      <text textAnchor="middle" y={-8} fontSize="22">{icon}</text>
      <text textAnchor="middle" y={12} fill={C.lightCyan} fontSize="11" fontFamily="sans-serif">{label}</text>
    </g>
  );
};

const DataParticle: React.FC<{ startX: number; startY: number; endX: number; endY: number; delay: number; color: string }> = ({ startX, startY, endX, endY, delay, color }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = interpolate(frame, [delay * fps, (delay + 1.2) * fps], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const x = interpolate(t, [0, 1], [startX, endX], { easing: Easing.inOut(Easing.quad) });
  const y = interpolate(t, [0, 1], [startY, endY], { easing: Easing.inOut(Easing.quad) });
  const op = t < 0.1 ? t * 10 : t > 0.9 ? (1 - t) * 10 : 1;
  return <circle cx={x} cy={y} r="4" fill={color} opacity={op} />;
};

const SceneCloud: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const titleOpacity = fadeIn(frame, fps, 0.2, 0.6);
  const titleY = slideUp(frame, fps, 0.2);
  const cloudOpacity = fadeIn(frame, fps, 0.5, 0.8);

  const cx = 640, cy = 300;

  const nodes = [
    { x: cx, y: cy - 140, label: "Cloud", icon: "☁️", delay: 0.4 },
    { x: cx - 220, y: cy - 30, label: "Office A", icon: "🏢", delay: 0.8 },
    { x: cx + 220, y: cy - 30, label: "Office B", icon: "🏢", delay: 1.0 },
    { x: cx - 120, y: cy + 130, label: "Mobile", icon: "📱", delay: 1.2 },
    { x: cx + 120, y: cy + 130, label: "Camera", icon: "📷", delay: 1.4 },
  ];

  const lineOpacity = fadeIn(frame, fps, 1.0, 0.5);

  return (
    <AbsoluteFill>
      <Background />
      <Grid />

      {/* Title */}
      <div style={{ position: "absolute", top: 60, left: 0, right: 0, textAlign: "center", opacity: titleOpacity, transform: `translateY(${titleY}px)` }}>
        <div style={{ color: C.cyan, fontSize: 14, letterSpacing: 5, fontFamily: "sans-serif", marginBottom: 8 }}>SCENE 3 OF 5</div>
        <div style={{ color: C.white, fontSize: 42, fontWeight: 700, fontFamily: "sans-serif" }}>Cloud-Based Management</div>
      </div>

      {/* Network diagram */}
      <div style={{ position: "absolute", inset: 0, opacity: cloudOpacity }}>
        <svg width="1280" height="720">
          {/* Lines from cloud to nodes */}
          <g opacity={lineOpacity}>
            {nodes.slice(1).map((n, i) => (
              <line key={i} x1={cx} y1={cy - 140} x2={n.x} y2={n.y}
                stroke={C.border} strokeWidth="1.5" strokeDasharray="6 4" />
            ))}
          </g>
          {/* Particles */}
          {[0.4, 0.9, 1.4, 1.9, 2.4, 2.9, 3.4, 3.9].map((d, i) => (
            <DataParticle key={i}
              startX={nodes[(i % 4) + 1].x} startY={nodes[(i % 4) + 1].y}
              endX={cx} endY={cy - 140}
              delay={d} color={i % 2 === 0 ? C.cyan : C.lightCyan}
            />
          ))}
          {nodes.map((n, i) => (
            <CloudNode key={i} {...n} />
          ))}
        </svg>
      </div>

      {/* Stats bar */}
      <div style={{
        position: "absolute", bottom: 60, left: 0, right: 0,
        display: "flex", justifyContent: "center", gap: 48,
        opacity: fadeIn(frame, fps, 2.0, 0.8),
      }}>
        {[
          { value: "99.9%", label: "Uptime" },
          { value: "256-bit", label: "Encryption" },
          { value: "∞", label: "Scalability" },
        ].map((s, i) => (
          <div key={i} style={{ textAlign: "center", background: C.cardBg, border: `1px solid ${C.border}`, borderRadius: 10, padding: "14px 28px" }}>
            <div style={{ color: C.cyan, fontSize: 28, fontWeight: 800, fontFamily: "monospace" }}>{s.value}</div>
            <div style={{ color: C.gray, fontSize: 13, fontFamily: "sans-serif", marginTop: 4 }}>{s.label}</div>
          </div>
        ))}
      </div>
    </AbsoluteFill>
  );
};

// ════════════════════════════════════════════════════════════
// Scene 4 – Smart Alerts (18–24 s)
// ════════════════════════════════════════════════════════════
const AlertCard: React.FC<{ icon: string; title: string; desc: string; color: string; delay: number; top: number }> = ({ icon, title, desc, color, delay, top }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const op = fadeIn(frame, fps, delay, 0.5);
  const sc = spring({ frame: frame - delay * fps, fps, config: { damping: 18, stiffness: 140 } });
  const x = interpolate(sc, [0, 1], [80, 0]);

  return (
    <div style={{
      position: "absolute",
      top,
      left: 640,
      width: 420,
      opacity: op,
      transform: `translateX(${x}px)`,
      background: "rgba(7,16,31,0.9)",
      border: `1.5px solid ${color}44`,
      borderLeft: `4px solid ${color}`,
      borderRadius: 10,
      padding: "16px 20px",
      display: "flex",
      alignItems: "center",
      gap: 16,
    }}>
      <div style={{ fontSize: 30 }}>{icon}</div>
      <div>
        <div style={{ color, fontSize: 14, fontWeight: 700, fontFamily: "sans-serif", letterSpacing: 1 }}>{title}</div>
        <div style={{ color: C.gray, fontSize: 12, fontFamily: "sans-serif", marginTop: 4 }}>{desc}</div>
      </div>
      <div style={{ marginLeft: "auto", color, fontSize: 11, fontFamily: "monospace" }}>NOW</div>
    </div>
  );
};

const SceneAlerts: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const titleOpacity = fadeIn(frame, fps, 0.2, 0.6);
  const titleY = slideUp(frame, fps, 0.2);
  const mapOpacity = fadeIn(frame, fps, 0.5, 0.8);

  const pingScale = interpolate((frame * 1.5) % fps, [0, fps * 0.5, fps], [1, 2.5, 1]);
  const pingOpacity = interpolate((frame * 1.5) % fps, [0, fps * 0.5, fps], [0.8, 0, 0.8]);

  return (
    <AbsoluteFill>
      <Background />
      <Grid />

      {/* Title */}
      <div style={{ position: "absolute", top: 60, left: 0, right: 0, textAlign: "center", opacity: titleOpacity, transform: `translateY(${titleY}px)` }}>
        <div style={{ color: C.cyan, fontSize: 14, letterSpacing: 5, fontFamily: "sans-serif", marginBottom: 8 }}>SCENE 4 OF 5</div>
        <div style={{ color: C.white, fontSize: 42, fontWeight: 700, fontFamily: "sans-serif" }}>Real-Time Smart Alerts</div>
      </div>

      {/* Map mockup (left) */}
      <div style={{
        position: "absolute",
        top: 160, left: 80, width: 500, height: 360,
        borderRadius: 12,
        border: `1.5px solid ${C.border}`,
        background: "#040C1A",
        overflow: "hidden",
        opacity: mapOpacity,
      }}>
        <svg width="500" height="360">
          {/* Simulated building floor plan */}
          <rect width="500" height="360" fill="#050D1C" />
          <rect x="30" y="30" width="200" height="140" fill="none" stroke="#0D2040" strokeWidth="2" />
          <rect x="250" y="30" width="220" height="140" fill="none" stroke="#0D2040" strokeWidth="2" />
          <rect x="30" y="200" width="440" height="130" fill="none" stroke="#0D2040" strokeWidth="2" />
          {/* Rooms labels */}
          <text x="100" y="110" fill="#1A3A60" fontSize="14" fontFamily="sans-serif" textAnchor="middle">Lobby</text>
          <text x="360" y="110" fill="#1A3A60" fontSize="14" fontFamily="sans-serif" textAnchor="middle">Office A</text>
          <text x="230" y="275" fill="#1A3A60" fontSize="14" fontFamily="sans-serif" textAnchor="middle">Main Hall</text>

          {/* Camera icons */}
          <text x="50" y="55" fill={C.cyan} fontSize="14">📷</text>
          <text x="255" y="55" fill={C.cyan} fontSize="14">📷</text>
          <text x="440" y="55" fill={C.cyan} fontSize="14">📷</text>
          <text x="50" y="215" fill={C.cyan} fontSize="14">📷</text>
          <text x="440" y="215" fill={C.cyan} fontSize="14">📷</text>

          {/* Alert ping */}
          <circle cx="360" cy="110" r={14 * pingScale} fill="none" stroke={C.red} strokeWidth="2" opacity={pingOpacity} />
          <circle cx="360" cy="110" r="8" fill={C.red} opacity="0.9" />
          <text x="360" y="145" fill={C.red} fontSize="10" textAnchor="middle" fontFamily="sans-serif">ALERT</text>
        </svg>
      </div>

      {/* Alert cards (right) */}
      <AlertCard icon="🚨" title="INTRUSION DETECTED" desc="Office A · Camera 3 · Unauthorised person" color={C.red} delay={0.6} top={160} />
      <AlertCard icon="🔥" title="SMOKE DETECTED" desc="Server Room · Camera 7 · Smoke sensor triggered" color={C.orange} delay={1.0} top={260} />
      <AlertCard icon="✅" title="PERIMETER CLEAR" desc="Main Entrance · All cameras normal" color={C.green} delay={1.4} top={360} />
      <AlertCard icon="📊" title="DAILY REPORT READY" desc="23 events logged · 0 false positives" color={C.cyan} delay={1.8} top={460} />
    </AbsoluteFill>
  );
};

// ════════════════════════════════════════════════════════════
// Scene 5 – CTA (24–30 s)
// ════════════════════════════════════════════════════════════
const SceneCTA: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const titleOpacity = fadeIn(frame, fps, 0.3, 0.8);
  const titleY = slideUp(frame, fps, 0.3, 50);
  const subOpacity = fadeIn(frame, fps, 1.0, 0.8);
  const pillsOpacity = fadeIn(frame, fps, 1.6, 0.8);
  const ctaOpacity = fadeIn(frame, fps, 2.2, 0.8);
  const ctaScale = spring({ frame: frame - 2.2 * fps, fps, config: { damping: 14, stiffness: 130 } });

  const glowPulse = interpolate(Math.sin((frame / fps) * Math.PI * 1.5), [-1, 1], [0.6, 1.0]);
  const lineW = interpolate(frame, [0.8 * fps, 2.0 * fps], [0, 500], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.quad),
  });

  const features = ["AI Detection", "Cloud Management", "Smart Alerts", "Multi-Site", "Mobile App", "24/7 Support"];

  return (
    <AbsoluteFill style={{ alignItems: "center", justifyContent: "center" }}>
      <Background accent />
      <Grid />

      {/* Ambient glow */}
      <div style={{
        position: "absolute",
        width: 600, height: 600,
        borderRadius: "50%",
        background: `radial-gradient(circle, rgba(0,198,255,${0.12 * glowPulse}) 0%, transparent 70%)`,
      }} />

      {/* Brand */}
      <div style={{ opacity: titleOpacity, transform: `translateY(${titleY}px)`, textAlign: "center" }}>
        <div style={{ fontSize: 64, fontWeight: 900, fontFamily: "sans-serif", letterSpacing: 2, color: C.white, lineHeight: 1.1 }}>
          En<span style={{ color: C.cyan }}>Genius</span>
        </div>
        <div style={{ fontSize: 28, fontWeight: 300, fontFamily: "sans-serif", letterSpacing: 8, color: C.lightCyan, marginTop: 8 }}>
          AI CLOUD SURVEILLANCE
        </div>
      </div>

      {/* Line */}
      <div style={{ width: lineW, height: 1.5, background: `linear-gradient(90deg, transparent, ${C.cyan}, transparent)`, margin: "28px 0" }} />

      {/* Tagline */}
      <div style={{ opacity: subOpacity, textAlign: "center", fontSize: 22, fontFamily: "sans-serif", color: C.gray, maxWidth: 600, lineHeight: 1.6 }}>
        See everything. Know instantly.<br />
        <span style={{ color: C.white }}>Protect what matters most.</span>
      </div>

      {/* Feature pills */}
      <div style={{
        opacity: pillsOpacity,
        display: "flex",
        flexWrap: "wrap",
        justifyContent: "center",
        gap: 12,
        marginTop: 32,
        maxWidth: 680,
      }}>
        {features.map((f, i) => (
          <div key={i} style={{
            background: C.cardBg,
            border: `1px solid ${C.border}`,
            borderRadius: 20,
            padding: "8px 20px",
            color: C.lightCyan,
            fontSize: 14,
            fontFamily: "sans-serif",
          }}>
            ✦ {f}
          </div>
        ))}
      </div>

      {/* CTA button */}
      <div style={{
        opacity: ctaOpacity,
        transform: `scale(${ctaScale})`,
        marginTop: 40,
        background: `linear-gradient(135deg, ${C.blue}, ${C.cyan})`,
        borderRadius: 40,
        padding: "18px 56px",
        fontSize: 20,
        fontWeight: 700,
        fontFamily: "sans-serif",
        letterSpacing: 2,
        color: C.white,
        boxShadow: `0 0 40px rgba(0,198,255,${0.4 * glowPulse})`,
      }}>
        LEARN MORE AT ENGENIUS.AI
      </div>
    </AbsoluteFill>
  );
};

// ════════════════════════════════════════════════════════════
// Root composition – 30 s @ 30 fps = 900 frames
// ════════════════════════════════════════════════════════════
export const EnGeniusAd: React.FC = () => {
  const { fps } = useVideoConfig();
  const sceneDur = 6 * fps; // 180 frames per scene

  return (
    <AbsoluteFill>
      <Sequence from={0} durationInFrames={sceneDur} premountFor={fps}>
        <SceneIntro />
      </Sequence>
      <Sequence from={sceneDur} durationInFrames={sceneDur} premountFor={fps}>
        <SceneDetection />
      </Sequence>
      <Sequence from={2 * sceneDur} durationInFrames={sceneDur} premountFor={fps}>
        <SceneCloud />
      </Sequence>
      <Sequence from={3 * sceneDur} durationInFrames={sceneDur} premountFor={fps}>
        <SceneAlerts />
      </Sequence>
      <Sequence from={4 * sceneDur} durationInFrames={sceneDur} premountFor={fps}>
        <SceneCTA />
      </Sequence>
    </AbsoluteFill>
  );
};
