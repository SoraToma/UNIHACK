import { Routes, Route} from "react-router-dom";
import './App.css'
import { Home } from "./pages/Home";
import { Game } from "./pages/Game";

function App() {
  return (
    <div className="h-auto w-full bg-[#F4EDED]">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/auth" element={<Home />} />
        <Route path="/games/:gameId" element={<Game />} />
      </Routes>
    </div>
  )
}

export default App
