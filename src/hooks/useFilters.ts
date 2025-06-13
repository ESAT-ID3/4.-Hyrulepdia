import { useState, useMemo } from 'react';
import { HyruleCardType } from '../types/hyrule.types';

export const useFilters = (
  cards: HyruleCardType[],
  showAll: boolean = false // nuevo argumento opcional
) => {
  const [filterRarity, setFilterRarity] = useState<string>('All');
  const [filterCategory, setFilterCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isReversed, setIsReversed] = useState<boolean>(false);

  const clearFilters = () => {
    setFilterRarity('All');
    setFilterCategory('All');
  };

  const filteredCards = useMemo(() => {
    let result = cards;

    // Si no es library, ocultamos las no descubiertas
    if (!showAll) {
      result = result.filter((card) => card.isDiscovered);
    }

    result = result.filter((card) => {
      const matchesRarity =
        filterRarity === 'All' || card.rarity === filterRarity;
      const matchesCategory =
        filterCategory === 'All' || card.category === filterCategory;
      const matchesSearch = searchQuery
        ? card.name?.toLowerCase().includes(searchQuery.toLowerCase())
        : true;

      return matchesRarity && matchesCategory && matchesSearch;
    });

    if (isReversed) {
      result = [...result].reverse();
    }

    return result;
  }, [cards, filterRarity, filterCategory, searchQuery, isReversed, showAll]);

  return {
    filteredCards,
    setFilterRarity,
    setFilterCategory,
    clearFilters,
    setSearchQuery,
    setIsReversed,
    isReversed,
  };
};
