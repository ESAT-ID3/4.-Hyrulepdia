import { useRef, useEffect, useState } from 'react';

export const useCardTilt = () => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [style, setStyle] = useState<React.CSSProperties>({
    transition: 'transform 0.2s ease, box-shadow 0.2s ease',
  });

  useEffect(() => {
    const card = cardRef.current;
    if (!card) return;

    const glowEl = card.querySelector('.glow') as HTMLElement;

    let animationFrameId: number;

    const updateTilt = (x: number, y: number) => {
      const rect = card.getBoundingClientRect();
      const relativeX = x - rect.left;
      const relativeY = y - rect.top;

      const rotateX = ((relativeY / rect.height) - 0.5) * -60;
      const rotateY = ((relativeX / rect.width) - 0.5) * 60;

      const shadowX = -(rotateY / 2);
      const shadowY = rotateX / 2;
      const glowX = -(rotateY / 2);
      const glowY = rotateX / 2;

      const glow = `radial-gradient(circle at ${50 + glowX}% ${50 + glowY}%, rgba(231, 214, 116, 0.2), transparent 90%)`;

      cancelAnimationFrame(animationFrameId);
      animationFrameId = requestAnimationFrame(() => {
        setStyle({
          transform: `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`,
          boxShadow: `${shadowX}px ${shadowY}px 20px rgba(0, 0, 0, 0.71)`,
          transition: 'transform 0.1s ease, box-shadow 0.1s ease',
        });

        if (glowEl) {
          glowEl.style.background = glow;
        }
      });
    };

    const resetTilt = () => {
      setStyle({
        transform: `perspective(1000px) rotateX(0deg) rotateY(0deg)`,
        boxShadow: `none`,
        transition: 'transform 0.4s ease, box-shadow 0.4s ease',
      });

      if (glowEl) {
        glowEl.style.background = 'transparent';
      }
    };

    const handleMouseMove = (e: MouseEvent) => updateTilt(e.clientX, e.clientY);
    const handleMouseLeave = resetTilt;

    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        e.preventDefault(); // 🔥 Esto es lo que bloquea el scroll

        const touch = e.touches[0];
        const rect = card.getBoundingClientRect();

        if (
          touch.clientX >= rect.left &&
          touch.clientX <= rect.right &&
          touch.clientY >= rect.top &&
          touch.clientY <= rect.bottom
        ) {
          updateTilt(touch.clientX, touch.clientY);
        } else {
          resetTilt();
        }
      }
    };

    const handleTouchEnd = resetTilt;

    card.addEventListener('mousemove', handleMouseMove);
    card.addEventListener('mouseleave', handleMouseLeave);
    card.addEventListener('touchmove', handleTouchMove, { passive: false }); // ✅ Fix aquí
    card.addEventListener('touchend', handleTouchEnd);
    card.addEventListener('touchcancel', handleTouchEnd);

    return () => {
      card.removeEventListener('mousemove', handleMouseMove);
      card.removeEventListener('mouseleave', handleMouseLeave);
      card.removeEventListener('touchmove', handleTouchMove);
      card.removeEventListener('touchend', handleTouchEnd);
      card.removeEventListener('touchcancel', handleTouchEnd);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return { cardRef, style };
};
