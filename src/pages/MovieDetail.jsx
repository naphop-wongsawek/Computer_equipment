import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import ReviewForm from '../components/ReviewForm';
import ReviewList from '../components/ReviewList';
import MovieActions from '../components/MovieActions';
import { movies as localMovies } from '../data/data';
import { useAuth } from '../auth/AuthContext';
import { getReviews, postReview } from '../api/backend';

function MovieDetail() {
  const { id } = useParams();                       // ได้เป็น string เสมอ
  const [reviews, setReviews] = useState([]);       // รีวิวจาก backend ของเรา
  const { isLoggedIn, token, member } = useAuth();

  // หาอุปกรณ์จากข้อมูลในเครื่อง (id ใน data.js เป็นตัวเลข จึงเทียบเป็น string)
  const movie = localMovies.find(m => String(m.id) === id);

  // โหลดรีวิวของอุปกรณ์นี้จาก backend ถ้า backend ล่มก็แค่ไม่มีรีวิว หน้ายังดูได้
  useEffect(() => {
    let ignore = false;
    getReviews(id)
      .then(data => { if (!ignore) setReviews(data.items); })
      .catch(() => { if (!ignore) setReviews([]); });
    return () => { ignore = true; };
  }, [id]);

  // ส่งรีวิว: ReviewForm เรียกฟังก์ชันนี้ตอนกดส่ง ถ้า throw ฟอร์มจะโชว์ข้อความ error เอง
  async function handleReviewSubmit(text) {
    const saved = await postReview(id, text, token);
    setReviews([
      { ...saved, member: { id: member.id, displayName: member.displayName }, score: null },
      ...reviews,
    ]);
  }

  if (!movie) {
    return (
      <div className="mx-auto max-w-xl px-4 py-20 text-center">
        <p className="text-lg text-slate-700">ไม่พบอุปกรณ์ชิ้นนี้ 😢</p>
        <Link to="/products" className="mt-6 inline-block text-sm text-emerald-600 hover:underline">กลับไปหน้าอุปกรณ์ทั้งหมด</Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-10 md:px-6">
      <Link to="/products" className="text-sm text-slate-500 hover:text-emerald-600">กลับไปหน้าอุปกรณ์ทั้งหมด</Link>

      <div className="mt-4 flex flex-col gap-8 md:flex-row">
        {movie.poster ? (
          <img src={movie.poster} alt={`รูป ${movie.titleTh ?? ''} ${movie.title}`}
            className="w-56 shrink-0 self-start rounded-xl border border-slate-200" />
        ) : (
          <div className="grid aspect-square w-56 shrink-0 place-items-center rounded-xl bg-slate-100 text-7xl">
            {movie.emoji ?? '💻'}
          </div>
        )}

        <div className="flex-1">
          <p className="text-sm font-medium text-emerald-600">{movie.genre}</p>
          <h1 className="text-2xl font-semibold text-slate-900 md:text-3xl">{movie.title}</h1>
          {movie.titleTh && <p className="mt-1 text-slate-500">ยี่ห้อ {movie.titleTh}</p>}
          <p className="mt-2 text-sm text-slate-500">
            เปิดตัวปี {movie.year}{movie.rating != null && ` | ⭐ ${movie.rating}`}
            {movie.price != null && ` | ราคาประมาณ ฿${movie.price.toLocaleString('th-TH')}`}
          </p>
          <p className="mt-4 leading-relaxed text-slate-700">{movie.detail}</p>

          <MovieActions movieId={movie.id} />

          <div className="mt-8">
            <h2 className="mb-3 text-lg font-semibold text-slate-900">รีวิวจากสมาชิก ({reviews.length})</h2>
            <ReviewList items={reviews} />
          </div>

          <div className="mt-6 rounded-xl border border-emerald-100 bg-white p-5">
            {isLoggedIn ? (
              <ReviewForm key={movie.id} movieTitle={movie.title} onSubmit={handleReviewSubmit} />
            ) : (
              <p className="text-sm text-slate-500">
                <Link to="/login" className="text-emerald-600 hover:underline">เข้าสู่ระบบ</Link> เพื่อเขียนรีวิว
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default MovieDetail;
