import { useState, forwardRef } from "react";
import { Send, Car, User, MessageSquare, CheckCircle, Loader2 } from "lucide-react";

const services = [
  { id: "transferencia", label: "Transferência de Veículo" },
  { id: "licenciamento", label: "Licenciamento Anual" },
  { id: "consulta-debitos", label: "Consulta de Débitos" },
  { id: "crlv-e", label: "2ª Via do CRLV-e" },
  { id: "atpv-e", label: "Emissão de ATPV-e" },
  { id: "primeiro-emplacamento", label: "Primeiro Emplacamento" },
  { id: "regularizacao", label: "Regularização de Documentação" },
  { id: "outros", label: "Outros Serviços" },
];

interface ContactFormProps {
  selectedService: string;
}

const ContactForm = forwardRef<HTMLDivElement, ContactFormProps>(({ selectedService }, ref) => {
  const [formData, setFormData] = useState({
    service: selectedService || "",
    plate: "",
    name: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [showSummary, setShowSummary] = useState(false);

  // Update service when prop changes
  if (selectedService && formData.service !== selectedService) {
    setFormData(prev => ({ ...prev, service: selectedService }));
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const formatPlate = (value: string) => {
    const upper = value.toUpperCase().replace(/[^A-Z0-9]/g, "");
    if (upper.length <= 7) {
      return upper.replace(/([A-Z]{3})(\d)/, "$1-$2");
    }
    return value;
  };

  const handlePlateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.target.value = formatPlate(e.target.value);
    handleChange(e);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setShowSummary(true);
  };

  const confirmSubmit = () => {
    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
      
      // Prepare WhatsApp message - only include fields that were filled
      const serviceLabel = services.find(s => s.id === formData.service)?.label || formData.service;
      const messageParts = [
        `Olá! Vim pelo site e gostaria de solicitar um serviço:\n`,
        `*Serviço:* ${serviceLabel}`,
        `*Placa:* ${formData.plate}`,
        `*Nome:* ${formData.name}`,
      ];
      
      // Only add optional fields if they have content
      if (formData.message.trim()) {
        messageParts.push(`*Mensagem:* ${formData.message}`);
      }
      
      const message = encodeURIComponent(messageParts.join('\n'));
      
      // Open WhatsApp after a short delay
      setTimeout(() => {
        window.open(`https://wa.me/5511953284566?text=${message}`, "_blank");
      }, 1500);
    }, 1000);
  };

  if (isSubmitted) {
    return (
      <section ref={ref} id="formulario" className="section-padding bg-secondary/30">
        <div className="container-custom">
          <div className="max-w-2xl mx-auto text-center">
            <div className="bg-card p-12 rounded-2xl shadow-lg border border-border">
              <div className="w-20 h-20 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle className="w-10 h-10 text-accent" />
              </div>
              <h2 className="text-2xl font-bold text-foreground mb-4">
                Solicitação Enviada com Sucesso!
              </h2>
              <p className="text-muted-foreground mb-6">
                Você será redirecionado para o WhatsApp para finalizar seu atendimento.
                Nossa equipe responderá em breve!
              </p>
              <button
                onClick={() => {
                  setIsSubmitted(false);
                  setShowSummary(false);
                  setFormData({ service: "", plate: "", name: "", message: "" });
                }}
                className="text-accent font-medium hover:underline"
              >
                Fazer nova solicitação
              </button>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section ref={ref} id="formulario" className="section-padding bg-secondary/30">
      <div className="container-custom">
        <div className="max-w-2xl mx-auto">
          {/* Section Header */}
          <div className="text-center mb-10">
            <span className="inline-block bg-accent/10 text-accent font-medium px-4 py-2 rounded-full text-sm mb-4">
              Solicite Agora
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Preencha seus dados
            </h2>
            <p className="text-muted-foreground">
              Informe os dados abaixo e nossa equipe entrará em contato rapidamente.
            </p>
          </div>

          {/* Form Card */}
          <div className="bg-card p-8 md:p-10 rounded-2xl shadow-lg border border-border">
            {!showSummary ? (
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Service Select */}
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Serviço Desejado *
                  </label>
                  <div className="relative">
                    <Car className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <select
                      name="service"
                      value={formData.service}
                      onChange={handleChange}
                      required
                      className="form-input pl-12 appearance-none cursor-pointer"
                    >
                      <option value="">Selecione um serviço</option>
                      {services.map(service => (
                        <option key={service.id} value={service.id}>
                          {service.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Plate Input */}
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Placa do Veículo *
                  </label>
                  <input
                    type="text"
                    name="plate"
                    value={formData.plate}
                    onChange={handlePlateChange}
                    placeholder="ABC-1234 ou ABC1D23"
                    required
                    maxLength={8}
                    className="form-input uppercase"
                  />
                </div>

                {/* Name Input */}
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Nome Completo *
                  </label>
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="Seu nome completo"
                      required
                      className="form-input pl-12"
                    />
                  </div>
                </div>

                {/* Message Textarea */}
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Mensagem Adicional (opcional)
                  </label>
                  <div className="relative">
                    <MessageSquare className="absolute left-4 top-4 w-5 h-5 text-muted-foreground" />
                    <textarea
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      placeholder="Descreva sua necessidade ou dúvida..."
                      rows={4}
                      className="form-input pl-12 resize-none"
                    />
                  </div>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  className="cta-primary w-full flex items-center justify-center gap-2"
                >
                  Avançar para atendimento
                  <Send className="w-5 h-5" />
                </button>

                <p className="text-xs text-muted-foreground text-center">
                  Ao enviar, você concorda com nossa{" "}
                  <a href="#" className="text-accent hover:underline">Política de Privacidade</a>
                </p>
              </form>
            ) : (
              /* Summary View */
              <div className="space-y-6">
                <h3 className="text-xl font-bold text-foreground text-center mb-6">
                  Confirme seus dados
                </h3>
                
                <div className="bg-secondary/50 rounded-xl p-6 space-y-4">
                  <div className="flex justify-between items-center border-b border-border pb-3">
                    <span className="text-muted-foreground">Serviço:</span>
                    <span className="font-medium text-foreground">
                      {services.find(s => s.id === formData.service)?.label}
                    </span>
                  </div>
                  <div className="flex justify-between items-center border-b border-border pb-3">
                    <span className="text-muted-foreground">Placa:</span>
                    <span className="font-medium text-foreground">{formData.plate}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Nome:</span>
                    <span className="font-medium text-foreground">{formData.name}</span>
                  </div>
                </div>

                <div className="flex gap-4">
                  <button
                    onClick={() => setShowSummary(false)}
                    className="flex-1 py-4 border border-border rounded-lg font-medium hover:bg-secondary transition-colors"
                  >
                    Voltar e editar
                  </button>
                  <button
                    onClick={confirmSubmit}
                    disabled={isSubmitting}
                    className="cta-primary flex-1 flex items-center justify-center gap-2"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        Enviando...
                      </>
                    ) : (
                      <>
                        Confirmar e enviar
                        <Send className="w-5 h-5" />
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
});

ContactForm.displayName = "ContactForm";

export default ContactForm;
