"use client";
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  Users,
  Activity,
  Database,
  Shield,
  LogOut,
  Settings,
  BarChart3,
  FileText,
  Clock,
  CheckCircle,
  AlertTriangle,
  TrendingUp,
  Calendar,
  User
} from 'lucide-react';

interface AdminUser {
  id: number;
  name: string;
  email: string;
  login_time: string;
}

export default function AdminDashboard() {
  const [admin, setAdmin] = useState<AdminUser | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      // Check if user is authenticated by making a request to a protected endpoint
      const response = await fetch('/api/auth/verify', {
        credentials: 'include'
      });

      if (response.ok) {
        const data = await response.json();
        setAdmin(data.user);
      } else {
        router.push('/auth/login');
      }
    } catch (error) {
      router.push('/auth/login');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST', credentials: 'include' });
    router.push('/auth/login');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <span className="text-lg text-slate-700">Loading...</span>
      </div>
    );
  }

  if (!admin) {
    return null;
  }

  return (
    <>
      {/* Admin Header */}
      <div className="bg-white border-b border-slate-200 pt-24 pb-6">
        <div className="container mx-auto px-6 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 mb-2">Admin Dashboard</h1>
            <p className="text-slate-600">Welcome back, {admin.name}</p>
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 bg-red-50 text-red-700 rounded-lg hover:bg-red-100 transition-colors"
            >
              <LogOut size={16} />
              Logout
            </button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Quick Stats / KPIs */}
          <div className="lg:col-span-2 bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
            <h3 className="text-sm text-slate-500 font-medium">Quick Stats</h3>
            <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="p-4 bg-teal-50 rounded-lg">
                <p className="text-2xl font-bold">1,234</p>
                <p className="text-xs text-slate-600">Total registered users</p>
              </div>
              <div className="p-4 bg-yellow-50 rounded-lg">
                <p className="text-2xl font-bold">12</p>
                <p className="text-xs text-slate-600">Pending doctor approvals</p>
              </div>
              <div className="p-4 bg-blue-50 rounded-lg">
                <p className="text-2xl font-bold">5,678</p>
                <p className="text-xs text-slate-600">Scans/reports processed</p>
              </div>
              <div className="p-4 bg-green-50 rounded-lg">
                <p className="text-2xl font-bold">342</p>
                <p className="text-xs text-slate-600">Active sessions today</p>
              </div>
            </div>

            <div className="mt-6">
              <h4 className="text-sm text-slate-500 font-medium">Recent activity feed</h4>
              <ul className="mt-3 space-y-3 text-sm text-slate-700">
                <li>New user <span className="text-slate-500">alice@example.com</span> registered</li>
                <li>Recent scan uploaded by <span className="text-slate-500">bob@example.com</span></li>
                <li>Doctor <span className="text-slate-500">dr.smith@example.com</span> approved</li>
              </ul>
            </div>
          </div>

          {/* Right column: Links to management sections */}
          <aside className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
            <h3 className="text-sm text-slate-500 font-medium">Admin Actions</h3>
            <div className="mt-4 space-y-3">
              <a href="/admin/users" className="block text-slate-700 hover:underline">Users Management</a>
              <a href="/admin/doctors" className="block text-slate-700 hover:underline">Doctor Management</a>
              <a href="/admin/reports" className="block text-slate-700 hover:underline">Reports / Scan Data</a>
              <a href="/admin/models" className="block text-slate-700 hover:underline">Datasets / Model Monitoring</a>
              <a href="/admin/notifications" className="block text-slate-700 hover:underline">Notifications / Requests</a>
              <a href="/admin/settings" className="block text-slate-700 hover:underline">Settings / Admin Profile</a>
            </div>
          </aside>
        </div>
      </div>
    </>
  );
}