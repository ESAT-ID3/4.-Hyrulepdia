import { useRef, useEffect, useCallback, useState } from 'react';

export const useHorizontalScroll = () => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [mostVisible, setMostVisible] = useState<HTMLElement | null>(null);
  const isDragging = useRef(false);
  const startX = useRef(0);
  const scrollLeft = useRef(0);
  const moved = useRef(false);
  const ignoreClick = useRef(false);

  const detectMostVisible = useCallback((): HTMLElement | null => {
    const slider = scrollRef.current;
    if (!slider) return null;

    const children = Array.from(slider.children).filter(
      (el): el is HTMLElement => el instanceof HTMLElement
    );

    const sliderRect = slider.getBoundingClientRect();

    let maxVisibleRatio = 0;
    let mostVisibleElement: HTMLElement | null = null;

    children.forEach(child => {
      const rect = child.getBoundingClientRect();
      const visibleWidth = Math.min(rect.right, sliderRect.right) - Math.max(rect.left, sliderRect.left);
      const visibleRatio = Math.max(0, visibleWidth) / rect.width;

      if (visibleRatio > maxVisibleRatio) {
        maxVisibleRatio = visibleRatio;
        mostVisibleElement = child;
      }
    });

    return mostVisibleElement;
  }, []);

  useEffect(() => {
    const slider = scrollRef.current;
    if (!slider) return;

    const handleMouseDown = (e: MouseEvent) => {
      isDragging.current = true;
      moved.current = false;
      ignoreClick.current = false;
      slider.classList.add('dragging');
      startX.current = e.pageX - slider.offsetLeft;
      scrollLeft.current = slider.scrollLeft;
    };

    const handleEnd = () => {
      if (!isDragging.current) return;
      isDragging.current = false;
      slider.classList.remove('dragging');

      if (moved.current) ignoreClick.current = true;

      const mostVisible = detectMostVisible();
      setMostVisible(mostVisible);

      if (mostVisible) {
        mostVisible.scrollIntoView({ behavior: 'smooth', inline: 'center' });
      }
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging.current) return;
      e.preventDefault();
      const x = e.pageX - slider.offsetLeft;
      const walk = (x - startX.current) * 1.5;
      slider.scrollLeft = scrollLeft.current - walk;

      if (Math.abs(x - startX.current) > 5) {
        moved.current = true;
      }
    };

    const handleScroll = () => {
      const mostVisible = detectMostVisible();
      setMostVisible(mostVisible);

      if (!mostVisible) return;

      Array.from(slider.children).forEach(child => {
        child.classList.toggle('active', child === mostVisible);
      });
    };

    slider.addEventListener('mousedown', handleMouseDown);
    slider.addEventListener('mouseleave', handleEnd);
    slider.addEventListener('mouseup', handleEnd);
    slider.addEventListener('mousemove', handleMouseMove);
    slider.addEventListener('scroll', handleScroll);

    // Inicial
    handleScroll();

    return () => {
      slider.removeEventListener('mousedown', handleMouseDown);
      slider.removeEventListener('mouseleave', handleEnd);
      slider.removeEventListener('mouseup', handleEnd);
      slider.removeEventListener('mousemove', handleMouseMove);
      slider.removeEventListener('scroll', handleScroll);
    };
  }, [detectMostVisible]);

  return { scrollRef, ignoreClick, mostVisible };
};
