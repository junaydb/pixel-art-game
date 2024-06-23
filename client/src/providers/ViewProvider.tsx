import { useState, useContext, createContext } from "react";

type Views = "LOBBY" | "GAME";
type setView = (view: Views) => void;

const viewContext = createContext<Views>("LOBBY");
const setViewContext = createContext<setView>(() => {});

export function useView() {
  return useContext(viewContext);
}
export function useSetView() {
  return useContext(setViewContext);
}

export default function ViewProvider({ children }: { children: React.ReactNode }) {
  const [view, setView] = useState<Views>("LOBBY");

  // prettier-ignore
  return (
    <viewContext.Provider value={view}>
      <setViewContext.Provider value={setView}>
        {children}
      </setViewContext.Provider>
    </viewContext.Provider>
  );
}
