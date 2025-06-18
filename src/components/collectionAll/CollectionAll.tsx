import { useEffect, useState } from "react";
import { getAllCards } from "../../services/getAllCards";
import { HyruleCard } from "../hyrule-card/HyruleCard";
import { HyruleCardType } from "../../types/hyrule.types";
import { Filters } from "../filters/filters";
import { useFilters } from "../../hooks/useFilters";
import { CardCounter } from "../cardCounter/CardCounter";
import { ModalCard } from "../modalCard/ModalCard";
import { Button } from "../button/button.tsx";
import { useNavigate } from "react-router-dom";
import { CollectionFavorites } from "../../hooks/useCollectionFavorites.ts";
import { useUserCollection } from "../../hooks/useUserCollection";
import loadingGif from '../../assets/gif-zelda-loading.webp';
import noCardsImage from '../../../public/no-cards-link.webp';
import { FilterModal } from "../filterModal/FilterModal.tsx";

import '../hyrule-card/hyruleCard.css';
import './collection-all.css'
import '../cardCounter/card-counter.css'
import '../modalCard/modal-card.css'
import '../filterModal/filter-modal.css'

interface CollectionAllProps {
  variant?: 'default' | 'library';
}

export const CollectionAll = ({ variant = 'default' }: CollectionAllProps) => {
  const [cards, setCards] = useState<HyruleCardType[]>([]); // Todas las cartas
  const [favoriteCards, setFavoriteCards] = useState<HyruleCardType[]>([]);
  const [isShowingFavorites, setIsShowingFavorites] = useState(false);
  const [selectedCard, setSelectedCard] = useState<HyruleCardType | null>(null);
  const [isPageReady] = useState(false);
  const [loadingCards, setLoadingCards] = useState(true);
  const [hasAttemptedLoad, setHasAttemptedLoad] = useState(false);
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);

  const { userCards, loading: loadingUserCards, error: userCardsError } = useUserCollection();
  const { favoriteIds, favoriteCards: fetchedFavoriteCards } = CollectionFavorites(isShowingFavorites);
  const navigate = useNavigate();
  const isStillLoading = loadingUserCards || loadingCards;
  

  // Cargar todas las cartas
useEffect(() => {
  const fetchData = async () => {
    setLoadingCards(true);

    const allCards = await getAllCards();

    if (allCards) {
 const markedCards = allCards.map(card => {
  const userCard = userCards.find(c => c.id === card.id);

  return {
    ...card,
    isDiscovered: !!userCard,
    rarity: userCard?.rareza || 'common'
  };
});

      setCards(markedCards);
    }
    setLoadingCards(false);
    setHasAttemptedLoad(true);
  };

  if (userCards.length >= 0) {
    fetchData();
  }
}, [userCards]);

  // Actualizar cartas favoritas
  useEffect(() => {
    if (fetchedFavoriteCards.length >= 0) {
      setFavoriteCards(fetchedFavoriteCards);
    }
  }, [fetchedFavoriteCards]);

 
  // Aplicar filtros. Para 'library' mostramos todas sin filtrar por isDiscovered, para el resto sí filtramos.
  const filtersForAll = useFilters(cards, variant === "library");
  const filtersForFavorites = useFilters(favoriteCards);

const {
  filteredCards,
  setFilterRarity,
  setFilterCategory,
  setSearchQuery,
  setIsReversed,
} = isShowingFavorites ? filtersForFavorites : filtersForAll;

  const handleFavoritesToggle = () => {
    setIsShowingFavorites(prev => !prev);
  };

  const handleRemoveFavoriteLocally = (id: number) => {
    setFavoriteCards(prev => prev.filter(card => card.id !== id));
  };

  // Decide qué cartas mostrar según el modo y filtros
  const cardsToDisplay = isShowingFavorites ? filtersForFavorites.filteredCards.filter(card => card.isDiscovered) : (variant === "library" ? filtersForAll.filteredCards : filteredCards);

    if (isPageReady) {
      return (
        <div className="collection-container loading">
          <img src={loadingGif} alt="Cargando..." className="loading-gif" />
        </div>
    );
}

  if (!userCards) {
    return (
      <div>
        <p>Looks like Link forgot to pick up your cards. Typical</p>
      </div>
    )
  }

  if (userCardsError) return <p>Error cargando cartas del usuario: {userCardsError}</p>;

  return (
    <>
      <FilterModal   
        open={isFilterModalOpen}
        onClose={() => setIsFilterModalOpen(false)}
        onFilterTypesChange={setFilterRarity}
        onFilterCategoryChange={setFilterCategory}
        onSearchChange={setSearchQuery}
        setIsReversed={setIsReversed}
        onFavoritesToggle={handleFavoritesToggle}
        isShowingFavorites={isShowingFavorites}
        > 
      </FilterModal>
      <Filters
        onFilterTypesChange={setFilterRarity}
        onFilterCategoryChange={setFilterCategory}
        onSearchChange={setSearchQuery}
        setIsReversed={setIsReversed}
        onFavoritesToggle={handleFavoritesToggle}
        isShowingFavorites={isShowingFavorites}
        onOpenFiltersModal={() => setIsFilterModalOpen(true)}
      />
      <div className="collection-page">
        <div className="collection-page__buttons">
          <Button onClick={() => navigate("/collection")} size="lg">My Cards</Button>
          <Button onClick={() => navigate("/collection/decks")} size="lg">Decks</Button>
          <Button onClick={() => navigate("/collection/library")} size="lg">Library</Button>
        </div>
        <div className="cards-wrapped">
          <CardCounter
            obtained={
              variant === "library"
                ? filteredCards.filter(card => card.isDiscovered).length
                : filteredCards.length
            }
            total={cards.length}
          />
          <div className="collection-container">
            {isStillLoading ? (
                <div className="loading-container">
                  <img src={loadingGif} alt="Loading cards..." className="loading-gif" />
                </div>
              ) : cardsToDisplay.length === 0 && hasAttemptedLoad ? (
                <div className="no-cards-message">
                  <img src={noCardsImage} alt="No cards available" className="no-cards-image" />
                  <p>Looks like Link forgot to pick up your cards. <br/>Typical.</p>
                </div>
              ) : (
            cardsToDisplay.map((card) => (
              <div
                className="card-container"
                key={card.id}
                onClick={
                  card.isDiscovered ? () => setSelectedCard(card) : undefined
                }
              >
                <HyruleCard
                  {...card}
                  disableClick={variant === "library"} // solo se desactiva click en la biblioteca
                />
              </div>
            ))
            )}
          </div>
        </div>
      </div>
      {selectedCard && (
        <ModalCard
          selectedCard={selectedCard}
          onClose={() => setSelectedCard(null)}
          favoriteIds={favoriteIds}
          onRemoveFavorite={handleRemoveFavoriteLocally}
        />
      )}
    </>
  );
};
