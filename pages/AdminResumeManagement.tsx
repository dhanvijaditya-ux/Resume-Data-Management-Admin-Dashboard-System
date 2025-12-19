
import React, { useEffect, useState } from 'react';
import { Search, Filter, FileText, Download, Trash2, Eye, Archive, CheckCircle } from 'lucide-react';
import { mockApiService } from '../services/api';
import { Resume, ResumeStatus } from '../types';

const AdminResumeManagement: React.FC = () => {
  const [resumes, setResumes] = useState<Resume[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const loadResumes = async () => {
      const data = await mockApiService.getResumes();
      setResumes(data);
      setLoading(false);
    };
    loadResumes();
  }, []);

  const handleStatusChange = async (id: string, newStatus: ResumeStatus) => {
    const updated = await mockApiService.updateResume(id, { status: newStatus });
    setResumes(resumes.map(r => r.id === id ? updated : r));
  };

  const filteredResumes = resumes.filter(r => 
    r.personalInfo.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    r.skills.some(s => s.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Resume Management</h1>
          <p className="text-slate-500">Oversee and evaluate all candidate submissions</p>
        </div>
        <button className="bg-indigo-600 text-white px-5 py-2.5 rounded-xl font-semibold flex items-center gap-2 hover:bg-indigo-700 shadow-md transition-all">
          <Download className="w-5 h-5" /> Export All (CSV)
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-4 bg-slate-50/50 border-b border-slate-100 flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-2.5 w-5 h-5 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search by name, skills, or email..." 
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
                  <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase">Candidate</th>
                  <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase">Skills</th>
                  <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase">Status</th>
                  <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase">Date</th>
                  <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredResumes.map((resume) => (
                  <tr key={resume.id} className="hover:bg-slate-50 border-b border-slate-50 last:border-0 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-600">
                          <FileText className="w-5 h-5" />
                        </div>
                        <div>
                          <p className="font-semibold text-slate-900">{resume.personalInfo.fullName}</p>
                          <p className="text-sm text-slate-500">{resume.personalInfo.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-wrap gap-1 max-w-xs">
                        {resume.skills.slice(0, 3).map(skill => (
                          <span key={skill} className="px-1.5 py-0.5 bg-slate-100 text-slate-600 rounded text-[10px] font-bold">
                            {skill.toUpperCase()}
                          </span>
                        ))}
                        {resume.skills.length > 3 && <span className="text-[10px] text-slate-400">+{resume.skills.length - 3}</span>}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <select 
                        value={resume.status}
                        onChange={(e) => handleStatusChange(resume.id, e.target.value as ResumeStatus)}
                        className={`text-xs font-bold px-2 py-1 rounded-full border outline-none transition-colors ${
                          resume.status === ResumeStatus.SUBMITTED ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
                          resume.status === ResumeStatus.DRAFT ? 'bg-amber-50 text-amber-700 border-amber-200' :
                          'bg-slate-100 text-slate-700 border-slate-200'
                        }`}
                      >
                        <option value={ResumeStatus.SUBMITTED}>Submitted</option>
                        <option value={ResumeStatus.DRAFT}>Draft</option>
                        <option value={ResumeStatus.ARCHIVED}>Archived</option>
                      </select>
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-500">
                      {new Date(resume.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors">
                          <Eye className="w-5 h-5" />
                        </button>
                        <button className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminResumeManagement;
