
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';
import {
  putVote,
  addToWishlist,
  removeFromWishlist,
  getWishlist
} from '../api/backend';

// ปุ่มให้คะแนนสินค้าและเพิ่มสินค้าเข้า Wishlist (ต้อง Login)
function ProductActions({ productId, initialVote = null, initialInWishlist = false }) {
  const { isLoggedIn, token } = useAuth();

  const [myScore, setMyScore] = useState(initialVote);
  const [inWishlist, setInWishlist] = useState(initialInWishlist);
  const [message, setMessage] = useState(null);

  // ตรวจสอบว่าสินค้านี้อยู่ใน Wishlist หรือไม่
  useEffect(() => {
    if (!isLoggedIn || !token) {
      setInWishlist(false);
      setMyScore(null);
      return;
    }

    let ignore = false;

    async function syncWishlistStatus() {
      try {
        const data = await getWishlist(token);

        const saved = data.items.some(
          item => Number(item.id) === Number(productId)
        );

        if (!ignore) {
          setInWishlist(saved);
        }
      } catch (err) {
        if (!ignore) {
          setMessage(err.message || 'โหลดรายการที่อยากได้ไม่สำเร็จ');
        }
      }
    }

    syncWishlistStatus();

    return () => {
      ignore = true;
    };
  }, [isLoggedIn, token, productId]);

  useEffect(() => {
    setMyScore(initialVote ?? null);
    setInWishlist(Boolean(initialInWishlist));
  }, [initialVote, initialInWishlist]);

  // ถ้ายังไม่ได้ Login
  if (!isLoggedIn) {
    return (
      <p className="mt-4 text-sm text-slate-500">
        <Link
          to="/login"
          className="text-emerald-600 hover:underline"
        >
          เข้าสู่ระบบ
        </Link>
        {' '}เพื่อให้คะแนนและเพิ่มสินค้าเข้ารายการที่อยากดู
      </p>
    );
  }

  // บันทึกคะแนนสินค้า
  async function handleVote(score) {
    try {
      await putVote(productId, score, token);

      setMyScore(score);
      setMessage('บันทึกคะแนนเรียบร้อย');
    } catch (err) {
      setMessage(err.message || 'เกิดข้อผิดพลาดขณะบันทึกคะแนน');
    }
  }

  // เพิ่มหรือลบสินค้าใน Wishlist
  async function handleWishlist() {
    try {
      if (inWishlist) {
        await removeFromWishlist(productId, token);

        setInWishlist(false);
        setMessage('ลบสินค้าออกจากรายการที่อยากดูแล้ว');
      } else {
        await addToWishlist(productId, token);

        setInWishlist(true);
        setMessage('เพิ่มสินค้าเข้ารายการที่อยากดูแล้ว');
      }
    } catch (err) {
      setMessage(
        err.message || 'เกิดข้อผิดพลาดขณะอัปเดตรายการที่อยากดู'
      );
    }
  }

  return (
    <div className="mt-4 space-y-3">

      {/* ปุ่มให้คะแนน 1-10 */}
      <div className="flex flex-wrap items-center gap-1">
        <span className="mr-2 text-sm text-slate-500">
          ให้คะแนน
        </span>

        {Array.from({ length: 10 }, (_, i) => i + 1).map(score => (
          <button
            key={score}
            onClick={() => handleVote(score)}
            className={
              'h-8 w-8 rounded-lg border text-sm ' +
              (myScore === score
                ? 'border-emerald-500 bg-emerald-500 text-white'
                : 'border-emerald-200 bg-white text-slate-600 hover:bg-emerald-50')
            }
          >
            {score}
          </button>
        ))}
      </div>

      {/* ปุ่ม Wishlist */}
      <button
        onClick={handleWishlist}
        className={
          'rounded-lg border px-4 py-2 text-sm ' +
          (inWishlist
            ? 'border-emerald-500 bg-emerald-50 text-emerald-700'
            : 'border-emerald-200 bg-white text-slate-600 hover:bg-emerald-50')
        }
      >
        {inWishlist
          ? '❤️ อยู่ในรายการที่อยากดูแล้ว'
          : '🤍 เพิ่มเข้ารายการที่อยากดู'}
      </button>

      {/* ข้อความแจ้งผล */}
      {message && (
        <p className="text-sm text-slate-500">
          {message}
        </p>
      )}

    </div>
  );
}

export default ProductActions;
