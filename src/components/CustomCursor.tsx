import { useEffect, useRef, useState } from "react";

export function CustomCursor() {
  const [positions, setPositions] = useState({
    cursor: { x: 0, y: 0 },
    trailing: { x: 0, y: 0 },
  });
  const [clicked, setClicked] = useState(false);
  const [hovered, setHovered] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  const targetRef = useRef({ x: 0, y: 0 });
  const trailingRef = useRef({ x: 0, y: 0 });
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
        trailingRef.current = { x: e.clientX, y: e.clientY };
        setPositions({
          cursor: targetRef.current,
          trailing: trailingRef.current,
        });
        hasMoved.current = true;
      }
    };

    let animationFrameId: number;

    const updateCursor = () => {
      if (hasMoved.current) {
        // Outer ring follows with smooth lerp — 0.18 = snappy but not instant
        const dx = targetRef.current.x - trailingRef.current.x;
        const dy = targetRef.current.y - trailingRef.current.y;

        trailingRef.current.x += dx * 0.18;
        trailingRef.current.y += dy * 0.18;

        setPositions({
          cursor: { x: targetRef.current.x, y: targetRef.current.y },
          trailing: { x: trailingRef.current.x, y: trailingRef.current.y },
        });
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
        target.tagName === "INPUT" ||
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

    const handleMouseLeave = () => setIsVisible(false);
    const handleMouseEnter = () => setIsVisible(true);

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

  // Scale factors
  const ringScale = clicked ? 0.75 : hovered ? 1.45 : 1;
  const dotScale = hovered || clicked ? 0 : 1;

  return (
    <div className="hidden lg:block pointer-events-none select-none">
      {/*
        Outer trailing ring — hollow circle, mix-blend-mode: difference.
        On dark bg it appears white; on light bg it appears black.
        This gives instant, automatic contrast on any surface.
      */}
      <div
        className="pointer-events-none fixed z-[9999]"
        style={{
          left: `${positions.trailing.x}px`,
          top: `${positions.trailing.y}px`,
          transform: `translate(-50%, -50%) scale(${ringScale})`,
          transition: "transform 0.2s cubic-bezier(0.22, 1, 0.36, 1)",
          mixBlendMode: "difference",
          width: "30px",
          height: "30px",
          borderRadius: "50%",
          border: "1.5px solid white",
          backgroundColor: "transparent",
          willChange: "transform, left, top",
        }}
      />

      {/*
        Inner dot — tracks the precise mouse position instantly.
        Also uses mix-blend-mode: difference for the same inversion effect.
      */}
      <div
        className="pointer-events-none fixed z-[9999]"
        style={{
          left: `${positions.cursor.x}px`,
          top: `${positions.cursor.y}px`,
          transform: `translate(-50%, -50%) scale(${dotScale})`,
          transition: "transform 0.15s cubic-bezier(0.22, 1, 0.36, 1)",
          mixBlendMode: "difference",
          width: "5px",
          height: "5px",
          borderRadius: "50%",
          backgroundColor: "white",
          willChange: "transform, left, top",
        }}
      />
    </div>
  );
}