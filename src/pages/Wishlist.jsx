
import { useEffect, useState } from 'react';
import ProductGrid from '../components/ProductGrid';
import { useAuth } from '../auth/AuthContext';
import { getWishlist } from '../api/backend';

// หน้า Wishlist ของสมาชิกที่เข้าสู่ระบบ
function Wishlist() {
  const { member, token } = useAuth();

  const [products, setProducts] = useState([]);
  const [status, setStatus] = useState(token ? 'loading' : 'success');
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!token) {
      setProducts([]);
      setStatus('success');
      setError(null);
      return;
    }

    let mounted = true;

    setStatus('loading');
    setError(null);

    getWishlist(token, { includeMemberRatings: true })
      .then((data) => {
        if (!mounted) return;

        setProducts(data.items);
        setStatus('success');
      })
      .catch((err) => {
        if (!mounted) return;

        setError(err);
        setStatus('error');
      });

    return () => {
      mounted = false;
    };
  }, [token]);

  return (
    <div className="mx-auto max-w-5xl px-4 py-10 md:px-6">
      <h1 className="text-2xl font-semibold text-slate-900">
        รายการอุปกรณ์ที่สนใจของ {member?.displayName}
      </h1>

      <p className="mb-6 text-sm text-slate-500">
        กดปุ่มหัวใจในหน้ารายละเอียดอุปกรณ์เพื่อเพิ่มรายการที่สนใจ
      </p>

      <ProductGrid
        products={products}
        status={status}
        error={error}
      />
    </div>
  );
}

export default Wishlist;
