import { useState, useEffect, FC } from "react";
import { HyruleCardType } from "../../types/hyrule.types";
import { HyruleCard } from "../hyrule-card/HyruleCard";
import { Button } from "../button/button";
import { CardContainer } from "../CardContainer/CardContainer";
import { useAuth } from "../../context/authContext";
import { useAddFavorites } from "../../hooks/useAddFavorites";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../firebaseConfig/firebaseConfig";

interface ModalCardProps {
  selectedCard: HyruleCardType;
  onClose: () => void;
  favoriteIds?: number[];
  onRemoveFavorite?: (id: number) => void;
}

export const ModalCard: FC<ModalCardProps> = ({
  selectedCard,
  onClose,
  onRemoveFavorite,
}) => {
  const [showZoomedCard, setShowZoomedCard] = useState(false);
  const { toggleFavorite } = useAddFavorites();
  const [isFavorite, setIsFavorite] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
  document.body.classList.add("modal-open");
  return () => {
    document.body.classList.remove("modal-open");
  };
}, []);

  // Verificar el estado de favorite en Firestore para la carta seleccionada
  useEffect(() => {
    const fetchFavoriteStatus = async () => {
      if (!user || !selectedCard) return;

      const userDocRef = doc(db, "users", user.uid, "hyrule_cards", String(selectedCard.id));
      const cardDocSnap = await getDoc(userDocRef);
      if (cardDocSnap.exists()) {
        const cardData = cardDocSnap.data();
        setIsFavorite(cardData?.favorite ?? false); // Actualiza el estado según la propiedad 'favorite' de Firestore
      }
    };

    fetchFavoriteStatus();
  }, [selectedCard, user]); // Se ejecuta cuando la carta seleccionada o el usuario cambian

  // Función para manejar el clic en el botón de favoritos
  const handleToggleFavorite = async () => {
    if (!user) {
      alert("Debes estar logueado para añadir favoritos");
      return;
    }

    // Cambiar el estado de favorito localmente
    const newFavoriteState = !isFavorite;
    setIsFavorite(newFavoriteState);

    // Actualizar en Firestore
    await toggleFavorite(selectedCard);

    // Si fue eliminado de favoritos, notificar al padre
    if (!newFavoriteState && onRemoveFavorite) {
      onRemoveFavorite(selectedCard.id);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <CardContainer className="card-container-modal" onClick={(e) => e.stopPropagation()}>
          <button
            className="modal-close-button"
            onClick={onClose}
            aria-label="Close modal"
          >
            <svg xmlns="http://www.w3.org/2000/svg" height="28px" viewBox="0 -960 960 960" width="28px" fill="#e3e3e3"><path d="m256-200-56-56 224-224-224-224 56-56 224 224 224-224 56 56-224 224 224 224-56 56-224-224-224 224Z"/></svg>
          </button>
        <div className="modal-content">
          <div className="modal-content__card" onClick={() => setShowZoomedCard(true)}>
            <HyruleCard {...selectedCard}  size="lg" />
          </div>
          <div className="modal-content__text-btn">
            <h1>{selectedCard.name}</h1> 
            <p className="modal-description">{selectedCard.description}</p>
            <div className="modal-description">
              <h2>Common Location</h2>
              {selectedCard.location}
            </div>
            <div className="modal-description">
              <h2>Droppable Items</h2>
              {selectedCard.items}
            </div>
            <div className="modal-content__btn">
              <Button onClick={handleToggleFavorite}>
                {isFavorite ? "Remove from favorites" : "Add to favorites"}
              </Button>
              <Button>Add Deck</Button>
            </div>
          </div>
        </div>
      </CardContainer>

      {showZoomedCard && (
        <div
          className="zoomed-card-overlay"
          onClick={(e) => {
            e.stopPropagation();
            setShowZoomedCard(false);
          }}
        >
          <div className="zoomed-card-content" onClick={(e) => e.stopPropagation()}>
            <HyruleCard {...selectedCard} size="xl" isInteractive={true}/>
          </div>
        </div>
      )}
    </div>
  );
};
