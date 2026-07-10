import { MapPin, Phone, Clock, MessageCircle, Monitor, Users, Instagram, Mail } from "lucide-react";
import logo from "@/assets/logo-despachante-paixao.png";

const Footer = () => {
  return (
    <footer id="footer" className="bg-primary text-white">
      {/* Main Footer */}
      <div className="container-custom py-[clamp(2.5rem,4vw,4rem)]">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand Column */}
          <div className="lg:col-span-1">
            <img 
              src={logo} 
              alt="Despachante Paixão" 
              loading="lazy"
              className="h-20 mb-4"
            />
              <p className="text-white/60 mb-6 leading-relaxed text-[clamp(0.75rem,0.95vw,0.875rem)]">
                Realizamos serviços de documentação veicular junto ao Detran com agilidade, segurança e sem burocracia. Atendimento presencial em Guarulhos e remoto para todo o Brasil.
              </p>
            <div className="flex items-center gap-2 bg-accent/20 text-accent px-4 py-2 rounded-lg w-fit">
              <Users className="w-5 h-5" />
              <span className="font-medium text-sm">Presencial e Online</span>
            </div>
          </div>

          {/* Institutional Column */}
          <div>
            <h4 className="text-[clamp(0.875rem,1.2vw,1.125rem)] font-semibold text-white mb-6">Institucional</h4>
            <ul className="space-y-3">
              {[
                { label: "Sobre Nós", href: "#" },
                { label: "Política de Privacidade", href: "/privacidade" },
                { label: "Termos de Uso", href: "#" },
                { label: "FAQ - Perguntas Frequentes", href: "#" },
              ].map((link) => (
                <li key={link.label}>
                  <a href={link.href} className="text-white/60 hover:text-accent transition-colors">
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Working Hours Column */}
          <div>
            <h4 className="text-[clamp(0.875rem,1.2vw,1.125rem)] font-semibold text-white mb-6">Horário de Atendimento</h4>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <Clock className="w-5 h-5 text-accent mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-white font-medium">Segunda a Sexta</p>
                  <p className="text-white/60 text-sm flex items-center gap-2">
                    <Monitor className="w-4 h-4" /> Presencial: 7h às 21h
                  </p>
                  <p className="text-white/60 text-sm flex items-center gap-2">
                    <MessageCircle className="w-4 h-4" /> Digital: 7h às 22h
                  </p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <Clock className="w-5 h-5 text-accent mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-white font-medium">Sábado</p>
                  <p className="text-white/60 text-sm">8h às 18h</p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <Clock className="w-5 h-5 text-accent mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-white font-medium">Domingo</p>
                  <p className="text-white/60 text-sm">8h às 14h</p>
                </div>
              </li>
            </ul>
          </div>

          {/* Contact Column */}
          <div>
            <h4 className="text-[clamp(0.875rem,1.2vw,1.125rem)] font-semibold text-white mb-6">Contato</h4>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <Phone className="w-5 h-5 text-accent mt-0.5" />
                <div>
                  <a 
                    href="https://wa.me/5511953284566" 
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-white hover:text-accent transition-colors"
                  >
                    (11) 95328-4566
                  </a>
                  <p className="text-white/60 text-sm">WhatsApp</p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <Mail className="w-5 h-5 text-accent mt-0.5" />
                <div>
                  <a 
                    href="mailto:despachantepaixao@gmail.com"
                    className="text-white hover:text-accent transition-colors"
                  >
                    despachantepaixao@gmail.com
                  </a>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-accent mt-0.5 shrink-0" />
                <div>
                  <a
                    href="https://www.google.com/maps/search/?api=1&query=R.+Geraldo+Augusto,+106,+Guarulhos,+SP"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-white hover:text-accent transition-colors"
                  >
                    R. Geraldo Augusto, 106
                  </a>
                  <p className="text-white/60 text-sm">Jardim Pte. Alta I - Guarulhos/SP</p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <Instagram className="w-5 h-5 text-accent mt-0.5" />
                <div>
                  <a 
                    href="https://www.instagram.com/despachantepaixao"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-white hover:text-accent transition-colors"
                  >
                    @despachantepaixao
                  </a>
                  <p className="text-white/60 text-sm">Instagram</p>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-white/10">
        <div className="container-custom py-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-white/50 text-sm text-center md:text-left">
              © {new Date().getFullYear()} Despachante Paixão. Todos os direitos reservados.
            </p>
            <p className="text-white/40 text-xs text-center md:text-right max-w-xl">
              As informações exibidas são baseadas nos dados fornecidos pelo cliente e nas bases oficiais disponíveis.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
