import { Outlet } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Chatbot from "@/components/Chatbot";
import BackToTop from "@/components/BackToTop";

// Shell compartilhado: navbar + conteúdo + rodapé + ferramentas flutuantes
export default function Layout() {
  return (
    <div className="flex min-h-screen flex-col prism-gradient">
      <Navbar />
      <main className="flex-1 pt-16">
        <Outlet />
      </main>
      <Footer />
      <BackToTop />
      <Chatbot />
    </div>
  );
}