import { useState, useContext, createContext } from "react";

type SetWord = (word: string) => void;

const WordContext = createContext("");
const SetWordContext = createContext<SetWord>(() => {});

export function useWord() {
  return useContext(WordContext);
}
export function useSetWord() {
  return useContext(SetWordContext);
}

export default function WordProvider({ children }: { children: React.ReactNode }) {
  const [word, setWord] = useState("pixlio");

  // prettier-ignore
  return (
    <WordContext.Provider value={word}>
      <SetWordContext.Provider value={setWord}>
        {children}
      </SetWordContext.Provider>
    </WordContext.Provider>
  );
}
