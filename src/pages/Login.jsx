
import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';

function Login() {
  const [email, setEmail] = useState('demo@techreview.test');
  const [password, setPassword] = useState('12345678');
  const [error, setError] = useState(null);
  const [status, setStatus] = useState('typing');

  const location = useLocation();
  const navigate = useNavigate();
  const { login } = useAuth();

  const from = location.state?.from || '/';

  async function handleSubmit(e) {
    e.preventDefault();
    setStatus('submitting');
    setError(null);

    try {
      await login(email, password);
      navigate(from);
    } catch (err) {
      setError(err.message);
      setStatus('typing');
    }
  }

  return (
    <div className="min-h-[70vh] bg-[#faf7ef] px-4 py-12 md:py-20">
      <div className="mx-auto max-w-md rounded-3xl border border-emerald-100 bg-white p-6 shadow-xl shadow-emerald-900/5 md:p-9">
        <div className="mb-6 grid h-14 w-14 place-items-center rounded-2xl bg-emerald-100 text-2xl">🔐</div>
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-emerald-700">Member access</p>
        <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-900">
          เข้าสู่ระบบ TechReview
        </h1>

        <p className="mt-2 rounded-xl bg-emerald-50 px-4 py-3 text-sm leading-6 text-emerald-900">
          บัญชีทดลองสำหรับ mock: <strong>demo@techreview.test / 12345678</strong> หรือสมัครสมาชิกใหม่
           <br />
          บัญชีทดลองสำหรับ admin: <strong>demo2@techreview.test / 12345678</strong>
        </p>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
        <label className="block text-sm font-medium text-slate-700">
          อีเมล
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="อีเมล"
          required
          className="mt-1.5 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 font-normal outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100"
        />
        </label>

        <label className="block text-sm font-medium text-slate-700">
          รหัสผ่าน
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="อย่างน้อย 8 ตัวอักษร"
          required
          minLength={8}
          maxLength={72}
          className="mt-1.5 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 font-normal outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100"
        />
        </label>

        <button
          type="submit"
          disabled={status === 'submitting'}
          className="w-full rounded-xl bg-emerald-800 px-4 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-900 disabled:bg-slate-300"
        >
          {status === 'submitting'
            ? 'กำลังเข้าสู่ระบบ...'
            : 'เข้าสู่ระบบ'}
        </button>

        {error && (
          <p role="alert" className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>
        )}
      </form>

      <p className="mt-6 border-t border-slate-100 pt-5 text-center text-sm text-slate-500">
        ยังไม่มีบัญชี?{' '}
        <Link
          to="/register"
          className="text-emerald-600 hover:underline"
        >
          สมัครสมาชิก
        </Link>
      </p>
      </div>
    </div>
  );
}

export default Login;
