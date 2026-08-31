import WoLogo from '../components/WoLogo';

export default function About() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-16">
      <div className="text-center mb-12">
        <WoLogo mode="hero" size={90} className="mx-auto mb-4" />
        <h1 className="font-display text-4xl sm:text-6xl text-metallic tracking-widest">WEAR OUT</h1>
        <p className="text-gold tracking-[0.4em] uppercase mt-3 text-sm">Wear Your Confidence</p>
      </div>
      <div className="space-y-6 text-slate-600 leading-relaxed">
        <p>
          Wear Out is a premium streetwear label built for people who refuse to blend in. Born from the streets and
          forged in bold metallic tones, our pieces are designed to make a statement before you say a word.
        </p>
        <p>
          Every drop is crafted with obsessive attention to fit, fabric, and finish. From oversized color-block tees
          to cargo pants with tan-trimmed pockets, our collection is unapologetically confident — just like you.
        </p>
        <p>
          We believe clothing is armor. When you wear Wear Out, you wear your confidence.
        </p>
      </div>
      <div className="grid sm:grid-cols-3 gap-4 mt-12">
        {['Bold', 'Premium', 'Confident'].map((v) => (
          <div key={v} className="bg-white border border-gold/20 rounded-lg p-6 text-center shadow-sm">
            <p className="font-display text-3xl text-gold">{v}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
