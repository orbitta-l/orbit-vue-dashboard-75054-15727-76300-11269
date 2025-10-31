import { Users, User, Building2 } from "lucide-react";
import { useEffect, useRef } from "react";

const solutions = [
  {
    icon: Users,
    title: "Para o Líder",
    description:
      "Oferece visibilidade total das competências da equipe, transformando gestão em liderança estratégica.",
    gradient: "from-[#012873] to-[#3142ff]",
  },
  {
    icon: User,
    title: "Para o Liderado",
    description:
      "Cria um caminho claro de evolução profissional, conectando carreira e projetos.",
    gradient: "from-[#E09F7D] to-[#d88a68]",
  },
  {
    icon: Building2,
    title: "Para a Empresa",
    description:
      "Garante retenção de talentos e acelera resultados, cultivando uma cultura de crescimento.",
    gradient: "from-[#012873] to-[#E09F7D]",
  },
];

const SolutionCard = ({ solution, index }: { solution: typeof solutions[0]; index: number }) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const Icon = solution.icon;

  useEffect(() => {
    const card = cardRef.current;
    if (!card) return;

    const createCloudBubble = () => {
      const bubble = document.createElement("div");
      bubble.className = "cloud-bubble";
      
      // Random horizontal position relative to card
      const randomX = Math.random() * 100;
      bubble.style.left = randomX + "%";
      
      // Random size between 4px and 12px
      const size = Math.random() * 8 + 4;
      bubble.style.width = size + "px";
      bubble.style.height = size + "px";
      
      // Random animation duration
      bubble.style.animationDuration = (Math.random() * 2 + 2) + "s";
      
      card.appendChild(bubble);
      
      // Remove bubble after animation completes
      setTimeout(() => {
        bubble.remove();
      }, 4000);
    };

    // Create bubbles at intervals
    const intervalId = setInterval(createCloudBubble, 300);

    return () => {
      clearInterval(intervalId);
    };
  }, []);

  return (
    <div
      ref={cardRef}
      className="group relative bg-white rounded-2xl p-8 shadow-xl hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 overflow-visible"
    >
      <div
        className={`w-20 h-20 bg-gradient-to-br ${solution.gradient} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg`}
      >
        <Icon className="w-10 h-10 text-white" />
      </div>

      <h3 className="text-2xl font-bold text-gray-900 mb-4">
        {solution.title}
      </h3>

      <p className="text-gray-700 leading-relaxed">
        {solution.description}
      </p>

      {/* Decorative corner accent */}
      <div
        className={`absolute top-0 right-0 w-24 h-24 bg-gradient-to-br ${solution.gradient} opacity-10 rounded-bl-[100%] rounded-tr-2xl`}
      ></div>
    </div>
  );
};

const Solution = () => {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const createGradientBubble = () => {
      const bubble = document.createElement("div");
      bubble.className = "gradient-bubble";
      
      // Random horizontal position
      const randomX = Math.random() * 100;
      bubble.style.left = randomX + "%";
      
      // Random size between 20px and 50px (maiores que as outras)
      const size = Math.random() * 30 + 20;
      bubble.style.width = size + "px";
      bubble.style.height = size + "px";
      
      // Random animation duration
      bubble.style.animationDuration = (Math.random() * 3 + 4) + "s";
      
      // Random delay for staggered effect
      bubble.style.animationDelay = Math.random() * 2 + "s";
      
      section.appendChild(bubble);
      
      // Remove bubble after animation completes
      setTimeout(() => {
        bubble.remove();
      }, 9000);
    };

    // Create bubbles at intervals
    const intervalId = setInterval(createGradientBubble, 600);

    return () => {
      clearInterval(intervalId);
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      id="solucao"
      className="relative py-24 px-6 overflow-hidden"
      style={{
        background: "linear-gradient(to bottom, #090F24 0%, #ffffff 100%)",
      }}
    >
      <div className="max-w-7xl mx-auto relative z-10">
        <h2 className="text-4xl md:text-5xl font-bold text-center text-white mb-4">
          A <span className="text-[#E09F7D]">Solução</span>
        </h2>
        <p className="text-center text-white/90 mb-16 max-w-2xl mx-auto">
          Uma plataforma completa que atende todas as necessidades
        </p>

        <div className="grid md:grid-cols-3 gap-8">
          {solutions.map((solution, index) => (
            <SolutionCard key={index} solution={solution} index={index} />
          ))}
        </div>
      </div>

      <style>{`
        .cloud-bubble {
          position: absolute;
          top: -10px;
          background: rgba(255, 255, 255, 0.7);
          border-radius: 50%;
          pointer-events: none;
          animation: floatUp 3s ease-in forwards;
        }
        
        @keyframes floatUp {
          0% {
            transform: translateY(0) scale(1);
            opacity: 0.7;
          }
          50% {
            opacity: 0.5;
          }
          100% {
            transform: translateY(-150px) scale(0.5);
            opacity: 0;
          }
        }
        
        .gradient-bubble {
          position: absolute;
          bottom: 0;
          background: rgba(255, 255, 255, 0.4);
          border-radius: 50%;
          pointer-events: none;
          animation: floatUpGradient 6s ease-out forwards;
          z-index: 1;
        }
        
        @keyframes floatUpGradient {
          0% {
            transform: translateY(0) translateX(0) scale(1);
            opacity: 0.6;
          }
          25% {
            transform: translateY(-25vh) translateX(-20px) scale(1.1);
            opacity: 0.5;
          }
          50% {
            transform: translateY(-50vh) translateX(10px) scale(1);
            opacity: 0.4;
          }
          75% {
            transform: translateY(-75vh) translateX(-10px) scale(0.8);
            opacity: 0.2;
          }
          100% {
            transform: translateY(-100vh) translateX(0) scale(0.5);
            opacity: 0;
          }
        }
      `}</style>
    </section>
  );
};

export default Solution;
