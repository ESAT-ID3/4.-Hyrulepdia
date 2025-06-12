import  './StoreOpening.css'
import { HyruleCardType } from "../../types/hyrule.types";
import { HyruleCard } from "../hyrule-card/HyruleCard";
import { CardContainer } from '../CardContainer/CardContainer';
import { Button } from '../button/button';
import { useNavigate } from 'react-router-dom';
import { useHorizontalScroll } from '../../hooks/useHorizontalScroll';
import { useEffect, useRef } from 'react';

type storeOpening = {
    cards: HyruleCardType[],
}

export const StoreOpening = ({ cards }: storeOpening) => {
  const navigate = useNavigate();
  const { scrollRef, mostVisible, ignoreClick } = useHorizontalScroll();

  // Calcula el índice de la carta del medio
  const middleIndex = Math.floor(cards.length / 2);

  // Ref para la carta del medio
  const middleCardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current && middleCardRef.current) {
      const container = scrollRef.current;
      const card = middleCardRef.current;

      const containerWidth = container.offsetWidth;
      const cardLeft = card.offsetLeft;
      const cardWidth = card.offsetWidth;

      container.scrollTo({
        left: cardLeft - (containerWidth / 2) + (cardWidth / 2),
        behavior: 'smooth',  // para que sea suave
      });
    }
  }, [scrollRef, cards.length]); // ejecuta cuando cards cambian

  const handleCardClick = (card: HyruleCardType) => {
    if (ignoreClick.current) return;
    console.log('Card clicked:', card);
  };

  return (
    <body className='slider-page'>
      <div className='store-opening'>
        <CardContainer >
          <div className="hyrule-cards-wrapper">
            <div ref={scrollRef} className="hyrule-cards-container">
              {cards.length === 0 ? (
                <p className='hyrule-cards-container__loading-info'>Loading cards...</p>
              ) : (
                cards.map((card, index) => (
                  <div
                    key={card.id}
                    data-id={card.id}
                    className={`hyrule-card-wrapper ${card.id === Number(mostVisible?.getAttribute("data-id")) ? 'active' : ''}`}
                    ref={index === middleIndex ? middleCardRef : null} // aquí asignas la ref solo a la carta del medio
                  >
                    <HyruleCard
                      {...card}
                      className={`hyrule-card ${card.id === Number(mostVisible?.getAttribute("data-id")) ? 'active' : ''}`}
                      onClick={() => handleCardClick(card)}
                    />
                  </div>
                ))
              )}
            </div>
          </div>
        </CardContainer>

        <div className='hyrule-cards__textbox'>
          <p>
            Cards are saved automatically. <br />
            You'll find your cards in your <span>COLLECTION</span>
          </p>
          <div className='hyrule-cards__textbox__buttons'>
            <Button onClick={() => navigate('/collection')}>MY CARDS</Button>
            <Button onClick={() => navigate('/shop')}>UNLOCK CHESTS</Button>
          </div>
        </div>
      </div>
    </body>
  );
};
