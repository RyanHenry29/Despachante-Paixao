import { useRef, useEffect } from "react";
import { ArrowRight, Star, Car, FileText, Search, RefreshCw, Stamp, MapPin, Clock } from "lucide-react";
import { motion } from "framer-motion";
import logo from "@/assets/logo-despachante-paixao.png";
import { useReviews } from "@/contexts/ReviewsContext";

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
    transition: { staggerChildren: 0.12 }
  }
};

const services = [
  { icon: Car, label: "Transferência" },
  { icon: FileText, label: "Licenciamento" },
  { icon: Search, label: "Débitos" },
  { icon: RefreshCw, label: "2ª Via" },
  { icon: Stamp, label: "Emplacamento" },
];

const HeroSection = ({ onScrollToForm }: HeroSectionProps) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const sectionRef = useRef<HTMLElement>(null);
  const { totalReviews } = useReviews();

  useEffect(() => {
    const section = sectionRef.current;
    const video = videoRef.current;
    if (!section || !video) return;

    const tryPlay = async () => {
      try {
        video.currentTime = 0;
        await video.play();
      } catch {
        // Mobile browsers block autoplay without user interaction
      }
    };

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          tryPlay();
        } else {
          video.pause();
        }
      },
      { threshold: 0.3 }
    );

    observer.observe(section);
    tryPlay();
    return () => observer.disconnect();
  }, []);

  return (
    <section ref={sectionRef} id="hero" className="bg-[#0B1D3D] relative min-h-screen flex items-center overflow-hidden">
      
      {/* Background Video */}
      <video
        ref={videoRef}
        autoPlay
        muted
        playsInline
        onEnded={(e) => { e.currentTarget.pause(); }}
        className="absolute inset-0 w-full h-full object-cover z-0"
      >
        <source src="/hero-bg.mp4" type="video/mp4" />
      </video>
      
      {/* Dark overlay for readability */}
      <div className="absolute inset-0 bg-[#0B1D3D]/85 z-0" />

      <div className="max-w-[1440px] mx-auto px-6 sm:px-8 lg:px-12 w-full relative z-10">
        <div className="grid lg:grid-cols-[1.2fr_1fr] gap-6 sm:gap-8 lg:gap-16 items-center">

          {/* Left Column (Text and Value Prop) */}
          <motion.div
            className="text-center lg:text-left"
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: false }}
          >
            <motion.div
              variants={fadeInUp}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 bg-[#1A3668]/85 px-4 py-2 rounded-xl border border-[#2D5A9E]/60 mb-6"
            >
              <MapPin className="w-4 h-4 text-accent" />
              <span className="text-white font-semibold text-[clamp(0.7rem,0.9vw,0.825rem)] tracking-wider uppercase">
                Guarulhos e Região Metropolitana
              </span>
            </motion.div>

            <motion.h1
              variants={fadeInUp}
              transition={{ duration: 0.5 }}
              className="text-[clamp(2rem,4.8vw,4rem)] font-extrabold text-white leading-[1.08] mb-6 tracking-tight"
            >
              Regularização Veicular<br />
              <span className="text-gradient font-black">sem Burocracia</span>
            </motion.h1>

            <motion.p
              variants={fadeInUp}
              transition={{ duration: 0.5 }}
              className="text-[clamp(1rem,1.25vw,1.2rem)] text-white/75 max-w-xl mx-auto lg:mx-0 mb-8 leading-relaxed"
            >
              Você envia os documentos digitalizados e nós resolvemos direto no sistema do Detran. Sem fila, sem taxas escondidas, sem passar de setor em setor.
            </motion.p>

            {/* Service Pills */}
            <motion.div
              variants={fadeInUp}
              transition={{ duration: 0.5 }}
              className="flex flex-wrap gap-3 justify-center lg:justify-start mb-10"
            >
              {services.map((s) => (
                <span
                  key={s.label}
                  className="inline-flex items-center gap-1.5 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 text-white/80 hover:text-white text-xs sm:text-[clamp(0.75rem,0.9vw,0.825rem)] font-semibold px-3 sm:px-3.5 py-2 rounded-xl transition-all duration-300 cursor-pointer shadow-sm"
                >
                  <s.icon className="w-3.5 h-3.5 text-accent" />
                  {s.label}
                </span>
              ))}
            </motion.div>

            <motion.div
              variants={fadeInUp}
              transition={{ duration: 0.5 }}
              className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start"
            >
              <motion.button
                onClick={onScrollToForm}
                className="bg-[#25D366] hover:bg-[#20BA5A] text-white font-bold py-4 px-8 rounded-xl shadow-lg flex items-center justify-center gap-2 text-[clamp(0.95rem,1.1vw,1.05rem)] transition-colors"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                Falar no WhatsApp
                <ArrowRight className="w-5 h-5" />
              </motion.button>
              <motion.a
                href="#servicos"
                className="border-2 border-white/20 hover:border-white/40 text-white font-semibold py-4 px-8 rounded-xl flex items-center justify-center gap-2 text-[clamp(0.95rem,1.1vw,1.05rem)] transition-colors bg-white/5"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                Ver Serviços
              </motion.a>
            </motion.div>
          </motion.div>

          {/* Right Column (Unified Premium Widget with Brand Details, Badges & Google Quote) */}
          <motion.div
            className="flex justify-center lg:justify-end w-full"
            initial="hidden"
            whileInView="visible"
            variants={staggerContainer}
            viewport={{ once: false }}
          >
            <motion.div
              variants={fadeInUp}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="w-full max-w-md lg:max-w-lg"
            >
              <div className="bg-[#132A52]/75 backdrop-blur-md border border-white/10 rounded-3xl p-5 sm:p-8 shadow-2xl transition-all duration-300 hover:border-accent/30 relative flex flex-col gap-5 sm:gap-6">
                
                {/* Brand */}
                <div className="flex items-center gap-3.5 pb-6 border-b border-white/10">
                  <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center p-2 border border-white/10">
                    <img src={logo} alt="Despachante Paixão" className="w-full h-full object-contain" />
                  </div>
                  <div>
                    <p className="text-white font-bold text-base leading-tight">Despachante Paixão</p>
                    <p className="text-white/40 text-xs mt-0.5">Guarulhos · SP</p>
                  </div>
                </div>

                {/* Google Rating Button */}
                <a
                  href="https://search.google.com/local/reviews?placeid=ChIJjf_y6uGJzpQRzJYssyNyLZg"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 rounded-2xl p-4 transition-all duration-300 group"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex gap-0.5">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      ))}
                    </div>
                    <div className="text-left">
                      <p className="text-white font-bold text-sm leading-tight">5.0</p>
                       <p className="text-white/50 text-xs group-hover:text-white/80 transition-colors">{totalReviews > 0 ? `${totalReviews} avaliações no Google` : "Avaliações no Google"}</p>
                    </div>
                  </div>
                  <svg className="w-4 h-4 text-white/30 group-hover:text-white/70 transition-colors" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M7 17L17 7M17 7H7M17 7V17" />
                  </svg>
                </a>

                {/* Business Info */}
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <Clock className="w-4 h-4 text-accent shrink-0" />
                    <div>
                      <p className="text-white/40 uppercase font-semibold text-[9px] tracking-wider">Horário</p>
                       <p className="text-white/70 font-medium text-xs mt-0.5">Seg a Sex: 7h-22h · Sáb: 8h-18h · Dom: 8h-14h</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <MapPin className="w-4 h-4 text-accent shrink-0" />
                    <div>
                      <p className="text-white/40 uppercase font-semibold text-[9px] tracking-wider">Endereço</p>
                      <p className="text-white/70 font-medium text-xs mt-0.5">R. Geraldo Augusto, 106 — Guarulhos</p>
                    </div>
                  </div>
                </div>

              </div>
            </motion.div>
          </motion.div>

        </div>
      </div>
    </section>
  );
};

export default HeroSection;
