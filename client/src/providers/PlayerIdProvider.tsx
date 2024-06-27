import { createContext, useContext, useState } from "react";

const PlayerIdContext = createContext(0);

export function usePlayerId() {
  return useContext(PlayerIdContext);
}

export default function PlayerIdProvider({
  children,
}: { children: React.ReactNode }) {
  const [id, setId] = useState(0);

  // prettier-ignore
  return (
    <PlayerIdContext.Provider value={id}>{children}</PlayerIdContext.Provider>
  );
}
