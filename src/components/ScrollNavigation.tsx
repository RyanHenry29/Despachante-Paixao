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
  const currentIdxRef = useRef(0);

  useEffect(() => {
    const checkPosition = () => {
      const footer = document.querySelector("#footer");
      if (!footer) return;
      const rect = footer.getBoundingClientRect();
      setIsAtBottom(rect.top < window.innerHeight && rect.bottom >= 0);
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

      if (!elements.length) {
        currentIdxRef.current = 0;
        return;
      }

      const scrollY = window.scrollY;
      let closestIdx = 0;
      let closestDist = Infinity;

      elements.forEach((el, i) => {
        const rect = el.getBoundingClientRect();
        const elTop = rect.top + scrollY;
        const dist = Math.abs(elTop - scrollY);
        if (dist < closestDist) {
          closestDist = dist;
          closestIdx = i;
        }
      });

      currentIdxRef.current = closestIdx;
      const nextIdx = (currentIdxRef.current + 1) % elements.length;
      elements[nextIdx].scrollIntoView({ behavior: "smooth", block: "start" });
      currentIdxRef.current = nextIdx;
      setIsAtBottom(nextIdx === elements.length - 1);
    } catch {
      currentIdxRef.current = 0;
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
