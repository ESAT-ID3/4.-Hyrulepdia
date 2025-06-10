// src/hooks/useUnlockedCards.ts
import { useEffect, useState } from "react";
import { useAuth } from "../context/authContext";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebaseConfig/firebaseConfig";

// Este hook recupera las cartas desbloqueadas del usuario
export const useUnlockedCards = () => {
  const { user } = useAuth();
  const [cards, setCards] = useState<any[]>([]);

  useEffect(() => {
      if (!user) return;

      const fetchCards = async () => {
      try {
        const cardsRef = collection(db, "users", user.uid, "hyrule_cards");
        const snapshot = await getDocs(cardsRef);
        const userCards = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
          }));
        setCards(userCards);
      } catch (error) {
        console.error("Error al cargar las cartas desbloqueadas:", error);
      } 
    };

    fetchCards();
  }, [user]);

  return { cards};
};
