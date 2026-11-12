import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import FeaturedCarousel from '../components/FeaturedCarousel';
import { getProducts } from '../api/backend';

function shuffle(list) {
  const copy = [...list];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

function Home() {
  const [products, setProducts] = useState([]);
  const [picks, setPicks] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    let ignore = false;
    getProducts()
      .then(items => {
        if (ignore) return;
        setProducts(items);
        setPicks(shuffle(items));
      })
      .catch(loadError => {
        if (!ignore) setError(loadError);
      });

    return () => {
      ignore = true;
    };
  }, []);

  const categories = [...new Set(products.map(product => product.category).filter(Boolean))];

  return (
    <div className="bg-[#faf7ef]">
      <section className="mx-auto max-w-7xl px-4 py-12 md:px-8 md:py-16">
        <div className="rounded-3xl border border-emerald-200 bg-white/70 p-5 shadow-sm md:p-8">
          <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-emerald-700">ค้นหาตามการใช้งาน</p>
              <h2 className="mt-2 text-2xl font-bold tracking-tight text-slate-900 md:text-3xl">
                เริ่มจากหมวดที่คุณสนใจ
              </h2>
              <p className="mt-2 text-sm text-slate-500">เลือกดูอุปกรณ์แต่ละประเภทได้ในที่เดียว</p>
            </div>
            <Link to="/products" className="text-sm font-semibold text-emerald-800 hover:text-emerald-600">
              ดูสินค้าทั้งหมด <span aria-hidden="true">→</span>
            </Link>
          </div>

          {categories.length > 0 ? (
            <div className="mt-6 flex flex-wrap gap-3">
              {categories.map((category, index) => (
                <Link
                  key={category}
                  to={`/products?category=${encodeURIComponent(category)}`}
                  className="group inline-flex items-center gap-3 rounded-xl border border-emerald-100 bg-emerald-50/60 px-4 py-3 text-sm font-medium text-slate-700 transition hover:border-emerald-300 hover:bg-emerald-100"
                >
                  <span className="grid h-9 w-9 place-items-center rounded-lg bg-white text-lg shadow-sm">
                    {['▦', '⌘', '◉', '⌨', '▣', '◌'][index % 6]}
                  </span>
                  <span>{category}</span>
                  <span className="text-emerald-700 transition group-hover:translate-x-0.5" aria-hidden="true">→</span>
                </Link>
              ))}
            </div>
          ) : (
            <div className="mt-6 h-16 animate-pulse rounded-xl bg-emerald-50" />
          )}
        </div>
      </section>

      <section className="bg-[#faf7ef]">
        <div className="mx-auto max-w-7xl px-4 py-12 md:px-8 md:py-16">
          <div className="mb-6 flex items-end justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-emerald-700">Community picks</p>
              <h2 className="mt-2 text-2xl font-bold tracking-tight text-slate-900 md:text-3xl">อุปกรณ์แนะนำ</h2>
              <p className="mt-2 text-sm text-slate-500">สำรวจตัวเลือกน่าสนใจจากแคตตาล็อกของเรา</p>
            </div>
            <button
              onClick={() => setPicks(current => shuffle(current))}
              disabled={picks.length < 2}
              className="shrink-0 rounded-full border border-emerald-200 bg-white px-4 py-2 text-sm font-semibold text-emerald-800 transition hover:border-emerald-400 hover:bg-emerald-50 disabled:opacity-50"
            >
              สุ่มใหม่ <span aria-hidden="true">⟳</span>
            </button>
          </div>
          {error ? (
            <p role="alert" className="rounded-xl border border-red-100 bg-red-50 p-4 text-sm text-red-700">
              โหลดอุปกรณ์แนะนำไม่สำเร็จ: {error.message}
            </p>
          ) : (
            <FeaturedCarousel products={picks} />
          )}
        </div>
      </section>
    </div>
  );
}

export default Home;
