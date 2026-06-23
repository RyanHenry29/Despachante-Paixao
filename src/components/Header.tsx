import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";

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
        <div className="flex items-center md:justify-center justify-end">
          {/* Desktop Navigation + CTA centered */}
          <div className="hidden md:flex items-center gap-8">
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
          <div
            className={`md:hidden absolute top-full left-0 right-0 animate-fade-in shadow-2xl border-t ${
              isScrolled
                ? "bg-white border-border"
                : "bg-[#0B1D3D] border-white/10"
            }`}
          >
            <nav className="px-6 py-6 space-y-1">
              {navLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`block font-semibold py-3 px-4 rounded-xl transition-all duration-200 ${
                    isScrolled
                      ? "text-foreground/80 hover:bg-accent/10 hover:text-accent"
                      : "text-white/80 hover:bg-white/10 hover:text-white"
                  }`}
                >
                  {link.label}
                </a>
              ))}
              <div className="pt-4 mt-4 border-t border-white/10">
                <button
                  onClick={() => {
                    onScrollToForm();
                    setIsMobileMenuOpen(false);
                  }}
                  className="w-full bg-accent hover:bg-accent/90 text-accent-foreground font-bold py-3.5 px-4 rounded-xl transition-all duration-200 shadow-lg"
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
