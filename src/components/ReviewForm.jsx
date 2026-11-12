import { useState } from 'react';

// ฟอร์มรีวิวสินค้า รับชื่อสินค้าและฟังก์ชัน onSubmit จาก Component แม่
function ReviewForm({ productTitle, onSubmit }) {
  const [review, setReview] = useState('');
  const [error, setError] = useState(null);
  const [status, setStatus] = useState('typing');

  if (status === 'success') {
    return (
      <p className="rounded-lg bg-emerald-50 p-4 text-emerald-700">
        ขอบคุณสำหรับรีวิว {productTitle} 🎉
      </p>
    );
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setStatus('submitting');
    setError(null);

    try {
      await onSubmit(review);
      setStatus('success');
    } catch (err) {
      setStatus('typing');
      setError(err);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <h3 className="font-medium text-slate-900">
        เขียนรีวิว {productTitle}
      </h3>

      <textarea
        value={review}
        onChange={(e) => setReview(e.target.value)}
        disabled={status === 'submitting'}
        rows={3}
        maxLength={2000}
        placeholder="ใช้งานแล้วรู้สึกอย่างไร (10–2000 ตัวอักษร)"
        className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 focus:border-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-100 disabled:bg-slate-50"
      />

      <div className="flex items-center gap-3">
        <button
          type="submit"
          disabled={review.trim().length === 0 || status === 'submitting'}
          className="rounded-lg bg-emerald-500 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-600 disabled:bg-slate-300"
        >
          {status === 'submitting' ? 'กำลังส่ง...' : 'ส่งรีวิว'}
        </button>

        {error && (
          <p className="text-sm text-red-600">
            {error.message}
          </p>
        )}
      </div>
      <p className="text-xs text-slate-400">{review.trim().length}/2000 ตัวอักษร</p>
    </form>
  );
}

export default ReviewForm;