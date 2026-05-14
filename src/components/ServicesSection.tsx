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
    description: "Fazemos a transferência de propriedade e cuidamos de toda a burocracia do Detran.",
    icon: Car,
    popular: true,
  },
  {
    id: "licenciamento",
    title: "Licenciamento Anual",
    description: "Licenciamento rápido e seguro para você circular com seu veículo sem preocupações.",
    icon: FileText,
    popular: true,
  },
  {
    id: "consulta-debitos",
    title: "Consulta de Débitos",
    description: "Levantamento completo de IPVA, multas e restrições no sistema.",
    icon: Search,
    popular: false,
  },
  {
    id: "crlv-e",
    title: "2ª Via do CRLV-e",
    description: "Emissão de segunda via do documento digital de forma expressa.",
    icon: RefreshCw,
    popular: false,
  },
  {
    id: "atpv-e",
    title: "Emissão de ATPV-e",
    description: "Autorização para transferência de propriedade (Recibo de Compra e Venda).",
    icon: CreditCard,
    popular: false,
  },
  {
    id: "primeiro-emplacamento",
    title: "Primeiro Emplacamento",
    description: "Registro e emplacamento completo para veículos zero quilômetro.",
    icon: Stamp,
    popular: false,
  },
  {
    id: "regularizacao",
    title: "Regularização de Bloqueios",
    description: "Resolução de pendências, bloqueios judiciais e irregularidades.",
    icon: AlertCircle,
    popular: false,
  },
  {
    id: "outros",
    title: "Outros Serviços",
    description: "Renovação de CNH, recursos de multas e muito mais.",
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
    <section id="servicos" className="py-20 bg-gray-50 border-t border-gray-100">
      <div className="container-custom">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-extrabold text-[#0B1D3D] mb-4">
            Serviços Especializados
          </h2>
          <div className="w-24 h-1 bg-blue-500 mx-auto mb-6 rounded-full"></div>
          <p className="text-gray-600 text-lg">
            Selecione o serviço que você precisa e conte com a nossa experiência para resolver tudo com agilidade e total segurança.
          </p>
        </div>

        {/* Services Grid */}
        <motion.div 
          className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
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
                
                <h3 className="font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                  {service.title}
                </h3>
                
                <p className="text-gray-600 text-sm mb-4 leading-relaxed">
                  {service.description}
                </p>
                
                <div className="flex items-center text-blue-600 text-sm font-semibold opacity-0 group-hover:opacity-100 transition-opacity">
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
