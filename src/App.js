import "./App.css";
import GameTypeSelector from "./components/gameTypeSelector";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import { Suspense, lazy, useContext } from "react";

const OfflineGame = lazy(() => import("./components/offlineGame"));
const OnlineGame = lazy(() => import("./components/onlineGame"));

function App() {
  return (
    <div className="wrapper">
      <Suspense fallback={<p>Loading...</p>}>
        <BrowserRouter basename="/">
          <Routes>
            <Route index element={<GameTypeSelector />} />
            <Route path="offline" element={<OfflineGame />} />
            <Route path="online" element={<OnlineGame />} />
          </Routes>
        </BrowserRouter>
      </Suspense>
    </div>
  );
}

export default App;
