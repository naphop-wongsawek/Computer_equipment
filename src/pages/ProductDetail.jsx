
import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import ReviewForm from '../components/ReviewForm';
import ReviewList from '../components/ReviewList';
import ProductActions from '../components/ProductActions';
import { useAuth } from '../auth/AuthContext';
import { getProduct, getReviews, postReview } from '../api/backend';

function ProductDetail() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [status, setStatus] = useState('loading');
  const [error, setError] = useState(null);
  const [reviewError, setReviewError] = useState(null);
  const { isLoggedIn, token, member } = useAuth();

  useEffect(() => {
    let ignore = false;

    setStatus('loading');
    setError(null);
    setProduct(null);
    setReviews([]);
    setReviewError(null);
    getProduct(id, token)
      .then(loadedProduct => {
        if (ignore) return;
        setProduct(loadedProduct);
        setStatus('success');
      })
      .catch(loadError => {
        if (!ignore) {
          setError(loadError);
          setStatus('error');
        }
      });
    getReviews(id)
      .then(data => {
        if (!ignore) setReviews(data.items);
      })
      .catch(loadError => {
        if (!ignore) setReviewError(loadError);
      });

    return () => {
      ignore = true;
    };
  }, [id, token]);

  async function handleReviewSubmit(text) {
    const saved = await postReview(id, text, token);

    setReviews(previousReviews => [
      {
        ...saved,
        member: {
          id: member.id,
          displayName: member.displayName
        },
        score: null
      },
      ...previousReviews
    ]);
  }

  if (status === 'loading') {
    return <p className="mx-auto max-w-4xl px-4 py-20 text-center text-slate-500">กำลังโหลดข้อมูลอุปกรณ์...</p>;
  }

  if (status === 'error') {
    return (
      <div className="mx-auto max-w-xl px-4 py-20 text-center">
        <p role="alert" className="text-lg text-slate-700">
          {error?.status === 404 ? 'ไม่พบอุปกรณ์ชิ้นนี้ 😢' : `โหลดข้อมูลไม่สำเร็จ: ${error?.message}`}
        </p>
        <Link
          to="/products"
          className="mt-6 inline-block text-sm text-emerald-600 hover:underline"
        >
          กลับไปหน้าอุปกรณ์ทั้งหมด
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-10 md:px-6">
      <Link
        to="/products"
        className="text-sm text-slate-500 hover:text-emerald-600"
      >
        กลับไปหน้าอุปกรณ์ทั้งหมด
      </Link>

      <div className="mt-4 flex flex-col gap-8 md:flex-row">
        {product.imageUrl ? (
          <img
            src={product.imageUrl}
            alt={`รูป ${product.name}`}
            className="w-56 shrink-0 self-start rounded-xl border border-slate-200"
          />
        ) : (
          <div className="grid aspect-square w-56 shrink-0 place-items-center rounded-xl bg-slate-100 text-7xl">
            {product.emoji ?? '💻'}
          </div>
        )}

        <div className="flex-1">
          <p className="text-sm font-medium text-emerald-600">
            {product.category}
          </p>

          <h1 className="text-2xl font-semibold text-slate-900 md:text-3xl">
            {product.name}
          </h1>

          <p className="mt-1 text-slate-500">
            ยี่ห้อ {product.brand}
          </p>

          <p className="mt-2 text-sm text-slate-500">
            เปิดตัวปี {product.releaseYear}
            {product.rating != null && ` | ⭐ ${product.rating}`}
            {product.price != null &&
              ` | ราคาประมาณ ฿${product.price.toLocaleString('th-TH')}`}
          </p>

          <p className="mt-4 leading-relaxed text-slate-700">
            {product.description}
          </p>

          <ProductActions
            productId={product.id}
            initialVote={product.myVote}
            initialInWishlist={product.inWishlist}
          />

          <div className="mt-8">
            <h2 className="mb-3 text-lg font-semibold text-slate-900">
              รีวิวจากสมาชิก ({reviews.length})
            </h2>

            {reviewError
              ? <p role="alert" className="text-sm text-red-600">โหลดรีวิวไม่สำเร็จ: {reviewError.message}</p>
              : <ReviewList items={reviews} />}
          </div>

          <div className="mt-6 rounded-xl border border-emerald-100 bg-white p-5">
            {isLoggedIn ? (
              <ReviewForm
                key={product.id}
                productTitle={product.name}
                onSubmit={handleReviewSubmit}
              />
            ) : (
              <p className="text-sm text-slate-500">
                <Link
                  to="/login"
                  className="text-emerald-600 hover:underline"
                >
                  เข้าสู่ระบบ
                </Link>
                {' '}เพื่อเขียนรีวิว
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductDetail;
