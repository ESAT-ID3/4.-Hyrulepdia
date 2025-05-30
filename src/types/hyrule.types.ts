export interface HyruleCardType {
    id: number;
    name: string;
    points: number;
    rarity: 'common' | 'rare' | 'epic';
    image: string;
    description: string;
    fullDescription?: string;
    location: string;
    items: string;
    category: 'creatures' | 'materials' | 'equipment' | 'monsters' | 'treasure';
    size?: 'default' | 'lg' | 'xl';
    isFavorite?: boolean;
    disableClick?: boolean;
    isDiscovered?: boolean;
}


export interface HyruleDataType {
    category: string;
    common_locations: string[] | null;
    description: string;
    dlc: boolean;
    drops: string[] | null;
    id: number;
    image: string;
    name: string;
}

export interface ChestButtonType {
    rarity: 'common' | 'rare' | 'epic';
    price: number;
}
