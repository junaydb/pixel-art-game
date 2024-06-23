import { useState, useContext, createContext, useEffect } from "react";
import { io } from "socket.io-client";
import { ClientSocket } from "@/types";

const SocketContext = createContext<ClientSocket>(null as unknown as ClientSocket);

export function useSocket() {
  return useContext(SocketContext);
}

export default function SocketProvider({ children }: { children: React.ReactNode }) {
  const [socket, setSocket] = useState<ClientSocket>(null as unknown as ClientSocket);

  useEffect(() => {
    const socket: ClientSocket = io("https://localhost:3000");

    socket.on("init", (id) => {
      console.log(`WebSocket: ${id}`);
    });

    setSocket(socket);
  }, []);

  // prettier-ignore
  return (
    <SocketContext.Provider value={socket}>
      {children}
    </SocketContext.Provider>
  );
}
