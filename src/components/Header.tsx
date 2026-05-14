import { useState, useEffect } from "react";
import { Menu, X, Phone } from "lucide-react";
import logo from "@/assets/logo-despachante-paixao.png";

interface HeaderProps {
  onScrollToForm: () => void;
}

const Header = ({ onScrollToForm }: HeaderProps) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { label: "Início", href: "#" },
    { label: "Serviços", href: "#servicos" },
    { label: "Avaliações", href: "#avaliacoes" },
    { label: "Contato", href: "#formulario" },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-white/95 backdrop-blur-md shadow-lg py-2"
          : "bg-transparent py-4"
      }`}
    >
      <div className="container-custom">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <a href="#" className="flex items-center gap-2">
            <img 
              src={logo} 
              alt="Despachante Paixão" 
              className={`transition-all duration-300 ${
                isScrolled ? 'h-12' : 'h-14 md:h-16'
              }`}
            />
          </a>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className={`font-medium transition-colors hover:text-accent ${
                  isScrolled ? "text-foreground/80" : "text-white/90"
                }`}
              >
                {link.label}
              </a>
            ))}
          </nav>

          {/* CTA Button */}
          <div className="hidden md:flex items-center gap-4">
            <a
              href="tel:+5511953284566"
              className={`flex items-center gap-2 font-medium transition-colors ${
                isScrolled ? "text-foreground/80" : "text-white/90"
              }`}
            >
              <Phone className="w-4 h-4" />
              (11) 95328-4566
            </a>
            <button
              onClick={onScrollToForm}
              className="bg-accent text-accent-foreground px-6 py-2.5 rounded-lg font-semibold hover:bg-accent/90 transition-all shadow-lg hover:shadow-xl"
            >
              Solicitar agora
            </button>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className={`md:hidden p-2 ${isScrolled ? "text-foreground" : "text-white"}`}
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden absolute top-full left-0 right-0 bg-white shadow-xl border-t border-border animate-fade-in">
            <nav className="container-custom py-6 space-y-4">
              {navLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block text-foreground/80 font-medium py-2 hover:text-accent transition-colors"
                >
                  {link.label}
                </a>
              ))}
              <div className="pt-4 border-t border-border space-y-4">
                <a
                  href="tel:+5511953284566"
                  className="flex items-center gap-2 text-foreground/80 font-medium"
                >
                  <Phone className="w-4 h-4" />
                  (11) 95328-4566
                </a>
                <button
                  onClick={() => {
                    onScrollToForm();
                    setIsMobileMenuOpen(false);
                  }}
                  className="w-full bg-accent text-accent-foreground py-3 rounded-lg font-semibold"
                >
                  Solicitar agora
                </button>
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
