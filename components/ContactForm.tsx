import { useState, forwardRef, useEffect, useRef } from "react";
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
  const [privacyAccepted, setPrivacyAccepted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [showSummary, setShowSummary] = useState(false);
  const summaryRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (showSummary && summaryRef.current) {
      const top = summaryRef.current.getBoundingClientRect().top + window.scrollY - 120;
      window.scrollTo({ top, behavior: "smooth" });
    }
  }, [showSummary]);

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
    
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
      
      const serviceLabel = services.find(s => s.id === formData.service)?.label || formData.service;
      const messageParts = [
        `Olá! Vim pelo site e gostaria de solicitar um orçamento:\n`,
        `*Serviço:* ${serviceLabel}`,
        `*Placa:* ${formData.plate}`,
        `*Nome:* ${formData.name}`,
      ];
      
      if (formData.message.trim()) {
        messageParts.push(`*Mensagem:* ${formData.message}`);
      }
      
      const message = encodeURIComponent(messageParts.join('\n'));
      
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
                  setPrivacyAccepted(false);
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
            <h2 className="text-[clamp(1.5rem,3vw,2.5rem)] font-bold text-foreground mb-4">
              Solicite seu Orçamento
            </h2>
            <p className="text-muted-foreground text-[clamp(0.75rem,0.95vw,0.875rem)]">
               Preencha com seus dados e receba um orçamento personalizado sem compromisso.
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

                {/* Privacy Checkbox */}
                <label className="flex items-start gap-3 cursor-pointer group">
                  <input
                    type="checkbox"
                    checked={privacyAccepted}
                    onChange={(e) => setPrivacyAccepted(e.target.checked)}
                    className="mt-1 w-4 h-4 rounded border-border text-accent focus:ring-accent cursor-pointer"
                  />
                  <span className="text-xs text-muted-foreground group-hover:text-foreground transition-colors leading-relaxed">
                    Li e aceito a{" "}
                    <a href="/privacidade" target="_blank" className="text-accent hover:underline font-medium">
                      Política de Privacidade
                    </a>{" "}
                    e autorizo o tratamento dos meus dados conforme a LGPD.
                  </span>
                </label>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={!privacyAccepted}
                  className={`w-full flex items-center justify-center gap-2 font-bold py-4 px-8 rounded-lg text-lg transition-all ${
                    privacyAccepted
                      ? "bg-accent text-accent-foreground shadow-lg hover:shadow-xl hover:bg-accent/90 cursor-pointer"
                      : "bg-muted text-muted-foreground cursor-not-allowed"
                  }`}
                >
                  Avançar para atendimento
                  <Send className="w-5 h-5" />
                </button>
              </form>
            ) : (
              /* Summary View */
              <div ref={summaryRef} className="space-y-6">
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

                <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
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
