import { useState, useRef, useCallback, useEffect } from "react";
import { ChevronDown } from "lucide-react";

const SECTIONS = [
  "#hero",
  "#servicos",
  "#formulario",
  "#avaliacoes",
  "#diferenciais",
  "#footer",
];

const ScrollNavigation = () => {
  const [isAtBottom, setIsAtBottom] = useState(false);
  const isNavigating = useRef(false);

  useEffect(() => {
    const checkPosition = () => {
      const scrollBottom = window.innerHeight + window.scrollY;
      const pageHeight = document.documentElement.scrollHeight;
      setIsAtBottom(scrollBottom >= pageHeight - 200);
    };
    window.addEventListener("scroll", checkPosition, { passive: true });
    checkPosition();
    return () => window.removeEventListener("scroll", checkPosition);
  }, []);

  const handleClick = useCallback(() => {
    if (isNavigating.current) return;
    isNavigating.current = true;

    try {
      const elements = SECTIONS.map((s) =>
        document.querySelector(s),
      ).filter(Boolean) as HTMLElement[];

      if (!elements.length) return;

      const scrollCenter = window.scrollY + window.innerHeight / 2;

      let currentIdx = 0;
      for (let i = elements.length - 1; i >= 0; i--) {
        const sectionTop = elements[i].getBoundingClientRect().top + window.scrollY;
        if (sectionTop <= scrollCenter) {
          currentIdx = i;
          break;
        }
      }

      const nextIdx = (currentIdx + 1) % elements.length;
      elements[nextIdx].scrollIntoView({ behavior: "smooth", block: "start" });
      setIsAtBottom(nextIdx === elements.length - 1);
    } finally {
      setTimeout(() => {
        isNavigating.current = false;
      }, 400);
    }
  }, []);

  return (
    <button
      onClick={handleClick}
      aria-label={isAtBottom ? "Voltar ao topo" : "Próxima seção"}
      className={`fixed bottom-8 left-1/2 -translate-x-1/2 z-40 flex items-center justify-center w-12 h-12 md:w-14 md:h-14 rounded-full shadow-xl hover:shadow-2xl hover:scale-110 active:scale-95 transition-all duration-300 border-2 border-white/20 ${
        isAtBottom
          ? "bg-white/20 text-white/60 hover:bg-white/30"
          : "bg-accent text-accent-foreground"
      }`}
    >
      <ChevronDown
        className={`w-6 h-6 transition-transform duration-300 ${
          isAtBottom ? "rotate-180" : ""
        }`}
      />
    </button>
  );
};

export default ScrollNavigation;
