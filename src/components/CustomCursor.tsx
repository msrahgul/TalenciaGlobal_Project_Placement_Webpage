import { useEffect, useRef, useState } from "react";

export function CustomCursor() {
  const [dotPosition, setDotPosition] = useState({ x: 0, y: 0 });
  const [clicked, setClicked] = useState(false);
  const [hovered, setHovered] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  const targetRef = useRef({ x: 0, y: 0 });
  const dotRef = useRef({ x: 0, y: 0 });
  const hasMoved = useRef(false);

  useEffect(() => {
    // Inject global stylesheet to hide default cursor on desktops
    const style = document.createElement("style");
    style.innerHTML = `
      @media (min-width: 1024px) {
        .custom-cursor-active, .custom-cursor-active * {
          cursor: none !important;
        }
      }
    `;
    document.head.appendChild(style);
    document.body.classList.add("custom-cursor-active");

    const updatePosition = (e: MouseEvent) => {
      targetRef.current = { x: e.clientX, y: e.clientY };
      setIsVisible(true);

      if (!hasMoved.current) {
        dotRef.current = { x: e.clientX, y: e.clientY };
        setDotPosition({ x: e.clientX, y: e.clientY });
        hasMoved.current = true;
      }
    };

    let animationFrameId: number;

    const updateCursor = () => {
      if (hasMoved.current) {
        // Inner dot (and concentric circle) follows mouse position with a smooth delay (speed: 0.15)
        const dxDot = targetRef.current.x - dotRef.current.x;
        const dyDot = targetRef.current.y - dotRef.current.y;
        dotRef.current.x += dxDot * 0.15;
        dotRef.current.y += dyDot * 0.15;

        setDotPosition({ x: dotRef.current.x, y: dotRef.current.y });
      }

      animationFrameId = requestAnimationFrame(updateCursor);
    };

    animationFrameId = requestAnimationFrame(updateCursor);

    const handleMouseDown = () => setClicked(true);
    const handleMouseUp = () => setClicked(false);

    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (
        target.tagName === "BUTTON" ||
        target.tagName === "A" ||
        target.closest("button") ||
        target.closest("a") ||
        target.classList.contains("cursor-pointer") ||
        target.closest(".cursor-pointer")
      ) {
        setHovered(true);
      } else {
        setHovered(false);
      }
    };

    const handleMouseLeave = () => {
      setIsVisible(false);
    };

    const handleMouseEnter = () => {
      setIsVisible(true);
    };

    window.addEventListener("mousemove", updatePosition, { passive: true });
    window.addEventListener("mousedown", handleMouseDown, { passive: true });
    window.addEventListener("mouseup", handleMouseUp, { passive: true });
    window.addEventListener("mouseover", handleMouseOver, { passive: true });
    document.addEventListener("mouseleave", handleMouseLeave);
    document.addEventListener("mouseenter", handleMouseEnter);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("mousemove", updatePosition);
      window.removeEventListener("mousedown", handleMouseDown);
      window.removeEventListener("mouseup", handleMouseUp);
      window.removeEventListener("mouseover", handleMouseOver);
      document.removeEventListener("mouseleave", handleMouseLeave);
      document.removeEventListener("mouseenter", handleMouseEnter);
      
      document.head.removeChild(style);
      document.body.classList.remove("custom-cursor-active");
    };
  }, []);

  if (!isVisible) return null;

  return (
    <div className="hidden lg:block pointer-events-none">
      {/* Outer ring tracking - perfectly concentric with inner dot */}
      <div
        className="pointer-events-none fixed z-50 h-9 w-9 -translate-x-1/2 -translate-y-1/2 rounded-full border border-blue-500/40 transition-transform duration-100 ease-out"
        style={{
          left: `${dotPosition.x}px`,
          top: `${dotPosition.y}px`,
          transform: `translate(-50%, -50%) scale(${clicked ? 0.75 : hovered ? 1.5 : 1})`,
          backgroundColor: hovered ? "rgba(59, 130, 246, 0.08)" : "transparent",
          borderColor: hovered ? "rgba(59, 130, 246, 0.6)" : "rgba(59, 130, 246, 0.4)",
          boxShadow: hovered ? "0 0 12px rgba(59, 130, 246, 0.2)" : "none",
        }}
      />
      {/* Inner dot tracking */}
      <div
        className="pointer-events-none fixed z-50 h-2 w-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-blue-400 shadow-[0_0_8px_#60a5fa] transition-transform duration-75 ease-out"
        style={{
          left: `${dotPosition.x}px`,
          top: `${dotPosition.y}px`,
          transform: `translate(-50%, -50%) scale(${clicked ? 0.8 : hovered ? 0.5 : 1})`,
        }}
      />
    </div>
  );
}
