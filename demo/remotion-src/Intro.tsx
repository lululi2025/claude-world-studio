import {
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";

// 逐字打字機效果
const Typewriter = ({ text, startFrame }: { text: string; startFrame: number }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // 每 0.05 秒顯示一個字
  const charsPerSecond = 20;
  const charsVisible = Math.floor(
    interpolate(frame - startFrame, [0, text.length / charsPerSecond * fps], [0, text.length], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    })
  );

  return <span>{text.slice(0, charsVisible)}</span>;
};

export const Intro = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // 標題：Spring 彈入效果
  const titleScale = spring({
    frame,
    fps,
    config: { damping: 12, stiffness: 180 },
  });

  // 副標題：延遲 20 frames 淡入
  const subtitleOpacity = interpolate(frame, [20, 40], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const subtitleY = interpolate(frame, [20, 40], [20, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // 底部卡片：延遲 45 frames 滑入
  const cardScale = spring({
    frame: frame - 45,
    fps,
    config: { damping: 200 },
  });

  // 背景漸層旋轉
  const hue = interpolate(frame, [0, 150], [220, 260], {
    extrapolateRight: "clamp",
  });

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        background: `linear-gradient(135deg, hsl(${hue}, 70%, 15%) 0%, hsl(${hue + 30}, 80%, 8%) 100%)`,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: "system-ui, sans-serif",
        color: "white",
      }}
    >
      {/* 主標題 - Spring 彈入 */}
      <div
        style={{
          transform: `scale(${titleScale})`,
          fontSize: 72,
          fontWeight: 900,
          letterSpacing: -2,
          background: "linear-gradient(90deg, #60a5fa, #a78bfa, #f472b6)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          marginBottom: 16,
        }}
      >
        Remotion
      </div>

      {/* 副標題 - 淡入 + 上滑 */}
      <div
        style={{
          opacity: subtitleOpacity,
          transform: `translateY(${subtitleY}px)`,
          fontSize: 28,
          color: "rgba(255,255,255,0.7)",
          marginBottom: 60,
        }}
      >
        Video creation in React
      </div>

      {/* 打字機效果說明文字 */}
      <div
        style={{
          opacity: subtitleOpacity,
          transform: `translateY(${subtitleY}px)`,
          fontSize: 20,
          color: "rgba(255,255,255,0.5)",
          fontFamily: "monospace",
          marginBottom: 60,
        }}
      >
        {"// "}
        <Typewriter text="All animations driven by useCurrentFrame()" startFrame={25} />
        <span
          style={{
            opacity: Math.floor(frame / 15) % 2 === 0 ? 1 : 0,
          }}
        >
          |
        </span>
      </div>

      {/* 三個特色卡片 - Spring 縮放 */}
      <div
        style={{
          display: "flex",
          gap: 24,
          transform: `scale(${cardScale})`,
        }}
      >
        {[
          { icon: "⚛️", label: "React Components" },
          { icon: "🎬", label: "Frame-Perfect" },
          { icon: "🚀", label: "Render to MP4" },
        ].map(({ icon, label }, i) => {
          const cardEntrance = spring({
            frame: frame - 45 - i * 8,
            fps,
            config: { damping: 15, stiffness: 200 },
          });

          return (
            <div
              key={label}
              style={{
                transform: `scale(${cardEntrance}) translateY(${interpolate(
                  cardEntrance,
                  [0, 1],
                  [30, 0]
                )}px)`,
                background: "rgba(255,255,255,0.08)",
                border: "1px solid rgba(255,255,255,0.15)",
                borderRadius: 16,
                padding: "20px 28px",
                textAlign: "center",
                backdropFilter: "blur(10px)",
              }}
            >
              <div style={{ fontSize: 36, marginBottom: 8 }}>{icon}</div>
              <div style={{ fontSize: 16, color: "rgba(255,255,255,0.8)" }}>{label}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
