import { Routes, Route } from 'react-router-dom';
import { AuthProvider } from './auth/AuthContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';
import RequireRole from './components/RequireRole';
import Home from './pages/Home';
import Products from './pages/Products';          // หน้ารายการอุปกรณ์ (ชื่อไฟล์เดิม)
import ProductDetail from './pages/ProductDetail';
import About from './pages/About';
import Login from './pages/Login';
import Register from './pages/Register';
import Wishlist from './pages/Wishlist';
import NotFound from './pages/NotFound';
import AdminLayout from './pages/admin/AdminLayout';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminProducts from './pages/admin/AdminProducts';
import AdminProductForm from './pages/admin/AdminProductForm';
import AdminMembers from './pages/admin/AdminMembers';

function App() {
  return (
    // AuthProvider ครอบทั้งแอป ทุกหน้าข้างในจึงเรียก useAuth() ได้
    <AuthProvider>
      <div className="flex min-h-screen flex-col">
        <Navbar />
        <main className="flex-1 bg-[#faf7ef]">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/products" element={<Products />} />
            <Route path="/products/:id" element={<ProductDetail />} />
            <Route path="/movies/:id" element={<ProductDetail />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/me/wishlist" element={<ProtectedRoute><Wishlist /></ProtectedRoute>} />
            {/* หลังบ้าน: ครอบทั้งกิ่งด้วย RequireRole ครั้งเดียว หน้าลูกทุกหน้าได้รับการป้องกันหมด */}
            <Route path="/admin" element={<RequireRole role="admin"><AdminLayout /></RequireRole>}>
              <Route index element={<AdminDashboard />} />
              <Route path="products" element={<AdminProducts />} />
              <Route path="products/new" element={<AdminProductForm />} />
              <Route path="products/:id" element={<AdminProductForm />} />
              <Route path="members" element={<AdminMembers />} />
            </Route>
            <Route path="/about" element={<About />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </AuthProvider>
  );
}

export default App;
