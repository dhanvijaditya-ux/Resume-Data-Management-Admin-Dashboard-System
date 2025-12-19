
import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  User, 
  GraduationCap, 
  Briefcase, 
  Award, 
  CheckCircle2, 
  ChevronRight, 
  ChevronLeft, 
  Plus, 
  X,
  Loader2,
  Trash2,
  UploadCloud,
  FileCheck,
  Paperclip
} from 'lucide-react';
import { mockApiService } from '../services/api';
import { ResumeStatus } from '../types';

const STEPS = [
  { id: 'personal', title: 'Personal Info', icon: User },
  { id: 'upload', title: 'Resume File', icon: UploadCloud },
  { id: 'education', title: 'Education', icon: GraduationCap },
  { id: 'experience', title: 'Experience', icon: Briefcase },
  { id: 'skills', title: 'Skills & Certs', icon: Award },
  { id: 'review', title: 'Review & Submit', icon: CheckCircle2 },
];

const SubmitResume: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    personalInfo: {
      fullName: '',
      email: '',
      phone: '',
      address: '',
      linkedin: '',
      summary: ''
    },
    attachment: undefined as { name: string; type: string; size: number; data: string } | undefined,
    education: [{ id: '1', institution: '', degree: '', field: '', startDate: '', endDate: '', gpa: undefined }],
    experience: [{ id: '1', company: '', position: '', description: '', startDate: '', endDate: '', achievements: [''] }],
    skills: [] as string[],
    certifications: [] as { id: string; name: string; issuer: string; issueDate: string }[],
  });

  const [newSkill, setNewSkill] = useState('');

  const nextStep = () => setCurrentStep(prev => Math.min(prev + 1, STEPS.length - 1));
  const prevStep = () => setCurrentStep(prev => Math.max(prev - 1, 0));

  const handleFile = (file: File) => {
    if (file && (file.type === 'application/pdf' || file.type === 'application/msword' || file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document')) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setFormData(prev => ({
          ...prev,
          attachment: {
            name: file.name,
            type: file.type,
            size: file.size,
            data: e.target?.result as string
          }
        }));
      };
      reader.readAsDataURL(file);
    } else {
      alert("Please upload a PDF or DOCX file.");
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const user = await mockApiService.getCurrentUser();
      if (!user) return;
      
      await mockApiService.createResume({
        ...formData,
        userId: user.id,
        status: ResumeStatus.SUBMITTED
      });
      navigate('/user/dashboard');
    } catch (err) {
      alert('Error saving resume');
    } finally {
      setLoading(false);
    }
  };

  const addEducation = () => {
    setFormData(prev => ({
      ...prev,
      education: [...prev.education, { id: Math.random().toString(), institution: '', degree: '', field: '', startDate: '', endDate: '', gpa: undefined }]
    }));
  };

  const addExperience = () => {
    setFormData(prev => ({
      ...prev,
      experience: [...prev.experience, { id: Math.random().toString(), company: '', position: '', description: '', startDate: '', endDate: '', achievements: [''] }]
    }));
  };

  const addSkill = (e: React.FormEvent) => {
    e.preventDefault();
    if (newSkill && !formData.skills.includes(newSkill)) {
      setFormData(prev => ({ ...prev, skills: [...prev.skills, newSkill] }));
      setNewSkill('');
    }
  };

  const removeSkill = (skill: string) => {
    setFormData(prev => ({ ...prev, skills: prev.skills.filter(s => s !== skill) }));
  };

  const renderStep = () => {
    switch(STEPS[currentStep].id) {
      case 'personal':
        return (
          <div className="space-y-6 animate-in slide-in-from-right-4 duration-300">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700">Full Name</label>
                <input 
                  type="text" 
                  value={formData.personalInfo.fullName}
                  onChange={(e) => setFormData(p => ({ ...p, personalInfo: { ...p.personalInfo, fullName: e.target.value } }))}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none" 
                  placeholder="Rahul Sharma"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700">Email</label>
                <input 
                  type="email" 
                  value={formData.personalInfo.email}
                  onChange={(e) => setFormData(p => ({ ...p, personalInfo: { ...p.personalInfo, email: e.target.value } }))}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
                  placeholder="rahul.sharma@example.in"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700">Phone (with +91)</label>
                <input 
                  type="text" 
                  value={formData.personalInfo.phone}
                  onChange={(e) => setFormData(p => ({ ...p, personalInfo: { ...p.personalInfo, phone: e.target.value } }))}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
                  placeholder="+91 98765 43210"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700">LinkedIn URL</label>
                <input 
                  type="text" 
                  value={formData.personalInfo.linkedin}
                  onChange={(e) => setFormData(p => ({ ...p, personalInfo: { ...p.personalInfo, linkedin: e.target.value } }))}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
                  placeholder="linkedin.com/in/rahulsharma"
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700">Address</label>
              <input 
                type="text" 
                value={formData.personalInfo.address}
                onChange={(e) => setFormData(p => ({ ...p, personalInfo: { ...p.personalInfo, address: e.target.value } }))}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
                placeholder="Indiranagar, Bengaluru, KA 560038"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700">Professional Summary</label>
              <textarea 
                rows={4}
                value={formData.personalInfo.summary}
                onChange={(e) => setFormData(p => ({ ...p, personalInfo: { ...p.personalInfo, summary: e.target.value } }))}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none resize-none"
                placeholder="Senior Software Engineer with 5+ years experience at TCS and Infosys..."
              />
            </div>
          </div>
        );
      case 'upload':
        return (
          <div className="space-y-6 animate-in slide-in-from-right-4 duration-300">
            <div className="text-center mb-8">
              <h3 className="text-lg font-bold text-slate-900">Upload Your Current Resume</h3>
              <p className="text-sm text-slate-500">Optional: We can use your existing file as a reference.</p>
            </div>

            <div 
              className={`relative border-2 border-dashed rounded-3xl p-12 transition-all flex flex-col items-center justify-center text-center ${
                dragActive ? 'border-indigo-500 bg-indigo-50' : 'border-slate-200 hover:border-indigo-300'
              } ${formData.attachment ? 'bg-indigo-50/50' : ''}`}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
            >
              {formData.attachment ? (
                <div className="space-y-4">
                  <div className="w-16 h-16 bg-indigo-600 rounded-2xl flex items-center justify-center mx-auto shadow-lg shadow-indigo-100">
                    <FileCheck className="text-white w-8 h-8" />
                  </div>
                  <div>
                    <p className="font-bold text-slate-900">{formData.attachment.name}</p>
                    <p className="text-xs text-slate-500">{(formData.attachment.size / 1024).toFixed(1)} KB • Ready to submit</p>
                  </div>
                  <button 
                    onClick={() => setFormData(p => ({ ...p, attachment: undefined }))}
                    className="text-sm font-bold text-red-600 hover:underline"
                  >
                    Remove and Change
                  </button>
                </div>
              ) : (
                <>
                  <UploadCloud className="w-12 h-12 text-indigo-500 mb-4" />
                  <p className="text-slate-900 font-bold mb-1">Drag and drop your file here</p>
                  <p className="text-sm text-slate-500 mb-6">PDF, DOC, or DOCX up to 5MB</p>
                  <button 
                    onClick={() => fileInputRef.current?.click()}
                    className="bg-indigo-600 text-white px-6 py-2 rounded-xl font-bold hover:bg-indigo-700 transition-all shadow-md"
                  >
                    Browse Files
                  </button>
                </>
              )}
              <input 
                type="file" 
                ref={fileInputRef}
                className="hidden" 
                accept=".pdf,.doc,.docx"
                onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
              />
            </div>
          </div>
        );
      case 'education':
        return (
          <div className="space-y-8 animate-in slide-in-from-right-4 duration-300">
            {formData.education.map((edu, idx) => (
              <div key={edu.id} className="p-6 bg-white border border-slate-200 rounded-2xl relative">
                <button 
                  onClick={() => setFormData(p => ({ ...p, education: p.education.filter(e => e.id !== edu.id) }))}
                  className="absolute top-4 right-4 text-slate-400 hover:text-red-600"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-slate-700">Institution</label>
                    <input 
                      type="text" 
                      value={edu.institution}
                      onChange={(e) => {
                        const newEdu = [...formData.education];
                        newEdu[idx].institution = e.target.value;
                        setFormData(p => ({ ...p, education: newEdu }));
                      }}
                      placeholder="e.g. IIT Delhi, BITS Pilani"
                      className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-slate-700">Degree</label>
                    <input 
                      type="text" 
                      value={edu.degree}
                      onChange={(e) => {
                        const newEdu = [...formData.education];
                        newEdu[idx].degree = e.target.value;
                        setFormData(p => ({ ...p, education: newEdu }));
                      }}
                      placeholder="e.g. B.Tech Computer Science"
                      className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                    />
                  </div>
                </div>
              </div>
            ))}
            <button 
              onClick={addEducation}
              className="w-full py-4 border-2 border-dashed border-slate-200 rounded-2xl text-slate-500 hover:border-indigo-400 hover:text-indigo-600 transition-all flex items-center justify-center gap-2 font-semibold"
            >
              <Plus className="w-5 h-5" /> Add Education
            </button>
          </div>
        );
      case 'experience':
        return (
          <div className="space-y-8 animate-in slide-in-from-right-4 duration-300">
            {formData.experience.map((exp, idx) => (
              <div key={exp.id} className="p-6 bg-white border border-slate-200 rounded-2xl">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-slate-700">Company</label>
                    <input 
                      type="text" 
                      value={exp.company}
                      onChange={(e) => {
                        const newExp = [...formData.experience];
                        newExp[idx].company = e.target.value;
                        setFormData(p => ({ ...p, experience: newExp }));
                      }}
                      placeholder="e.g. TCS, Infosys, Zomato"
                      className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-slate-700">Position</label>
                    <input 
                      type="text" 
                      value={exp.position}
                      onChange={(e) => {
                        const newExp = [...formData.experience];
                        newExp[idx].position = e.target.value;
                        setFormData(p => ({ ...p, experience: newExp }));
                      }}
                      placeholder="e.g. Systems Engineer"
                      className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-700">Description</label>
                  <textarea 
                    rows={3}
                    value={exp.description}
                    onChange={(e) => {
                      const newExp = [...formData.experience];
                      newExp[idx].description = e.target.value;
                      setFormData(p => ({ ...p, experience: newExp }));
                    }}
                    className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none resize-none"
                  />
                </div>
              </div>
            ))}
            <button 
              onClick={addExperience}
              className="w-full py-4 border-2 border-dashed border-slate-200 rounded-2xl text-slate-500 hover:border-indigo-400 hover:text-indigo-600 transition-all flex items-center justify-center gap-2 font-semibold"
            >
              <Plus className="w-5 h-5" /> Add Experience
            </button>
          </div>
        );
      case 'skills':
        return (
          <div className="space-y-10 animate-in slide-in-from-right-4 duration-300">
            <div>
              <h3 className="text-lg font-bold text-slate-900 mb-4">Professional Skills</h3>
              <form onSubmit={addSkill} className="flex gap-2 mb-4">
                <input 
                  type="text" 
                  value={newSkill}
                  onChange={(e) => setNewSkill(e.target.value)}
                  placeholder="e.g. Java, Python, SQL, Project Management"
                  className="flex-1 px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
                />
                <button 
                  type="submit"
                  className="bg-indigo-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-indigo-700"
                >
                  Add
                </button>
              </form>
              <div className="flex flex-wrap gap-2">
                {formData.skills.map(skill => (
                  <span key={skill} className="inline-flex items-center gap-2 px-3 py-1.5 bg-indigo-50 text-indigo-700 rounded-full font-medium border border-indigo-100 group">
                    {skill}
                    <button onClick={() => removeSkill(skill)} className="text-indigo-400 hover:text-indigo-700">
                      <X className="w-4 h-4" />
                    </button>
                  </span>
                ))}
              </div>
            </div>
          </div>
        );
      case 'review':
        return (
          <div className="space-y-8 animate-in slide-in-from-right-4 duration-300">
             <div className="bg-indigo-50 p-6 rounded-2xl border border-indigo-100">
               <h3 className="text-indigo-900 font-bold mb-2 flex items-center gap-2">
                 <CheckCircle2 className="w-5 h-5" /> Final Review
               </h3>
               <p className="text-indigo-700 text-sm">Please review your information carefully before submitting to the system.</p>
             </div>
             
             <div className="space-y-6">
                <div className="border-l-4 border-indigo-500 pl-4 py-1">
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Personal Info</p>
                  <p className="text-lg font-bold text-slate-900">{formData.personalInfo.fullName || 'No name provided'}</p>
                  <p className="text-slate-600">{formData.personalInfo.email} | {formData.personalInfo.phone}</p>
                </div>

                {formData.attachment && (
                  <div className="border-l-4 border-indigo-500 pl-4 py-1">
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Attached Document</p>
                    <p className="text-slate-900 flex items-center gap-2">
                      <Paperclip className="w-4 h-4 text-indigo-500" /> {formData.attachment.name}
                    </p>
                  </div>
                )}

                <div className="border-l-4 border-slate-200 pl-4 py-1">
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Education</p>
                  <p className="text-slate-900">{formData.education.length} academic entries</p>
                </div>

                <div className="border-l-4 border-slate-200 pl-4 py-1">
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Experience</p>
                  <p className="text-slate-900">{formData.experience.length} professional roles</p>
                </div>

                <div className="border-l-4 border-slate-200 pl-4 py-1">
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Skills</p>
                  <p className="text-slate-900">{formData.skills.join(', ') || 'None added'}</p>
                </div>
             </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-20">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-extrabold text-slate-900">Build Your Resume</h1>
        <p className="text-slate-500">Step {currentStep + 1} of {STEPS.length}: {STEPS[currentStep].title}</p>
      </div>

      <div className="flex items-center justify-between px-4 max-w-2xl mx-auto mb-12">
        {STEPS.map((step, idx) => (
          <div key={step.id} className="flex flex-col items-center gap-2 relative z-10">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-500 ${
              idx <= currentStep ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-100' : 'bg-slate-100 text-slate-400'
            }`}>
              {idx < currentStep ? <CheckCircle2 className="w-6 h-6" /> : <step.icon className="w-5 h-5" />}
            </div>
            {idx < STEPS.length - 1 && (
              <div className={`hidden sm:block absolute left-1/2 w-full h-[2px] -z-10 top-5 ml-5 ${
                idx < currentStep ? 'bg-indigo-600' : 'bg-slate-100'
              }`}></div>
            )}
          </div>
        ))}
      </div>

      <div className="bg-white p-8 md:p-10 rounded-3xl shadow-xl border border-slate-200">
        {renderStep()}

        <div className="mt-12 flex items-center justify-between pt-8 border-t border-slate-100">
          <button 
            onClick={prevStep}
            disabled={currentStep === 0}
            className="flex items-center gap-2 px-6 py-3 text-slate-600 font-bold hover:bg-slate-50 rounded-xl transition-all disabled:opacity-0"
          >
            <ChevronLeft className="w-5 h-5" /> Back
          </button>
          
          {currentStep === STEPS.length - 1 ? (
            <button 
              onClick={handleSubmit}
              disabled={loading}
              className="bg-indigo-600 text-white px-10 py-3 rounded-xl font-bold hover:bg-indigo-700 shadow-xl shadow-indigo-100 flex items-center gap-2 transition-all active:scale-95 disabled:opacity-50"
            >
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Submit Resume'}
            </button>
          ) : (
            <button 
              onClick={nextStep}
              className="bg-indigo-600 text-white px-10 py-3 rounded-xl font-bold hover:bg-indigo-700 shadow-xl shadow-indigo-100 flex items-center gap-2 transition-all active:scale-95"
            >
              Continue <ChevronRight className="w-5 h-5" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default SubmitResume;
