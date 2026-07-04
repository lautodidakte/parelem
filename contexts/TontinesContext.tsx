
import React, { createContext, useContext, useState, useEffect } from 'react';
import { Organization } from '../types';
import { MOCK_ORG } from '../constants';

interface TontinesContextType {
  tontines: Organization[];
  addTontine: (t: Organization) => void;
  updateTontine: (t: Organization) => void;
  getTontine: (id: string) => Organization | undefined;
}

const TontinesContext = createContext<TontinesContextType | undefined>(undefined);

export const TontinesProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [tontines, setTontines] = useState<Organization[]>(() => {
    const saved = localStorage.getItem('parelem_tontines');
    // On fusionne avec MOCK_ORG pour s'assurer qu'elle est toujours présente au moins une fois
    if (saved) {
      const parsed = JSON.parse(saved);
      return parsed.length > 0 ? parsed : [MOCK_ORG];
    }
    return [MOCK_ORG];
  });

  useEffect(() => {
    localStorage.setItem('parelem_tontines', JSON.stringify(tontines));
  }, [tontines]);

  const addTontine = (t: Organization) => {
    setTontines(prev => [t, ...prev]);
  };

  const updateTontine = (updated: Organization) => {
    setTontines(prev => prev.map(t => t.id === updated.id ? updated : t));
  };

  const getTontine = (id: string) => tontines.find(t => t.id === id);

  return (
    <TontinesContext.Provider value={{ tontines, addTontine, updateTontine, getTontine }}>
      {children}
    </TontinesContext.Provider>
  );
};

export const useTontines = () => {
  const context = useContext(TontinesContext);
  if (!context) {
    throw new Error('useTontines must be used within a TontinesProvider');
  }
  return context;
};
