import { createContext, useContext, useEffect, useState } from 'react';

const SocketContext = createContext(null);

export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);

  const connect = () => {
    const ws = new WebSocket(`ws://localhost:8080/ws`);

    ws.onopen = () => console.log("Conectado ao servidor");
    ws.onclose = () => console.log("Desconectado");
    
    setSocket(ws);
    return ws;
  };

  const disconnect = () => {
    if (socket) {
      socket.close();
      setSocket(null);
    }
  };

  // Cleanup: fecha a conexão se o usuário fechar a aba ou o app desmontar
  useEffect(() => {
    return () => socket?.close();
  }, [socket]);

  return (
    <SocketContext.Provider value={{ socket, connect, disconnect }}>
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = () => useContext(SocketContext);