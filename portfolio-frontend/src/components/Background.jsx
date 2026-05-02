// src/components/Background.jsx
// Uses CSS variables set by ThemeContext — auto switches with theme

const Background = () => (
  <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden"
    style={{ background: "var(--bg-main)", transition: "background 0.4s ease" }}>

    {/* Mesh gradient */}
    <div className="absolute inset-0" style={{
      background: `
        radial-gradient(ellipse 80% 60% at 10% 10%,  var(--orb1) 0%, transparent 60%),
        radial-gradient(ellipse 60% 70% at 90% 20%,  var(--orb2) 0%, transparent 55%),
        radial-gradient(ellipse 70% 50% at 50% 90%,  var(--orb3) 0%, transparent 60%)
      `,
      transition: "all 0.6s ease",
    }}/>

    {/* Animated orbs */}
    {[
      { size: 500, color: "var(--orb1)", top:"-100px",  left:"-100px", delay:"0s"  },
      { size: 400, color: "var(--orb2)", top:"30%",     right:"-80px", delay:"-3s" },
      { size: 350, color: "var(--orb3)", bottom:"10%",  left:"20%",    delay:"-5s" },
    ].map((o, i) => (
      <div key={i} className="absolute rounded-full" style={{
        width: o.size, height: o.size,
        background: o.color,
        filter: "blur(80px)",
        top: o.top, left: o.left, right: o.right, bottom: o.bottom,
        animation: `floatOrb 8s ease-in-out infinite`,
        animationDelay: o.delay,
        transition: "background 0.6s ease",
      }}/>
    ))}

    <style>{`
      @keyframes floatOrb {
        0%,100% { transform: translate(0,0) scale(1); }
        33%      { transform: translate(30px,-40px) scale(1.05); }
        66%      { transform: translate(-20px,20px) scale(0.95); }
      }
    `}</style>
  </div>
);

export default Background;