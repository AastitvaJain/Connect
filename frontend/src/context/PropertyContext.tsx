import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Property } from '../types';

interface PropertyContextType {
  selectedProperties: Property[];
  setSelectedProperties: (properties: Property[]) => void;
}

const PropertyContext = createContext<PropertyContextType | undefined>(undefined);

export const usePropertyContext = () => {
  const context = useContext(PropertyContext);
  if (!context) {
    throw new Error('usePropertyContext must be used within a PropertyProvider');
  }
  return context;
};

interface PropertyProviderProps {
  children: ReactNode;
}

export const PropertyProvider: React.FC<PropertyProviderProps> = ({ children }) => {
  const [selectedProperties, setSelectedProperties] = useState<Property[]>([]);

  return (
    <PropertyContext.Provider value={{ selectedProperties, setSelectedProperties }}>
      {children}
    </PropertyContext.Provider>
  );
};