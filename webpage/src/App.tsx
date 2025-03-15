import { Routes, Route} from "react-router-dom";
import './App.css'
import { Home } from "./pages/Home";
import { Game } from "./pages/Game";
import { Auth } from "./pages/Auth";
import { Callback } from "./pages/Callback";

function App() {
  return (
    <div className="min-h-screen w-full bg-[#F4EDED]">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/auth" element={<Auth />} />
        <Route path="/auth/callback" element={<Callback />} />
        <Route path="/games/:gameId" element={<Game />} />
      </Routes>
    </div>
  )
}

export default App
