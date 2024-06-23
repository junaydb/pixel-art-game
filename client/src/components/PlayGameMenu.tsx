import { useState } from "react";
import { useSetView } from "@/providers/ViewProvider";
import { joinGame } from "@/socket/socket-handlers";
import { useSocket } from "@/providers/SocketProvider";

export default function PlayGameMenu() {
  const [input, setInput] = useState("");
  const socket = useSocket();
  const setView = useSetView();

  function handlePlayButton() {
    joinGame(input, socket);
    setView("GAME");
  }

  return (
    <form className="w-inherit" onSubmit={handlePlayButton} action="submit">
      <label>
        Nickname:
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          type="text"
          className="rounded border border-black p-1"
        />
      </label>
      <div>
        <button type="submit" onClick={() => handlePlayButton}>
          Play
        </button>
      </div>
    </form>
  );
}
