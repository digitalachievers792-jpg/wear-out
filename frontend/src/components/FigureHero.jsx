import { useRef, useState, useEffect } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

// The figure base image. Drop your real ChatGPT image over:
//   frontend/public/assets/hero/figure-base.webp
const BASE_IMG = '/assets/hero/figure-base.webp';

// Clothing layers in the exact order they get "worn" on scroll.
// `style` positions each cutout over the figure (tweak to match your image).
// Replace the placeholder SVGs in /assets/hero with your real transparent PNGs.
const ITEMS = [
  { key: 'shirt', src: '/assets/hero/shirt.svg', alt: 'Shirt', center: true, style: { top: '24%', left: '50%', width: '44%' } },
  { key: 'pants', src: '/assets/hero/pants.svg', alt: 'Pants', center: true, style: { top: '50%', left: '50%', width: '40%' } },
  { key: 'glasses', src: '/assets/hero/glasses.svg', alt: 'Glasses', center: true, style: { top: '12%', left: '50%', width: '26%' } },
  { key: 'watch', src: '/assets/hero/watch.svg', alt: 'Watch', center: false, style: { top: '42%', left: '70%', width: '13%' } },
  { key: 'shoes', src: '/assets/hero/shoes.svg', alt: 'Shoes', center: true, style: { top: '84%', left: '50%', width: '38%' } },
  { key: 'locket', src: '/assets/hero/locket.svg', alt: 'Locket', center: true, style: { top: '19%', left: '50%', width: '9%' } },
];

const FIGURE_END = 0.05;
function windowFor(index) {
  const start = FIGURE_END + index * 0.13;
  const end = start + 0.13;
  return [start, end];
}

function HeroItem({ progress, index, item }) {
  const [start, end] = windowFor(index);
  const opacity = useTransform(progress, [start, end], [0, 1]);
  const scale = useTransform(progress, [start, end], [0.5, 1]);
  const y = useTransform(progress, [start, end], [60, 0]);
  return (
    <motion.img
      src={item.src}
      alt={item.alt}
      draggable={false}
      style={{
        opacity,
        scale,
        y,
        left: item.style.left,
        top: item.style.top,
        width: item.style.width,
        ...(item.center ? { x: '-50%' } : {}),
      }}
      className="absolute will-change-transform pointer-events-none select-none"
    />
  );
}

function BrandReveal({ progress }) {
  const opacity = useTransform(progress, [0.85, 1], [0, 1]);
  const y = useTransform(progress, [0.85, 1], [30, 0]);
  return (
    <motion.div
      style={{ opacity, y }}
      className="absolute bottom-8 left-1/2 -translate-x-1/2 text-center px-4 z-20"
    >
      <h2 className="font-display text-5xl sm:text-7xl text-metallic tracking-widest leading-none">WEAR OUT</h2>
      <p className="text-gold tracking-[0.4em] uppercase mt-2 text-xs sm:text-sm">Wear Your Confidence</p>
    </motion.div>
  );
}

export default function FigureHero() {
  const ref = useRef(null);
  const [mobile, setMobile] = useState(false);

  useEffect(() => {
    const check = () => setMobile(window.innerWidth < 768);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end end'] });
  const baseOpacity = useTransform(scrollYProgress, [0, 0.05], [0, 1]);

  const sectionHeight = mobile ? '300vh' : '440vh';

  return (
    <section ref={ref} style={{ height: sectionHeight }} className="relative bg-gradient-to-b from-bone to-mist">
      <div className="sticky top-0 h-screen overflow-hidden">
        {/* Base figure */}
        <motion.div style={{ opacity: baseOpacity }} className="absolute inset-0 flex items-center justify-center">
          <img
            src={BASE_IMG}
            alt="Wear Out figure"
            className="h-[88vh] max-h-[760px] w-auto object-contain drop-shadow-xl"
            draggable={false}
          />
        </motion.div>

        {/* Clothing layers appear on scroll */}
        {ITEMS.map((item, i) => (
          <HeroItem key={item.key} progress={scrollYProgress} index={i} item={item} />
        ))}

        {/* Brand reveal at the end */}
        <BrandReveal progress={scrollYProgress} />

        <motion.div
          className="absolute bottom-4 left-1/2 -translate-x-1/2 text-slate-400 text-xs uppercase tracking-[0.3em] z-20"
          animate={{ y: [0, 8, 0] }}
          transition={{ repeat: Infinity, duration: 1.8 }}
        >
          Scroll to dress
        </motion.div>
      </div>
    </section>
  );
}
