import { useState } from 'react';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';

const links = [
  { to: '/', label: 'หน้าแรก', end: true },
  { to: '/products', label: 'อุปกรณ์ทั้งหมด' },
  { to: '/me/wishlist', label: 'รายการที่สนใจ', private: true },
  { to: '/about', label: 'เกี่ยวกับเรา' },
  { to: '/admin', label: 'จัดการระบบ', admin: true },
];

function Navbar() {
  const { isLoggedIn, isAdmin, member, logout } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  function handleLogout() {
    logout();
    setMenuOpen(false);
    navigate('/');
  }

  const visibleLinks = links.filter(link =>
    (!link.private || isLoggedIn) && (!link.admin || isAdmin)
  );
  const linkClass = ({ isActive }) =>
    `rounded-lg px-3 py-2 text-sm transition ${
      isActive
        ? 'bg-white font-semibold text-emerald-900'
        : 'text-emerald-50 hover:bg-white/10 hover:text-white'
    }`;

  return (
    <header className="sticky top-0 z-30 border-b border-emerald-900 bg-emerald-800/95 shadow-sm backdrop-blur">
      <div className="mx-auto flex min-h-20 max-w-7xl items-center gap-4 px-4 md:px-8">
        <Link
          to="/"
          className="group flex shrink-0 items-center gap-3"
          onClick={() => setMenuOpen(false)}
        >
          <span className="grid h-11 w-11 place-items-center rounded-xl bg-emerald-600 text-2xl text-white shadow-sm transition group-hover:bg-emerald-500">
            💻
          </span>
          <span>
            <span className="block text-lg font-bold leading-tight tracking-tight text-white">
              TechReview
            </span>
            <span className="hidden text-[11px] tracking-wide text-emerald-100 sm:block">
              COMMUNITY EQUIPMENT GUIDE
            </span>
          </span>
        </Link>

        <nav className="ml-auto hidden items-center gap-1 lg:flex" aria-label="เมนูหลัก">
          {visibleLinks.map(link => (
            <NavLink key={link.to} to={link.to} end={link.end} className={linkClass}>
              {link.label}
            </NavLink>
          ))}
        </nav>

        <div className="ml-auto hidden items-center gap-3 lg:flex">
          {isLoggedIn ? (
            <>
              <span className="max-w-36 truncate text-sm text-emerald-50">
                สวัสดี {member?.displayName}
              </span>
              <button
                onClick={handleLogout}
                className="rounded-full border border-emerald-200/60 px-4 py-2 text-sm font-medium text-white transition hover:bg-white/10"
              >
                ออกจากระบบ
              </button>
            </>
          ) : (
            <Link
              to="/login"
              className="rounded-full bg-white px-5 py-2.5 text-sm font-semibold text-emerald-900 shadow-sm transition hover:bg-emerald-50"
            >
              เข้าสู่ระบบ
            </Link>
          )}
        </div>

        <button
          type="button"
          aria-label={menuOpen ? 'ปิดเมนู' : 'เปิดเมนู'}
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen(open => !open)}
          className="ml-auto grid h-10 w-10 place-items-center rounded-lg border border-emerald-200/60 text-white hover:bg-white/10 lg:hidden"
        >
          <span className="text-xl" aria-hidden="true">{menuOpen ? '×' : '☰'}</span>
        </button>
      </div>

      {menuOpen && (
        <div className="border-t border-emerald-700 bg-emerald-800 px-4 py-3 shadow-lg lg:hidden">
          <nav className="mx-auto flex max-w-7xl flex-col gap-1" aria-label="เมนูมือถือ">
            {visibleLinks.map(link => (
              <NavLink
                key={link.to}
                to={link.to}
                end={link.end}
                className={linkClass}
                onClick={() => setMenuOpen(false)}
              >
                {link.label}
              </NavLink>
            ))}
            {isLoggedIn ? (
              <button
                onClick={handleLogout}
                className="mt-2 rounded-lg bg-white/10 px-3 py-2 text-left text-sm font-medium text-white"
              >
                ออกจากระบบ ({member?.displayName})
              </button>
            ) : (
              <Link
                to="/login"
                onClick={() => setMenuOpen(false)}
                className="mt-2 rounded-lg bg-white px-3 py-2 text-center text-sm font-semibold text-emerald-900"
              >
                เข้าสู่ระบบ
              </Link>
            )}
          </nav>
        </div>
      )}
    </header>
  );
}

export default Navbar;
