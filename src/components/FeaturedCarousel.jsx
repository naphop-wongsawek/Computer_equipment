
import { useState } from 'react';
import ProductCard from './ProductCard';

const PER_PAGE = 4;

// แสดงสินค้าแนะนำแบบแบ่งหน้า
function FeaturedCarousel({ products }) {
  const [page, setPage] = useState(0);
  const total = Math.ceil(products.length / PER_PAGE);

  if (products.length === 0) {
    return (
      <p className="py-10 text-center text-slate-400">
        ยังไม่มีอุปกรณ์แนะนำ
      </p>
    );
  }

  const shown = products.slice(
    page * PER_PAGE,
    page * PER_PAGE + PER_PAGE
  );

  const prev = () => setPage(p => (p - 1 + total) % total);
  const next = () => setPage(p => (p + 1) % total);

  return (
    <div>
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        {shown.map(product => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>

      <div className="mt-4 flex items-center justify-center gap-4 text-sm text-slate-500">
        <button
          onClick={prev}
          className="rounded-lg border border-emerald-200 bg-white px-3 py-1.5 text-emerald-700 hover:bg-emerald-50"
        >
          ก่อนหน้า
        </button>

        <span>ชุดที่ {page + 1} จาก {total}</span>

        <button
          onClick={next}
          className="rounded-lg border border-emerald-200 bg-white px-3 py-1.5 text-emerald-700 hover:bg-emerald-50"
        >
          ถัดไป
        </button>
      </div>
    </div>
  );
}

export default FeaturedCarousel;
