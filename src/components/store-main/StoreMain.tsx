import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../button/button';
import { ChestButton } from '../chest-button/ChestButton';
import './StoreMain.css';
import { ChestButtonType } from '../../types/hyrule.types';
import { PopupGemsInfo } from '../popup-gems-info/PopupGemsInfo';
import { useHorizontalScroll } from '../../hooks/useHorizontalScroll';

export const StoreMain = () => {
  const [showPopup, setShowPopup] = useState(false);
  const navigate = useNavigate();
  const { scrollRef, ignoreClick } = useHorizontalScroll();
  const middleChestRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current && middleChestRef.current) {
      const container = scrollRef.current;
      const chest = middleChestRef.current;

      const containerWidth = container.offsetWidth;
      const chestLeft = chest.offsetLeft;
      const chestWidth = chest.offsetWidth;

      container.scrollLeft = chestLeft - (containerWidth / 2) + (chestWidth / 2);
    }
  }, [scrollRef]);

  const handleSelect = (rarity: ChestButtonType['rarity'], price: number) => {
    if (ignoreClick.current) {
      ignoreClick.current = false; // Reseteamos la bandera para futuros clicks
      return;
    }
    navigate('/purchase', {
      state: { rarity, price },
    });
  };

  return (
    <div className='store-page'>
      <div ref={scrollRef} className="store-main">
        <div className="card-content" onClick={() => handleSelect('rare', 500)}>
          <ChestButton rarity="rare" price={500} />
        </div>
        <div
          ref={middleChestRef}
          className="card-content"
          onClick={() => handleSelect('common', 200)}
        >
          <ChestButton rarity="common" price={200} />
        </div>
        <div className="card-content" onClick={() => handleSelect('epic', 800)}>
          <ChestButton rarity="epic" price={800} />
        </div>
      </div>
      <div className="store-main__textbox">
        <p className="store-main__textbox__text">Select a chest to continue...</p>
        <div className="store-main__textbox__buttons">
          <Button onClick={() => navigate('/collection')}>COLLECTION</Button>
          <Button onClick={() => setShowPopup(true)}>MORE GEMS</Button>
        </div>
      </div>
      <PopupGemsInfo visible={showPopup} onClose={() => setShowPopup(false)} />
    </div>
  );
};
