
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Chart as ChartJS, 
  CategoryScale, 
  LinearScale, 
  BarElement, 
  Title, 
  Tooltip, 
  Legend, 
  ArcElement,
  PointElement,
  LineElement
} from 'chart.js';
import { Bar, Pie } from 'react-chartjs-2';
import { Filter, Download, ChevronLeft, BarChart2, Users } from 'lucide-react';
import { mockApiService } from '../services/api';
import { DashboardStats } from '../types';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  PointElement,
  LineElement
);

const AdminAnalytics: React.FC = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      const data = await mockApiService.getDashboardStats();
      setStats(data);
      setLoading(false);
    };
    load();
  }, []);

  if (loading || !stats) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  const skillsChartData = {
    labels: stats.skillsData.map(s => s.name),
    datasets: [
      {
        label: 'Candidate Count',
        data: stats.skillsData.map(s => s.value),
        backgroundColor: [
          'rgba(99, 102, 241, 0.8)',
          'rgba(139, 92, 246, 0.8)',
          'rgba(217, 70, 239, 0.8)',
          'rgba(244, 63, 94, 0.8)',
          'rgba(245, 158, 11, 0.8)',
        ],
        borderColor: [
          '#6366f1',
          '#8b5cf6',
          '#d946ef',
          '#f43f5e',
          '#f59e0b',
        ],
        borderWidth: 2,
      },
    ],
  };

  const experienceDistributionData = {
    labels: ['0-2 yrs', '3-5 yrs', '5-8 yrs', '8-12 yrs', '12+ yrs'],
    datasets: [
      {
        label: 'Applicants',
        data: [12, 19, 13, 5, 2],
        backgroundColor: 'rgba(99, 102, 241, 0.6)',
        borderColor: '#6366f1',
        borderWidth: 1,
        borderRadius: 8,
      },
    ],
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col gap-4">
        <button 
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-1.5 text-sm font-semibold text-slate-500 hover:text-indigo-600 transition-colors group"
        >
          <ChevronLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" /> Back to Previous Page
        </button>
        
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Talent Analytics</h1>
            <p className="text-slate-500">Insights into candidate demographics and skill distributions using Chart.js</p>
          </div>
          <div className="flex gap-2">
             <button className="p-2.5 bg-white border border-slate-200 rounded-xl text-slate-600 hover:bg-slate-50">
                <Filter className="w-5 h-5" />
             </button>
             <button className="bg-indigo-600 text-white px-5 py-2.5 rounded-xl font-semibold flex items-center gap-2 hover:bg-indigo-700 shadow-md">
                <Download className="w-5 h-5" /> Export Report
             </button>
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Experience Histogram */}
        <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm">
          <div className="flex items-center gap-3 mb-8">
             <div className="p-2 bg-indigo-50 rounded-lg text-indigo-600">
                <Users className="w-5 h-5" />
             </div>
             <h3 className="text-lg font-bold text-slate-900">Experience Levels</h3>
          </div>
          <div className="h-80 flex items-center justify-center">
            <Bar 
              data={experienceDistributionData} 
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: { display: false },
                  tooltip: {
                    backgroundColor: '#1e293b',
                    padding: 12,
                    titleFont: { size: 14, weight: 'bold' },
                    bodyFont: { size: 13 },
                    cornerRadius: 8,
                  }
                },
                scales: {
                  y: {
                    beginAtZero: true,
                    grid: { display: false },
                    ticks: { color: '#94a3b8' }
                  },
                  x: {
                    grid: { display: false },
                    ticks: { color: '#94a3b8' }
                  }
                }
              }}
            />
          </div>
        </div>

        {/* Skill Popularity */}
        <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm">
          <div className="flex items-center gap-3 mb-8">
             <div className="p-2 bg-indigo-50 rounded-lg text-indigo-600">
                <BarChart2 className="w-5 h-5" />
             </div>
             <h3 className="text-lg font-bold text-slate-900">Skill Distribution</h3>
          </div>
          <div className="h-80 flex items-center justify-center">
            <Pie 
              data={skillsChartData}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: {
                    position: 'bottom',
                    labels: {
                      usePointStyle: true,
                      padding: 20,
                      font: { size: 12, weight: '500' },
                      color: '#64748b'
                    }
                  },
                  tooltip: {
                    backgroundColor: '#1e293b',
                    padding: 12,
                    cornerRadius: 8,
                  }
                }
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminAnalytics;
