'use client';
export const dynamic = 'force-dynamic';

import React, { useState, useEffect } from 'react';
import {
  Users,
  Activity,
  FileText,
  TrendingUp,
  CheckCircle2,
  AlertCircle,
  Clock,
  Scan,
  LayoutDashboard,
  Settings,
  LogOut,
  Bell,
  Menu,
  X,
  FileBarChart,
  ShieldAlert,
  ChevronRight,
} from 'lucide-react';

// --- Mocks for standalone preview ---
const usePathname = () => '/dashboard';
const useRouter = () => ({ push: (path: string) => console.log('Navigate to:', path) });

// --- AdminLayout ---
interface AdminLayoutProps {
  children: React.ReactNode;
  user?: any;
}

const AdminLayout = ({ children, user }: AdminLayoutProps) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const pathname = usePathname();

  const navItems = [
    { name: 'Dashboard', href: '/dashboard', icon: <LayoutDashboard size={20} /> },
    { name: 'Doctor Requests', href: '/doctor-requests', icon: <Users size={20} /> },
    { name: 'Patient Registry', href: '/patients', icon: <FileText size={20} /> },
    { name: 'Scan Results', href: '/scans', icon: <FileBarChart size={20} /> },
    { name: 'Model Audit', href: '/audit', icon: <ShieldAlert size={20} /> },
    { name: 'Settings', href: '/settings', icon: <Settings size={20} /> },
  ];

  const isActive = (path: string) => pathname === path || pathname?.startsWith(`${path}/`);

  return (
    <div className="min-h-screen bg-slate-50 flex font-sans text-slate-900">
      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-slate-900/50 backdrop-blur-sm lg:hidden"
          onClick={() => setSidebarOpen(false)}
        ></div>
      )}

      {/* Sidebar */}
      <aside
        className={`fixed lg:static inset-y-0 left-0 z-50 w-72 bg-white border-r border-slate-200 shadow-xl lg:shadow-none transform transition-transform duration-300 ease-in-out
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}
      >
        <div className="h-full flex flex-col">
          {/* Logo */}
          <div className="h-20 flex items-center px-8 border-b border-slate-100">
            <div className="flex items-center gap-3">
              <div className="bg-teal-600 p-1.5 rounded-lg text-white">
                <Scan size={22} strokeWidth={2.5} />
              </div>
              <span className="text-xl font-bold text-slate-900 tracking-tight">
                Smart Scan<span className="text-teal-600">Plus</span>
              </span>
            </div>
            <button onClick={() => setSidebarOpen(false)} className="ml-auto lg:hidden text-slate-400">
              <X size={24} />
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-8 space-y-1 overflow-y-auto">
            <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider px-4 mb-4">
              Admin Menu
            </div>
            {navItems.map((item) => (
              <a
                key={item.href}
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  console.log(`Navigating to ${item.href}`);
                }}
                className={`flex items-center gap-3 px-4 py-3.5 rounded-xl transition-all duration-200 font-medium ${
                  isActive(item.href)
                    ? 'bg-teal-50 text-teal-700 shadow-sm'
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                }`}
              >
                <span className={isActive(item.href) ? 'text-teal-600' : 'text-slate-400'}>
                  {item.icon}
                </span>
                {item.name}
              </a>
            ))}
          </nav>

          {/* User Profile Footer */}
          <div className="p-4 border-t border-slate-100">
            <div className="bg-slate-50 rounded-xl p-3 flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center font-bold text-sm">
                {user?.avatar || 'DR'}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-slate-900 truncate">{user?.fullName || 'Dr. Admin'}</p>
                <p className="text-xs text-slate-500 truncate">{user?.role || 'Administrator'}</p>
              </div>
              <button className="text-slate-400 hover:text-red-500 transition-colors" title="Sign Out">
                <LogOut size={18} />
              </button>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Mobile Header */}
        <header className="h-16 lg:hidden bg-white border-b border-slate-200 flex items-center justify-between px-4">
          <button onClick={() => setSidebarOpen(true)} className="text-slate-500">
            <Menu size={24} />
          </button>
          <span className="font-bold text-slate-700">Dashboard</span>
          <div className="w-8"></div>
        </header>

        {/* Content Area */}
        <div className="flex-1 overflow-auto p-4 md:p-8 lg:p-10 scroll-smooth">{children}</div>
      </main>
    </div>
  );
};

// --- MetricCard Component ---
const MetricCard = ({ title, value, trend, trendUp, icon, color }: any) => {
  const colorStyles: any = {
    teal: 'bg-teal-50 text-teal-600',
    amber: 'bg-amber-50 text-amber-600',
    blue: 'bg-blue-50 text-blue-600',
    purple: 'bg-purple-50 text-purple-600',
  };

  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
      <div className="flex items-start justify-between mb-4">
        <div>
          <p className="text-sm font-medium text-slate-500">{title}</p>
          <h4 className="text-3xl font-bold text-slate-900 mt-1">{value}</h4>
        </div>
        <div className={`p-3 rounded-xl ${colorStyles[color]} bg-opacity-50`}>{icon}</div>
      </div>
      <div className="flex items-center">
        <span
          className={`flex items-center text-xs font-bold px-2 py-0.5 rounded-md ${
            trend === 'Stable'
              ? 'bg-slate-100 text-slate-600'
              : trendUp
              ? 'bg-green-50 text-green-700'
              : 'bg-red-50 text-red-700'
          }`}
        >
          {trend !== 'Stable' &&
            (trendUp ? <TrendingUp size={12} className="mr-1" /> : <TrendingUp size={12} className="mr-1 rotate-180" />)}
          {trend}
        </span>
        <span className="text-xs text-slate-400 ml-2">vs. last week</span>
      </div>
    </div>
  );
};

// --- Dashboard Page ---
export default function Dashboard() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Mock auth
    const timer = setTimeout(() => {
      setUser({
        id: 1,
        email: 'admin@smartscan.com',
        fullName: 'Dr. Sarah Connor',
        role: 'Chief of Diagnostics',
        avatar: 'SC',
      });
      setLoading(false);
    }, 800);
    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-center">
          <div className="relative w-20 h-20 mx-auto mb-6">
            <div className="absolute inset-0 border-4 border-slate-200 rounded-full"></div>
            <div className="absolute inset-0 border-4 border-teal-500 rounded-full border-t-transparent animate-spin"></div>
            <Activity className="absolute inset-0 m-auto text-teal-600 animate-pulse" size={24} />
          </div>
          <p className="text-slate-600 font-medium tracking-wide animate-pulse">Initializing Dashboard...</p>
        </div>
      </div>
    );
  }

  const recentScans = [
    { id: 'SCN-8842', patient: 'Alex M.', study: 'Dermatology', result: 'Benign Nevus', confidence: 98.2, date: 'Today, 10:42 AM', status: 'completed' },
    { id: 'SCN-8841', patient: 'Sarah J.', study: 'Anemia (Conjunctiva)', result: 'Normal', confidence: 94.5, date: 'Today, 09:15 AM', status: 'completed' },
    { id: 'SCN-8840', patient: 'Michael B.', study: 'Dermatology', result: 'Melanoma (High Risk)', confidence: 89.1, date: 'Yesterday', status: 'review' },
    { id: 'SCN-8839', patient: 'David C.', study: 'Dermatology', result: 'Basal Cell', confidence: 76.4, date: 'Yesterday', status: 'pending' },
    { id: 'SCN-8838', patient: 'Emily R.', study: 'Anemia (Conjunctiva)', result: 'Severe Anemia', confidence: 91.0, date: 'Jan 16, 2026', status: 'review' },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-emerald-50 text-emerald-700 border-emerald-100';
      case 'review':
        return 'bg-amber-50 text-amber-700 border-amber-100';
      case 'pending':
        return 'bg-blue-50 text-blue-700 border-blue-100';
      default:
        return 'bg-slate-50 text-slate-700 border-slate-100';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle2 size={14} className="mr-1.5" />;
      case 'review':
        return <AlertCircle size={14} className="mr-1.5" />;
      case 'pending':
        return <Clock size={14} className="mr-1.5" />;
      default:
        return null;
    }
  };

  return (
    <AdminLayout user={user}>
      <div className="space-y-8 max-w-7xl mx-auto">
        {/* Welcome */}
        <div className="relative overflow-hidden rounded-4xl bg-linear-to-r from-slate-900 via-slate-800 to-teal-900 p-10 text-white shadow-2xl shadow-slate-200">
          <div className="absolute top-0 right-0 -mr-20 -mt-20 w-80 h-80 bg-teal-500 rounded-full blur-[100px] opacity-20"></div>
          <div className="relative z-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold mb-2 tracking-tight">Welcome back, {user.fullName}</h1>
              <p className="text-slate-300 text-lg max-w-xl">
                System is operating at <span className="text-teal-400 font-semibold">99.9% uptime</span>. 
                You have <span className="text-white font-semibold underline decoration-teal-500 underline-offset-4">3 high-priority</span> scans requiring review.
              </p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm border border-white/10 p-4 rounded-xl min-w-50">
              <div className="text-xs text-slate-400 uppercase tracking-wider font-semibold mb-1">Current Model</div>
              <div className="text-xl font-bold flex items-center gap-2">
                ISIC-ResNet50 <span className="flex h-2 w-2 rounded-full bg-green-400 shadow-[0_0_10px_#4ade80]"></span>
              </div>
              <div className="text-xs text-teal-300 mt-1">v2.4.1 (Stable)</div>
            </div>
          </div>
        </div>

        {/* Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <MetricCard title="Total Scans Today" value="384" trend="+12%" trendUp={true} icon={<Activity size={24} />} color="teal" />
          <MetricCard title="Positive Detections" value="6.2%" trend="-0.8%" trendUp={false} icon={<AlertCircle size={24} />} color="amber" />
          <MetricCard title="Avg. Confidence" value="94.8%" trend="+2.1%" trendUp={true} icon={<TrendingUp size={24} />} color="blue" />
          <MetricCard title="Active Physicians" value="42" trend="Stable" trendUp={true} icon={<Users size={24} />} color="purple" />
        </div>

        {/* Recent Scans Table */}
        <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
          <div className="p-8 border-b border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                <FileText className="text-teal-600" size={20} />
                Recent Diagnostics
              </h3>
              <p className="text-slate-500 mt-1">Real-time feed of incoming patient scans.</p>
            </div>
            <div className="flex gap-3">
              <button className="px-4 py-2 bg-slate-50 text-slate-600 rounded-lg text-sm font-semibold hover:bg-slate-100 transition-colors border border-slate-200">
                Filter View
              </button>
              <button className="px-4 py-2 bg-teal-600 text-white rounded-lg text-sm font-semibold hover:bg-teal-700 transition-colors shadow-lg shadow-teal-100 flex items-center gap-2">
                View All Records <ChevronRight size={16} />
              </button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50/50 border-b border-slate-100">
                <tr>
                  <th className="px-8 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Scan ID</th>
                  <th className="px-8 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Patient</th>
                  <th className="px-8 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Modality</th>
                  <th className="px-8 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">AI Prediction</th>
                  <th className="px-8 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Confidence</th>
                  <th className="px-8 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Status</th>
                  <th className="px-8 py-4 text-right text-xs font-bold text-slate-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {recentScans.map((scan) => (
                  <tr key={scan.id} className="group hover:bg-slate-50/80 transition-colors">
                    <td className="px-8 py-5 whitespace-nowrap text-sm font-mono font-medium text-teal-700">{scan.id}</td>
                    <td className="px-8 py-5 whitespace-nowrap text-sm font-semibold text-slate-900">{scan.patient}</td>
                    <td className="px-8 py-5 whitespace-nowrap text-sm text-slate-600">{scan.study}</td>
                    <td className="px-8 py-5 whitespace-nowrap">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${
                          scan.result.includes('Malignant') || scan.result.includes('High')
                            ? 'bg-red-50 text-red-700 border-red-100'
                            : scan.result.includes('Benign') || scan.result.includes('Normal')
                            ? 'bg-green-50 text-green-700 border-green-100'
                            : 'bg-slate-100 text-slate-600 border-slate-200'
                        }`}
                      >
                        {scan.result}
                      </span>
                    </td>
                    <td className="px-8 py-5 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <div className="w-16 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full ${
                              scan.confidence > 90
                                ? 'bg-green-500'
                                : scan.confidence > 80
                                ? 'bg-yellow-500'
                                : 'bg-slate-400'
                            }`}
                            style={{ width: `${scan.confidence}%` }}
                          ></div>
                        </div>
                        <span className="text-xs font-bold text-slate-700">{scan.confidence}%</span>
                      </div>
                    </td>
                    <td className="px-8 py-5 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-md text-xs font-bold border capitalize ${getStatusColor(scan.status)}`}>
                        {getStatusIcon(scan.status)}
                        {scan.status}
                      </span>
                    </td>
                    <td className="px-8 py-5 whitespace-nowrap text-right">
                      <button className="text-slate-400 hover:text-teal-600 font-medium text-sm transition-colors">Details</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="p-4 border-t border-slate-100 bg-slate-50/50 text-center">
            <span className="text-xs text-slate-400 font-medium">Showing 5 most recent records</span>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
