
import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ShieldCheck, ShieldAlert, Loader2, ArrowRight } from 'lucide-react';
import { mockApiService } from '../services/api';

const VerifyEmail: React.FC = () => {
  const { token } = useParams<{ token: string }>();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('');

  useEffect(() => {
    const verify = async () => {
      if (!token) {
        setStatus('error');
        setMessage('No verification token provided.');
        return;
      }
      
      try {
        await mockApiService.verifyEmail(token);
        setStatus('success');
      } catch (err: any) {
        setStatus('error');
        setMessage(err.message || 'Verification failed.');
      }
    };
    
    // Artificial delay for UI feel
    const timer = setTimeout(verify, 1500);
    return () => clearTimeout(timer);
  }, [token]);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6">
      <div className="max-w-md w-full bg-white p-8 rounded-3xl shadow-xl border border-slate-200 text-center">
        {status === 'loading' && (
          <div className="space-y-4">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-indigo-50 rounded-full mb-4">
              <Loader2 className="w-10 h-10 text-indigo-600 animate-spin" />
            </div>
            <h1 className="text-2xl font-bold text-slate-900">Verifying Email</h1>
            <p className="text-slate-500">Please wait while we secure your account...</p>
          </div>
        )}

        {status === 'success' && (
          <div className="space-y-6 animate-in zoom-in-95 duration-500">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-emerald-50 rounded-full mb-4">
              <ShieldCheck className="w-10 h-10 text-emerald-600" />
            </div>
            <h1 className="text-2xl font-bold text-slate-900">Account Verified!</h1>
            <p className="text-slate-500 leading-relaxed">Your email has been successfully verified. You can now access all features of ResuManage Pro.</p>
            <Link 
              to="/login"
              className="flex items-center justify-center gap-2 w-full bg-indigo-600 text-white py-3 rounded-xl font-bold hover:bg-indigo-700 shadow-lg shadow-indigo-100 transition-all"
            >
              Continue to Login <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        )}

        {status === 'error' && (
          <div className="space-y-6 animate-in zoom-in-95 duration-500">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-rose-50 rounded-full mb-4">
              <ShieldAlert className="w-10 h-10 text-rose-600" />
            </div>
            <h1 className="text-2xl font-bold text-slate-900">Verification Failed</h1>
            <p className="text-slate-500">{message}</p>
            <Link 
              to="/login"
              className="text-indigo-600 font-bold hover:underline block"
            >
              Back to Login
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default VerifyEmail;
