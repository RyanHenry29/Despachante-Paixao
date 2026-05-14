import { MessageCircle } from "lucide-react";

const WhatsAppButton = () => {
  const phoneNumber = "5511953284566";
  const message = encodeURIComponent("Olá! Gostaria de informações sobre os serviços do Despachante Paixão.");
  
  return (
    <a
      href={`https://wa.me/${phoneNumber}?text=${message}`}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-50 flex items-center gap-3 bg-[#25D366] text-white px-5 py-4 rounded-full shadow-2xl hover:bg-[#20BA5A] transition-colors duration-300 group"
      aria-label="Fale conosco pelo WhatsApp"
    >
      <MessageCircle className="w-6 h-6" />
      <span className="font-semibold hidden sm:inline group-hover:inline transition-all">
        Fale Conosco
      </span>
    </a>
  );
};

export default WhatsAppButton;
