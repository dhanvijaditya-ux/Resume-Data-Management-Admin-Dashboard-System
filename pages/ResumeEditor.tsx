
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { 
  FileText, 
  Download, 
  ArrowLeft, 
  Briefcase, 
  GraduationCap, 
  Mail, 
  Linkedin, 
  Phone, 
  MapPin,
  Calendar,
  Share2,
  Paperclip,
  ExternalLink
} from 'lucide-react';
import { mockApiService } from '../services/api';
import { Resume } from '../types';

const ResumeEditor: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [resume, setResume] = useState<Resume | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const loadResume = async () => {
      if (id) {
        const data = await mockApiService.getResumeById(id);
        setResume(data);
      }
      setLoading(false);
    };
    loadResume();
  }, [id]);

  if (loading) return <div className="p-12 text-center">Loading resume...</div>;
  if (!resume) return <div className="p-12 text-center">Resume not found.</div>;

  const handleDownloadAttachment = () => {
    if (resume.attachment) {
      const link = document.createElement('a');
      link.href = resume.attachment.data;
      link.download = resume.attachment.name;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-20 animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <Link to="/user/dashboard" className="flex items-center gap-2 text-slate-600 hover:text-indigo-600 font-semibold transition-colors">
          <ArrowLeft className="w-5 h-5" /> Back to Dashboard
        </Link>
        <div className="flex gap-2">
          <button className="flex items-center gap-2 px-4 py-2 border border-slate-200 rounded-xl hover:bg-slate-50 text-slate-600 font-bold transition-all">
            <Share2 className="w-4 h-4" /> Share
          </button>
          <button className="flex items-center gap-2 px-5 py-2 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 shadow-lg shadow-indigo-100 font-bold transition-all">
            <Download className="w-4 h-4" /> Download PDF
          </button>
        </div>
      </div>

      <div className="bg-white rounded-3xl shadow-xl border border-slate-200 overflow-hidden">
        {/* Header Section */}
        <div className="p-10 border-b border-slate-100 bg-slate-50/30">
          <h1 className="text-4xl font-extrabold text-slate-900 mb-4">{resume.personalInfo.fullName}</h1>
          <p className="text-lg text-slate-600 max-w-2xl leading-relaxed mb-8">{resume.personalInfo.summary}</p>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-y-4 gap-x-8">
            <div className="flex items-center gap-3 text-slate-600">
              <Mail className="w-5 h-5 text-indigo-500" /> {resume.personalInfo.email}
            </div>
            {resume.personalInfo.phone && (
              <div className="flex items-center gap-3 text-slate-600">
                <Phone className="w-5 h-5 text-indigo-500" /> {resume.personalInfo.phone}
              </div>
            )}
            {resume.personalInfo.linkedin && (
              <div className="flex items-center gap-3 text-slate-600">
                <Linkedin className="w-5 h-5 text-indigo-500" /> LinkedIn Profile
              </div>
            )}
            <div className="flex items-center gap-3 text-slate-600">
              <MapPin className="w-5 h-5 text-indigo-500" /> {resume.personalInfo.address || 'Location Not Specified'}
            </div>
          </div>
        </div>

        {/* Content Grid */}
        <div className="p-10 grid grid-cols-1 md:grid-cols-3 gap-12">
          {/* Main Column */}
          <div className="md:col-span-2 space-y-12">
            {/* Experience */}
            <section>
              <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2 mb-6">
                <Briefcase className="w-6 h-6 text-indigo-600" /> Professional Experience
              </h2>
              <div className="space-y-8">
                {resume.experience.map(exp => (
                  <div key={exp.id} className="relative pl-6 before:absolute before:left-0 before:top-2 before:bottom-0 before:w-0.5 before:bg-slate-100">
                    <div className="absolute left-[-4px] top-2 w-2.5 h-2.5 rounded-full bg-indigo-500"></div>
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h3 className="font-bold text-slate-900">{exp.position}</h3>
                        <p className="text-indigo-600 font-semibold">{exp.company}</p>
                      </div>
                      <span className="text-sm font-medium text-slate-400 flex items-center gap-1">
                        <Calendar className="w-3 h-3" /> {exp.startDate} - {exp.endDate || 'Present'}
                      </span>
                    </div>
                    <p className="text-slate-600 text-sm leading-relaxed mb-4">{exp.description}</p>
                    <ul className="space-y-2">
                      {exp.achievements.map((ach, idx) => (
                        <li key={idx} className="text-sm text-slate-500 flex gap-2">
                          <span className="text-indigo-500">•</span> {ach}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </section>

            {/* Education */}
            <section>
              <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2 mb-6">
                <GraduationCap className="w-6 h-6 text-indigo-600" /> Education
              </h2>
              <div className="space-y-6">
                {resume.education.map(edu => (
                  <div key={edu.id}>
                    <div className="flex justify-between items-start mb-1">
                      <h3 className="font-bold text-slate-900">{edu.degree} in {edu.field}</h3>
                      <span className="text-sm font-medium text-slate-400">{edu.startDate} - {edu.endDate}</span>
                    </div>
                    <p className="text-slate-600">{edu.institution}</p>
                    {edu.gpa && <p className="text-sm text-indigo-600 font-semibold mt-1">GPA: {edu.gpa}/4.0</p>}
                  </div>
                ))}
              </div>
            </section>
          </div>

          {/* Sidebar Column */}
          <div className="space-y-12">
            {/* Attachment */}
            {resume.attachment && (
              <section>
                <h2 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2">
                  <Paperclip className="w-5 h-5 text-indigo-600" /> Attached File
                </h2>
                <div className="p-4 bg-indigo-50 rounded-2xl border border-indigo-100">
                  <p className="font-bold text-slate-900 text-sm truncate mb-1">{resume.attachment.name}</p>
                  <p className="text-[10px] text-indigo-600 font-medium uppercase tracking-widest mb-3">{(resume.attachment.size / 1024).toFixed(1)} KB</p>
                  <button 
                    onClick={handleDownloadAttachment}
                    className="w-full flex items-center justify-center gap-2 py-2 bg-white border border-indigo-200 text-indigo-600 rounded-xl text-xs font-bold hover:bg-indigo-600 hover:text-white hover:border-transparent transition-all"
                  >
                    <Download className="w-3.5 h-3.5" /> Download Original
                  </button>
                </div>
              </section>
            )}

            {/* Expertise */}
            <section>
              <h2 className="text-lg font-bold text-slate-900 mb-6">Expertise</h2>
              <div className="flex flex-wrap gap-2">
                {resume.skills.map(skill => (
                  <span key={skill} className="px-3 py-1 bg-slate-100 text-slate-700 rounded-lg text-sm font-semibold border border-slate-200">
                    {skill}
                  </span>
                ))}
              </div>
            </section>

            {/* Certifications */}
            <section>
              <h2 className="text-lg font-bold text-slate-900 mb-6">Certifications</h2>
              <div className="space-y-4">
                {resume.certifications.length > 0 ? resume.certifications.map(cert => (
                  <div key={cert.id} className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                    <p className="font-bold text-slate-900 text-sm">{cert.name}</p>
                    <p className="text-xs text-indigo-600 font-medium">{cert.issuer}</p>
                    <p className="text-[10px] text-slate-400 mt-1 uppercase tracking-wider">{cert.issueDate}</p>
                  </div>
                )) : (
                  <p className="text-slate-400 text-sm italic">No certifications listed</p>
                )}
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResumeEditor;
