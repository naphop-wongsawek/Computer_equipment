import { Link } from 'react-router-dom';

// การ์ดอุปกรณ์ 1 ใบ รับ object จาก data.js: { id, title, titleTh, year, genre, rating, price, emoji, poster }
// title = ชื่อรุ่น, titleTh = ยี่ห้อ, genre = หมวดอุปกรณ์
// ชื่อไฟล์และ prop "movie" ยังเป็นของเดิม เพื่อให้ MovieGrid ใช้ต่อได้ (เปลี่ยนชื่อทีหลังได้)
function MovieCard({ movie }) {
  return (
    <Link to={`/products/${movie.id}`}
          className="group block overflow-hidden rounded-xl border border-emerald-100 bg-white transition hover:border-emerald-300 hover:shadow-md">
      {movie.poster ? (
        <img src={movie.poster} alt={`รูป ${movie.titleTh ?? ''} ${movie.title}`} loading="lazy"
             className="aspect-square w-full object-cover" />
      ) : (
        <div className="grid aspect-square w-full place-items-center bg-slate-100 text-6xl">
          {movie.emoji ?? '💻'}
        </div>
      )}
      <div className="p-3">
        <p className="text-xs font-medium text-emerald-600">{movie.genre}</p>
        <h3 className="truncate font-medium text-slate-900" title={movie.title}>{movie.title}</h3>
        {movie.titleTh && <p className="truncate text-sm text-slate-500">{movie.titleTh}</p>}
        <div className="mt-1 flex items-center justify-between text-xs text-slate-400">
          <span>{movie.rating != null && `⭐ ${movie.rating}`}</span>
          <span className="font-medium text-slate-700">
            {movie.price != null && `฿${movie.price.toLocaleString('th-TH')}`}
          </span>
        </div>
      </div>
    </Link>
  );
}

export default MovieCard;
