// src/views/collection/DeckEditorPage.tsx
import { useState , useEffect , useRef } from "react";
import { toast } from "react-toastify";
import { db } from "../../firebaseConfig/firebaseConfig";
import { collection, addDoc, doc, updateDoc } from "firebase/firestore";
import { useAuth } from "../../context/authContext";
import { HyruleCard } from "../../components/hyrule-card/HyruleCard";
import { useUnlockedCards } from "../../hooks/useUnlockedCards";
import './DeckEditorPage.css'
import { Button } from "../../components/button/button";
import 'react-toastify/dist/ReactToastify.css';


export const DeckEditorPage = ({ onClose, initialDeck }: { onClose: () => void; initialDeck?: { id: string; name: string; cards: string[] }; }) => {
    const [deckName, setDeckName] = useState(""); // Nombre del mazo
    const [selectedSlots, setSelectedSlots] = useState<(string | null)[]>(Array(6).fill(null));
    const [activeSlot, setActiveSlot] = useState<number | null>(null); // Slot activo que el usuario quiere llenar
    const { user } = useAuth(); // Usuario autenticado
    const { cards: userCards } = useUnlockedCards(); // Cartas desbloqueadas del usuario
    const modalRef = useRef<HTMLDivElement>(null); // Para detectar clics fuera

    //para la preview
useEffect(() => {
    if (initialDeck) {
        setDeckName(initialDeck.name || "");
        setSelectedSlots(
        initialDeck.cards?.map(String).concat(Array(6).fill(null)).slice(0, 6) || Array(6).fill(null)
        );
    }
}, [initialDeck]);

  // Cerrar al hacer clic fuera
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        onClose();
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [onClose]);

  // Añadir una carta al slot activo
  const handleSelectCard = (cardId: string) => {
    if (activeSlot === null) return;
    if (selectedSlots.includes(cardId)) {
      toast.error("Card already in the deck");
      return;
    }
    const newSlots = [...selectedSlots];
    newSlots[activeSlot] = cardId;
    setSelectedSlots(newSlots); //para que el grid permanezca abierto siempre
  };

  // Crear el mazo en Firebase
  const handleCreateDeck = async () => {
    if (!deckName.trim()) {
      toast.error("You must write a name fot the deck");
      return;
    }
    if (!user) return;

    const deck = {
        name: deckName,
        cards: selectedSlots.map(card => card ? String(card) : null),
        createdAt: Date.now(),
    };

    const userRef = doc(db, 'users', user.uid);
    const decksRef = collection(userRef, 'decks');

    try {
        if (initialDeck && initialDeck.id) {
            // 🔁 Modo edición: actualiza
            const deckRef = doc(decksRef, initialDeck.id);
            await updateDoc(deckRef, deck);
            toast.success("Deck updated");
          } else {
            // ✨ Modo nuevo: crea
            await addDoc(decksRef, deck);
            toast.success("Saved successfully");
          }
          onClose();
        } catch (err) {
            console.error("Error al guardar el mazo:", err);
            toast.error("Error al guardar el mazo");
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
          {selectedSlots.map((cardId, index) => (
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
              {cardId ? (
                <HyruleCard
                {...(userCards.find(c => c.id === cardId)!)}
                size="sm"
                disableClick
                isDiscovered
              />
            ) : (
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

        {/* Botón para crear el mazo */}
        <Button className='create-deck-button'size="md" onClick={() =>{handleCreateDeck()}} >Create new deck</Button>
      </div>
    </div>
  );
};
