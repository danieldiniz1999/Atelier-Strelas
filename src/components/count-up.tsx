import { useEffect, useRef, useState } from "react";

type Props = {
  end: number;
  prefix?: string;
  suffix?: string;
  duration?: number;
  format?: (n: number) => string;
  className?: string;
};

export function CountUp({
  end,
  prefix = "",
  suffix = "",
  duration = 1800,
  format,
  className,
}: Props) {
  const [value, setValue] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const started = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !started.current) {
            started.current = true;
            const start = performance.now();
            const tick = (now: number) => {
              const elapsed = Math.min((now - start) / duration, 1);
              // easeOutExpo
              const eased = elapsed === 1 ? 1 : 1 - Math.pow(2, -10 * elapsed);
              setValue(Math.round(end * eased));
              if (elapsed < 1) requestAnimationFrame(tick);
            };
            requestAnimationFrame(tick);
          }
        });
      },
      { threshold: 0.4 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [end, duration]);

  const display = format ? format(value) : value.toLocaleString("pt-BR");
  return (
    <span ref={ref} className={className}>
      {prefix}
      {display}
      {suffix}
    </span>
  );
}
