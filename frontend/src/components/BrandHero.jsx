import { useRef, useState, useEffect } from 'react';
import { motion, useScroll, useTransform, animate } from 'framer-motion';
import { Link } from 'react-router-dom';

function HeroLetter({ progress, index, char }) {
  const start = 0.08 + index * 0.06;
  const end = start + 0.3;
  const x = useTransform(progress, [start, end], [index % 2 === 0 ? -60 : 60, 0]);
  const opacity = useTransform(progress, [start, end], [0, 1]);
  const scale = useTransform(progress, [start, end], [0.5, 1]);
  return (
    <motion.span
      style={{ opacity, x, scale, display: 'inline-block', ...(char === ' ' ? { width: '0.45em' } : {}) }}
      className="hero-metal inline-block"
    >
      {char === ' ' ? '\u00A0' : char}
    </motion.span>
  );
}

function BrandMark({ progress }) {
  const scale = useTransform(progress, [0, 0.45], [0.4, 1]);
  const rotate = useTransform(progress, [0, 0.6], [-200, 0]);
  const opacity = useTransform(progress, [0, 0.25], [0, 1]);
  return (
    <motion.svg
      width={110}
      height={110}
      viewBox="0 0 100 100"
      style={{ scale, rotate, opacity }}
      className="mx-auto mb-6"
    >
      <defs>
        <linearGradient id="woGoldHero" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#c9a227" />
          <stop offset="0.5" stopColor="#a8740f" />
          <stop offset="1" stopColor="#6b4f12" />
        </linearGradient>
      </defs>
      <circle cx="50" cy="50" r="44" fill="none" stroke="url(#woGoldHero)" strokeWidth="6" />
      <text x="50" y="64" fontFamily="Bebas Neue, Arial" fontSize="42" fill="url(#woGoldHero)" textAnchor="middle">
        WO
      </text>
    </motion.svg>
  );
}

export default function BrandHero() {
  const ref = useRef(null);
  const [mobile, setMobile] = useState(false);

  useEffect(() => {
    const check = () => setMobile(window.innerWidth < 768);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end end'] });
  const taglineOpacity = useTransform(scrollYProgress, [0.7, 1], [0, 1]);
  const taglineY = useTransform(scrollYProgress, [0.7, 1], [30, 0]);

  useEffect(() => {
    const target = window.innerHeight * 1.4;
    animate(0, target, {
      duration: 2.5,
      ease: [0.25, 0.1, 0.25, 1],
      onUpdate: (v) => window.scrollTo(0, v),
    });
  }, []);

  const word = 'WEAR OUT';
  const sectionHeight = mobile ? '180vh' : '260vh';

  return (
    <section ref={ref} style={{ height: sectionHeight }} className="relative bg-gradient-to-b from-bone to-mist">
      <div className="sticky top-0 h-screen overflow-hidden flex flex-col items-center justify-center text-center px-4">
        {/* Scroll-revealed featured image backdrop — full width, kept sharp */}
        <div className="absolute inset-0 z-0">
          <img
            src="/assets/featured-hero.png"
            alt="Wear Out featured collection"
            className="w-full h-full object-cover object-center"
          />
        </div>
        <div className="absolute inset-0 z-0 bg-mist/15" />

        <div className="relative z-10 flex flex-col items-center justify-center px-4">
          <h1
            className="leading-none text-[clamp(2.25rem,12vw,8rem)]"
            style={{
              fontFamily: 'Orbitron, "Arial Black", sans-serif',
              fontWeight: 900,
              letterSpacing: '-0.02em',
              transform: 'skewX(-8deg)',
              textTransform: 'uppercase',
            }}
          >
            {word.split('').map((ch, i) => (
              <HeroLetter key={i} progress={scrollYProgress} index={i} char={ch} />
            ))}
          </h1>

        <motion.div style={{ opacity: taglineOpacity, y: taglineY }} className="mt-6">
          <p className="text-gold tracking-[0.4em] uppercase text-sm sm:text-base drop-shadow-[0_1px_6px_rgba(0,0,0,0.45)]">Wear Your Confidence</p>
          <p className="text-black mt-4 max-w-md mx-auto drop-shadow-[0_1px_3px_rgba(255,255,255,0.85)]">
            Premium streetwear built to make a statement. Bold fits, clean lines, unapologetic confidence.
          </p>
          <div className="flex gap-3 justify-center mt-8">
            <Link to="/shirts" className="bg-black text-gold px-5 py-2.5 rounded-md font-semibold hover:bg-neutral-800 transition-colors">
              Shop Now
            </Link>
            <Link to="/about" className="bg-gold text-black px-5 py-2.5 rounded-md font-semibold hover:bg-gold-light transition-colors">
              Our Story
            </Link>
          </div>
        </motion.div>

        </div>
      </div>
    </section>
  );
}
