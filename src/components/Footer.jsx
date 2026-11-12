import { Link } from 'react-router-dom';

function Footer() {
  return (
    <footer className="bg-emerald-950 text-emerald-50">
      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-10 md:grid-cols-[1.4fr_0.6fr] md:px-8">
        <div>
          <Link to="/" className="inline-flex items-center gap-3 text-lg font-bold text-white">
            <span className="grid h-10 w-10 place-items-center rounded-xl bg-emerald-700">💻</span>
            TechReview
          </Link>
          <p className="mt-4 max-w-xl text-sm leading-6 text-emerald-100/70">
            พื้นที่แบ่งปันข้อมูลและประสบการณ์เกี่ยวกับอุปกรณ์คอมพิวเตอร์
            เพื่อช่วยให้คุณเลือกอุปกรณ์ได้ตรงกับการใช้งาน
          </p>
        </div>
        <div className="md:justify-self-end">
          <p className="text-sm font-semibold text-white">ลิงก์ด่วน</p>
          <div className="mt-3 flex flex-wrap gap-x-5 gap-y-2 text-sm text-emerald-100/75">
            <Link to="/products" className="transition hover:text-white">อุปกรณ์ทั้งหมด</Link>
            <Link to="/about" className="transition hover:text-white">เกี่ยวกับเรา</Link>
            <Link to="/login" className="transition hover:text-white">เข้าสู่ระบบ</Link>
          </div>
        </div>
      </div>
      <div className="border-t border-white/10">
        <div className="mx-auto flex max-w-7xl flex-col gap-2 px-4 py-4 text-xs text-emerald-100/55 sm:flex-row sm:items-center sm:justify-between md:px-8">
          <p>TechReview · โปรเจกต์รายวิชา 520 341 Client Side Web Programming</p>
          <p>คณะวิทยาศาสตร์ มหาวิทยาลัยศิลปากร</p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
