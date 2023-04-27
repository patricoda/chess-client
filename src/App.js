import "./App.css";
import Game from "./components/game";
import useSocketIo from "./hooks/useSocketIo";

function App() {
  const { socket, isOnline } = useSocketIo();
  return (
    <div className="App">
      <div>{`${isOnline}`}</div>
      <Game />
    </div>
  );
}

export default App;
