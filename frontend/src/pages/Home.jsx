import Navbar from "../components/Navbar";
import Hero from "../components/Hero";
import ProductsSection from "../components/ProductsSection";
import LoginModal from "../components/LoginModal";
import Footer from "../components/Footer";
import { useState } from "react";

export default function Home() {
  const [modalOpen, setModalOpen] = useState(true);
  return (
    <div style={{ fontFamily: "'Segoe UI', sans-serif", background: "#f8f9ff" }}>
      <Navbar onLogin={() => setModalOpen(true)} />
      <Hero onLogin={() => setModalOpen(true)} />
      <ProductsSection />
      <Footer />
      <LoginModal open={modalOpen} onClose={() => setModalOpen(false)} />
    </div>
  );
}
