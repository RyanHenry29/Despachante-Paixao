import { 
  Car, 
  FileText, 
  Search, 
  RefreshCw, 
  CreditCard, 
  Stamp,
  AlertCircle,
  MoreHorizontal,
  ArrowRight
} from "lucide-react";
import { motion } from "framer-motion";

interface ServicesSectionProps {
  onSelectService: (service: string) => void;
}

const services = [
  {
    id: "transferencia",
    title: "Transferência de Veículo",
    description: "Cuidamos de toda a documentação de compra e venda, com assinatura digital e registro no Detran.",
    icon: Car,
    popular: true,
  },
  {
    id: "licenciamento",
    title: "Licenciamento Anual",
    description: "Emitimos seu licenciamento anual com código de segurança — sem filas e sem taxa extra.",
    icon: FileText,
    popular: true,
  },
  {
    id: "consulta-debitos",
    title: "Consulta de Débitos",
    description: "Verificamos IPVA atrasado, multas vigentes, restrições administrativas e judiciais no sistema.",
    icon: Search,
    popular: false,
  },
  {
    id: "crlv-e",
    title: "2ª Via do CRLV-e",
    description: "Disponibilizamos o PDF do seu CRLV-e em minutos, direto da base oficial do Detran.",
    icon: RefreshCw,
    popular: false,
  },
  {
    id: "atpv-e",
    title: "Emissão de ATPV-e",
    description: "Emissão do recibo digital de compra e venda (ATPV-e) para formalizar a transferência.",
    icon: CreditCard,
    popular: false,
  },
  {
    id: "primeiro-emplacamento",
    title: "Primeiro Emplacamento",
    description: "Registro e emplacamento de veículos zero km com escolha de placa personalizada se desejar.",
    icon: Stamp,
    popular: false,
  },
  {
    id: "regularizacao",
    title: "Regularização de Bloqueios",
    description: "Resolvemos bloqueios judiciais, multas, IPVA atrasado e restrições que impedem o licenciamento.",
    icon: AlertCircle,
    popular: false,
  },
  {
    id: "outros",
    title: "Outros Serviços",
    description: "Renovação de CNH, defesa de multas, segunda via de documentos e demais serviços veiculares.",
    icon: MoreHorizontal,
    popular: false,
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
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

const ServicesSection = ({ onSelectService }: ServicesSectionProps) => {
  return (
    <section id="servicos" className="py-[clamp(3rem,5vw,5rem)] bg-gray-50 border-t border-gray-100">
      <div className="container-custom">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-[clamp(2rem,3.5vw,4rem)]">
          <h2 className="text-[clamp(1.5rem,3vw,2.5rem)] font-extrabold text-[#0B1D3D] mb-4">
            Serviços Especializados
          </h2>
          <div className="w-24 h-1 bg-blue-500 mx-auto mb-6 rounded-full"></div>
          <p className="text-gray-600 text-[clamp(0.875rem,1.2vw,1.125rem)]">
            Resolvemos a documentação do seu veículo sem complicação. Escolha o serviço abaixo e solicite seu orçamento.
          </p>
        </div>

        {/* Services Grid */}
        <motion.div 
          className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: false, margin: "-50px" }}
        >
          {services.map((service) => {
            const Icon = service.icon;
            return (
              <motion.div
                key={service.id}
                variants={cardVariants}
                onClick={() => onSelectService(service.id)}
                className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm hover:shadow-md hover:border-blue-300 transition-all cursor-pointer relative group"
              >
                {service.popular && (
                  <div className="absolute -top-3 -right-3 bg-[#25D366] text-white text-[11px] uppercase font-bold px-3 py-1 rounded-full shadow-sm">
                    Mais pedido
                  </div>
                )}
                
                <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center mb-4 group-hover:bg-blue-100 transition-colors">
                  <Icon className="w-6 h-6 text-blue-600" />
                </div>
                
                <h3 className="font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors text-[clamp(0.875rem,1.1vw,1rem)]">
                  {service.title}
                </h3>
                
                <p className="text-gray-600 text-[clamp(0.75rem,0.95vw,0.875rem)] mb-4 leading-relaxed">
                  {service.description}
                </p>
                
                <div className="flex items-center text-blue-600 text-[clamp(0.75rem,0.9vw,0.875rem)] font-semibold opacity-0 group-hover:opacity-100 transition-opacity">
                  Fazer Orçamento
                  <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
};

export default ServicesSection;
