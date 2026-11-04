import { Route, Routes, useLocation } from 'react-router-dom'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import ProtectedRoute from './components/ProtectedRoute'

import Home from './pages/Home'
import FeedDetail from './pages/FeedDetail'
import Products from './pages/Products'
import ProductDetail from './pages/ProductDetail'
import Blog from './pages/Blog'
import BlogDetail from './pages/BlogDetail'
import About from './pages/About'

import Login from './pages/admin/Login'
import Dashboard from './pages/admin/Dashboard'
import ManageCategories from './pages/admin/ManageCategories'
import ManageFeed from './pages/admin/ManageFeed'
import ManageProducts from './pages/admin/ManageProducts'
import ManageBlog from './pages/admin/ManageBlog'
import AdminSettings from './pages/admin/AdminSettings'

export default function App() {
  const location = useLocation()
  const isAdmin = location.pathname.startsWith('/admin')

  return (
    <>
      {!isAdmin && <Navbar />}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/feed/:id" element={<FeedDetail />} />
        <Route path="/san-pham" element={<Products />} />
        <Route path="/san-pham/:id" element={<ProductDetail />} />
        <Route path="/bai-viet" element={<Blog />} />
        <Route path="/bai-viet/:id" element={<BlogDetail />} />
        <Route path="/gioi-thieu" element={<About />} />

        <Route path="/admin/login" element={<Login />} />
        <Route
          path="/admin"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/danh-muc"
          element={
            <ProtectedRoute>
              <ManageCategories />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/feed"
          element={
            <ProtectedRoute>
              <ManageFeed />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/san-pham"
          element={
            <ProtectedRoute>
              <ManageProducts />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/bai-viet"
          element={
            <ProtectedRoute>
              <ManageBlog />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/cai-dat"
          element={
            <ProtectedRoute>
              <AdminSettings />
            </ProtectedRoute>
          }
        />

        <Route path="*" element={<Home />} />
      </Routes>
      {!isAdmin && <Footer />}
    </>
  )
}
