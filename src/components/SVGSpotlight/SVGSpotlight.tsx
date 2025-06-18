import React, { useEffect, useRef } from 'react';
import './SVGSpotlight.css';

const TILE_SIZE = 100;
const MAX_DIST = 200;

const SVGSpotlight: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const tilesRef = useRef<HTMLDivElement[]>([]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Limpiar tiles previos
    container.innerHTML = '';
    tilesRef.current = [];

    const vw = window.innerWidth;
    const vh = window.innerHeight;
    const cols = Math.ceil(vw / TILE_SIZE);
    const rows = Math.ceil(vh / TILE_SIZE);

    const svgMarkup = `
      <svg width="100" height="100" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
        ${Array.from({ length: 1 }, (_, i) => {
          const pos = i * 1;
          return `
            <line x1="${pos}" y1="0" x2="${pos}" y2="100" stroke="white" stroke-width="0.5"/>
            <line x1="0" y1="${pos}" x2="100" y2="${pos}" stroke="white" stroke-width="0.5"/>
          `;
        }).join('')}
      </svg>
    `;

    for (let i = 0; i < rows * cols; i++) {
      const div = document.createElement('div');
      div.classList.add('svg-tile');
      div.innerHTML = svgMarkup;
      container.appendChild(div);
      tilesRef.current.push(div);
    }

    const handleMouseMove = (e: MouseEvent) => {
      tilesRef.current.forEach((tile) => {
        const rect = tile.getBoundingClientRect();
        const centerX = rect.left + TILE_SIZE / 2;
        const centerY = rect.top + TILE_SIZE / 2;
        const dist = Math.hypot(centerX - e.clientX, centerY - e.clientY);

        if (dist < MAX_DIST) {
          const norm = 1 - dist / MAX_DIST;
          const brightness = 0.3 + norm * 0.5;
          const shadow = norm * 10;
          tile.style.filter = `brightness(${brightness}) drop-shadow(0 0 ${shadow}px turquoise)`;
          tile.style.opacity = `${norm}`;
        } else {
          tile.style.filter = `brightness(0.3)`;
          tile.style.opacity = '0';
        }
      });
    };

    document.addEventListener('mousemove', handleMouseMove);
    return () => document.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return <div className='svg-grid-container' ref={containerRef} />;
};

export default SVGSpotlight;
