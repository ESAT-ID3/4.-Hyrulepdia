import { HyruleCardType } from "../types/hyrule.types";

// export const getRandomRarity = () : 'common' | 'rare' | 'epic' => {
//     const rand = Math.random();
//     if(rand < 0.05) return 'epic'; //5%
//     if (rand < 0.30) return 'rare'; //25%
//     return 'common'; //70%
// };

// //Esta función asigna puntos según la rareza
// export const getPointsByRarity = (rarity: 'common' | 'rare' | 'epic') : number => {
//     switch (rarity) {
//         case 'epic': return 100;
//         case 'rare': return 50;
//         case 'common': return 20;
//     }
// };


export const getAllCards = async (): Promise<HyruleCardType[] | undefined> => {
    const url = 'https://botw-compendium.herokuapp.com/api/v3/compendium/all';
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`Response status: ${response.status}`);
        }

        const json = await response.json();
        const allData = json.data;

        return allData.map((item: any) => {
            // const rarity = getRandomRarity();
            const fullDescription = item.description;

            return {
                id: item.id,
                name: item.name,
                image: item.image,
                description: fullDescription,
                location: item.common_locations?.join(', ') || "Unknown",
                items: item.drops?.join(', ') || "None",
                category: item.category,
                // rarity,
                // points: getPointsByRarity(rarity),
            };
        });
    } catch (error: any) {
        throw new Error('Oops! Something went wrong while fetching data from the Hyrule Compendium');
    }
};