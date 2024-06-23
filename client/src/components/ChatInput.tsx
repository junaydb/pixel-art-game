import { useState } from "react";
import { useChatUpdate } from "@/providers/ChatProvider";
import { useWord } from "@/providers/WordProvider";
import { useScores, useSetScores } from "@/providers/ScoresProvider";

export default function ChatInput() {
  const [input, setInput] = useState("");

  const currentWord = useWord();
  const chatUpdate = useChatUpdate();
  const scores = useScores();
  const setScores = useSetScores();

  function handleGuess(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (!input) return;

    if (input !== currentWord) {
      chatUpdate(input);
      setInput("");
    }

    if (input === currentWord) {
      // setScores(
      // scores.map((player) => {
      // if (player.id === thisPlayersId) {
      // player.score += 100;
      // return { ...player, score: (player.score += 100) };
      // } else {
      // return player;
      // }
      // })
      // );
      chatUpdate(`${input} is correct!`);
      setInput("");
    }
  }

  return (
    <form className="w-inherit" onSubmit={handleGuess} action="submit">
      <input
        value={input}
        onChange={(e) => setInput(e.target.value)}
        type="text"
        className="h-7 w-inherit rounded border border-black p-1"
      />
    </form>
  );
}
