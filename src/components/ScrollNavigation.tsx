import { useState, useRef, useCallback, useEffect } from "react";
import { ChevronDown } from "lucide-react";

const SECTIONS = [
  "#hero",
  "#servicos",
  "#formulario",
  "#avaliacoes",
  "#diferenciais",
  "footer",
];

const ScrollNavigation = () => {
  const [isAtBottom, setIsAtBottom] = useState(false);
  const isNavigating = useRef(false);

  useEffect(() => {
    const checkPosition = () => {
      if (isNavigating.current) return;
      const scrollBottom = window.innerHeight + window.scrollY;
      const pageHeight = document.documentElement.scrollHeight;
      setIsAtBottom(scrollBottom >= pageHeight - 100);
    };
    window.addEventListener("scroll", checkPosition, { passive: true });
    checkPosition();
    return () => window.removeEventListener("scroll", checkPosition);
  }, []);

  const handleClick = useCallback(() => {
    if (isNavigating.current) return;
    isNavigating.current = true;

    const elements = SECTIONS.map((s) =>
      document.querySelector(s),
    ).filter(Boolean) as HTMLElement[];

    if (!elements.length) {
      isNavigating.current = false;
      return;
    }

    const viewportCenter = window.innerHeight / 2;
    let closestIdx = 0;
    let closestDist = Infinity;

    elements.forEach((el, i) => {
      const rect = el.getBoundingClientRect();
      const elCenter = rect.top + rect.height / 2;
      const dist = Math.abs(elCenter - viewportCenter);
      if (dist < closestDist) {
        closestDist = dist;
        closestIdx = i;
      }
    });

    const nextIdx = closestIdx + 1 >= elements.length ? 0 : closestIdx + 1;
    elements[nextIdx].scrollIntoView({ behavior: "smooth", block: "start" });
    setIsAtBottom(nextIdx >= elements.length - 1);

    setTimeout(() => {
      isNavigating.current = false;
    }, 500);
  }, []);

  return (
    <button
      onClick={handleClick}
      aria-label={isAtBottom ? "Voltar ao topo" : "Próxima seção"}
      className={`fixed bottom-8 left-1/2 -translate-x-1/2 z-40 hidden md:flex items-center justify-center w-14 h-14 rounded-full shadow-xl hover:shadow-2xl hover:scale-110 active:scale-95 transition-all duration-300 border-2 border-white/20 ${
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
