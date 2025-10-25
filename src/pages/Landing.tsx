import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import logo from '@/assets/logo.png';

// Hook para detectar seção ativa baseado em scroll
function useScrollSpy(sectionIds: string[]) {
  const [activeSection, setActiveSection] = useState<string>(sectionIds[0]);

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + 100;

      for (const id of sectionIds) {
        const element = document.getElementById(id);
        if (element) {
          const { offsetTop, offsetHeight } = element;
          if (scrollPosition >= offsetTop && scrollPosition < offsetTop + offsetHeight) {
            setActiveSection(id);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [sectionIds]);

  return activeSection;
}

export default function Landing() {
  const navigate = useNavigate();
  const [isScrolled, setIsScrolled] = useState(false);
  const [currentLeaderFeature, setCurrentLeaderFeature] = useState(0);
  const [currentEmployeeFeature, setCurrentEmployeeFeature] = useState(0);

  const sectionIds = ['inicio', 'obstaculos', 'solucao', 'funcionalidades', 'leis'];
  const activeSection = useScrollSpy(sectionIds);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    // Gerar estrelas
    const starContainer = document.getElementById('stars');
    if (starContainer) {
      for (let i = 0; i < 150; i++) {
        const star = document.createElement('div');
        star.className = 'absolute rounded-full bg-white';
        star.style.top = Math.random() * 100 + '%';
        star.style.left = Math.random() * 100 + '%';
        const size = Math.random() * 2 + 1;
        star.style.width = size + 'px';
        star.style.height = size + 'px';
        star.style.opacity = '0.8';
        star.style.animation = `twinkle ${Math.random() * 2 + 1}s ease-in-out infinite`;
        starContainer.appendChild(star);
      }
    }
  }, []);

  const leaderFeatures = [
    {
      title: 'Gráfico VERSUS',
      description: 'Compare as competências atuais do colaborador com o perfil ideal do cargo de forma visual e intuitiva.',
    },
    {
      title: 'Painel de Maturidade',
      description: 'Visualize a distribuição de maturidade (M1-M4) de toda a sua equipe em um único gráfico de quadrante.',
    },
    {
      title: 'Contextualize novos membros',
      description: 'Rapidamente com uma página central de objetivos, links e responsabilidades.',
    },
    {
      title: 'Linha do Tempo',
      description: 'Registre e consulte feedbacks e marcos de desenvolvimento em um histórico cronológico e de fácil acesso.',
    },
  ];

  const employeeFeatures = [
    {
      title: 'Relatórios de Desempenho',
      description: 'Acesse relatórios claros e objetivos sobre suas competências e evolução ao longo do tempo.',
    },
    {
      title: 'Plano de Desenvolvimento',
      description: 'Visualize suas lacunas e receba sugestões personalizadas de como evoluir profissionalmente.',
    },
    {
      title: 'Histórico de Feedbacks',
      description: 'Consulte todos os feedbacks recebidos e acompanhe seu progresso de forma transparente.',
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Navbar */}
      <header
        className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 border-b ${
          isScrolled
            ? 'bg-white/10 backdrop-blur-[20px] border-white/20 shadow-lg'
            : 'bg-white/5 backdrop-blur-[16px] border-white/20 shadow-md'
        }`}
      >
        <nav className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <a href="#inicio">
            <img src={logo} alt="Orbitta Logo" className="h-8" />
          </a>

          <div className="hidden md:flex gap-10">
            {sectionIds.map((id) => (
              <a
                key={id}
                href={`#${id}`}
                className={`text-white/90 relative transition-colors hover:text-accent ${
                  activeSection === id ? 'text-accent' : ''
                }`}
              >
                {id === 'inicio' && 'Início'}
                {id === 'obstaculos' && 'O problema'}
                {id === 'solucao' && 'A solução'}
                {id === 'funcionalidades' && 'Funcionalidades'}
                {id === 'leis' && 'Nossa Órbita'}
                <span className="absolute bottom-0 left-0 w-0 h-[2px] bg-accent transition-all duration-300 hover:w-full" />
              </a>
            ))}
          </div>

          <button
            onClick={() => navigate('/login')}
            className="hidden md:block px-6 py-2.5 bg-gradient-to-r from-accent to-[#d88a68] text-white font-semibold rounded-full transition-all hover:scale-105 hover:shadow-[0_10px_25px_rgba(239,159,125,0.3)]"
          >
            Acessar Plataforma
          </button>
        </nav>
      </header>

      {/* Hero Section */}
      <section
        id="inicio"
        className="relative min-h-screen flex items-center justify-center text-center overflow-hidden"
        style={{
          background: 'radial-gradient(circle at bottom, hsl(215, 100%, 23%) 0%, hsl(223, 83%, 7%) 80%)',
        }}
      >
        <div className="relative z-10 max-w-3xl px-6 animate-[fadeIn_0.8s_ease-out]">
          <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-white to-accent bg-clip-text text-transparent">
            Conectando talentos em uma única órbita
          </h1>
          <p className="text-lg md:text-xl text-white/90 mb-8 max-w-2xl mx-auto">
            Do ponto de partida ao sucesso, uma plataforma que potencializa o desenvolvimento e alinha a estratégia da sua equipe.
          </p>
          <button
            onClick={() => navigate('/login')}
            className="relative px-10 py-4 bg-gradient-to-r from-primary to-accent text-white font-bold rounded-full overflow-hidden transition-all duration-500 hover:scale-105 hover:shadow-[0_20px_50px_rgba(239,159,125,0.5)] z-[1] before:content-[''] before:absolute before:inset-0 before:bg-gradient-to-r before:from-accent before:to-primary before:opacity-0 before:transition-opacity before:duration-500 before:z-[-1] hover:before:opacity-100"
          >
            COMEÇAR AGORA
          </button>
        </div>

        <div id="stars" className="absolute inset-0 z-0" />

        {/* Orbital rings */}
        {[
          { size: 'w-[45vh] h-[45vh]', duration: '25s' },
          { size: 'w-[70vh] h-[70vh]', duration: '40s' },
          { size: 'w-[95vh] h-[95vh]', duration: '55s' },
        ].map((ring, i) => (
          <div
            key={i}
            className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 border border-white/40 rounded-full opacity-20 z-[1] ${ring.size}`}
            style={{ animation: `rotateRing ${ring.duration} linear infinite` }}
          />
        ))}

        {/* Galaxy rings */}
        {[
          { size: 'w-[80vh] h-[45vh]', duration: '120s' },
          { size: 'w-[100vh] h-[50vh]', duration: '150s', opacity: 0.08 },
        ].map((ring, i) => (
          <div
            key={i}
            className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 border-2 border-white/15 rounded-full z-0 ${ring.size}`}
            style={{
              animation: `rotateGalaxy ${ring.duration} linear infinite`,
              filter: 'blur(1px)',
              transform: 'translate(-50%, -50%) rotateX(65deg) rotateZ(25deg)',
              opacity: ring.opacity || 1,
            }}
          />
        ))}

        {/* Curved bottom */}
        <div className="absolute bottom-0 left-0 w-full h-[50vh] overflow-hidden">
          <div
            className="absolute bottom-[-190vh] h-[200vh] w-full left-0 bg-primary-dark z-[1] shadow-[0_-20px_100px_20px_rgba(255,255,255,0.3),0_-1px_15px_-1px_rgba(255,255,255,0.5)_inset]"
            style={{
              borderTopLeftRadius: '50vw 11vh',
              borderTopRightRadius: '50vw 11vh',
            }}
          />
        </div>

        <style>{`
          @keyframes twinkle {
            0%, 100% { opacity: 0.2; transform: scale(0.8); }
            50% { opacity: 1; transform: scale(1.2); }
          }
          @keyframes rotateRing {
            from { transform: translate(-50%, -50%) rotate(0deg); }
            to { transform: translate(-50%, -50%) rotate(360deg); }
          }
          @keyframes rotateGalaxy {
            from { transform: translate(-50%, -50%) rotateX(65deg) rotateZ(0deg); }
            to { transform: translate(-50%, -50%) rotateX(65deg) rotateZ(360deg); }
          }
          @keyframes fadeIn {
            0% { opacity: 0; transform: translateY(20px); }
            100% { opacity: 1; transform: translateY(0); }
          }
        `}</style>
      </section>

      {/* Obstacles Section */}
      <section id="obstaculos" className="relative py-24 bg-primary-dark text-white">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-4xl md:text-5xl font-bold text-center mb-16 bg-gradient-to-r from-white to-accent bg-clip-text text-transparent">
            Os Obstáculos que Enfrentamos
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                title: 'Falta de Visibilidade',
                description: 'Líderes não têm uma visão clara das competências e lacunas de desenvolvimento de suas equipes.',
                icon: '👁️',
              },
              {
                title: 'Processos Manuais',
                description: 'Avaliações de desempenho feitas em planilhas dispersas, sem histórico ou análise consolidada.',
                icon: '📋',
              },
              {
                title: 'Desalinhamento',
                description: 'Colaboradores não sabem onde estão nem para onde ir, gerando desmotivação e turnover.',
                icon: '🎯',
              },
            ].map((obstacle, i) => (
              <div
                key={i}
                className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8 hover:bg-white/10 transition-all duration-300 hover:scale-105"
              >
                <div className="text-5xl mb-4">{obstacle.icon}</div>
                <h3 className="text-2xl font-bold mb-4">{obstacle.title}</h3>
                <p className="text-white/80">{obstacle.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Solution Section */}
      <section id="solucao" className="relative py-24 bg-gradient-to-b from-primary-dark to-primary text-white">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-4xl md:text-5xl font-bold text-center mb-16 bg-gradient-to-r from-white to-accent bg-clip-text text-transparent">
            A Solução: Orbitta
          </h2>
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h3 className="text-3xl font-bold mb-6">Uma plataforma completa para gestão de pessoas</h3>
              <p className="text-lg text-white/90 mb-6">
                Orbitta centraliza avaliações de competências, feedbacks e planos de desenvolvimento em uma interface intuitiva e visual.
              </p>
              <ul className="space-y-4">
                {[
                  'Avaliações estruturadas por competências técnicas e comportamentais',
                  'Gráficos de radar (VERSUS) comparando perfil atual vs. ideal',
                  'Matriz de maturidade (M1-M4) para visualizar toda a equipe',
                  'Histórico completo e linha do tempo de evolução',
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <span className="text-accent text-xl">✓</span>
                    <span className="text-white/90">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="relative">
              <div className="aspect-square bg-gradient-to-br from-accent/20 to-primary/20 rounded-3xl border border-white/20 flex items-center justify-center">
                <div className="text-6xl">🚀</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="funcionalidades" className="relative py-24 bg-primary text-white">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-4xl md:text-5xl font-bold text-center mb-16 bg-gradient-to-r from-white to-accent bg-clip-text text-transparent">
            Funcionalidades
          </h2>

          {/* Leader Features */}
          <div className="mb-20">
            <h3 className="text-3xl font-bold mb-8 text-center">Para Líderes</h3>
            <div className="grid md:grid-cols-2 gap-8">
              {leaderFeatures.map((feature, i) => (
                <div
                  key={i}
                  className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8 hover:bg-white/10 transition-all duration-300"
                >
                  <h4 className="text-2xl font-bold mb-4 text-accent">{feature.title}</h4>
                  <p className="text-white/80">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Employee Features */}
          <div>
            <h3 className="text-3xl font-bold mb-8 text-center">Para Colaboradores</h3>
            <div className="grid md:grid-cols-3 gap-8">
              {employeeFeatures.map((feature, i) => (
                <div
                  key={i}
                  className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8 hover:bg-white/10 transition-all duration-300"
                >
                  <h4 className="text-2xl font-bold mb-4 text-accent">{feature.title}</h4>
                  <p className="text-white/80">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Laws Section */}
      <section id="leis" className="relative py-24 bg-gradient-to-b from-primary to-primary-dark text-white">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-4xl md:text-5xl font-bold text-center mb-16 bg-gradient-to-r from-white to-accent bg-clip-text text-transparent">
            Nossa Órbita: Princípios que nos Guiam
          </h2>
          <div className="grid md:grid-cols-2 gap-8">
            {[
              {
                title: 'Transparência',
                description: 'Dados claros e acessíveis para todos os envolvidos no processo de desenvolvimento.',
              },
              {
                title: 'Objetividade',
                description: 'Métricas e critérios bem definidos, eliminando subjetividade nas avaliações.',
              },
              {
                title: 'Evolução Contínua',
                description: 'Foco no crescimento progressivo, com feedbacks regulares e planos de ação.',
              },
              {
                title: 'Alinhamento Estratégico',
                description: 'Conectar competências individuais aos objetivos organizacionais.',
              },
            ].map((law, i) => (
              <div
                key={i}
                className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8 hover:bg-white/10 transition-all duration-300"
              >
                <h3 className="text-2xl font-bold mb-4 text-accent">{law.title}</h3>
                <p className="text-white/80">{law.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative py-12 bg-primary-dark text-white border-t border-white/10">
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex items-center gap-4">
              <img src={logo} alt="Orbitta Logo" className="h-8" />
              <span className="text-white/60">© 2025 Orbitta. Todos os direitos reservados.</span>
            </div>
            <div className="flex gap-6">
              <a href="#" className="text-white/60 hover:text-accent transition-colors">
                Termos de Uso
              </a>
              <a href="#" className="text-white/60 hover:text-accent transition-colors">
                Política de Privacidade
              </a>
              <a href="#" className="text-white/60 hover:text-accent transition-colors">
                Contato
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
