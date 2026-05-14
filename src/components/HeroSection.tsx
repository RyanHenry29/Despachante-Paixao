import { ArrowRight, Car, FileText, Shield, MapPin, CheckCircle, Clock } from "lucide-react";
import { motion } from "framer-motion";
import logo from "@/assets/logo-despachante-paixao.png";

interface HeroSectionProps {
  onScrollToForm: () => void;
}

const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0 }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15 }
  }
};

const scaleIn = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: { opacity: 1, scale: 1 }
};

const HeroSection = ({ onScrollToForm }: HeroSectionProps) => {
  return (
    <section className="bg-[#0B1D3D] relative min-h-[90vh] flex items-center pt-24 pb-12 lg:pt-0 lg:pb-0">
      
      {/* Container */}
      <div className="container-custom relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          
          {/* Left Content */}
          <motion.div 
            className="text-center lg:text-left space-y-8"
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
          >
            {/* Location Badge */}
            <motion.div 
              variants={fadeInUp}
              transition={{ duration: 0.6 }}
              className="inline-flex items-center gap-2 bg-[#1A3668] px-4 py-2 rounded-md border border-[#2D5A9E]"
            >
              <MapPin className="w-4 h-4 text-white" />
              <span className="text-white/90 text-sm font-medium tracking-wide uppercase">
                Atendimento em Guarulhos e Região
              </span>
            </motion.div>

            {/* Main Title */}
            <motion.h1 
              variants={fadeInUp}
              transition={{ duration: 0.6 }}
              className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-white leading-tight"
            >
              Tradição e Confiança para a <span className="text-[#3b82f6]">Documentação</span> do seu Veículo
            </motion.h1>

            {/* Subtitle */}
            <motion.p 
              variants={fadeInUp}
              transition={{ duration: 0.6 }}
              className="text-lg md:text-xl text-white/80 max-w-xl mx-auto lg:mx-0 font-medium"
            >
              Chega de dor de cabeça com burocracia do Detran. Nós resolvemos o licenciamento, transferência e débitos do seu veículo de forma rápida e segura.
            </motion.p>

            {/* Features List */}
            <motion.div 
              variants={fadeInUp}
              className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-left max-w-xl mx-auto lg:mx-0"
            >
              <div className="flex items-center gap-3">
                <CheckCircle className="w-5 h-5 text-green-400" />
                <span className="text-white/90 font-medium">Processo Transparente</span>
              </div>
              <div className="flex items-center gap-3">
                <Shield className="w-5 h-5 text-green-400" />
                <span className="text-white/90 font-medium">Pagamento Seguro</span>
              </div>
              <div className="flex items-center gap-3">
                <Clock className="w-5 h-5 text-green-400" />
                <span className="text-white/90 font-medium">Agilidade na Entrega</span>
              </div>
              <div className="flex items-center gap-3">
                <FileText className="w-5 h-5 text-green-400" />
                <span className="text-white/90 font-medium">Sem Filas no Poupatempo</span>
              </div>
            </motion.div>

            {/* CTA Buttons */}
            <motion.div 
              variants={fadeInUp}
              transition={{ duration: 0.6 }}
              className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start pt-4"
            >
              <motion.button 
                onClick={onScrollToForm}
                className="bg-[#25D366] hover:bg-[#20BA5A] text-white font-bold py-4 px-8 rounded-lg shadow-lg flex items-center justify-center gap-2 text-lg transition-colors"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                Fazer um orçamento
                <ArrowRight className="w-5 h-5" />
              </motion.button>
              <motion.a 
                href="#servicos"
                className="bg-transparent border-2 border-white/20 hover:border-white/40 text-white font-bold py-4 px-8 rounded-lg flex items-center justify-center gap-2 text-lg transition-colors"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                Nossos Serviços
              </motion.a>
            </motion.div>
          </motion.div>

          {/* Right Content - Logo Box */}
          <motion.div 
            className="flex flex-col justify-center items-center gap-8"
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
          >
            {/* Logo Wrapper */}
            <motion.div 
              variants={scaleIn}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="bg-white rounded-2xl p-8 shadow-2xl border border-gray-100 hidden md:block"
            >
              <img 
                src={logo} 
                alt="Despachante Paixão" 
                className="w-72 h-auto"
              />
            </motion.div>

            {/* Rating Banner */}
            <motion.div 
              variants={fadeInUp}
              className="bg-white/10 backdrop-blur-sm border border-white/10 text-white px-6 py-4 rounded-xl shadow-lg w-full max-w-sm flex items-center justify-between"
            >
              <div className="flex flex-col">
                <span className="font-bold text-lg">Excelente</span>
                <span className="text-sm text-white/70">Avaliações no Google</span>
              </div>
              <div className="flex flex-col items-end">
                <div className="flex items-center gap-1">
                  <span className="text-2xl font-bold">5.0</span>
                  <div className="flex text-yellow-400">
                    ★ ★ ★ ★ ★
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
      
      {/* Divisor Visual de Base */}
      <div className="absolute bottom-0 left-0 right-0 h-4 bg-gradient-to-r from-blue-600 to-blue-400" />
    </section>
  );
};

export default HeroSection;
