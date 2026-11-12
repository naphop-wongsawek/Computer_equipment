
import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import ProductGrid from '../components/ProductGrid';
import { getProducts } from '../api/backend';

function Products() {
  const [searchParams] = useSearchParams();
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState(() => searchParams.get('category') || 'all');
  const [products, setProducts] = useState([]);
  const [status, setStatus] = useState('loading');
  const [error, setError] = useState(null);
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    setCategory(searchParams.get('category') || 'all');
  }, [searchParams]);

  useEffect(() => {
    let ignore = false;

    async function loadProducts() {
      setStatus('loading');
      setError(null);
      try {
        const items = await getProducts();
        if (!ignore) {
          setProducts(items);
          setStatus('success');
        }
      } catch (loadError) {
        if (!ignore) {
          setError(loadError);
          setStatus('error');
        }
      }
    }

    loadProducts();
    return () => {
      ignore = true;
    };
  }, [reloadKey]);

  const categories = [
    ...new Set(products.map(product => product.category).filter(Boolean))
  ];

  const q = query.trim().toLowerCase();

  const shown = products.filter(product =>
    (category === 'all' || product.category === category) &&
    (
      q === '' ||
      product.name.toLowerCase().includes(q) ||
      (product.brand || '').toLowerCase().includes(q)
    )
  );

  const chipClass = (active) =>
    'rounded-full border px-4 py-2 text-sm font-medium transition ' +
    (active
      ? 'border-emerald-800 bg-emerald-800 text-white shadow-sm'
      : 'border-emerald-200 bg-white text-slate-600 hover:border-emerald-300 hover:bg-emerald-50');

  return (
    <div className="min-h-[65vh] bg-[#faf7ef]">
      <div className="mx-auto max-w-7xl px-4 py-10 md:px-8 md:py-14">
      <div className="mb-8 flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-emerald-700">Product directory</p>
          <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-900 md:text-4xl">
            ค้นหาอุปกรณ์ที่ใช่
          </h1>
          <p className="mt-2 text-sm text-slate-500">
            พบ {shown.length} จาก {products.length} รายการ
          </p>
        </div>

        <label className="relative block w-full md:max-w-sm">
          <span className="sr-only">ค้นหาชื่อรุ่นหรือยี่ห้อ</span>
          <span className="pointer-events-none absolute inset-y-0 left-4 flex items-center text-lg text-emerald-700" aria-hidden="true">⌕</span>
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="ค้นหาชื่อรุ่นหรือยี่ห้อ..."
            className="w-full rounded-xl border border-emerald-100 bg-white py-3 pl-11 pr-4 shadow-sm outline-none transition placeholder:text-slate-400 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100"
          />
        </label>
      </div>

      <div className="mb-7 rounded-2xl border border-emerald-100 bg-white p-4 shadow-sm md:p-5">
        <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-slate-500">เลือกหมวดหมู่</p>
        <div className="flex flex-wrap gap-2">
        <button
          onClick={() => setCategory('all')}
          className={chipClass(category === 'all')}
        >
          ทุกหมวด
        </button>

        {categories.map(categoryName => (
          <button
            key={categoryName}
            onClick={() => setCategory(categoryName)}
            className={chipClass(category === categoryName)}
          >
            {categoryName}
          </button>
        ))}
        </div>
      </div>

      <ProductGrid
        products={shown}
        status={status}
        error={error}
        onRetry={() => setReloadKey(key => key + 1)}
      />
      </div>
    </div>
  );
}

export default Products;
