import { Monitor, MessageCircle, FileText, Clock, RefreshCw, CheckCircle } from "lucide-react";
import { motion } from "framer-motion";

const trustItems = [
  {
    icon: MessageCircle,
    title: "Atendimento sem intermediários",
    description: "Seu processo é tratado diretamente pelo responsável pelo serviço, garantindo mais agilidade e comunicação clara.",
  },
  {
    icon: CheckCircle,
    title: "Acompanhamento até a conclusão",
    description: "Não entregamos apenas protocolos. Acompanhamos o andamento da solicitação até a finalização do processo.",
  },
  {
    icon: FileText,
    title: "Menos burocracia para você",
    description: "Orientamos toda a documentação necessária e cuidamos dos procedimentos para evitar retrabalho e atrasos.",
  },
  {
    icon: Clock,
    title: "Experiência prática desde 2020",
    description: "Anos atuando na regularização documental de veículos para clientes de Guarulhos e região.",
  },
  {
    icon: RefreshCw,
    title: "Atualizações durante o processo",
    description: "Você sabe exatamente em qual etapa está sua solicitação e o que ainda precisa ser feito.",
  },
  {
    icon: Monitor,
    title: "Atendimento remoto e presencial",
    description: "Inicie seu processo pelo WhatsApp ou conte com atendimento presencial quando necessário.",
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
    <section id="diferenciais" className="py-[clamp(3rem,5vw,5rem)] bg-[#0B1D3D] border-b border-blue-900">
      <div className="container-custom">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-[clamp(2rem,3.5vw,4rem)]">
          <h2 className="text-[clamp(1.5rem,3vw,2.5rem)] font-extrabold text-white mb-4">
            Por que confiar sua documentação ao Despachante Paixão?
          </h2>
          <div className="w-24 h-1 bg-blue-500 mx-auto mb-6 rounded-full"></div>
          <p className="text-white/80 text-[clamp(0.875rem,1.2vw,1.125rem)]">
            Nossa reputação é construída com base na confiança, rapidez e no respeito ao cliente.
          </p>
        </div>

        {/* Trust Grid */}
        <motion.div 
          className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: false, margin: "-50px" }}
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
                <h3 className="text-[clamp(1rem,1.5vw,1.25rem)] font-bold text-white mb-2">
                  {item.title}
                </h3>
                <p className="text-white/70 leading-relaxed text-[clamp(0.75rem,0.95vw,0.875rem)]">
                  {item.description}
                </p>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
};

export default TrustSection;
