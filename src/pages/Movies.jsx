import { useState } from 'react';
import MovieGrid from '../components/MovieGrid';
import { movies as localMovies } from '../data/data';
// ถ้าทีมมี backend ของอุปกรณ์คอมพิวเตอร์แล้ว ค่อยกลับไปใช้ getMovies จาก '../api/backend'
// (ต้องให้ backend ส่ง field ชื่อเดียวกับ data.js)

function Movies() {
  const [query, setQuery] = useState('');      // คำค้น กรองในเครื่อง
  const [category, setCategory] = useState('all'); // หมวดที่เลือก 'all' = ทุกหมวด

  // ใช้ข้อมูลในเครื่อง จึงไม่มี loading / error
  const movies = localMovies;
  const status = 'success';
  const error = null;

  // รายชื่อหมวดที่มีจริงในข้อมูล และรายการหลังกรอง
  const categories = [...new Set(movies.map(m => m.genre).filter(Boolean))];
  const q = query.trim().toLowerCase();
  const shown = movies.filter(m =>
    (category === 'all' || m.genre === category) &&
    (q === '' ||
      m.title.toLowerCase().includes(q) ||
      (m.titleTh ?? '').toLowerCase().includes(q))
  );

  const chipClass = (active) =>
    'rounded-full border px-3 py-1 text-sm transition ' +
    (active ? 'border-emerald-500 bg-emerald-500 text-white' : 'border-emerald-200 bg-white text-slate-600 hover:bg-emerald-50');

  return (
    <div className="mx-auto max-w-5xl px-4 py-10 md:px-6">
      <div className="mb-4 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">อุปกรณ์คอมพิวเตอร์ทั้งหมด</h1>
          <p className="text-sm text-slate-500">
            พบ {shown.length} จาก {movies.length} รายการ
          </p>
        </div>
        <input value={query} onChange={(e) => setQuery(e.target.value)}
               placeholder="พิมพ์ชื่อรุ่นหรือยี่ห้อเพื่อค้นหา..."
               className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 focus:border-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-100 md:w-72" />
      </div>

      {/* เมนูเลือกหมวด สร้างจากข้อมูลที่มีจริง */}
      <div className="mb-6 flex flex-wrap gap-2">
        <button onClick={() => setCategory('all')} className={chipClass(category === 'all')}>ทุกหมวด</button>
        {categories.map(c => (
          <button key={c} onClick={() => setCategory(c)} className={chipClass(category === c)}>{c}</button>
        ))}
      </div>

      <MovieGrid movies={shown} status={status} error={error} onRetry={() => {}} />
    </div>
  );
}

export default Movies;
