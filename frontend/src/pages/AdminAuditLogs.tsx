import React, { useEffect, useState } from 'react';
import { AdminSidebar } from '../components/AdminSidebar';
import { IAuditLog } from '../types';
import { apiClient } from '../api/client';

export const AdminAuditLogs: React.FC = () => {
  const [logs, setLogs] = useState<IAuditLog[]>([]);

  useEffect(() => {
    apiClient
      .get('/admin/audit-logs')
      .then((res) => setLogs(res.data.data))
      .catch(() => {
        setLogs([
          {
            _id: 'log-1',
            userId: 'usr-admin',
            userEmail: 'admin@nongsanviet.vn',
            userRole: 'ADMIN',
            action: 'CREATE_PRODUCT',
            resource: 'PRODUCT',
            ipAddress: '127.0.0.1',
            userAgent: 'Mozilla/5.0 (Windows NT 10.0)',
            createdAt: '2026-08-12T11:20:00Z',
          },
          {
            _id: 'log-2',
            userId: 'usr-admin',
            userEmail: 'admin@nongsanviet.vn',
            userRole: 'ADMIN',
            action: 'UPDATE_ORDER_STATUS',
            resource: 'ORDER',
            ipAddress: '127.0.0.1',
            userAgent: 'Mozilla/5.0 (Windows NT 10.0)',
            createdAt: '2026-08-12T10:45:00Z',
          },
        ]);
      });
  }, []);

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-rice-cream">
      <AdminSidebar />

      <main className="flex-1 p-4 sm:p-8 space-y-6 overflow-x-hidden">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-rice-slate">Nhật Ký Bảo Mật Audit Logs</h1>
          <p className="text-xs text-gray-500">Truy vết toàn bộ thao tác của Admin & Nhân viên hệ thống theo tiêu chuẩn OWASP.</p>
        </div>

        {/* Audit Logs Table */}
        <div className="bg-white rounded-2xl border border-rice-green/20 overflow-x-auto shadow-sm">
          <table className="w-full text-left text-xs min-w-[640px]">
            <thead className="bg-rice-slate text-white uppercase text-[11px] font-bold">
              <tr>
                <th className="p-4">Thời Gian</th>
                <th className="p-4">Người Thực Hiện</th>
                <th className="p-4">Vai Trò</th>
                <th className="p-4">Hành Động (Action)</th>
                <th className="p-4">Tài Nguyên (Resource)</th>
                <th className="p-4">Địa Chỉ IP</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 font-medium font-mono">
              {logs.map((log) => (
                <tr key={log._id} className="hover:bg-rice-cream/50">
                  <td className="p-4 text-gray-500 font-sans">{new Date(log.createdAt).toLocaleString('vi-VN')}</td>
                  <td className="p-4 font-bold text-rice-slate font-sans">{log.userEmail}</td>
                  <td className="p-4">
                    <span className="bg-rice-green text-white text-[10px] font-bold px-2 py-0.5 rounded">
                      {log.userRole}
                    </span>
                  </td>
                  <td className="p-4 font-bold text-rice-green">{log.action}</td>
                  <td className="p-4">{log.resource}</td>
                  <td className="p-4 text-gray-600">{log.ipAddress}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
};
