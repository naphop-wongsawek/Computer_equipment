import { Link } from 'react-router-dom';

function ProductCard({ product }) {
  return (
    <Link
      to={`/products/${product.id}`}
      className="group flex h-full flex-col overflow-hidden rounded-2xl border border-emerald-100 bg-white shadow-sm transition duration-200 hover:-translate-y-1 hover:border-emerald-300 hover:shadow-xl hover:shadow-emerald-900/10"
    >
      <div className="relative aspect-[4/3] overflow-hidden bg-gradient-to-br from-emerald-50 via-slate-100 to-teal-100">
        {product.imageUrl ? (
          <img
            src={product.imageUrl}
            alt={`รูป ${product.name}`}
            loading="lazy"
            className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="grid h-full w-full place-items-center text-6xl transition duration-300 group-hover:scale-105">
            {product.emoji ?? '💻'}
          </div>
        )}
        {product.category && (
          <span className="absolute left-3 top-3 rounded-full border border-white/70 bg-white/90 px-3 py-1 text-[11px] font-semibold text-emerald-800 shadow-sm backdrop-blur">
            {product.category}
          </span>
        )}
      </div>

      <div className="flex flex-1 flex-col p-4">
        <h3
          className="line-clamp-2 min-h-12 font-semibold leading-6 text-slate-900 group-hover:text-emerald-800"
          title={product.name}
        >
          {product.name}
        </h3>
        <p className="mt-1 truncate text-sm text-slate-500">
          {product.brand || 'ไม่ระบุยี่ห้อ'}
        </p>

        <div className="mt-auto flex items-center justify-between gap-2 border-t border-emerald-50 pt-3">
          <span className="text-sm font-medium text-amber-600">
            {product.rating != null ? `★ ${product.rating}` : 'ยังไม่มีคะแนน'}
          </span>
          <span className="text-sm font-bold text-emerald-900">
            {product.price != null ? `฿${Number(product.price).toLocaleString('th-TH')}` : 'สอบถามราคา'}
          </span>
        </div>
      </div>
    </Link>
  );
}

export default ProductCard;
