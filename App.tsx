
import React, { useState, useEffect } from 'react';
import { HashRouter, Routes, Route, Navigate, Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  FileText, 
  Users, 
  Settings, 
  LogOut, 
  PlusCircle, 
  Menu, 
  X,
  PieChart,
  History,
  ShieldCheck,
  User as UserIcon,
  Search,
  Bell,
  ChevronRight,
  TrendingUp,
  Mail,
  Linkedin,
  MapPin,
  Calendar,
  Briefcase,
  GraduationCap,
  Award,
  BarChart2
} from 'lucide-react';

import { User, UserRole, Resume } from './types';
import { mockApiService } from './services/api';

// Pages
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import UserDashboard from './pages/UserDashboard';
import SubmitResume from './pages/SubmitResume';
import ResumeEditor from './pages/ResumeEditor';
import AdminOverview from './pages/AdminOverview';
import AdminUserManagement from './pages/AdminUserManagement';
import AdminResumeManagement from './pages/AdminResumeManagement';
import AdminAuditLogs from './pages/AdminAuditLogs';
import AdminAnalytics from './pages/AdminAnalytics';
import UserProfile from './pages/UserProfile';
import VerifyEmail from './pages/VerifyEmail';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check local storage for session
    const checkAuth = async () => {
      try {
        const currentUser = await mockApiService.getCurrentUser();
        setUser(currentUser);
      } catch (e) {
        setUser(null);
      } finally {
        setLoading(false);
      }
    };
    checkAuth();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  const handleLogout = async () => {
    await mockApiService.logout();
    setUser(null);
    window.location.hash = '#/';
  };

  return (
    <HashRouter>
      <div className="min-h-screen flex flex-col">
        {user && <Header user={user} onLogout={handleLogout} />}
        
        <div className="flex-1 flex overflow-hidden">
          {user && <Sidebar user={user} />}
          
          <main className={`flex-1 overflow-y-auto ${user ? 'p-4 md:p-8' : ''}`}>
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={!user ? <LandingPage /> : <Navigate to={user.role === UserRole.ADMIN ? "/admin/overview" : "/user/dashboard"} />} />
              <Route path="/login" element={!user ? <LoginPage onLogin={setUser} /> : <Navigate to="/" />} />
              <Route path="/register" element={!user ? <RegisterPage onLogin={setUser} /> : <Navigate to="/" />} />
              <Route path="/verify-email/:token" element={<VerifyEmail />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route path="/reset-password/:token" element={<ResetPassword />} />

              {/* User Routes */}
              <Route path="/user/dashboard" element={user?.role === UserRole.USER ? <UserDashboard /> : <Navigate to="/login" />} />
              <Route path="/user/submit-resume" element={user?.role === UserRole.USER ? <SubmitResume /> : <Navigate to="/login" />} />
              <Route path="/user/resume/:id" element={user ? <ResumeEditor /> : <Navigate to="/login" />} />
              <Route path="/user/profile" element={user ? <UserProfile user={user} setUser={setUser} /> : <Navigate to="/login" />} />

              {/* Admin Routes */}
              <Route path="/admin/overview" element={user?.role === UserRole.ADMIN ? <AdminOverview /> : <Navigate to="/login" />} />
              <Route path="/admin/users" element={user?.role === UserRole.ADMIN ? <AdminUserManagement /> : <Navigate to="/login" />} />
              <Route path="/admin/resumes" element={user?.role === UserRole.ADMIN ? <AdminResumeManagement /> : <Navigate to="/login" />} />
              <Route path="/admin/logs" element={user?.role === UserRole.ADMIN ? <AdminAuditLogs /> : <Navigate to="/login" />} />
              <Route path="/admin/analytics" element={user?.role === UserRole.ADMIN ? <AdminAnalytics /> : <Navigate to="/login" />} />

              {/* Fallback */}
              <Route path="*" element={<Navigate to="/" />} />
            </Routes>
          </main>
        </div>
      </div>
    </HashRouter>
  );
};

const Header: React.FC<{ user: User; onLogout: () => void }> = ({ user, onLogout }) => {
  const [showDropdown, setShowDropdown] = useState(false);
  
  return (
    <header className="bg-white border-b border-slate-200 h-16 flex items-center justify-between px-6 sticky top-0 z-50">
      <div className="flex items-center gap-2">
        <div className="bg-indigo-600 p-2 rounded-lg">
          <FileText className="text-white w-6 h-6" />
        </div>
        <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-violet-600">
          ResuManage Pro
        </span>
      </div>

      <div className="flex items-center gap-4">
        <button className="p-2 text-slate-500 hover:bg-slate-100 rounded-full relative">
          <Bell className="w-5 h-5" />
          <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
        </button>
        
        <div className="relative">
          <button 
            onClick={() => setShowDropdown(!showDropdown)}
            className="flex items-center gap-3 pl-2 pr-1 py-1 rounded-full hover:bg-slate-100 transition-colors"
          >
            <div className="text-right hidden sm:block">
              <p className="text-sm font-semibold text-slate-900 leading-tight">{user.firstName} {user.lastName}</p>
              <p className="text-xs text-slate-500 capitalize">{user.role}</p>
            </div>
            <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold border border-indigo-200">
              {user.firstName[0]}{user.lastName[0]}
            </div>
          </button>

          {showDropdown && (
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-xl border border-slate-200 py-1 z-50 overflow-hidden">
              <Link to="/user/profile" className="flex items-center gap-2 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50" onClick={() => setShowDropdown(false)}>
                <UserIcon className="w-4 h-4" /> My Profile
              </Link>
              <button 
                onClick={() => {
                  setShowDropdown(false);
                  onLogout();
                }}
                className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 text-left"
              >
                <LogOut className="w-4 h-4" /> Sign Out
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

const Sidebar: React.FC<{ user: User }> = ({ user }) => {
  const location = useLocation();
  const isActive = (path: string) => location.pathname === path;

  const userLinks = [
    { to: '/user/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { to: '/user/submit-resume', icon: PlusCircle, label: 'Submit Resume' },
    { to: '/user/profile', icon: UserIcon, label: 'Profile' },
  ];

  const adminLinks = [
    { to: '/admin/overview', icon: TrendingUp, label: 'Overview' },
    { to: '/admin/resumes', icon: FileText, label: 'Manage Resumes' },
    { to: '/admin/users', icon: Users, label: 'Manage Users' },
    { to: '/admin/analytics', icon: PieChart, label: 'Analytics' },
    { to: '/admin/logs', icon: History, label: 'Audit Logs' },
  ];

  const links = user.role === UserRole.ADMIN ? adminLinks : userLinks;

  return (
    <aside className="w-64 bg-white border-r border-slate-200 hidden md:flex flex-col py-6 px-4 shrink-0">
      <div className="space-y-1">
        <p className="px-3 text-xs font-semibold text-slate-400 uppercase tracking-wider mb-4">
          Main Menu
        </p>
        {links.map((link) => {
          const Icon = link.icon;
          return (
            <Link
              key={link.to}
              to={link.to}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 ${
                isActive(link.to)
                  ? 'bg-indigo-50 text-indigo-700 font-medium'
                  : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
              }`}
            >
              <Icon className={`w-5 h-5 ${isActive(link.to) ? 'text-indigo-600' : 'text-slate-400'}`} />
              {link.label}
            </Link>
          );
        })}
      </div>

      <div className="mt-auto">
        <div className="bg-slate-50 rounded-xl p-4 border border-slate-100">
          <p className="text-xs font-semibold text-slate-400 uppercase mb-2">System Status</p>
          <div className="flex items-center gap-2 text-xs font-medium text-emerald-600">
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
            Online & Secure
          </div>
        </div>
      </div>
    </aside>
  );
};

export default App;
