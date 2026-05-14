import { motion } from "framer-motion";
import { useEffect, useRef } from "react";

const TestimonialsSection = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (containerRef.current) {
      // Evita duplicar o script caso o React faça um re-render rápido
      containerRef.current.innerHTML = '';
      
      const script = document.createElement('script');
      script.src = "https://cdn.trustindex.io/loader.js?1538b46713499849b53665b04ff";
      script.defer = true;
      script.async = true;
      
      containerRef.current.appendChild(script);
    }
  }, []);

  return (
    <section id="avaliacoes" className="section-padding bg-secondary/30 overflow-hidden">
      <div className="container-custom">
        {/* Section Header */}
        <motion.div 
          className="text-center max-w-3xl mx-auto mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <span className="inline-block bg-accent/10 text-accent font-medium px-4 py-2 rounded-full text-sm mb-4">
            Avaliações Reais
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            O que nossos clientes dizem
          </h2>
          <p className="text-muted-foreground text-sm">
            ✓ Avaliações reais e verificadas pelo Google
          </p>
        </motion.div>

        {/* TrustIndex Widget Container */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="w-full min-h-[400px] flex justify-center"
        >
          <div ref={containerRef} className="w-full max-w-6xl overflow-hidden" />
        </motion.div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
