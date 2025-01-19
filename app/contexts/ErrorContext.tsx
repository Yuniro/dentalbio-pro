// ErrorContext.tsx
'use client'
import React, { createContext, useContext, useState } from 'react';

interface ErrorContextProps {
  errorMessage: any;
  setErrorMessage: ({ message, show }: { message: string, show: boolean }) => void;
}

const ErrorContext = createContext<ErrorContextProps | undefined>(undefined);

export const ErrorProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [errorMessage, setErrorMessage] = useState({
    message: "",
    show: false,
  });

  return (
    <ErrorContext.Provider value={{ errorMessage, setErrorMessage }}>
      {children}
    </ErrorContext.Provider>
  );
};

export const useError = () => {
  const context = useContext(ErrorContext);
  if (!context) {
    throw new Error('useError must be used within a ErrorProvider');
  }
  return context;
};
