// AdminContext.tsx
'use client'
import React, { createContext, useContext, useState } from 'react';

interface AdminContextProps {
  adminData: any;
  setTargetUser: (targetUser: string) => void;
}

const AdminContext = createContext<AdminContextProps | undefined>(undefined);

export const AdminProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [adminData, setAdminData] = useState({
    targetUser: "",
  });

  const setTargetUser = (targetUser: string) => {
    setAdminData((prevData: any) => ({
      ...prevData,
      targetUser: targetUser,
    }));
  }

  return (
    <AdminContext.Provider value={{ adminData, setTargetUser }}>
      {children}
    </AdminContext.Provider>
  );
};

export const useAdmin = () => {
  const context = useContext(AdminContext);
  if (!context) {
    throw new Error('useAdmin must be used within a AdminProvider');
  }
  return context;
};
