import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import logo from "@/assets/logo.png";

// Hook personalizado para scroll spy
function useScrollSpy(ids: string[]) {
  const [activeId, setActiveId] = useState(ids[0]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        });
      },
      { threshold: 0.5 }
    );

    ids.forEach((id) => {
      const element = document.getElementById(id);
      if (element) observer.observe(element);
    });

    return () => observer.disconnect();
  }, [ids]);

  return activeId;
}

export default function Landing() {
  const navigate = useNavigate();
  const activeSection = useScrollSpy(["tela1", "tela2b", "tela3", "tela4", "tela6"]);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="bg-[#000303] text-white min-h-screen font-['Montserrat',sans-serif]">
      {/* NAVBAR */}
      <header
        className={`fixed top-0 left-0 w-full h-16 px-6 z-[1000] flex items-center justify-between transition-all duration-300 ${
          isScrolled
            ? "bg-[rgba(9,15,36,0.85)] backdrop-blur-xl border-b border-white/10"
            : "bg-[rgba(9,15,36,0.75)] backdrop-blur-xl border-b border-white/10"
        }`}
      >
        <div className="navbar-logo">
          <img src={logo} alt="Orbitta Logo" draggable="false" className="h-8" />
        </div>
        <nav className="hidden md:flex gap-10">
          {[
            { href: "#tela1", label: "Início", id: "tela1" },
            { href: "#tela2b", label: "O problema", id: "tela2b" },
            { href: "#tela3", label: "A solução", id: "tela3" },
            { href: "#tela4", label: "Funcionalidades", id: "tela4" },
            { href: "#tela6", label: "Nossa Órbita", id: "tela6" },
          ].map((link) => (
            <a
              key={link.id}
              href={link.href}
              className={`relative text-sm py-1 transition-colors duration-300 after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-full after:h-0.5 after:bg-[#E09F7D] after:scale-x-0 after:origin-bottom-right after:transition-transform after:duration-300 hover:text-[#E09F7D] hover:after:scale-x-100 hover:after:origin-bottom-left ${
                activeSection === link.id
                  ? "text-[#E09F7D] after:scale-x-100 after:origin-bottom-left"
                  : "text-white"
              }`}
            >
              {link.label}
            </a>
          ))}
        </nav>
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate("/login")}
            className="px-6 py-2 bg-transparent border-2 border-transparent bg-gradient-to-r from-[#E09F7D] to-white bg-clip-border text-white text-sm font-medium rounded-lg transition-all duration-300 hover:bg-gradient-to-r hover:from-[rgba(224,159,125,0.2)] hover:to-[rgba(255,255,255,0.05)] hover:text-[#E09F7D] hover:-translate-y-0.5 hover:shadow-[0_4px_12px_rgba(224,159,125,0.3)]"
            style={{
              borderImage: "linear-gradient(90deg, #E09F7D, #FFFFFF) 1",
            }}
          >
            Entrar
          </button>
          <button
            onClick={() => navigate("/login")}
            className="px-6 py-2 bg-transparent border-2 border-transparent bg-gradient-to-r from-[#E09F7D] to-white bg-clip-border text-white text-sm font-medium rounded-lg transition-all duration-300 hover:bg-gradient-to-r hover:from-[rgba(224,159,125,0.2)] hover:to-[rgba(255,255,255,0.05)] hover:text-[#E09F7D] hover:-translate-y-0.5 hover:shadow-[0_4px_12px_rgba(224,159,125,0.3)]"
            style={{
              borderImage: "linear-gradient(90deg, #E09F7D, #FFFFFF) 1",
            }}
          >
            Cadastrar
          </button>
        </div>
      </header>

      {/* HERO SECTION */}
      <section
        id="tela1"
        className="h-screen relative flex items-center justify-center text-center overflow-hidden"
        style={{
          background: "radial-gradient(circle at bottom, #012873 0%, #000303 80%)",
        }}
      >
        <div className="z-10 flex flex-col items-center max-w-3xl px-6">
          <h2
            className="font-['Michroma',sans-serif] text-4xl md:text-5xl mb-6 tracking-tight bg-gradient-to-b from-white to-[#E09F7D] bg-clip-text text-transparent"
          >
            Conectando talentos em uma única órbita
          </h2>
          <p className="text-base md:text-lg max-w-md mb-6 leading-relaxed opacity-90">
            Do ponto de partida ao sucesso, uma plataforma que potencializa o desenvolvimento e alinha a estratégia da sua equipe.
          </p>
          <button
            onClick={() => navigate("/login")}
            className="px-6 py-3 text-sm border-none rounded bg-gradient-to-r from-[#012873] to-[#E09F7D] text-white font-medium uppercase tracking-wider shadow-lg transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl"
          >
            Começar agora
          </button>
        </div>

        {/* Decorative rings */}
        <div className="absolute top-1/2 left-1/2 w-96 h-96 border border-white/40 rounded-full -translate-x-1/2 -translate-y-1/2 animate-[spin_25s_linear_infinite] opacity-20" />
        <div className="absolute top-1/2 left-1/2 w-[560px] h-[560px] border border-white/40 rounded-full -translate-x-1/2 -translate-y-1/2 animate-[spin_40s_linear_infinite] opacity-20" />
        <div className="absolute top-1/2 left-1/2 w-[760px] h-[760px] border border-white/40 rounded-full -translate-x-1/2 -translate-y-1/2 animate-[spin_55s_linear_infinite] opacity-20" />

        {/* Curved bottom */}
        <div className="absolute bottom-0 left-0 w-full h-[50vh] overflow-hidden">
          <div
            className="absolute -bottom-[190vh] h-[200vh] w-full left-0 bg-[#090F24] z-[1] shadow-[0_-20px_100px_20px_rgba(255,255,255,0.3),0_-1px_15px_-1px_rgba(255,255,255,0.5)_inset]"
            style={{
              borderTopLeftRadius: "50vw 11vh",
              borderTopRightRadius: "50vw 11vh",
            }}
          />
        </div>
      </section>

      {/* SECTION: OBSTACLES */}
      <section id="tela2b" className="min-h-screen bg-[#090F24] py-24 px-6">
        <div className="text-center mb-16">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">Obstáculos enfrentados</h1>
          <p className="text-base md:text-lg opacity-80">
            Problemas que atingem a sua órbita e desviam a rota de crescimento da sua equipe.
          </p>
        </div>

        <div className="max-w-7xl mx-auto space-y-16">
          {/* Box 1 */}
          <div className="flex flex-col md:flex-row items-center gap-8">
            <div className="flex-1">
              <h2 className="text-2xl font-bold mb-4">O Vácuo do Feedback</h2>
              <p className="text-base opacity-80 leading-relaxed">
                Apesar de 70% dos profissionais de TI considerarem o feedback regular fundamental, a maioria não o recebe. Essa desconexão gera desmotivação, ansiedade e um sentimento de que o trabalho não está sendo visto.
              </p>
            </div>
            <div className="flex-1 min-h-[300px] relative flex items-center justify-center">
              <div className="text-6xl opacity-20">📊</div>
            </div>
          </div>

          {/* Box 2 */}
          <div className="flex flex-col md:flex-row-reverse items-center gap-8">
            <div className="flex-1 text-left md:text-right">
              <h2 className="text-2xl font-bold mb-4">A Lacuna da Gestão</h2>
              <p className="text-base opacity-80 leading-relaxed">
                Apenas 64% das empresas brasileiras possuem um processo formal de avaliação de desempenho. Sem ele, líderes e equipes ficam sem uma direção clara para o crescimento, gerando um ciclo de ineficiência e incerteza.
              </p>
            </div>
            <div className="flex-1 min-h-[300px] relative flex items-center justify-center">
              <div className="text-6xl opacity-20">🎯</div>
            </div>
          </div>

          {/* Box 3 */}
          <div className="flex flex-col md:flex-row items-center gap-8">
            <div className="flex-1">
              <h2 className="text-2xl font-bold mb-4">O Custo da Incerteza</h2>
              <p className="text-base opacity-80 leading-relaxed">
                Para 43% dos profissionais de TI, a falta de um plano de carreira claro é o principal motivo para a troca de emprego. A ausência de perspectivas de crescimento se torna um alto custo de rotatividade para a empresa.
              </p>
            </div>
            <div className="flex-1 min-h-[300px] relative flex items-center justify-center">
              <div className="text-6xl opacity-20">💼</div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION: SOLUTION */}
      <section id="tela3" className="min-h-screen bg-[#000303] py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl md:text-4xl font-bold text-center mb-16">
            Nossa <span className="text-[#E09F7D]">Solução</span>
          </h1>

          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-4">
              <div className="h-96 bg-gradient-to-br from-[#012873] to-[#E09F7D] rounded-2xl opacity-30" />
            </div>

            <div className="space-y-8">
              <div className="flex gap-6">
                <div className="w-16 h-16 rounded-xl bg-[#012873] flex items-center justify-center text-2xl flex-shrink-0">
                  📊
                </div>
                <div>
                  <h2 className="text-xl font-bold mb-2">Para o Líder</h2>
                  <p className="opacity-80">
                    Oferece visibilidade total das competências da equipe, transformando gestão em liderança estratégica.
                  </p>
                </div>
              </div>

              <div className="flex gap-6">
                <div className="w-16 h-16 rounded-xl bg-[#F7C9AE] flex items-center justify-center text-2xl flex-shrink-0">
                  ❤️
                </div>
                <div>
                  <h2 className="text-xl font-bold mb-2">Para o Liderado</h2>
                  <p className="opacity-80">
                    Cria um caminho claro de evolução profissional, conectando carreira e projetos.
                  </p>
                </div>
              </div>

              <div className="flex gap-6">
                <div className="w-16 h-16 rounded-xl bg-[#012873] flex items-center justify-center text-2xl flex-shrink-0">
                  💼
                </div>
                <div>
                  <h2 className="text-xl font-bold mb-2">Para a Empresa</h2>
                  <p className="opacity-80">
                    Garante retenção de talentos e acelera resultados, cultivando uma cultura de crescimento.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION: FEATURES */}
      <section id="tela4" className="min-h-screen bg-[#090F24] py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl md:text-4xl font-bold text-center mb-16">Funcionalidades</h1>

          <div className="grid md:grid-cols-2 gap-12">
            <div className="space-y-6">
              {[
                {
                  title: "Gráfico 'VERSUS'",
                  desc: "Compare as competências atuais do colaborador com o perfil ideal do cargo de forma visual e intuitiva.",
                },
                {
                  title: "Painel de Maturidade",
                  desc: "Visualize a distribuição de maturidade (M1-M4) de toda a sua equipe em um único gráfico de quadrante.",
                },
                {
                  title: "Contextualize novos membros",
                  desc: "rapidamente com uma página central de objetivos, links e responsabilidades.",
                },
                {
                  title: "Linha do Tempo",
                  desc: "Registre e consulte feedbacks e marcos de desenvolvimento em um histórico cronológico e de fácil acesso.",
                },
              ].map((feature, i) => (
                <div key={i} className="flex gap-4">
                  <div className="w-8 h-8 rounded-full bg-[#E09F7D] flex items-center justify-center flex-shrink-0 text-white font-bold">
                    ✓
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                    <p className="opacity-80 text-sm">{feature.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex items-center justify-center">
              <div className="w-full max-w-md h-96 bg-gradient-to-br from-[#012873]/30 to-[#E09F7D]/30 rounded-2xl flex items-center justify-center">
                <div className="text-center">
                  <div className="text-6xl mb-4">👨‍💼</div>
                  <h2 className="text-2xl font-bold mb-2">Líder Técnico</h2>
                  <p className="opacity-60">Dores do Líder</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION: METHODOLOGY */}
      <section id="tela6" className="min-h-screen bg-[#000303] py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl md:text-4xl font-bold text-center mb-4">As Leis da Nossa Órbita</h1>
          <p className="text-center opacity-80 mb-16">Nossa metodologia é baseada em ciência, não em achismos</p>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Card 1 */}
            <div className="bg-[#090F24] rounded-2xl p-8 border border-white/10">
              <div className="text-4xl mb-4">⚡</div>
              <h2 className="text-2xl font-bold mb-4">Liderança Situacional</h2>
              <p className="opacity-80 mb-6">
                Defende que não existe um único estilo de liderança eficaz. O líder deve adaptar sua postura de acordo com o{" "}
                <span className="text-[#E09F7D] font-semibold">nível de maturidade do liderado (M1 a M4)</span>. A Orbitta oferece recursos que facilitam a aplicação dessa teoria, permitindo que líderes ajustem seus métodos de gestão em tempo real.
              </p>
              <div className="flex gap-2 mb-2">
                <span className="px-3 py-1 bg-red-500 rounded text-xs font-semibold">M1</span>
                <span className="px-3 py-1 bg-orange-500 rounded text-xs font-semibold">M2</span>
                <span className="px-3 py-1 bg-yellow-500 rounded text-xs font-semibold">M3</span>
                <span className="px-3 py-1 bg-green-500 rounded text-xs font-semibold">M4</span>
              </div>
              <div className="flex justify-between text-xs opacity-60">
                <span>Iniciante</span>
                <span>Aprendiz</span>
                <span>Competente</span>
                <span>Expert</span>
              </div>
            </div>

            {/* Card 2 */}
            <div className="bg-[#090F24] rounded-2xl p-8 border border-white/10">
              <div className="text-4xl mb-4">📊</div>
              <h2 className="text-2xl font-bold mb-4">Gestão por Competências</h2>
              <p className="opacity-80 mb-6">
                Define competência como um conjunto integrado de{" "}
                <span className="text-[#E09F7D] font-semibold">conhecimentos (saber)</span>,{" "}
                <span className="text-[#E09F7D] font-semibold">habilidades (saber fazer)</span> e{" "}
                <span className="text-[#E09F7D] font-semibold">atitudes (querer fazer)</span>. Na Orbitta, isso se traduz em trilhas personalizadas de desenvolvimento e uma visão clara de gaps individuais, garantindo que o talento cresça de forma orientada.
              </p>
              <div className="flex gap-2 mb-2">
                <span className="px-3 py-1 bg-blue-500 rounded text-xs font-semibold">K</span>
                <span className="px-3 py-1 bg-green-500 rounded text-xs font-semibold">S</span>
                <span className="px-3 py-1 bg-purple-500 rounded text-xs font-semibold">A</span>
              </div>
              <div className="flex justify-between text-xs opacity-60">
                <span>Conhecimento</span>
                <span>Habilidade</span>
                <span>Atitude</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-[#090F24] border-t border-white/10 py-12 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 gap-8 mb-8">
            <div>
              <img src={logo} alt="Orbitta Logo" className="h-10 mb-4 opacity-80" />
              <p className="opacity-60 text-sm">
                Do ponto de partida ao sucesso, uma plataforma que sincroniza a estratégia e o desempenho de toda a equipe.
              </p>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Plataforma</h4>
              <ul className="space-y-2 text-sm opacity-60">
                <li>
                  <a href="#tela1" className="hover:text-[#E09F7D] transition-colors">
                    Home
                  </a>
                </li>
                <li>
                  <a href="#tela2b" className="hover:text-[#E09F7D] transition-colors">
                    Problemas
                  </a>
                </li>
                <li>
                  <a href="#tela3" className="hover:text-[#E09F7D] transition-colors">
                    Solução
                  </a>
                </li>
                <li>
                  <a href="#tela6" className="hover:text-[#E09F7D] transition-colors">
                    Metodologia
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-white/10 pt-8 text-center text-sm opacity-60">
            <p>© 2025 Orbitta. Todos os direitos reservados.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
