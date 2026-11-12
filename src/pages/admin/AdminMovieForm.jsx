import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../../auth/AuthContext';
import {
  createProduct,
  deleteProduct,
  getAdminProduct,
  getCategories,
  updateProduct,
} from '../../api/backend';
import {
  btnDanger,
  btnPrimary,
  ConfirmBox,
  ErrorBox,
  inputClass,
  Loading,
} from '../../components/admin/AdminStates';

const EMPTY = {
  title: '',
  titleTh: '',
  categoryId: '',
  year: '',
  rating: '',
  price: '',
  emoji: '',
  detail: '',
  poster: '',
};

function nullableText(value) {
  return value.trim() || null;
}

function nullableNumber(value) {
  return value === '' ? null : Number(value);
}

function validate(form) {
  const errors = {};
  if (!form.title.trim() || form.title.trim().length > 255) {
    errors.title = 'ต้องมีชื่อรุ่นและยาวไม่เกิน 255 ตัวอักษร';
  }
  if (form.titleTh.trim().length > 100) errors.titleTh = 'ยี่ห้อยาวไม่เกิน 100 ตัวอักษร';
  if (form.categoryId && (!Number.isInteger(Number(form.categoryId)) || Number(form.categoryId) <= 0)) {
    errors.categoryId = 'เลือกหมวดอุปกรณ์ให้ถูกต้อง';
  }
  if (form.year && (!Number.isInteger(Number(form.year)) || Number(form.year) < 1990 || Number(form.year) > 2100)) {
    errors.year = 'ปีเปิดตัวต้องอยู่ระหว่าง 1990 ถึง 2100';
  }
  if (form.rating && (!Number.isFinite(Number(form.rating)) || Number(form.rating) < 0 || Number(form.rating) > 10)) {
    errors.rating = 'คะแนนต้องอยู่ระหว่าง 0 ถึง 10';
  }
  if (form.price && (!Number.isInteger(Number(form.price)) || Number(form.price) < 0)) {
    errors.price = 'ราคาต้องเป็นจำนวนเต็มและไม่ติดลบ';
  }
  if (form.emoji.length > 8) errors.emoji = 'ไอคอนยาวไม่เกิน 8 ตัวอักษร';
  if (form.detail.length > 5000) errors.detail = 'รายละเอียดยาวไม่เกิน 5000 ตัวอักษร';
  if (form.poster && !/^https?:\/\/.{1,493}$/.test(form.poster.trim())) {
    errors.poster = 'รูปต้องเป็น URL เต็มที่ขึ้นต้นด้วย http:// หรือ https:// และยาวไม่เกิน 500 ตัวอักษร';
  }
  return errors;
}

function toPayload(form) {
  return {
    title: form.title.trim(),
    titleTh: nullableText(form.titleTh),
    categoryId: nullableNumber(form.categoryId),
    year: nullableNumber(form.year),
    rating: nullableNumber(form.rating),
    price: nullableNumber(form.price),
    emoji: nullableText(form.emoji),
    detail: nullableText(form.detail),
    poster: nullableText(form.poster),
  };
}

function AdminMovieForm() {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const { token } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState(EMPTY);
  const [categories, setCategories] = useState([]);
  const [impact, setImpact] = useState(null);
  const [status, setStatus] = useState('loading');
  const [loadError, setLoadError] = useState(null);
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState(null);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    let ignore = false;

    async function load() {
      setStatus('loading');
      try {
        const [loadedCategories, product] = await Promise.all([
          getCategories(),
          isEdit ? getAdminProduct(id, token) : null,
        ]);
        if (ignore) return;
        setCategories(loadedCategories);
        if (product) {
          setForm({
            title: product.title ?? '',
            titleTh: product.titleTh ?? '',
            categoryId: product.categoryId == null ? '' : String(product.categoryId),
            year: product.year == null ? '' : String(product.year),
            rating: product.rating == null ? '' : String(product.rating),
            price: product.price == null ? '' : String(product.price),
            emoji: product.emoji ?? '',
            detail: product.detail ?? '',
            poster: product.poster ?? '',
          });
          setImpact(product.impact);
        }
        setStatus('ready');
      } catch (error) {
        if (!ignore) {
          setLoadError(error);
          setStatus('error');
        }
      }
    }

    load();
    return () => {
      ignore = true;
    };
  }, [id, isEdit, token]);

  function set(field) {
    return event => {
      setForm(previous => ({ ...previous, [field]: event.target.value }));
      setSaved(false);
    };
  }

  async function handleSubmit(event) {
    event.preventDefault();
    const formErrors = validate(form);
    setErrors(formErrors);
    if (Object.keys(formErrors).length > 0) return;

    setSaving(true);
    setServerError(null);
    try {
      if (isEdit) {
        const product = await updateProduct(id, toPayload(form), token);
        setImpact(product.impact);
        setSaved(true);
      } else {
        const product = await createProduct(toPayload(form), token);
        navigate(`/admin/products/${product.id}`, { replace: true });
      }
    } catch (error) {
      setServerError(error.message);
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete() {
    setDeleting(true);
    try {
      await deleteProduct(id, token);
      navigate('/admin/products', { replace: true });
    } catch (error) {
      setServerError(error.message);
      setConfirmDelete(false);
    } finally {
      setDeleting(false);
    }
  }

  if (status === 'loading') return <Loading />;
  if (status === 'error') return <ErrorBox error={loadError} />;

  const fieldLabel = 'block text-sm font-medium text-slate-700';
  const fieldError = name => errors[name] && (
    <p className="mt-1 text-xs text-red-600">{errors[name]}</p>
  );

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-semibold text-slate-900">
          {isEdit ? `แก้ไขอุปกรณ์ #${id}` : 'เพิ่มอุปกรณ์ใหม่'}
        </h2>
        <Link to="/admin/products" className="text-sm text-emerald-600 hover:underline">
          กลับรายการ
        </Link>
      </div>

      <form onSubmit={handleSubmit} noValidate className="grid gap-6 md:grid-cols-[1fr_200px]">
        <div className="space-y-4 rounded-xl border border-emerald-100 bg-white p-5">
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className={fieldLabel}>ชื่อรุ่น *</label>
              <input value={form.title} onChange={set('title')} maxLength={255} className={inputClass} />
              {fieldError('title')}
            </div>
            <div>
              <label className={fieldLabel}>ยี่ห้อ</label>
              <input value={form.titleTh} onChange={set('titleTh')} maxLength={100} className={inputClass} />
              {fieldError('titleTh')}
            </div>
            <div>
              <label className={fieldLabel}>หมวดอุปกรณ์</label>
              <select value={form.categoryId} onChange={set('categoryId')} className={inputClass}>
                <option value="">ไม่ระบุ</option>
                {categories.map(category => (
                  <option key={category.id} value={category.id}>
                    {category.nameTh} ({category.nameEn})
                  </option>
                ))}
              </select>
              {fieldError('categoryId')}
            </div>
            <div>
              <label className={fieldLabel}>ปีเปิดตัว</label>
              <input type="number" min="1990" max="2100" value={form.year} onChange={set('year')} className={inputClass} />
              {fieldError('year')}
            </div>
            <div>
              <label className={fieldLabel}>คะแนนทีมงาน (0–10)</label>
              <input type="number" min="0" max="10" step="0.1" value={form.rating} onChange={set('rating')} className={inputClass} />
              {fieldError('rating')}
            </div>
            <div>
              <label className={fieldLabel}>ราคา (บาท)</label>
              <input type="number" min="0" step="1" value={form.price} onChange={set('price')} className={inputClass} />
              {fieldError('price')}
            </div>
            <div>
              <label className={fieldLabel}>ไอคอน (ถ้าไม่มีรูป)</label>
              <input value={form.emoji} onChange={set('emoji')} maxLength={8} className={inputClass} />
              {fieldError('emoji')}
            </div>
          </div>
          <div>
            <label className={fieldLabel}>URL รูป</label>
            <input type="url" value={form.poster} onChange={set('poster')} className={inputClass} />
            {fieldError('poster')}
          </div>
          <div>
            <label className={fieldLabel}>รายละเอียด</label>
            <textarea value={form.detail} onChange={set('detail')} rows={5} maxLength={5000} className={inputClass} />
            {fieldError('detail')}
          </div>

          <div className="flex flex-wrap items-center gap-3 border-t border-slate-100 pt-4">
            <button type="submit" disabled={saving} className={btnPrimary}>
              {saving ? 'กำลังบันทึก...' : isEdit ? 'บันทึกการแก้ไข' : 'เพิ่มอุปกรณ์'}
            </button>
            {isEdit && (
              <button type="button" onClick={() => setConfirmDelete(true)} className={btnDanger}>
                ลบอุปกรณ์นี้
              </button>
            )}
            {saved && <span className="text-sm text-emerald-600">บันทึกแล้ว</span>}
            {serverError && <span role="alert" className="text-sm text-red-600">{serverError}</span>}
          </div>
        </div>

        <aside className="space-y-3">
          <div className="overflow-hidden rounded-xl border border-emerald-100 bg-white">
            {form.poster.trim()
              ? <img src={form.poster} alt="ตัวอย่างรูปอุปกรณ์" className="aspect-square w-full object-cover" />
              : <div className="grid aspect-square place-items-center bg-slate-100 text-6xl">{form.emoji || '💻'}</div>}
            <p className="p-2 text-center text-xs text-slate-400">ตัวอย่างรูปอุปกรณ์</p>
          </div>
          {impact && (
            <div className="rounded-xl border border-emerald-100 bg-white p-3 text-sm text-slate-600">
              <p className="font-medium text-slate-900">ข้อมูลที่ผูกกับอุปกรณ์นี้</p>
              <ul className="mt-1 space-y-0.5">
                <li>รีวิว {impact.reviews}</li>
                <li>คะแนน {impact.votes}</li>
                <li>รายการอยากได้ {impact.wishlist}</li>
              </ul>
            </div>
          )}
        </aside>
      </form>

      <ConfirmBox
        open={confirmDelete}
        title={`ลบ "${form.title}" ?`}
        confirmText="ลบถาวร"
        busy={deleting}
        onConfirm={handleDelete}
        onCancel={() => setConfirmDelete(false)}
      >
        {impact && (impact.reviews + impact.votes + impact.wishlist > 0)
          ? <p>รีวิว {impact.reviews} รายการ คะแนน {impact.votes} รายการ และรายการอยากได้ {impact.wishlist} รายการจะถูกลบตามไปด้วย ย้อนกลับไม่ได้</p>
          : <p>ยังไม่มีสมาชิกรีวิว ให้คะแนน หรือเพิ่มอุปกรณ์นี้ในรายการอยากได้ ลบได้โดยไม่กระทบใคร</p>}
      </ConfirmBox>
    </div>
  );
}

export default AdminMovieForm;
