import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { ShoppingBag, Scale, Building2, User, LogOut, ShieldAlert, Wheat, Menu, X } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

export const Navbar: React.FC = () => {
  const { totalWeightKg, items } = useCart();
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  const totalItemCount = items.reduce((sum, item) => sum + item.quantity, 0);

  const closeMenu = () => setMobileMenuOpen(false);

  return (
    <header className="sticky top-0 z-50 eco-glass shadow-sm border-b border-rice-green/20">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          {/* Brand Logo */}
          <Link to="/" onClick={closeMenu} className="flex items-center space-x-2 sm:space-x-3 flex-shrink-0 group">
            <div className="w-9 h-9 sm:w-11 sm:h-11 bg-rice-green rounded-xl flex items-center justify-center text-white shadow-md group-hover:scale-105 transition-transform">
              <Wheat className="w-5 h-5 sm:w-6 sm:h-6 text-rice-gold" />
            </div>
            <div className="flex flex-col">
              <span className="text-base sm:text-xl font-bold text-rice-slate tracking-tight flex items-center gap-1.5 whitespace-nowrap">
                Nông Sản Việt <span className="hidden sm:inline-block text-xs bg-rice-gold text-rice-slate px-2 py-0.5 rounded-full font-semibold">Eco Clean</span>
              </span>
              <p className="hidden sm:block text-[11px] text-rice-green font-medium leading-tight">Gạo ST25 & Nông Sản Sạch Chuẩn ISO</p>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center space-x-6 lg:space-x-8 text-sm font-semibold text-rice-slate">
            <Link to="/" className={`hover:text-rice-green transition-colors ${location.pathname === '/' ? 'text-rice-green font-bold' : ''}`}>Trang Chủ</Link>
            <Link to="/products" className={`hover:text-rice-green transition-colors ${location.pathname === '/products' ? 'text-rice-green font-bold' : ''}`}>Danh Mục Gạo</Link>
            <Link to="/tracking" className={`hover:text-rice-green transition-colors ${location.pathname === '/tracking' ? 'text-rice-green font-bold' : ''}`}>Tra Cứu Đơn Hàng</Link>
            <Link to="/b2b-quote" className="flex items-center gap-1.5 bg-rice-gold/20 text-rice-slate px-3.5 py-1.5 rounded-lg border border-rice-gold/40 hover:bg-rice-gold/30 transition-colors">
              <Building2 className="w-4 h-4 text-rice-slate" />
              <span>Báo Giá Sỉ B2B</span>
            </Link>
          </nav>

          {/* Right Action Icons & Weight Indicator */}
          <div className="flex items-center space-x-2 sm:space-x-4">
            {/* Live Total Weight Meter (Desktop/Tablet) */}
            <div className="hidden sm:flex items-center space-x-1.5 bg-rice-lightgreen/70 px-2.5 py-1.5 rounded-lg border border-rice-green/30 text-xs font-semibold text-rice-green whitespace-nowrap">
              <Scale className="w-4 h-4 text-rice-green flex-shrink-0" />
              <span>{totalWeightKg.toFixed(1)} Kg</span>
            </div>

            {/* Cart Button */}
            <Link to="/cart" onClick={closeMenu} className="relative p-2 text-rice-slate hover:text-rice-green transition-colors flex-shrink-0" title="Giỏ Hàng">
              <ShoppingBag className="w-6 h-6" />
              {totalItemCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-rice-gold text-rice-slate font-extrabold text-[10px] w-5 h-5 rounded-full flex items-center justify-center shadow">
                  {totalItemCount}
                </span>
              )}
            </Link>

            {/* User Account Controls */}
            {isAuthenticated ? (
              <div className="flex items-center space-x-2">
                {isAdmin && (
                  <Link to="/admin" onClick={closeMenu} className="hidden sm:flex items-center gap-1 text-xs bg-rice-slate text-white px-2.5 py-1.5 rounded-lg hover:bg-rice-slate/90 transition-colors whitespace-nowrap">
                    <ShieldAlert className="w-3.5 h-3.5 text-rice-gold" />
                    <span>Quản Trị</span>
                  </Link>
                )}
                <button onClick={logout} className="p-1.5 text-gray-500 hover:text-rice-accent transition-colors" title="Đăng xuất">
                  <LogOut className="w-5 h-5" />
                </button>
              </div>
            ) : (
              <Link to="/admin/login" onClick={closeMenu} className="hidden sm:flex items-center gap-1 text-xs bg-rice-green text-white font-semibold px-3 py-1.5 rounded-xl shadow-sm hover:bg-rice-green/90 transition-colors whitespace-nowrap">
                <User className="w-4 h-4" />
                <span>Đăng Nhập</span>
              </Link>
            )}

            {/* Mobile Hamburger Menu Toggle Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-rice-slate hover:text-rice-green md:hidden flex-shrink-0"
              aria-label="Toggle Menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6 text-rice-green" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Dropdown Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white/95 backdrop-blur-md border-b border-rice-green/20 px-4 pt-3 pb-5 space-y-3 animate-in slide-in-from-top duration-200">
          <div className="flex items-center justify-between bg-rice-lightgreen/50 p-2.5 rounded-xl text-xs font-bold text-rice-green mb-2">
            <span className="flex items-center gap-1.5">
              <Scale className="w-4 h-4" /> Khối Lượng Giỏ Hàng:
            </span>
            <span>{totalWeightKg.toFixed(1)} Kg</span>
          </div>

          <nav className="flex flex-col space-y-2 text-sm font-semibold text-rice-slate">
            <Link to="/" onClick={closeMenu} className="p-2 rounded-lg hover:bg-rice-cream">Trang Chủ</Link>
            <Link to="/products" onClick={closeMenu} className="p-2 rounded-lg hover:bg-rice-cream">Danh Mục Gạo</Link>
            <Link to="/tracking" onClick={closeMenu} className="p-2 rounded-lg hover:bg-rice-cream">Tra Cứu Đơn Hàng</Link>
            <Link to="/b2b-quote" onClick={closeMenu} className="flex items-center gap-2 bg-rice-gold/20 text-rice-slate p-2.5 rounded-xl font-bold border border-rice-gold/40">
              <Building2 className="w-4 h-4 text-rice-slate" />
              <span>Báo Giá Sỉ B2B</span>
            </Link>

            {isAuthenticated ? (
              <div className="pt-2 border-t space-y-2">
                {isAdmin && (
                  <Link to="/admin" onClick={closeMenu} className="flex items-center gap-2 bg-rice-slate text-white p-2.5 rounded-xl font-bold">
                    <ShieldAlert className="w-4 h-4 text-rice-gold" />
                    <span>Trang Quản Trị Admin</span>
                  </Link>
                )}
                <button onClick={() => { logout(); closeMenu(); }} className="flex items-center gap-2 text-red-600 font-bold p-2 w-full text-left">
                  <LogOut className="w-4 h-4" />
                  <span>Đăng Xuất</span>
                </button>
              </div>
            ) : (
              <div className="pt-2 border-t">
                <Link to="/admin/login" onClick={closeMenu} className="flex items-center gap-2 bg-rice-green text-white p-2.5 rounded-xl font-bold">
                  <User className="w-4 h-4" />
                  <span>Đăng Nhập Portal</span>
                </Link>
              </div>
            )}
          </nav>
        </div>
      )}
    </header>
  );
};
