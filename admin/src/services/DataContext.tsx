import React, { createContext, useContext, useState, Dispatch, SetStateAction } from 'react';

interface DataConfig {
  title: string;
  Buttons: React.ReactNode[];
}

interface DataContextProps {
  setCurrentPage: Dispatch<SetStateAction<DataConfig>>;
}

export const DataContext = createContext<DataContextProps>({
  setCurrentPage: () => {}
});

export const useDataContext = () => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useDataContext must be used within a DataProvider');
  }
  return context;
};