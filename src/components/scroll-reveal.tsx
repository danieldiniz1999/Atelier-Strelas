import { useEffect, useRef, type ReactNode, type CSSProperties } from "react";

interface ScrollRevealProps {
  children: ReactNode;
  delay?: number;
  className?: string;
}

// Single high-performance observer instance shared across all elements
let sharedObserver: IntersectionObserver | null = null;
const revealCallbacks = new WeakMap<Element, () => void>();

function getSharedObserver(): IntersectionObserver | null {
  if (typeof window === "undefined") return null;
  if (!sharedObserver) {
    sharedObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const el = entry.target;
            const cb = revealCallbacks.get(el);
            if (cb) {
              cb();
              revealCallbacks.delete(el);
            }
            sharedObserver?.unobserve(el);
          }
        });
      },
      { threshold: 0.08, rootMargin: "0px 0px -30px 0px" },
    );
  }
  return sharedObserver;
}

/**
 * Wrap any block to fade/slide it in when it scrolls into view.
 * Uses hardware acceleration and a single shared observer.
 */
export function ScrollReveal({ children, delay = 0, className = "" }: ScrollRevealProps) {
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // Fast-path: if IntersectionObserver is not supported, reveal immediately
    const observer = getSharedObserver();
    if (!observer) {
      el.classList.add("is-visible");
      return;
    }

    revealCallbacks.set(el, () => {
      el.classList.add("is-visible");
    });
    observer.observe(el);

    return () => {
      revealCallbacks.delete(el);
      observer.unobserve(el);
    };
  }, []);

  const style: CSSProperties = delay ? { transitionDelay: `${delay}ms` } : {};

  return (
    <div ref={ref} className={`reveal ${className}`} style={style}>
      {children}
    </div>
  );
}
