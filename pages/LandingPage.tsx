
import React from 'react';
import { Link } from 'react-router-dom';
import { FileText, CheckCircle, Shield, BarChart2, ArrowRight } from 'lucide-react';

const LandingPage: React.FC = () => {
  return (
    <div className="bg-white min-h-screen">
      {/* Navigation */}
      <nav className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="bg-indigo-600 p-2 rounded-lg">
            <FileText className="text-white w-6 h-6" />
          </div>
          <span className="text-xl font-bold text-slate-900 tracking-tight">ResuManage Pro</span>
        </div>
        <div className="flex items-center gap-6">
          <Link to="/login" className="text-slate-600 hover:text-slate-900 font-medium">Log in</Link>
          <Link to="/register" className="bg-indigo-600 text-white px-5 py-2 rounded-full font-medium hover:bg-indigo-700 transition-all shadow-md">
            Get Started
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-6 pt-20 pb-32 grid lg:grid-cols-2 gap-16 items-center">
        <div className="space-y-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 text-sm font-semibold border border-indigo-100">
            <Shield className="w-4 h-4" /> Secure Resume Management
          </div>
          <h1 className="text-6xl font-extrabold text-slate-900 leading-[1.1]">
            Build Your Future with <span className="text-indigo-600">Structured Data</span>
          </h1>
          <p className="text-xl text-slate-600 leading-relaxed max-w-xl">
            Streamline your application process. Manage structured resume data, track versions, and let administrators discover your skills through advanced analytics.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Link to="/register" className="flex items-center justify-center gap-2 bg-indigo-600 text-white px-8 py-4 rounded-xl font-bold text-lg hover:bg-indigo-700 transition-all shadow-xl hover:translate-y-[-2px]">
              Create My Resume <ArrowRight className="w-5 h-5" />
            </Link>
            <div className="flex items-center gap-3 px-6 text-slate-500 font-medium">
              <CheckCircle className="text-emerald-500 w-5 h-5" /> Free for candidates
            </div>
          </div>
        </div>
        
        <div className="relative">
          <div className="absolute -inset-4 bg-gradient-to-tr from-indigo-100 to-violet-100 rounded-3xl blur-2xl opacity-50"></div>
          <div className="relative bg-white border border-slate-200 rounded-2xl shadow-2xl overflow-hidden p-6">
            <img src="https://picsum.photos/seed/dashboard/800/600" alt="Dashboard Preview" className="rounded-lg border border-slate-100" />
            <div className="mt-6 flex items-center justify-between">
              <div className="flex gap-2">
                <div className="w-3 h-3 rounded-full bg-red-400"></div>
                <div className="w-3 h-3 rounded-full bg-amber-400"></div>
                <div className="w-3 h-3 rounded-full bg-emerald-400"></div>
              </div>
              <div className="flex gap-4">
                <div className="h-4 w-24 bg-slate-100 rounded"></div>
                <div className="h-4 w-12 bg-slate-100 rounded"></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="bg-slate-50 py-24 border-y border-slate-200">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">Everything You Need to Manage Professional Profiles</h2>
            <p className="text-slate-600">Our platform bridges the gap between structured data entry and powerful administrative insights.</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <FeatureCard 
              icon={<FileText className="text-indigo-600" />}
              title="Multi-Step Builder"
              desc="Intuitive step-by-step form to capture every detail of your professional journey."
            />
            <FeatureCard 
              icon={<Shield className="text-indigo-600" />}
              title="RBAC Security"
              desc="Role-based access ensures your personal data is only visible to authorized administrators."
            />
            <FeatureCard 
              icon={<BarChart2 className="text-indigo-600" />}
              title="Smart Analytics"
              desc="Admins gain deep insights into skill trends and candidate demographics through interactive charts."
            />
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-slate-200">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:row items-center justify-between gap-6">
          <div className="flex items-center gap-2">
            <FileText className="text-indigo-600 w-5 h-5" />
            <span className="font-bold text-slate-900">ResuManage Pro</span>
          </div>
          <p className="text-slate-500 text-sm">© 2024 ResuManage Pro System. All rights reserved. PS-07 Certified.</p>
          <div className="flex gap-6">
            <a href="#" className="text-slate-400 hover:text-indigo-600">Privacy Policy</a>
            <a href="#" className="text-slate-400 hover:text-indigo-600">Terms of Service</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

const FeatureCard: React.FC<{ icon: React.ReactNode; title: string; desc: string }> = ({ icon, title, desc }) => (
  <div className="bg-white p-8 rounded-2xl border border-slate-200 hover:border-indigo-300 transition-colors group shadow-sm">
    <div className="w-12 h-12 bg-indigo-50 rounded-xl flex items-center justify-center mb-6 group-hover:bg-indigo-600 transition-colors">
      {React.cloneElement(icon as React.ReactElement, { className: 'w-6 h-6 group-hover:text-white transition-colors' })}
    </div>
    <h3 className="text-xl font-bold text-slate-900 mb-3">{title}</h3>
    <p className="text-slate-600 leading-relaxed">{desc}</p>
  </div>
);

export default LandingPage;
