import ChatProvider from "./ChatProvider";
import ScoresProvider from "./ScoresProvider";
import SocketProvider from "./SocketProvider";
import WordProvider from "./WordProvider";

export default function GlobalProvider({ children }: { children: React.ReactNode }) {
  // prettier-ignore
  return (
    <SocketProvider>
      <WordProvider>
        <ChatProvider>
          <ScoresProvider>
            {children}
          </ScoresProvider>
        </ChatProvider>
      </WordProvider>
    </SocketProvider>
  );
}
