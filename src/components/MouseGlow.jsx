import React, { useEffect, useRef } from "react";

const MouseGlow = () => {
  const glowRef = useRef(null);

  useEffect(() => {
    const glow = glowRef.current;
    let timeout;

    const handleMove = (e) => {
      if (!glow) return;

      // Responsive size
      const screenWidth = window.innerWidth;
      const size =
        screenWidth < 500 ? 80 : screenWidth < 1024 ? 120 : 180; // adapt size
      const offset = size / 2;

      // Update position + visible opacity
      glow.style.width = `${size}px`;
      glow.style.height = `${size}px`;
      glow.style.transform = `translate(${e.clientX - offset}px, ${e.clientY - offset}px) scale(1)`;
      glow.style.opacity = "0.6";

      // Dim when idle
      clearTimeout(timeout);
      timeout = setTimeout(() => {
        glow.style.opacity = "0.3";
        glow.style.transform = `translate(${e.clientX - offset}px, ${e.clientY - offset}px) scale(0.95)`;
      }, 800);
    };

    window.addEventListener("mousemove", handleMove);
    return () => {
      window.removeEventListener("mousemove", handleMove);
      clearTimeout(timeout);
    };
  }, []);

  return (
    <div
      ref={glowRef}
      className="pointer-events-none fixed top-0 left-0 rounded-full bg-purple-500/60 blur-2xl transition-all duration-300 ease-out mix-blend-screen"
      style={{
        transform: "translate(-50%, -50%) scale(0.9)",
        opacity: 0,
        zIndex: 0,
      }}
    />
  );
};

export default MouseGlow;
