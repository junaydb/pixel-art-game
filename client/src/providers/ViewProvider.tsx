import { createContext, useContext, useState } from "react";

type Views = "LOBBY" | "GAME";
type SetView = (view: Views) => void;

const ViewContext = createContext<Views>("LOBBY");
const SetViewContext = createContext<SetView>(() => {});

export function useView() {
  return useContext(ViewContext);
}
export function useSetView() {
  return useContext(SetViewContext);
}

export default function ViewProvider({
  children,
}: { children: React.ReactNode }) {
  const [view, setView] = useState<Views>("LOBBY");

  // prettier-ignore
  return (
    <ViewContext.Provider value={view}>
      <SetViewContext.Provider value={setView}>
        {children}
      </SetViewContext.Provider>
    </ViewContext.Provider>
  );
}
