import "./index.css";
import GlobalProvider from "./providers/GlobalProvider";
import { useView } from "./providers/ViewProvider";
import Game from "./views/Game";
import Lobby from "./views/Lobby";

export default function App() {
  const view = useView();

  switch (view) {
    case "LOBBY":
      return (
        <GlobalProvider>
          <Lobby />
        </GlobalProvider>
      );
    case "GAME":
      return (
        <GlobalProvider>
          <Game />
        </GlobalProvider>
      );
  }
}
