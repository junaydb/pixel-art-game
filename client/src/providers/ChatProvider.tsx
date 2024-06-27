import { createContext, useContext, useState } from "react";
import { useSocket } from "./SocketProvider";

type UpdateChat = (chat: string) => void;

const ChatContext = createContext<string[]>([]);
const SetChatContext = createContext<UpdateChat>(() => {});

export function useChat() {
  return useContext(ChatContext);
}
export function useChatUpdate() {
  return useContext(SetChatContext);
}

export default function ChatProvider({
  children,
}: { children: React.ReactNode }) {
  const socket = useSocket();
  const [chat, setChat] = useState<string[]>([]);

  function updateChat(newMsg: string) {
    socket.emit("message", newMsg);
    setChat([...chat, newMsg]);
  }

  return (
    <ChatContext.Provider value={chat}>
      <SetChatContext.Provider value={updateChat}>
        {children}
      </SetChatContext.Provider>
    </ChatContext.Provider>
  );
}
