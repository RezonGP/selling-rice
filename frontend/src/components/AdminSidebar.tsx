import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, Package, Warehouse, ShoppingCart, ShieldAlert, Building2, LogOut, Wheat, Menu, X } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const AdminSidebar: React.FC = () => {
  const location = useLocation();
  const { logout, user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);

  const navItems = [
    { label: 'Tổng Quan Báo Cáo', path: '/admin', icon: LayoutDashboard },
    { label: 'Quản Lý Sản Phẩm', path: '/admin/products', icon: Package },
    { label: 'Kho & Lô Đóng Gói', path: '/admin/inventory', icon: Warehouse },
    { label: 'Đơn Hàng & Vận Đơn', path: '/admin/orders', icon: ShoppingCart },
    { label: 'Báo Giá Sỉ B2B', path: '/admin/b2b', icon: Building2 },
    { label: 'Nhật Ký Audit Logs', path: '/admin/audit-logs', icon: ShieldAlert },
  ];

  const closeSidebar = () => setIsOpen(false);

  return (
    <>
      {/* Mobile Top Header Bar */}
      <div className="md:hidden bg-rice-slate text-white p-4 flex items-center justify-between sticky top-0 z-40 shadow-md">
        <Link to="/" className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-rice-gold rounded-lg flex items-center justify-center text-rice-slate font-bold">
            <Wheat className="w-5 h-5" />
          </div>
          <span className="font-bold text-sm text-white">Admin Console</span>
        </Link>

        <button
          onClick={() => setIsOpen(!isOpen)}
          className="p-2 text-white hover:text-rice-gold"
          aria-label="Toggle Admin Sidebar"
        >
          {isOpen ? <X className="w-6 h-6 text-rice-gold" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Backdrop for Mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/60 z-40 md:hidden"
          onClick={closeSidebar}
        />
      )}

      {/* Sidebar Content (Desktop Permanent / Mobile Drawer) */}
      <aside
        className={`fixed md:static top-0 left-0 z-50 w-64 bg-rice-slate text-white flex flex-col justify-between p-5 min-h-screen transition-transform duration-300 ${
          isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        <div>
          {/* Brand */}
          <div className="flex items-center justify-between mb-8">
            <Link to="/" onClick={closeSidebar} className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-rice-gold rounded-xl flex items-center justify-center text-rice-slate font-bold shadow-md">
                <Wheat className="w-6 h-6" />
              </div>
              <div>
                <h1 className="text-base font-bold text-white leading-tight">Admin Console</h1>
                <p className="text-[11px] text-rice-gold font-medium">Nông Sản Việt Portal</p>
              </div>
            </Link>

            <button onClick={closeSidebar} className="md:hidden text-gray-400 hover:text-white">
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* User Card */}
          <div className="bg-white/10 p-3 rounded-xl mb-6 text-xs border border-white/10">
            <p className="font-bold text-white truncate">{user?.fullName || 'Admin Operator'}</p>
            <p className="text-gray-300 font-mono text-[11px] truncate">{user?.email}</p>
            <span className="inline-block bg-rice-green text-white text-[10px] font-extrabold px-2 py-0.5 rounded mt-1.5 uppercase">
              {user?.role} - 2FA BẢO MẬT
            </span>
          </div>

          {/* Navigation */}
          <nav className="space-y-1.5">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={closeSidebar}
                  className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl font-semibold text-xs transition-colors ${
                    isActive
                      ? 'bg-rice-green text-white shadow-sm font-bold'
                      : 'text-gray-300 hover:bg-white/10 hover:text-white'
                  }`}
                >
                  <Icon className="w-4 h-4 text-rice-gold flex-shrink-0" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Footer Actions */}
        <div className="pt-6 border-t border-white/10 space-y-2">
          <Link
            to="/"
            onClick={closeSidebar}
            className="flex items-center gap-2 px-3.5 py-2 text-xs font-semibold text-gray-300 hover:text-white transition-colors"
          >
            <span>← Quay về Trang Khách Hàng</span>
          </Link>
          <button
            onClick={() => { logout(); closeSidebar(); }}
            className="flex items-center gap-2 px-3.5 py-2.5 text-xs font-semibold text-red-300 hover:bg-red-900/30 rounded-xl transition-colors w-full"
          >
            <LogOut className="w-4 h-4" />
            <span>Đăng Xuất Admin</span>
          </button>
        </div>
      </aside>
    </>
  );
};
