import { useParams, Link } from 'react-router-dom';
import WoLogo from '../components/WoLogo';

export default function ComingSoon({ category: categoryProp }) {
  const params = useParams();
  const category = categoryProp || params.category || 'Coming Soon';
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-4">
      <WoLogo mode="hero" size={100} className="mb-6" />
      <h1 className="font-display text-5xl sm:text-7xl text-metallic tracking-widest uppercase">{category}</h1>
      <p className="text-gold tracking-[0.3em] uppercase mt-3 text-sm">Coming Soon</p>
        <p className="text-slate-500 mt-6 max-w-md">
        We're putting the final stitches on our {category} line. Join the community to be the first to know when it drops.
      </p>
      <Link to="/contact" className="btn-outline mt-8">
        Get Notified
      </Link>
    </div>
  );
}
