import { createContext, useContext, useState } from "react";

type PlayerScore = { id: number; playerName: string; score: number };
type UpdateScores = (scores: PlayerScore[]) => void;

const ScoreContext = createContext<PlayerScore[]>([]);
const SetScoreContext = createContext<UpdateScores>(() => {});

export function useScores() {
  return useContext(ScoreContext);
}
export function useSetScores() {
  return useContext(SetScoreContext);
}

export default function ScoresProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [score, setScore] = useState<PlayerScore[]>([]);

  // prettier-ignore
  return (
    <ScoreContext.Provider value={score}>
      <SetScoreContext.Provider value={setScore}>
        {children}
      </SetScoreContext.Provider>
    </ScoreContext.Provider>
  );
}
