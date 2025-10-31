import { useState } from "react";
import { BarChart3, TrendingUp, BookOpen, Clock, FileText, MapPin, Users as UsersIcon, ChevronLeft, ChevronRight } from "lucide-react";

const leaderFeatures = [
  {
    icon: BarChart3,
    title: "Gráfico VERSUS",
    description: "Compare as competências atuais do colaborador com o perfil ideal do cargo de forma visual e intuitiva.",
  },
  {
    icon: TrendingUp,
    title: "Painel de Maturidade",
    description: "Visualize a distribuição de maturidade (M1-M4) de toda a sua equipe em um único gráfico de quadrante.",
  },
  {
    icon: UsersIcon,
    title: "Contextualize novos membros",
    description: "Rapidamente com uma página central de objetivos, links e responsabilidades.",
  },
  {
    icon: Clock,
    title: "Linha do Tempo",
    description: "Registre e consulte feedbacks e marcos de desenvolvimento em um histórico cronológico e de fácil acesso.",
  },
];

const employeeFeatures = [
  {
    icon: FileText,
    title: "Histórico de Feedback",
    description: "Consulte feedbacks salvos em linha cronológica para compreender os pontos fortes e pontos de melhoria.",
  },
  {
    icon: MapPin,
    title: "Trilha de Desenvolvimento",
    description: "Tenha acesso a uma trilha de desenvolvimento criado pelo próprio Líder para guiá-lo no projeto.",
  },
  {
    icon: BookOpen,
    title: "Onboarding do projeto",
    description: "Integração rápida e eficiente de novos membros à equipe e ao projeto.",
  },
];

const Features = () => {
  const [currentLeaderIndex, setCurrentLeaderIndex] = useState(0);
  const [currentEmployeeIndex, setCurrentEmployeeIndex] = useState(0);

  const nextLeader = () => {
    setCurrentLeaderIndex((prev) => (prev + 1) % leaderFeatures.length);
  };

  const prevLeader = () => {
    setCurrentLeaderIndex((prev) => (prev - 1 + leaderFeatures.length) % leaderFeatures.length);
  };

  const nextEmployee = () => {
    setCurrentEmployeeIndex((prev) => (prev + 1) % employeeFeatures.length);
  };

  const prevEmployee = () => {
    setCurrentEmployeeIndex((prev) => (prev - 1 + employeeFeatures.length) % employeeFeatures.length);
  };

  const LeaderIcon = leaderFeatures[currentLeaderIndex].icon;
  const EmployeeIcon = employeeFeatures[currentEmployeeIndex].icon;

  return (
    <section id="funcionalidades" className="bg-white py-24 px-6">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-4xl md:text-5xl font-bold text-center text-gray-900 mb-4">
          Funcionalidades
        </h2>
        <p className="text-center text-gray-600 mb-16 max-w-2xl mx-auto">
          Ferramentas poderosas para líderes e liderados
        </p>

        {/* Leader Features Carousel */}
        <div className="mb-20">
          <div className="flex items-center justify-center gap-3 mb-10">
            <div className="w-12 h-12 bg-gradient-to-br from-[#012873] to-[#3142ff] rounded-full flex items-center justify-center">
              <UsersIcon className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-3xl font-bold text-gray-900">Líder Técnico</h3>
          </div>

          <div className="relative max-w-2xl mx-auto">
            {/* Card */}
            <div className="bg-gradient-to-br from-gray-50 to-white rounded-xl p-8 border border-gray-200 shadow-xl min-h-[280px] flex flex-col items-center justify-center text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-[#012873] to-[#3142ff] rounded-lg flex items-center justify-center mb-6">
                <LeaderIcon className="w-8 h-8 text-white" />
              </div>
              <h4 className="text-2xl font-bold text-gray-900 mb-4">
                {leaderFeatures[currentLeaderIndex].title}
              </h4>
              <p className="text-gray-600 leading-relaxed max-w-xl">
                {leaderFeatures[currentLeaderIndex].description}
              </p>
            </div>

            {/* Navigation Arrows */}
            <button
              onClick={prevLeader}
              className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-16 w-12 h-12 bg-white rounded-full shadow-lg flex items-center justify-center hover:bg-gray-50 transition-colors"
              aria-label="Anterior"
            >
              <ChevronLeft className="w-6 h-6 text-[#012873]" />
            </button>
            <button
              onClick={nextLeader}
              className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-16 w-12 h-12 bg-white rounded-full shadow-lg flex items-center justify-center hover:bg-gray-50 transition-colors"
              aria-label="Próximo"
            >
              <ChevronRight className="w-6 h-6 text-[#012873]" />
            </button>

            {/* Dots */}
            <div className="flex justify-center gap-2 mt-6">
              {leaderFeatures.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentLeaderIndex(index)}
                  className={`w-2 h-2 rounded-full transition-all ${
                    index === currentLeaderIndex ? "bg-[#012873] w-8" : "bg-gray-300"
                  }`}
                  aria-label={`Ir para slide ${index + 1}`}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Employee Features Carousel */}
        <div>
          <div className="flex items-center justify-center gap-3 mb-10">
            <div className="w-12 h-12 bg-gradient-to-br from-[#E09F7D] to-[#d88a68] rounded-full flex items-center justify-center">
              <UsersIcon className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-3xl font-bold text-gray-900">Liderado</h3>
          </div>

          <div className="relative max-w-2xl mx-auto">
            {/* Card */}
            <div className="bg-gradient-to-br from-gray-50 to-white rounded-xl p-8 border border-gray-200 shadow-xl min-h-[280px] flex flex-col items-center justify-center text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-[#E09F7D] to-[#d88a68] rounded-lg flex items-center justify-center mb-6">
                <EmployeeIcon className="w-8 h-8 text-white" />
              </div>
              <h4 className="text-2xl font-bold text-gray-900 mb-4">
                {employeeFeatures[currentEmployeeIndex].title}
              </h4>
              <p className="text-gray-600 leading-relaxed max-w-xl">
                {employeeFeatures[currentEmployeeIndex].description}
              </p>
            </div>

            {/* Navigation Arrows */}
            <button
              onClick={prevEmployee}
              className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-16 w-12 h-12 bg-white rounded-full shadow-lg flex items-center justify-center hover:bg-gray-50 transition-colors"
              aria-label="Anterior"
            >
              <ChevronLeft className="w-6 h-6 text-[#E09F7D]" />
            </button>
            <button
              onClick={nextEmployee}
              className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-16 w-12 h-12 bg-white rounded-full shadow-lg flex items-center justify-center hover:bg-gray-50 transition-colors"
              aria-label="Próximo"
            >
              <ChevronRight className="w-6 h-6 text-[#E09F7D]" />
            </button>

            {/* Dots */}
            <div className="flex justify-center gap-2 mt-6">
              {employeeFeatures.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentEmployeeIndex(index)}
                  className={`w-2 h-2 rounded-full transition-all ${
                    index === currentEmployeeIndex ? "bg-[#E09F7D] w-8" : "bg-gray-300"
                  }`}
                  aria-label={`Ir para slide ${index + 1}`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Features;
