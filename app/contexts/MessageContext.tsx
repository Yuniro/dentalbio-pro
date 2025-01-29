'use client'
import React, { createContext, useContext, useState } from 'react';

type MessageContextProps = {
  messageStatus?: any;
  setNotificationMessage: ({ message, extraButtons }: { message: string, extraButtons?: any }) => void;
  closeMessage: () => void;
}

const MessageContext = createContext<MessageContextProps | undefined>(undefined);

export const MessageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [messageStatus, setMessageStatus] = useState({
    message: "",
    extraButtons: null,
    isOpen: false,
  })

  const setNotificationMessage = ({ message, extraButtons }: { message: string, extraButtons?: any }) => {
    setMessageStatus({
      message,
      extraButtons,
      isOpen: true
    })
  }

  const closeMessage = () => {
    setMessageStatus((prev) => {
      return {
        ...prev,
        extraButtons: null,
        isOpen: false
      };
    })
  }

  return (
    <MessageContext.Provider value={{ messageStatus, setNotificationMessage, closeMessage }}>
      {children}
    </MessageContext.Provider>
  )
}

export const useMessage = () => {
  const context = useContext(MessageContext);
  if (!context) {
    throw new Error('useMessage must be used within a MessageProvider');
  }
  return context;
}