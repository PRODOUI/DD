import { useEffect, useRef, useState, type ReactNode } from 'react';
import { cn } from '../utils/cn';

interface RevealProps {
  children: ReactNode;
  /** تأخير الظهور بالميلي ثانية (لإظهار العناصر تباعًا) */
  delay?: number;
  className?: string;
}

/**
 * يُظهر محتواه بحركة خفيفة عند وصول الزائر إليه بالتمرير.
 * الحركة معرّفة في index.css تحت الصنف  .reveal
 */
export function Reveal({ children, delay = 0, className }: RevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    if (!('IntersectionObserver' in window)) {
      setVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0, rootMargin: '0px 0px -8% 0px' },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={cn('reveal', visible && 'is-visible', className)}
      style={delay ? { transitionDelay: `${delay}ms` } : undefined}
    >
      {children}
    </div>
  );
}
