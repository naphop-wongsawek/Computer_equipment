import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';

// โครงเดียวกับหน้า Login ต่างกันแค่ช่องกรอกและฟังก์ชันที่เรียก
function Register() {
  const [displayName, setDisplayName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [status, setStatus] = useState('typing');
  const { register } = useAuth();
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    setStatus('submitting');
    setError(null);
    try {
      await register(email, password, displayName);
      navigate('/');
    } catch (err) {
      setError(err.message);                       // 409 อีเมลซ้ำ หรือ 400 กรอกไม่ครบ ข้อความมาจาก server
      setStatus('typing');
    }
  }

  const input = 'w-full rounded-lg border border-slate-300 bg-white px-3 py-2 focus:border-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-100';

  return (
    <div className="min-h-[70vh] bg-[#faf7ef] px-4 py-12 md:py-20">
      <div className="mx-auto max-w-md rounded-3xl border border-emerald-100 bg-white p-6 shadow-xl shadow-emerald-900/5 md:p-9">
        <div className="mb-6 grid h-14 w-14 place-items-center rounded-2xl bg-emerald-100 text-2xl">✦</div>
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-emerald-700">Join the community</p>
        <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-900">สร้างบัญชีใหม่</h1>
        <p className="mt-2 text-sm leading-6 text-slate-500">
          สมัครสมาชิกเพื่อเขียนรีวิว ให้คะแนน และบันทึกอุปกรณ์ที่สนใจ
        </p>
        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <label className="block text-sm font-medium text-slate-700">
            ชื่อที่แสดง
            <input value={displayName} onChange={(e) => setDisplayName(e.target.value)} placeholder="ชื่อที่แสดง" required className={`${input} mt-1.5 rounded-xl border-slate-200 px-4 py-3`} />
          </label>
          <label className="block text-sm font-medium text-slate-700">
            อีเมล
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" required className={`${input} mt-1.5 rounded-xl border-slate-200 px-4 py-3`} />
          </label>
          <label className="block text-sm font-medium text-slate-700">
            รหัสผ่าน
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="อย่างน้อย 8 ตัวอักษร" required minLength={8} maxLength={72} className={`${input} mt-1.5 rounded-xl border-slate-200 px-4 py-3`} />
          </label>
          <button type="submit" disabled={status === 'submitting'}
                  className="w-full rounded-xl bg-emerald-800 px-4 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-900 disabled:bg-slate-300">
            {status === 'submitting' ? 'กำลังสมัคร...' : 'สมัครสมาชิก'}
          </button>
          {error && <p role="alert" className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>}
        </form>
        <p className="mt-6 border-t border-slate-100 pt-5 text-center text-sm text-slate-500">
          มีบัญชีแล้ว? <Link to="/login" className="font-semibold text-emerald-700 hover:text-emerald-900">เข้าสู่ระบบ</Link>
        </p>
      </div>
    </div>
  );
}

export default Register;
