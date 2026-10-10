import React, { useEffect, useState } from 'react';

export const DeskLampLight: React.FC = () => {
  const [pos, setPos] = useState({ x: 50, y: 35 });
  const [visible, setVisible] = useState(false);
  const [isTouchDevice, setIsTouchDevice] = useState(false);

  useEffect(() => {
    // Check if device supports hover / is not touch-only
    const touchCheck = window.matchMedia('(hover: none) and (pointer: coarse)');
    setIsTouchDevice(touchCheck.matches);

    const handlePointerMove = (e: PointerEvent) => {
      if (touchCheck.matches) return;
      const xPercent = (e.clientX / window.innerWidth) * 100;
      const yPercent = (e.clientY / window.innerHeight) * 100;
      setPos({ x: xPercent, y: yPercent });
      if (!visible) setVisible(true);
    };

    const handlePointerLeave = () => {
      setVisible(false);
    };

    window.addEventListener('pointermove', handlePointerMove, { passive: true });
    document.body.addEventListener('pointerleave', handlePointerLeave);

    return () => {
      window.removeEventListener('pointermove', handlePointerMove);
      document.body.removeEventListener('pointerleave', handlePointerLeave);
    };
  }, [visible]);

  if (isTouchDevice) {
    return null;
  }

  return (
    <div
      aria-hidden="true"
      className="desk-lamp-cone fixed inset-0 pointer-events-none z-30 transition-opacity duration-500"
      style={{
        opacity: visible ? 1 : 0,
        background: `radial-gradient(circle 380px at ${pos.x}% ${pos.y}%, rgba(245, 208, 115, var(--spotlight-opacity, 0.18)) 0%, rgba(220, 180, 80, 0.05) 50%, transparent 80%)`,
      }}
    />
  );
};
