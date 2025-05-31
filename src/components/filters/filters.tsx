import { Button } from "../button/button";
import { DropDownButton } from "../button/DropDownButton";
import { SearchBar } from "../searchBar/SearchBar";
import './filters.css'

export type Rareza = "common" | "rare" | "epic";
export type Category = "creatures" | "equipment" | "materials" | "monsters" | "treasure" | "";

interface FiltersProps {
  onFilterTypesChange?: (rarity: string) => void;
  onFilterCategoryChange?: (category: string) => void;
  onSearchChange: (query: string) => void; 
  setIsReversed: React.Dispatch<React.SetStateAction<boolean>>;
  onFavoritesToggle: () => void;
  isShowingFavorites: boolean;
}

export const Filters = ({ onFilterTypesChange, onFilterCategoryChange, onSearchChange, setIsReversed, onFavoritesToggle, isShowingFavorites }: FiltersProps) => {
  const types = ['common', 'rare', 'epic' ];
  const categories = ['creatures', 'equipment', 'materials', 'monsters', 'treasure'];


  return (
    <>
      <div className="filters">
        <SearchBar onSearch={onSearchChange} placeholder="Search..."/>
        <div  className="filters-buttons">
          <Button color="outlined" onClick={() => setIsReversed(prev => !prev)}>Card Nº</Button>
          <Button color="outlined" onClick={onFavoritesToggle}>
            {isShowingFavorites ? "View All" : "Favorites"}
          </Button>
          <DropDownButton 
            options={types}
            onSelect={onFilterTypesChange}
            >
              Types
            </DropDownButton>
          <DropDownButton  
            options={categories}
            onSelect={onFilterCategoryChange}>
              Categories
            </DropDownButton>
        </div>
      </div>
    </>
  );
};