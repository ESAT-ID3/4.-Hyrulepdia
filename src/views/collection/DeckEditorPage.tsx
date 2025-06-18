// src/views/collection/DeckEditorPage.tsx
import { useState , useEffect , useRef } from "react";
import { toast } from "react-toastify";
import { db } from "../../firebaseConfig/firebaseConfig";
import { collection, addDoc, doc, updateDoc, deleteDoc } from "firebase/firestore";
import { useAuth } from "../../context/authContext";
import { HyruleCard } from "../../components/hyrule-card/HyruleCard";
import { useUnlockedCards } from "../../hooks/useUnlockedCards";
import './DeckEditorPage.css'
import { Button } from "../../components/button/button";
import 'react-toastify/dist/ReactToastify.css';

//DeckEditorPage recibe 3 props, onClose(cierra el editor), initialDeck(mazo a editar si existe) y onDeckUpdate(una función que se ejecuta cuando se actualiza o crea un mazo)
export const DeckEditorPage = ({ onClose, initialDeck, onDeckUpdated, }: { onClose: () => void; initialDeck?: { id: string; name: string; cards: string[] }; onDeckUpdated?: () => void; }) => {
    const [deckName, setDeckName] = useState(""); // Nombre del mazo
    const [selectedSlots, setSelectedSlots] = useState<(string | null)[]>(Array(6).fill(null)); //array con los 6 slots para las cartas
    const [activeSlot, setActiveSlot] = useState<number | null>(null); // Slot activo que el usuario quiere llenar
    const { user } = useAuth(); // Usuario autenticado
    const { cards: userCards } = useUnlockedCards(); // Cartas desbloqueadas del usuario
    const modalRef = useRef<HTMLDivElement>(null); // Para detectar clics fuera

    //para la preview, si hay un mazo cargado se precargan el nombre y las cartas
useEffect(() => {
    if (initialDeck  && userCards.length > 0) {
        setDeckName(initialDeck.name || ""); //utiliza setDeckName para que el nombre del mazo inicial sea el que corresponda
        setSelectedSlots( //se usa setSelectedSlots para que el mazo aparezca con las cartas que tenía guardadas si es que las tenía
        initialDeck.cards //se hace un mapeo del array inicial, 
        ?.map(c => (c !== null && c !== undefined ? String(c) : null)) //convierte cada id de carta a string si la card no es null. ternario
        .concat(Array(6).fill(null)) //añade 6 null al final del array por si el mazo no tenía 6 cartas guardadas
        .slice(0, 6) || Array(6).fill(null) //corta el array en los primeros 6 elementos, para que siempre tenga longitud 6
        );
    }
}, [initialDeck, userCards]);

//para comprobar que los mazos funcionan
useEffect(() => {
    if (initialDeck) {
      console.log("Initial Deck cards:", initialDeck.cards);
      console.log("User Cards:", userCards.map(c => c.id));
    }
  }, [initialDeck, userCards]);

  // Cerrar al hacer clic fuera
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent | TouchEvent) => {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        onClose();
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("touchstart", handleClickOutside);
    
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("touchstart", handleClickOutside);
    };
  }, [onClose]);

  // Añadir una carta al slot activo: el id se normaliza a string para que no haya problemas
  const handleSelectCard = (cardId: string | number) => {
    if (activeSlot === null) return;
    const cardIdStr = String(cardId);  // normalizam a string el id
    if (selectedSlots.includes(cardIdStr)) { //
      toast.error("Card already in the deck");
      return;
    }
    const newSlots = [...selectedSlots];
    newSlots[activeSlot] = cardIdStr;
    setSelectedSlots(newSlots); //para que el grid permanezca abierto siempre
  };

  // Crear el mazo en Firebase
  const handleCreateDeck = async () => {
    if (!deckName.trim()) {
      toast.error("You must write a name fot the deck");
      return;
    }

    const hasAtLeastOneCard = selectedSlots.some(card => card !== null); //comprueba que hay mínimo una carta añadida
    if (!hasAtLeastOneCard) {
    toast.error("You must add at least one card to create a deck");
    return;
    }
    if (!user) return;

    const deck = { //creación del objeto deck
        name: deckName,
        cards: selectedSlots.map(card => card ? String(card) : null),
        createdAt: Date.now(),
    };

    //referencias a firebase
    const userRef = doc(db, 'users', user.uid);
    const decksRef = collection(userRef, 'decks');

    try {
        if (initialDeck && initialDeck.id) { //si el mazo que estás editando existe ya en firebase
            // Modo edición: actualiza
            const deckRef = doc(decksRef, initialDeck.id);
            await updateDoc(deckRef, deck);
            toast.success("Deck updated");
          } else { //si el mazo no existe
            // Modo nuevo: crea
            await addDoc(decksRef, deck);
            toast.success("Saved successfully");
          }
          if (onDeckUpdated) onDeckUpdated(); //Si hay una función onDeckUpdated, se ejecuta (normalmente vuelve a cargar la lista de mazos).
          onClose();
        } catch (err) {
            console.error("Error saving deck:", err);
            toast.error("Error saving deck");
        }
      };

  const handleDeleteDeck = async () => {
    if (!user || !initialDeck?.id) return;

    const userRef = doc(db,  'users', user.uid);
    const deckRef = doc(userRef, 'decks', initialDeck.id);
    
    try {
      await deleteDoc(deckRef);
      toast.success('Deck deleted successfully');
      if (onDeckUpdated) onDeckUpdated(); //Para refrescar la lista en DecksPage
      onClose(); //Cierra el modal
    } catch (err) {
      console.error('Error deleting deck:', err);
      toast.error("Error deleting deck");
    }
  };

  return (
    <div className="deck-editor-modal">
      <div className="deck-editor-form" ref={modalRef}>
        <input
          className="deck-name-input"
          type="text"
          value={deckName}
          onChange={(e) => setDeckName(e.target.value)}
          placeholder="Nombre del mazo"
        />

        {/* Grid de 6 botones para slots de cartas */}
        <div className="card-slot-grid">
          {selectedSlots.map((cardId, index) => ( //como el array selectedSlots tiene siempre 6 elementos, el map genera siempre 6 botones
            <button
              key={index}
              className={`card-slot-button ${activeSlot === index ? "active" : ""}`}
            //   onClick={() => setActiveSlot(index)} cambiamos esta lógica por la siguiente para hacer que se vacíen los slots si los volvemos a clickar
            onClick={() =>{
                if (selectedSlots[index]) { //verifica si el slot que ha sido clicado ya tiene una carta asignada (cardId)
                    const newSlots = [...selectedSlots]; //si es true crea una copia del array y asigna null al slot asociad, lo vacía
                    newSlots[index] = null;
                    setSelectedSlots(newSlots); //actualiza el estado selectedSlots con el nuevo array, en el que ese slot ya no tiene carta
                } else {
                    setActiveSlot(index); //Si el slot clicado estaba vacío, entonces entra en este bloque.
                }
            }}
            >
              {cardId ? (() => {
                const cardData = userCards.find(c => String(c.id) === cardId);
                if (!cardData) return <div className="missing-card">Carta no encontrada</div>;
                return <HyruleCard {...cardData} size="sm" disableClick isDiscovered />;
            })() : (
                <span className="empty-slot">+</span>
            )}
            </button>
          ))}
        </div>

        {/* Selector de cartas desbloqueadas */}
        {activeSlot !== null && (
          <div className="card-selection">
            <h4>Select a card for the slot {activeSlot + 1}</h4>
            <div className="user-card-grid">
              {userCards.map(card => (
                <div
                  key={card.id}
                  className="user-card card--sm"
                  onClick={() => handleSelectCard(card.id)}
                >
                  <HyruleCard {...card} disableClick isDiscovered={true}/>
                </div>
              ))}
            </div>
          </div>
        )}
        <div className="deck__buttons">
        {/* Botón para crear el mazo */}
          <Button className='create-deck-button'size="md" onClick={() =>{handleCreateDeck()}} >Save deck</Button>
          <Button className='delete-deck-button'size="md" color="error" onClick={() => {if (confirm("Are you sure you want to delete this deck?")){ handleDeleteDeck();}}}>Delete deck</Button>
        </div>
      </div>
    </div>
  );
};
