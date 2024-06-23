import "./index.css";
import GlobalProvider from "./providers/GlobalProvider";
import Lobby from "./views/Lobby";
import Game from "./views/Game";
import { useView } from "./providers/ViewProvider";

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
