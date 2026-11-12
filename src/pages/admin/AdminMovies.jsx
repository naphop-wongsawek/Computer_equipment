import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../auth/AuthContext';
import { getAdminProducts } from '../../api/backend';
import {
  ErrorBox,
  Loading,
  btnPrimary,
  inputClass
} from '../../components/admin/AdminStates';

// ตารางแสดงอุปกรณ์คอมพิวเตอร์ทั้งหมดในระบบ
function AdminMovies() {
  const { token } = useAuth();
  const [products, setProducts] = useState([]);
  const [status, setStatus] = useState('loading');
  const [error, setError] = useState(null);
  const [query, setQuery] = useState('');
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    let ignore = false;

    async function load() {
      setStatus('loading');

      try {
        const list = await getAdminProducts(token);

        if (!ignore) {
          setProducts(list);
          setStatus('success');
        }
      } catch (err) {
        if (!ignore) {
          setError(err);
          setStatus('error');
        }
      }
    }

    load();

    return () => {
      ignore = true;
    };
  }, [reloadKey, token]);

  const q = query.trim().toLowerCase();

  const shown = products.filter(product =>
    q === '' ||
    (product.title ?? '').toLowerCase().includes(q) ||
    (product.titleTh ?? '').toLowerCase().includes(q) ||
    String(product.id) === q
  );

  return (
    <div>
      <div className="mb-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-lg font-semibold text-slate-900">
            อุปกรณ์คอมพิวเตอร์ทั้งหมด
          </h2>

          {status === 'success' && (
            <p className="text-sm text-slate-500">
              แสดง {shown.length} จาก {products.length} รายการ
            </p>
          )}
        </div>

        <div className="flex gap-2">
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="ค้นหาชื่อรุ่น ยี่ห้อ หรือ ID"
            className={inputClass + ' md:w-64'}
          />

          <Link
            to="/admin/products/new"
            className={btnPrimary + ' whitespace-nowrap'}
          >
            + เพิ่มสินค้า
          </Link>
        </div>
      </div>

      {status === 'loading' && <Loading />}

      {status === 'error' && (
        <ErrorBox
          error={error}
          onRetry={() => setReloadKey(k => k + 1)}
        />
      )}

      {status === 'success' && (
        <div className="overflow-x-auto rounded-xl border border-emerald-100 bg-white">
          <table className="w-full text-sm">
            <thead className="bg-emerald-50/60 text-left text-xs uppercase tracking-wide text-slate-500">
              <tr>
                <th className="px-4 py-3">สินค้า</th>
                <th className="px-4 py-3">หมวดหมู่</th>
                <th className="px-4 py-3">ยี่ห้อ</th>
                <th className="px-4 py-3">ราคา</th>
                <th className="px-4 py-3 text-right">จัดการ</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100">
              {shown.map(product => (
                <tr
                  key={product.id}
                  className="hover:bg-emerald-50/40"
                >
                  <td className="px-4 py-2">
                    <div className="flex items-center gap-3">
                      {product.poster ? (
                        <img
                          src={product.poster}
                          alt=""
                          className="h-12 w-12 rounded object-cover"
                        />
                      ) : (
                        <div className="grid h-12 w-12 place-items-center rounded bg-slate-100 text-xl">
                          {product.emoji ?? '💻'}
                        </div>
                      )}

                      <div className="min-w-0">
                        <p className="truncate font-medium text-slate-900">
                          {product.title}
                        </p>

                        <p className="truncate text-xs text-slate-500">
                          {product.titleTh ?? '(ยังไม่ระบุยี่ห้อ)'}
                          {' '}
                          <span className="text-slate-300">
                            #{product.id}
                          </span>
                        </p>
                      </div>
                    </div>
                  </td>

                  <td className="px-4 py-2 text-slate-600">
                    {product.genre ?? '-'}
                  </td>

                  <td className="px-4 py-2 text-slate-600">
                    {product.titleTh ?? '-'}
                  </td>

                  <td className="px-4 py-2 text-slate-600">
                    {product.price != null
                      ? `฿${Number(product.price).toLocaleString('th-TH')}`
                      : '-'}
                  </td>

                  <td className="px-4 py-2 text-right">
                    <Link
                      to={`/admin/products/${product.id}`}
                      className="text-emerald-600 hover:underline"
                    >
                      แก้ไข
                    </Link>
                  </td>
                </tr>
              ))}

              {shown.length === 0 && (
                <tr>
                  <td
                    colSpan={5}
                    className="px-4 py-10 text-center text-slate-400"
                  >
                    ไม่พบสินค้าที่ค้นหา
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default AdminMovies;