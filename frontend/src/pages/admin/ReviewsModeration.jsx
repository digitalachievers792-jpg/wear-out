import { useEffect, useState } from 'react';
import api from '../../api';

export default function ReviewsModeration() {
  const [reviews, setReviews] = useState([]);

  const load = () => api.getPendingReviews().then(setReviews);
  useEffect(() => { load(); }, []);

  const act = async (id, status) => {
    await api.setReviewStatus(id, status);
    await load();
  };
  const del = async (id) => {
    if (!confirm('Reject & remove this review?')) return;
    await api.deleteReview(id);
    await load();
  };

  return (
    <div>
      <h1 className="text-2xl font-semibold text-ink mb-4">Pending Reviews</h1>
      <div className="space-y-3">
        {reviews.map((r) => (
          <div key={r._id} className="admin-surface p-4">
            <div className="flex justify-between items-start">
              <div>
                <p className="font-semibold text-ink">{r.author}</p>
                <p className="text-xs text-slate-400">{r.product?.name}</p>
              </div>
              <div className="text-gold-dark font-semibold">{'★'.repeat(r.rating)}</div>
            </div>
            <p className="text-slate-600 text-sm mt-2">{r.comment}</p>
            <div className="flex gap-3 mt-3">
              <button className="btn-gold !py-1.5 !px-4" onClick={() => act(r._id, 'Approved')}>Approve</button>
              <button className="btn-outline !py-1.5 !px-4" onClick={() => del(r._id)}>Reject</button>
            </div>
          </div>
        ))}
        {reviews.length === 0 && <p className="text-slate-400">No pending reviews. 🎉</p>}
      </div>
    </div>
  );
}
