import { useState, useRef, useCallback, useEffect } from "react";
import { ChevronDown } from "lucide-react";

const SECTIONS = ["hero", "servicos", "formulario", "avaliacoes", "diferenciais", "footer"];

const HEADER_OFFSET = 72;

const ScrollNavigation = () => {
  const [isAtBottom, setIsAtBottom] = useState(false);
  const isNavigating = useRef(false);

  useEffect(() => {
    const checkPosition = () => {
      const scrollBottom = window.scrollY + window.innerHeight;
      const docHeight = document.documentElement.scrollHeight;
      setIsAtBottom(scrollBottom >= docHeight - 150);
    };
    window.addEventListener("scroll", checkPosition, { passive: true });
    checkPosition();
    return () => window.removeEventListener("scroll", checkPosition);
  }, []);

  const handleClick = useCallback(() => {
    if (isNavigating.current) return;
    isNavigating.current = true;

    try {
      const scrollY = window.scrollY;
      let closestIdx = 0;
      let closestDist = Infinity;

      SECTIONS.forEach((id, i) => {
        const el = document.getElementById(id);
        if (!el) return;
        const rect = el.getBoundingClientRect();
        const dist = Math.abs(rect.top);
        if (dist < closestDist) {
          closestDist = dist;
          closestIdx = i;
        }
      });

      const nextIdx = (closestIdx + 1) % SECTIONS.length;
      const targetEl = document.getElementById(SECTIONS[nextIdx]);
      if (targetEl) {
        const top = targetEl.getBoundingClientRect().top + scrollY - HEADER_OFFSET;
        window.scrollTo({ top: Math.max(0, top), behavior: "smooth" });
      }
    } catch {
      // ignore
    } finally {
      setTimeout(() => {
        isNavigating.current = false;
      }, 800);
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
