import { useNavigate } from 'react-router-dom';
import { useCallback } from 'react';
import { Button } from '../../components/button/button';
import { Filters } from '../../components/filters/filters';
import { useAuth } from '../../context/authContext';
import { useEffect, useState } from 'react';
import { collection, getDocs, doc } from 'firebase/firestore';
import { db } from '../../firebaseConfig/firebaseConfig';
import { DeckEditorPage } from './DeckEditorPage';
import deckButton from '../../assets/backgrounds/deck-button.png';
import './DecksPage.css';
import { useUnlockedCards } from '../../hooks/useUnlockedCards';
import SVGSpotlight from '../../components/SVGSpotlight/SVGSpotlight';

export const DecksPage = () => {
  const navigate = useNavigate(); //use navigate para redirigir
  const { user } = useAuth();
  const [decks, setDecks] = useState<any[]>([]); //almacenamos los mazos del usuario en un array, y usaremos setDecks para actualizarlo
  const [isCreating, setIsCreating] = useState(false); //controla si se muestra el editor
  const [selectedDeck, setSelectedDeck] = useState<any | null>(null); //si se hace click en un mazo se pasa al editor para modificarlo
  const { cards: userCards } = useUnlockedCards();

  const fetchDecks = useCallback(async () => {
    //Consulta firestore para traer mazos guardados del usuario autenticado
    if (!user) return;
    const userRef = doc(db, 'users', user.uid);
    const decksRef = collection(userRef, 'decks');
    const snapshot = await getDocs(decksRef);
    const data = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })); //los nombres no funcionaban porque estaba pasando data como propiedad y no como función
    setDecks(data); //cargamos los mazos en el estado
  }, [user]);

  useEffect(() => {
    fetchDecks();
  }, [fetchDecks, isCreating]); //recargamos al crear nuevo mazo

  return (
    <>
      <Filters
        onFilterTypesChange={() => {}}
        onFilterCategoryChange={() => {}}
        onSearchChange={() => {}}
        setIsReversed={() => {}}
        onFavoritesToggle={() => {}}
        isShowingFavorites
      />
      <div className='collection-page'>
        <div className='collection-page__buttons'>
          <Button size='lg' onClick={() => navigate('/collection')}>
            My Cards
          </Button>
          <Button size='lg' onClick={() => navigate('/collection/decks')}>
            Decks
          </Button>
          <Button size='lg' onClick={() => navigate('/collection/library')}>
            Library
          </Button>
        </div>
        <div className='collection-page__decks'>
          <button
            className='deck-button'
            onClick={() => setIsCreating(true)}
            onTouchStart={() => setIsCreating(true)}
          >
            <img src={deckButton} alt='deck button' />
          </button>
          {decks.map((deck) => {
            const firstCardId = deck.cards?.find((id: null) => id !== null); //find para encontrar la primera carta que no sea null, mejor que focusear el index 0 del array de cartas
            const firstCard = userCards.find(
              (c) => String(c.id) === String(firstCardId)
            );
            if (!firstCard) return null; // no renderiza si no hay imagen

            return (
              <div
                key={deck.id}
                className='deck-preview'
                onClick={() => setSelectedDeck(deck)}
                onTouchStart={() => setSelectedDeck(deck)}
                style={{
                  backgroundImage: firstCard
                    ? `url(${firstCard.image})`
                    : 'none',
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                }}
              >
                <div className='deck-name'>{deck.name || 'Unnamed Deck'}</div>
              </div>
            );
          })}
        </div>
        {(isCreating || selectedDeck) && (
          <DeckEditorPage
            key={selectedDeck?.id || 'new'}
            onClose={() => {
              setIsCreating(false);
              setSelectedDeck(null);
            }}
            onDeckUpdated={() => {
              //esta función hace que se sincronice la recarga de mazos en la página, se actualiza el estado decks con los datos nuevos de firebase
              // Refresca la lista de mazos para reflejar cambios
              fetchDecks();
              // Además, cierra el modal y limpia selección
              setIsCreating(false);
              setSelectedDeck(null);
            }}
            initialDeck={selectedDeck || undefined}
          />
        )}
      </div>
      <SVGSpotlight />
    </>
  );
};
