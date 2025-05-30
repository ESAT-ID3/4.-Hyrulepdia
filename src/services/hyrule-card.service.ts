import { HyruleDataType, HyruleCardType } from "../types/hyrule.types"
import { auth, db } from "../firebaseConfig/firebaseConfig";
import { collection, setDoc, doc } from "firebase/firestore";

//Esta función se usa para que se le asigne un tipo de rareza a cada carta
const getRandomRarity = (chestRarity : 'common' | 'rare' | 'epic' ) : 'common' | 'rare' | 'epic' => {
    const rand = Math.random();
    if (chestRarity === 'common') {
        if(rand < 0.80) return 'common'; //80%
        if (rand < 0.95) return 'rare'; //15%
        return 'epic'; //5%
    } else if (chestRarity === 'rare') {
        if(rand < 0.70) return 'common'; //70%
        if (rand < 0.95) return 'rare'; //25%
        return 'epic'; //5%
    } else {
        if(rand < 0.55) return 'common'; //55%
        if (rand < 0.80) return 'rare'; //25%
        return 'epic'; //15%
    }
}

//Esta función asigna puntos según la rareza
const getPointsByRarity = (rarity: 'common' | 'rare' | 'epic') : number => {
    switch (rarity) {
        case 'epic': return 100;
        case 'rare': return 50;
        case 'common': return 20;
    }
}

//Esta función recoge todos los datos de la api ya que no tiene nada que devuelva un objeto de datos aleatorios
const getAllHyruleData = async() : Promise<HyruleDataType[] | undefined> => {
    const url = 'https://botw-compendium.herokuapp.com/api/v3/compendium/all';
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`Response status: ${response.status}`);
        }
        // parsear el response como JSON para acceder a los datos
        const json = await response.json(); //te da el objeto entero, la clave data contiene el arrat que se necesita
        return json.data as HyruleDataType[];
    } catch (error: any) {
        throw new error('Oops! Something went wrong while fetching data from the Hyrule Compendium');
    }
};

//Esta función baraja los objetos que devuelve la api y devuelve 3 aleatorios, se le pasa chestRarity para saber que tipo de probabilidades debe sacar
export const getRandomHyruleData = async( num : number = 3, chestRarity: 'common' | 'rare' | 'epic' ) : Promise< HyruleCardType[] | undefined> => {
    const allData = await getAllHyruleData();
    if (!allData) return;

    // Mezclamos los datos con el algoritmo de Fisher-Yates
    const shuffled = [...allData].sort(() => 0.5 - Math.random());

     // Seleccionamos los primeros `num` elementos
    const selected: HyruleCardType[] =  shuffled.slice(0, num).map((item) => { //el map se usa para transformar cada elemento del array original en un nuvo objeto con una forma diferente: HyruleCardType.
        const rarity = getRandomRarity(chestRarity);

        //para que los textos tengan máximo 130 caracteres incluyendo espacios y signos
        const trimmedDescription = item.description.length > 120
            ? item.description.slice(0, 115) + '...'
            : item.description;

        //Para acortar locations si hay mas de 4
        const trimmedLocations = item.common_locations && item.common_locations.length > 0
            ? item.common_locations.length > 3
                ? item.common_locations.slice(0, 3).join(', ') + ', ...'
                : item.common_locations.join(', ')
            : 'Unknown';

        //para acortar drop items si hay más de 4
        const trimmedDrops = item.drops && item.drops.length > 0
            ? item.drops.length > 3
                ? item.drops.slice(0, 3).join(', ') + ', ...'
                : item.drops.join(', ')
            :'None';

        return {
            id: item.id,
            name: item.name,
            image: item.image,
            description: trimmedDescription,
            fullDescription: item.description,
            location: trimmedLocations, //une las locations, si no hay pone unknown
            items: trimmedDrops,
            category: item.category as HyruleCardType['category'],
            rarity,
            points: getPointsByRarity(rarity),
        };
    });

    //guardar en firestore bajo el usuario autenticado
    const user = auth.currentUser; //Accede al usuario actualmente autenticado mediante Firebase Authentication
    if (user) { //si existe un usuario autenticado siguie con el guardado, si no lanza un warn
    const userCardsRef = collection(doc(db, "users", user.uid), "hyrule_cards"); 
 //doc(db, "users", user.uid)accede al documento del usuario actual dentro de la colección users, collection(..., "hyrule_cards") Dentro del documento del usuario, accede o crea una subcolección llamada hyrule_cards.
    for (const card of selected) { //Recorre el array selected (las cartas generadas). Por cada carta añadae la carta como un nuevo doc dentro de la colección hyrule_cards. 
    const cardDocRef = doc(userCardsRef, String(card.id));
      await setDoc(cardDocRef, {
        ...card, // Guardo toda la carta en el documento
        favorite: false, // Si quieres agregar el campo `favorite` inicializado en `false`
        isDiscovered: true
      });
    }
  } else {
    console.warn("Unauthenticated user. No cards saved."); //Si no hay un usuario autenticado, muestra un mensaje de advertencia 
    }

    return selected;
};

//llamar al componente y le asigno una rareza según el cofre que haya abierto
//useeffect, con el array de 3 Datas y con aleatprio le añado la rareza. 