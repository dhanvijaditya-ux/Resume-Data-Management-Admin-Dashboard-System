
import React, { useEffect, useState } from 'react';
import { 
  Users, 
  FileText, 
  Calendar, 
  TrendingUp, 
  ArrowUpRight, 
  ArrowDownRight,
  PlusCircle,
  Briefcase,
  Search
} from 'lucide-react';
import { 
  Chart as ChartJS, 
  ArcElement, 
  Tooltip as ChartTooltip, 
  Legend as ChartLegend 
} from 'chart.js';
import { Pie } from 'react-chartjs-2';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip as RechartsTooltip, 
  ResponsiveContainer 
} from 'recharts';
import { mockApiService } from '../services/api';
import { DashboardStats } from '../types';

// Register Chart.js components
ChartJS.register(ArcElement, ChartTooltip, ChartLegend);

const COLORS = ['#6366f1', '#8b5cf6', '#d946ef', '#f43f5e', '#f59e0b'];

const AdminOverview: React.FC = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const loadData = async () => {
      const data = await mockApiService.getDashboardStats();
      setStats(data);
      setLoading(false);
    };
    loadData();
  }, []);

  if (loading || !stats) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  // Filter skills based on search query
  const filteredSkills = stats.skillsData.filter(skill => 
    skill.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Chart.js data configuration
  const chartData = {
    labels: stats.skillsData.map(s => s.name),
    datasets: [
      {
        data: stats.skillsData.map(s => s.value),
        backgroundColor: COLORS,
        borderColor: '#ffffff',
        borderWidth: 2,
        hoverOffset: 10
      },
    ],
  };

  const chartOptions = {
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        backgroundColor: '#1e293b',
        padding: 12,
        cornerRadius: 8,
        titleFont: { size: 14, weight: 'bold' as const },
        bodyFont: { size: 13 },
      }
    },
    maintainAspectRatio: false,
    responsive: true,
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col lg:row items-start lg:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Admin Dashboard</h1>
          <p className="text-slate-500">Overview of system activities and performance</p>
        </div>
        
        <div className="flex flex-col sm:flex-row items-center gap-3 w-full lg:w-auto">
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
            <input 
              type="text"
              placeholder="Search skills or data..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
            />
          </div>
          <div className="px-4 py-2 bg-white border border-slate-200 rounded-xl text-sm font-medium text-slate-600 flex items-center gap-2 whitespace-nowrap shadow-sm">
            <Calendar className="w-4 h-4" /> Last 30 Days
          </div>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <KpiCard 
          icon={<Users className="w-6 h-6 text-indigo-600" />}
          label="Total Users"
          value={stats.totalUsers.toString()}
          trend="+12%"
          trendUp={true}
        />
        <KpiCard 
          icon={<FileText className="w-6 h-6 text-violet-600" />}
          label="Total Resumes"
          value={stats.totalResumes.toString()}
          trend="+8%"
          trendUp={true}
        />
        <KpiCard 
          icon={<PlusCircle className="w-6 h-6 text-emerald-600" />}
          label="Submitted Today"
          value={stats.submittedToday.toString()}
          trend="+2"
          trendUp={true}
        />
        <KpiCard 
          icon={<Briefcase className="w-6 h-6 text-amber-600" />}
          label="Avg Experience"
          value={`${stats.avgExperienceYears}y`}
          trend="-2%"
          trendUp={false}
        />
      </div>

      {/* Charts Section */}
      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between mb-8">
            <h3 className="font-bold text-slate-900">Submission Trends</h3>
            <div className="flex gap-4 text-xs font-semibold text-slate-400">
              <span className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-indigo-500"></div> Submissions</span>
            </div>
          </div>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={stats.submissionsByDay}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
                <RechartsTooltip 
                  contentStyle={{backgroundColor: '#fff', borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)'}}
                />
                <Line type="monotone" dataKey="count" stroke="#6366f1" strokeWidth={3} dot={{r: 4, fill: '#6366f1', strokeWidth: 2, stroke: '#fff'}} activeDot={{r: 6}} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col">
          <h3 className="font-bold text-slate-900 mb-8">Skill Distribution</h3>
          <div className="h-56 relative mb-6">
            <Pie data={chartData} options={chartOptions} />
          </div>
          <div className="space-y-3 flex-1 overflow-y-auto max-h-48 pr-2">
            {filteredSkills.length > 0 ? (
              filteredSkills.map((skill, idx) => {
                const originalIndex = stats.skillsData.findIndex(s => s.name === skill.name);
                return (
                  <div key={skill.name} className="flex items-center justify-between p-2 rounded-lg hover:bg-slate-50 transition-colors">
                    <div className="flex items-center gap-3">
                      <div className="w-2.5 h-2.5 rounded-full shadow-sm" style={{backgroundColor: COLORS[originalIndex % COLORS.length]}}></div>
                      <span className="text-sm font-semibold text-slate-700">{skill.name}</span>
                    </div>
                    <span className="text-sm font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-md">{skill.value}</span>
                  </div>
                );
              })
            ) : (
              <div className="text-center py-4 text-slate-400 text-sm">No skills match your search.</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const KpiCard: React.FC<{ icon: React.ReactNode; label: string; value: string; trend: string; trendUp: boolean }> = ({ icon, label, value, trend, trendUp }) => (
  <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
    <div className="flex items-center justify-between mb-4">
      <div className="w-12 h-12 bg-slate-50 rounded-xl flex items-center justify-center">{icon}</div>
      <span className={`flex items-center gap-1 text-xs font-bold px-2 py-1 rounded-full ${
        trendUp ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'
      }`}>
        {trendUp ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
        {trend}
      </span>
    </div>
    <p className="text-slate-500 text-sm font-medium">{label}</p>
    <p className="text-2xl font-bold text-slate-900 mt-1">{value}</p>
  </div>
);

export default AdminOverview;
