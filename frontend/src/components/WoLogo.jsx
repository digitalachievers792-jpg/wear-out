import { motion } from 'framer-motion';

// Animated "WO" brand mark inside a ring.
// mode="nav"  -> compact, hover micro-animation (navbar / footer)
// mode="hero" -> full entrance: ring scales/rotates in, W & O slide from opposite sides and lock
export default function WoLogo({ mode = 'nav', size = 40, className = '' }) {
  const ring = {
    fill: 'none',
    stroke: 'url(#woGold)',
    strokeWidth: 6,
  };

  if (mode === 'hero') {
    return (
      <motion.svg
        width={size}
        height={size}
        viewBox="0 0 100 100"
        className={className}
        initial="hidden"
        animate="show"
      >
        <defs>
          <linearGradient id="woGold" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#f3e3b0" />
            <stop offset="0.5" stopColor="#c9a24b" />
            <stop offset="1" stopColor="#8a6a24" />
          </linearGradient>
        </defs>
        <motion.circle
          cx="50"
          cy="50"
          r="44"
          style={ring}
          variants={{
            hidden: { scale: 0.4, rotate: -120, opacity: 0 },
            show: { scale: 1, rotate: 0, opacity: 1, transition: { duration: 0.9, ease: 'easeOut' } },
          }}
        />
        <motion.text
          x="36"
          y="64"
          fontFamily="Bebas Neue, Arial"
          fontSize="42"
          fill="url(#woGold)"
          textAnchor="middle"
          variants={{ hidden: { x: -40, opacity: 0 }, show: { x: 0, opacity: 1, transition: { delay: 0.5, duration: 0.5 } } }}
        >
          W
        </motion.text>
        <motion.text
          x="66"
          y="64"
          fontFamily="Bebas Neue, Arial"
          fontSize="42"
          fill="url(#woGold)"
          textAnchor="middle"
          variants={{ hidden: { x: 40, opacity: 0 }, show: { x: 0, opacity: 1, transition: { delay: 0.5, duration: 0.5 } } }}
        >
          O
        </motion.text>
      </motion.svg>
    );
  }

  // nav / footer compact mark with hover micro-animation
  return (
    <motion.svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      className={className}
      whileHover={{ rotate: 8 }}
      transition={{ type: 'spring', stiffness: 200, damping: 14 }}
    >
      <defs>
        <linearGradient id="woGold" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#f3e3b0" />
          <stop offset="0.5" stopColor="#c9a24b" />
          <stop offset="1" stopColor="#8a6a24" />
        </linearGradient>
      </defs>
      <motion.circle
        cx="50"
        cy="50"
        r="44"
        style={ring}
        animate={{ rotate: [0, 360] }}
        transition={{ duration: 18, repeat: Infinity, ease: 'linear' }}
        transform="rotate(0 50 50)"
      />
      <text x="50" y="64" fontFamily="Bebas Neue, Arial" fontSize="42" fill="url(#woGold)" textAnchor="middle">
        WO
      </text>
    </motion.svg>
  );
}
