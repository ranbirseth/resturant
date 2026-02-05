import React, { useEffect, useState } from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  AreaChart, Area, PieChart, Pie, Cell, Legend 
} from 'recharts';
import { TrendingUp, Users, ShoppingBag, Calendar, Filter, Loader2 } from 'lucide-react';
import Card, { CardContent, CardHeader } from '../components/ui/Card';
import Button from '../components/ui/Button';
import { getAnalytics } from '../services/orderService';

const COLORS = ['#ef4444', '#f59e0b', '#3b82f6', '#10b981', '#8b5cf6'];

export default function Analytics() {
  const [timeRange, setTimeRange] = useState('30d');
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchAnalytics(timeRange);
  }, [timeRange]);

  const fetchAnalytics = async (range) => {
    try {
      setLoading(true);
      const analyticsData = await getAnalytics(range);
      setData(analyticsData);
    } catch (err) {
      console.error('Failed to fetch analytics:', err);
      setError('Failed to load analytics data');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-red-500" />
      </div>
    );
  }

  if (error) {
    return (
        <div className="flex h-screen flex-col items-center justify-center text-slate-500">
            <p>{error}</p>
            <Button variant="primary" className="mt-4" onClick={() => fetchAnalytics(timeRange)}>Retry</Button>
        </div>
    );
  }

  const { stats, revenueTrend, topItems, peakTimes } = data;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Advanced Analytics</h1>
          <p className="text-slate-500 text-sm mt-1">Deep dive into your restaurant's performance metrics.</p>
        </div>
        <div className="flex items-center bg-white p-1 rounded-lg border border-slate-200 shadow-sm">
          <button 
            onClick={() => setTimeRange('1d')}
            className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
              timeRange === '1d' 
                ? 'bg-slate-100 text-slate-900 shadow-sm' 
                : 'text-slate-500 hover:text-slate-700 hover:bg-slate-50'
            }`}
          >
            1 Day
          </button>
          <button 
            onClick={() => setTimeRange('7d')}
             className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
              timeRange === '7d' 
                ? 'bg-slate-100 text-slate-900 shadow-sm' 
                : 'text-slate-500 hover:text-slate-700 hover:bg-slate-50'
            }`}
          >
            7 Days
          </button>
          <button 
            onClick={() => setTimeRange('30d')}
             className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
              timeRange === '30d' 
                ? 'bg-slate-100 text-slate-900 shadow-sm' 
                : 'text-slate-500 hover:text-slate-700 hover:bg-slate-50'
            }`}
          >
            1 Month
          </button>
        </div>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
         <Card className="bg-gradient-to-br from-red-600 to-rose-700 text-white border-none">
            <CardContent className="p-6">
               <div className="bg-white/20 w-10 h-10 rounded-lg flex items-center justify-center mb-4">
                  <TrendingUp className="text-white" size={20} />
               </div>
               <p className="text-red-100 text-sm font-medium">Total Revenue</p>
               <h2 className="text-3xl font-bold mt-1">₹{stats.totalRevenue.toLocaleString()}</h2>
               <p className="text-red-200 text-xs mt-2 italic">Total lifetime revenue</p>
            </CardContent>
         </Card>
         <Card>
            <CardContent className="p-6">
               <div className="bg-blue-50 w-10 h-10 rounded-lg flex items-center justify-center mb-4">
                  <Users className="text-blue-600" size={20} />
               </div>
               <p className="text-slate-500 text-sm font-medium">Customer Retention</p>
               <h2 className="text-3xl font-bold mt-1 text-slate-800">{stats.retentionRate}%</h2>
               <div className="w-full bg-slate-100 h-1.5 rounded-full mt-3 overflow-hidden">
                  <div className="bg-blue-500 h-full rounded-full" style={{ width: `${stats.retentionRate}%` }}></div>
               </div>
            </CardContent>
         </Card>
         <Card>
            <CardContent className="p-6">
               <div className="bg-amber-50 w-10 h-10 rounded-lg flex items-center justify-center mb-4">
                  <ShoppingBag className="text-amber-600" size={20} />
               </div>
               <p className="text-slate-500 text-sm font-medium">Avg. Order Value</p>
               <h2 className="text-3xl font-bold mt-1 text-slate-800">₹{stats.avgOrderValue}</h2>
               <p className="text-green-600 text-xs mt-2 font-bold flex items-center">
                  <TrendingUp size={12} className="mr-1" /> Per order average
               </p>
            </CardContent>
         </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
         {/* Monthly Revenue & Orders */}
         <Card>
            <CardHeader title="Revenue & Orders Trend" />
            <CardContent className="h-80">
               <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={revenueTrend}>
                    <defs>
                      <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#ef4444" stopOpacity={0.1}/>
                        <stop offset="95%" stopColor="#ef4444" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{fill: '#64748b'}} />
                    <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b'}} />
                    <Tooltip 
                      contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }} 
                    />
                    <Area type="monotone" dataKey="revenue" stroke="#ef4444" fillOpacity={1} fill="url(#colorRev)" strokeWidth={3} />
                    <Area type="monotone" dataKey="orders" stroke="#3b82f6" fill="transparent" strokeWidth={2} strokeDasharray="5 5" />
                  </AreaChart>
               </ResponsiveContainer>
            </CardContent>
         </Card>

         {/* Peak Order Times */}
         <Card>
            <CardHeader title="Peak Order Times" subtitle="Hourly distribution of orders across the day" />
            <CardContent className="h-80">
               <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={peakTimes}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis dataKey="time" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 10}} />
                    <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b'}} />
                    <Tooltip 
                      cursor={{fill: '#f8fafc'}}
                      contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }} 
                    />
                    <Bar dataKey="orders" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                  </BarChart>
               </ResponsiveContainer>
            </CardContent>
         </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
         {/* Top Selling Categories (Pie Chart) */}
         <Card className="lg:col-span-1">
            <CardHeader title="Top Items" />
            <CardContent className="h-64">
               <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={topItems}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {topItems.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend verticalAlign="bottom" height={36}/>
                  </PieChart>
               </ResponsiveContainer>
            </CardContent>
         </Card>

         {/* Detailed Table Placeholder / Other Stats */}
         <Card className="lg:col-span-2">
            <CardHeader title="Revenue Breakdown by Item" />
            <CardContent>
               <div className="space-y-6">
                  {topItems.map((item, i) => (
                    <div key={i} className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="font-medium text-slate-700">{item.name}</span>
                        <span className="text-slate-500 font-bold">₹{item.revenue.toLocaleString()}</span>
                      </div>
                      <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                        <div 
                          className="h-full rounded-full transition-all duration-1000" 
                          style={{ width: `${(item.value / (topItems[0]?.value || 1)) * 100}%`, backgroundColor: COLORS[i % COLORS.length] }}
                        ></div>
                      </div>
                    </div>
                  ))}
               </div>
            </CardContent>
         </Card>
      </div>
    </div>
  );
}
