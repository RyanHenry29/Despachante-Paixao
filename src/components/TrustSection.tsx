import { Monitor, Lock, Clock, Award, MessageCircle, Users } from "lucide-react";
import { motion } from "framer-motion";

const trustItems = [
  {
    icon: Monitor,
    title: "Atendimento Digital",
    description: "Faça tudo pelo WhatsApp sem precisar ir presencialmente ao Poupatempo.",
  },
  {
    icon: Lock,
    title: "Tradição e Confiança",
    description: "Cuidamos dos seus documentos com total segurança e responsabilidade.",
  },
  {
    icon: Clock,
    title: "Agilidade",
    description: "Processos diretos com o sistema do Detran para liberar seu documento rápido.",
  },
  {
    icon: Award,
    title: "Equipe Especializada",
    description: "Nossos despachantes conhecem todos os atalhos para resolver qualquer B.O.",
  },
  {
    icon: MessageCircle,
    title: "Suporte Real",
    description: "Nada de robôs enrolando: você fala direto com quem resolve seu problema.",
  },
  {
    icon: Users,
    title: "Preço Justo",
    description: "Orçamento claro, sem taxas surpresas no final do serviço.",
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
};

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0, 
    transition: { duration: 0.4, ease: "easeOut" }
  }
};

const TrustSection = () => {
  return (
    <section className="py-20 bg-[#0B1D3D] border-b border-blue-900">
      <div className="container-custom">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-extrabold text-white mb-4">
            Por que escolher o Despachante Paixão?
          </h2>
          <div className="w-24 h-1 bg-blue-500 mx-auto mb-6 rounded-full"></div>
          <p className="text-white/80 text-lg">
            Nossa reputação é construída com base na confiança, rapidez e no respeito ao cliente.
          </p>
        </div>

        {/* Trust Grid */}
        <motion.div 
          className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
        >
          {trustItems.map((item, index) => {
            const Icon = item.icon;
            return (
              <motion.div
                key={index}
                variants={cardVariants}
                className="bg-[#112A57] border border-[#1A3668] rounded-xl p-6 hover:bg-[#15346A] transition-colors"
              >
                <div className="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center mb-4">
                  <Icon className="w-6 h-6 text-blue-400" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">
                  {item.title}
                </h3>
                <p className="text-white/70 leading-relaxed text-sm">
                  {item.description}
                </p>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Stats Bar */}
        <motion.div 
          className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-8 pt-12 border-t border-[#1A3668]"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {[
            { value: "90+", label: "Avaliações no Google" },
            { value: "5.0", label: "Nota do Atendimento" },
            { value: "100%", label: "Segurança" },
            { value: "Rápido", label: "Tempo de Entrega" }
          ].map((stat, index) => (
            <motion.div key={index} className="text-center">
              <p className="text-3xl md:text-4xl font-extrabold text-blue-400 mb-2">
                {stat.value}
              </p>
              <p className="text-white/60 text-sm font-medium">{stat.label}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default TrustSection;
