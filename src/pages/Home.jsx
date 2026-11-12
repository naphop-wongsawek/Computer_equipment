import { Link } from 'react-router-dom';
import { useState } from 'react';
import FeaturedCarousel from '../components/FeaturedCarousel';
import { movies as localMovies } from '../data/data';

// สลับลำดับแบบสุ่มบนสำเนา ไม่แตะ array เดิม
function shuffle(list) {
  const copy = [...list];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

function Home() {
  // สุ่มครั้งเดียวตอน component เกิด แล้วจำไว้ใน state (กดเลื่อนแล้วลำดับไม่เปลี่ยน)
  const [picks, setPicks] = useState(() => shuffle(localMovies));

  return (
    <div className="mx-auto max-w-5xl px-4 md:px-6">
      {/* Hero */}
      <section className="py-14 md:py-20">
        <p className="text-sm font-medium text-emerald-600">รีวิวอุปกรณ์คอมพิวเตอร์</p>
        <h1 className="mt-2 max-w-2xl text-3xl font-semibold tracking-tight text-slate-900 md:text-5xl">
          เลือกอุปกรณ์ให้ถูกใจ จากรีวิวจริง
        </h1>
        <p className="mt-4 max-w-xl text-slate-600">
          รวมรีวิวการ์ดจอ ซีพียู เมาส์ คีย์บอร์ด จอมอนิเตอร์ หูฟัง และอุปกรณ์อื่นๆ
          ดูรายละเอียดและอ่านความเห็นจากสมาชิกก่อนตัดสินใจซื้อ
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <Link to="/products" className="rounded-lg bg-emerald-500 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-600">
            ดูอุปกรณ์ทั้งหมด
          </Link>
        </div>
      </section>

      {/* Featured */}
      <section className="pb-16">
        <div className="mb-4 flex items-end justify-between">
          <div>
            <h2 className="text-xl font-semibold text-slate-900">อุปกรณ์แนะนำ</h2>
            <p className="text-sm text-slate-500">สุ่มลำดับใหม่ทุกครั้งที่เปิดหน้า</p>
          </div>
          <button onClick={() => setPicks(shuffle(picks))} className="text-sm text-emerald-600 hover:underline">
            สุ่มใหม่
          </button>
        </div>
        <FeaturedCarousel movies={picks} />
      </section>
    </div>
  );
}

export default Home;
