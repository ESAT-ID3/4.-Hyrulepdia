import { useNavigate } from "react-router-dom"
import { Button } from "../../components/button/button";
import { Filters } from "../../components/filters/filters";
import { useAuth } from "../../context/authContext";
import { useEffect, useState } from "react";
import { collection, getDocs, doc } from "firebase/firestore";
import { db } from "../../firebaseConfig/firebaseConfig";
import { DeckEditorPage } from "./DeckEditorPage";
import deckButton from "../../assets/backgrounds/deck-button.png"
import { useUnlockedCards } from "../../hooks/useUnlockedCards";
import './DecksPage.css'

export const DecksPage = () => {
const navigate = useNavigate(); //use navigate para redirigir
const { user } = useAuth();
const [decks, setDecks] = useState<any[]>([]); //almacenamos los mazos del usuario
const [isCreating, setIsCreating] = useState(false); //controla si se muestra el editor
const [selectedDeck, setSelectedDeck] = useState<any | null>(null);
const { cards: userCards } = useUnlockedCards(); //para la preview de los mazos

const fetchDecks = async () => {
    if (!user) return;
    const userRef = doc(db, 'users', user.uid);
    const decksRef = collection(userRef, 'decks');
    const snapshot = await getDocs(decksRef);
    const data = snapshot.docs.map(doc => ({id: doc.id, ...doc.data()})); //los nombres no funcionaban porque estaba pasando data como propiedad y no como función
    setDecks(data); //cargamos los mazos en el estado
};

useEffect(() => {
    fetchDecks();
}, [user, isCreating]); //recargamos al crear nuevo mazo

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
        <div className="collection-page">
            <div className="collection-page__buttons">
                <Button size="lg" onClick={() => navigate("/collection")}>My Cards</Button>
                <Button size="lg" onClick={() => navigate("/collection/decks")}>Decks</Button>
                <Button size="lg" onClick={() => navigate("/collection/library")}>Library</Button>
            </div>
            <div className="collection-page__decks">
                <button className="deck-button" onClick={() => setIsCreating(true)}>
                    <img src={deckButton} alt='deck button'  />
                </button>
                {decks.map(deck => {
                    return (
                        <div key={deck.id} className="deck-preview" onClick={() => setSelectedDeck(deck)}>
                        <div className="deck-name">{deck.name || "Unnamed Deck"}</div>
                    </div>
                );
            })}
            </div>
            {(isCreating || selectedDeck) && (
                <DeckEditorPage
                    key={selectedDeck?.id || "new"}
                    onClose={() => {
                        setIsCreating(false);
                        setSelectedDeck(null);
                    }}
                    onDeckUpdated={() => { //esta función hace que se sincronice la recarga de mazos en la página, se actualiza el estado decks con los datos nuevos de firebase
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
        </>
    )
}