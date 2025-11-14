import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import logo from "../assets/logo.svg"; // ajuste o caminho conforme sua estrutura

const Navbar = () => {
  const [activeSection, setActiveSection] = useState("inicio");
  const [isScrolled, setIsScrolled] = useState(false);
  const navigate = useNavigate();

  // Detecta rolagem para mudar o estilo da navbar
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Detecta qual seção está visível
  useEffect(() => {
    const sections = document.querySelectorAll("section[id]");
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      { threshold: 0.5 } // ativa quando 50% da seção está visível
    );

    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, []);

  return (
    <header
      className={`navbar ${isScrolled ? "navbar-scrolled" : "navbar-default"}`}
      id="navbar"
    >
      <nav className="navbar-content">
        {/* Logo */}
        <a href="#inicio" className="navbar-logo">
          <img src={logo} alt="Orbitta Logo" />
        </a>

        {/* Links */}
        <div className="navbar-links">
          <a
            href="#inicio"
            className={`nav-link ${activeSection === "inicio" ? "active" : ""}`}
          >
            Início
          </a>
          <a
            href="#obstaculos"
            className={`nav-link ${activeSection === "obstaculos" ? "active" : ""}`}
          >
            O Problema
          </a>
          <a
            href="#solucao"
            className={`nav-link ${activeSection === "solucao" ? "active" : ""}`}
          >
            A Solução
          </a>
          <a
            href="#funcionalidades"
            className={`nav-link ${activeSection === "funcionalidades" ? "active" : ""}`}
          >
            Funcionalidades
          </a>
          <a
            href="#leis"
            className={`nav-link ${activeSection === "leis" ? "active" : ""}`}
          >
            Nossa Órbita
          </a>
        </div>

        {/* Botão */}
        <button className="navbar-button" onClick={() => {
          console.log('Navbar: Acessar Plataforma button clicked, navigating to /login');
          navigate("/login");
        }}>
          Acessar Plataforma
        </button>
      </nav>

      {/* Estilos locais */}
      <style>{`
        .nav-link.active {
          color: #E09F7D;
        }

        .nav-link.active::after {
          content: "";
          position: absolute;
          bottom: -4px;
          left: 0;
          width: 100%;
          height: 2px;
          background: #E09F7D;
          border-radius: 2px;
        }

      `}</style>
    </header>
  );
};

export default Navbar;