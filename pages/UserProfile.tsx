
import React, { useState } from 'react';
import { User, Shield, Mail, Phone, Calendar, Loader2, Save } from 'lucide-react';
import { mockApiService } from '../services/api';
import { User as UserType } from '../types';

interface UserProfileProps {
  user: UserType;
  setUser: (user: UserType) => void;
}

const UserProfile: React.FC<UserProfileProps> = ({ user, setUser }) => {
  const [formData, setFormData] = useState({
    firstName: user.firstName,
    lastName: user.lastName,
    phone: user.phone || '',
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const updated = await mockApiService.updateProfile(user.id, formData);
      setUser(updated);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      alert('Error updating profile');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-8 animate-in fade-in duration-500">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Profile Settings</h1>
        <p className="text-slate-500">Manage your personal information and security preferences</p>
      </div>

      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="h-32 bg-gradient-to-r from-indigo-600 to-violet-600 relative">
           <div className="absolute -bottom-10 left-8">
              <div className="w-24 h-24 rounded-2xl bg-white p-1 shadow-lg">
                <div className="w-full h-full bg-slate-100 rounded-xl flex items-center justify-center text-3xl font-extrabold text-indigo-600 border-2 border-slate-50">
                  {user.firstName[0]}{user.lastName[0]}
                </div>
              </div>
           </div>
        </div>
        
        <div className="pt-16 p-8">
           <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-700">First Name</label>
                  <input 
                    type="text" 
                    value={formData.firstName}
                    onChange={(e) => setFormData(p => ({ ...p, firstName: e.target.value }))}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none" 
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-700">Last Name</label>
                  <input 
                    type="text" 
                    value={formData.lastName}
                    onChange={(e) => setFormData(p => ({ ...p, lastName: e.target.value }))}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none" 
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700">Phone Number (with +91)</label>
                <div className="relative">
                  <Phone className="absolute left-3 top-3 w-5 h-5 text-slate-400" />
                  <input 
                    type="text" 
                    value={formData.phone}
                    onChange={(e) => setFormData(p => ({ ...p, phone: e.target.value }))}
                    className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none" 
                    placeholder="+91 98765 43210"
                  />
                </div>
              </div>

              <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Shield className="w-5 h-5 text-indigo-600" />
                  <div>
                    <p className="text-sm font-bold text-slate-900">Email Address</p>
                    <p className="text-sm text-slate-500">{user.email}</p>
                  </div>
                </div>
                {user.isVerified ? (
                  <span className="text-xs font-bold bg-emerald-100 text-emerald-700 px-2 py-1 rounded">VERIFIED</span>
                ) : (
                  <span className="text-xs font-bold bg-amber-100 text-amber-700 px-2 py-1 rounded">PENDING VERIFICATION</span>
                )}
              </div>

              <div className="flex items-center justify-end gap-4 pt-4">
                 {success && <span className="text-emerald-600 text-sm font-bold animate-pulse">Changes saved successfully!</span>}
                 <button 
                  type="submit"
                  disabled={loading}
                  className="bg-indigo-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-indigo-700 shadow-lg shadow-indigo-100 flex items-center gap-2 transition-all active:scale-95 disabled:opacity-50"
                 >
                   {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <><Save className="w-5 h-5" /> Save Changes</>}
                 </button>
              </div>
           </form>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
