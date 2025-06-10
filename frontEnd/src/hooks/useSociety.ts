
import { useState, useEffect } from 'react';
import { Society } from '../types/society';

let selectedSociety: Society | null = null;

export const useSociety = () => {
  const [society, setSociety] = useState<Society | null>(selectedSociety);

  const setSelectedSociety = (newSociety: Society | null) => {
    selectedSociety = newSociety;
    setSociety(newSociety);
  };

  return {
    selectedSociety: society,
    setSelectedSociety,
  };
};

// Export for components that need it without hooks
export const getCurrentSociety = (): Society | null => selectedSociety;
export const setCurrentSociety = (society: Society | null) => {
  selectedSociety = society;
};
