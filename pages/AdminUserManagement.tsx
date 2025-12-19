
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Search, 
  Filter, 
  Mail, 
  Shield, 
  ShieldAlert, 
  Trash2, 
  Edit2, 
  MoreVertical, 
  ChevronLeft,
  X,
  AlertTriangle,
  Loader2
} from 'lucide-react';
import { mockApiService } from '../services/api';
import { User, UserRole } from '../types';

const AdminUserManagement: React.FC = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [pendingUser, setPendingUser] = useState<User | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    const loadUsers = async () => {
      const data = await mockApiService.getAllUsers();
      setUsers(data);
      setLoading(false);
    };
    loadUsers();
  }, []);

  const handleOpenModal = (user: User) => {
    setPendingUser(user);
    setIsModalOpen(true);
  };

  const handleConfirmRoleChange = async () => {
    if (!pendingUser) return;
    
    setIsUpdating(true);
    try {
      const newRole = pendingUser.role === UserRole.ADMIN ? UserRole.USER : UserRole.ADMIN;
      const updatedUser = await mockApiService.updateProfile(pendingUser.id, { role: newRole });
      setUsers(users.map(u => u.id === pendingUser.id ? updatedUser : u));
      setIsModalOpen(false);
      setPendingUser(null);
    } catch (error) {
      alert("Failed to update user role.");
    } finally {
      setIsUpdating(false);
    }
  };

  const filteredUsers = users.filter(u => 
    u.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    `${u.firstName} ${u.lastName}`.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col gap-4">
        {/* Back Button */}
        <button 
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-indigo-600 transition-all group w-fit"
        >
          <div className="p-2 rounded-xl bg-white border border-slate-200 shadow-sm group-hover:border-indigo-200 group-hover:bg-indigo-50/30 transition-all">
            <ChevronLeft className="w-4 h-4 transition-transform group-hover:-translate-x-0.5" />
          </div>
          Back to Previous
        </button>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">User Management</h1>
            <p className="text-slate-500">View and manage all registered accounts</p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-4 bg-slate-50/50 border-b border-slate-100 flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-2.5 w-5 h-5 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search by name or email..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
            />
          </div>
        </div>

        {loading ? (
          <div className="p-12 text-center">
            <div className="animate-spin h-8 w-8 border-b-2 border-indigo-600 mx-auto rounded-full"></div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-slate-100">
                  <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">User</th>
                  <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Role</th>
                  <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-slate-50 border-b border-slate-50 last:border-0 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center font-bold text-slate-600">
                          {user.firstName[0]}{user.lastName[0]}
                        </div>
                        <div>
                          <p className="font-semibold text-slate-900">{user.firstName} {user.lastName}</p>
                          <p className="text-sm text-slate-500">{user.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold border ${
                        user.role === UserRole.ADMIN 
                          ? 'bg-amber-50 text-amber-700 border-amber-100' 
                          : 'bg-indigo-50 text-indigo-700 border-indigo-100'
                      }`}>
                        {user.role === UserRole.ADMIN ? <ShieldAlert className="w-3 h-3" /> : <Shield className="w-3 h-3" />}
                        {user.role.toUpperCase()}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                       <span className={`text-xs font-bold px-2 py-0.5 rounded ${
                         user.isVerified ? 'text-emerald-600 bg-emerald-50' : 'text-slate-400 bg-slate-100'
                       }`}>
                         {user.isVerified ? 'VERIFIED' : 'PENDING'}
                       </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button 
                        onClick={() => handleOpenModal(user)}
                        className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                        title="Toggle Role"
                      >
                        <Edit2 className="w-5 h-5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Confirmation Modal */}
      {isModalOpen && pendingUser && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
          <div 
            className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300" 
            onClick={() => !isUpdating && setIsModalOpen(false)}
          ></div>
          
          <div className="relative bg-white w-full max-w-md rounded-3xl shadow-2xl border border-slate-200 overflow-hidden animate-in zoom-in-95 duration-300">
            <div className="p-6 sm:p-8">
              <div className="flex justify-between items-start mb-6">
                <div className={`p-3 rounded-2xl ${pendingUser.role === UserRole.USER ? 'bg-amber-50' : 'bg-indigo-50'}`}>
                  <AlertTriangle className={`w-6 h-6 ${pendingUser.role === UserRole.USER ? 'text-amber-600' : 'text-indigo-600'}`} />
                </div>
                <button 
                  onClick={() => setIsModalOpen(false)}
                  disabled={isUpdating}
                  className="text-slate-400 hover:text-slate-600 transition-colors p-1"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <h3 className="text-xl font-bold text-slate-900 mb-2">
                Confirm Role Change
              </h3>
              
              <div className="space-y-4">
                <p className="text-slate-600 leading-relaxed">
                  You are about to change <span className="font-bold text-slate-900">{pendingUser.firstName} {pendingUser.lastName}</span>'s role 
                  from <span className="px-1.5 py-0.5 bg-slate-100 rounded font-bold uppercase text-xs">{pendingUser.role}</span> to 
                  <span className="px-1.5 py-0.5 bg-indigo-50 text-indigo-700 rounded font-bold uppercase text-xs mx-1">
                    {pendingUser.role === UserRole.ADMIN ? UserRole.USER : UserRole.ADMIN}
                  </span>.
                </p>

                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Security Implications</p>
                  {pendingUser.role === UserRole.USER ? (
                    <p className="text-sm text-slate-600">
                      Promoting this user to <span className="font-bold text-indigo-600">Admin</span> will grant them full access to all resumes, audit logs, and administrative analytics.
                    </p>
                  ) : (
                    <p className="text-sm text-slate-600">
                      Demoting this user to <span className="font-bold text-amber-600">User</span> will revoke their access to administrative tools and restrict them to managing only their own profile.
                    </p>
                  )}
                </div>
              </div>

              <div className="mt-8 flex flex-col sm:flex-row gap-3">
                <button
                  onClick={() => setIsModalOpen(false)}
                  disabled={isUpdating}
                  className="flex-1 px-6 py-3 border border-slate-200 text-slate-600 font-bold rounded-xl hover:bg-slate-50 transition-all disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleConfirmRoleChange}
                  disabled={isUpdating}
                  className={`flex-1 px-6 py-3 text-white font-bold rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 ${
                    pendingUser.role === UserRole.USER 
                      ? 'bg-indigo-600 hover:bg-indigo-700 shadow-indigo-100' 
                      : 'bg-amber-600 hover:bg-amber-700 shadow-amber-100'
                  } disabled:opacity-50`}
                >
                  {isUpdating ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    'Confirm Change'
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminUserManagement;
