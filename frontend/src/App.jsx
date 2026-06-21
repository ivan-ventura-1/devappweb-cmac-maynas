import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Dashboard from "./pages/Dashboard";
import Mora from "./pages/Mora";
import Calculadora from "./pages/Calculadora";
import Core from "./pages/Core";
import Movimientos from "./pages/Movimientos";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/mora" element={<Mora />} />
        <Route path="/calculadora" element={<Calculadora />} />
        <Route path="/core" element={<Core />} />
        <Route path="/movimientos" element={<Movimientos />} />
      </Routes>
    </BrowserRouter>
  );
}
