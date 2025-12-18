import React from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  LineChart, Line, AreaChart, Area, PieChart, Pie, Cell, Legend 
} from 'recharts';
import { TrendingUp, Users, ShoppingBag, DollarSign, Calendar, Filter } from 'lucide-react';
import Card, { CardContent, CardHeader } from '../components/ui/Card';
import Button from '../components/ui/Button';

const revenueData = [
  { month: 'Jan', revenue: 45000, orders: 120 },
  { month: 'Feb', revenue: 52000, orders: 150 },
  { month: 'Mar', revenue: 48000, orders: 140 },
  { month: 'Apr', revenue: 61000, orders: 180 },
  { month: 'May', revenue: 55000, orders: 165 },
  { month: 'Jun', revenue: 67000, orders: 200 },
];

const topItems = [
  { name: 'Butter Chicken', value: 400 },
  { name: 'Paneer Tikka', value: 300 },
  { name: 'Dal Makhani', value: 200 },
  { name: 'Garlic Naan', value: 100 },
];

const COLORS = ['#ef4444', '#f59e0b', '#3b82f6', '#10b981'];

const peakTimes = [
  { time: '12 PM', orders: 25 },
  { time: '1 PM', orders: 40 },
  { time: '2 PM', orders: 35 },
  { time: '3 PM', orders: 15 },
  { time: '4 PM', orders: 10 },
  { time: '5 PM', orders: 20 },
  { time: '6 PM', orders: 45 },
  { time: '7 PM', orders: 65 },
  { time: '8 PM', orders: 80 },
  { time: '9 PM', orders: 70 },
  { time: '10 PM', orders: 40 },
];

export default function Analytics() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Advanced Analytics</h1>
          <p className="text-slate-500 text-sm mt-1">Deep dive into your restaurant's performance metrics.</p>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="secondary" size="sm">
            <Calendar className="w-4 h-4 mr-2" />
            Last 30 Days
          </Button>
          <Button variant="secondary" size="sm">
            <Filter className="w-4 h-4 mr-2" />
            Filter
          </Button>
        </div>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
         <Card className="bg-gradient-to-br from-red-600 to-rose-700 text-white border-none">
            <CardContent className="p-6">
               <div className="bg-white/20 w-10 h-10 rounded-lg flex items-center justify-center mb-4">
                  <TrendingUp className="text-white" size={20} />
               </div>
               <p className="text-red-100 text-sm font-medium">Growth Rate</p>
               <h2 className="text-3xl font-bold mt-1">+18.5%</h2>
               <p className="text-red-200 text-xs mt-2 italic">Compared to previous month</p>
            </CardContent>
         </Card>
         <Card>
            <CardContent className="p-6">
               <div className="bg-blue-50 w-10 h-10 rounded-lg flex items-center justify-center mb-4">
                  <Users className="text-blue-600" size={20} />
               </div>
               <p className="text-slate-500 text-sm font-medium">Customer Retention</p>
               <h2 className="text-3xl font-bold mt-1 text-slate-800">64.2%</h2>
               <div className="w-full bg-slate-100 h-1.5 rounded-full mt-3 overflow-hidden">
                  <div className="bg-blue-500 h-full rounded-full" style={{ width: '64%' }}></div>
               </div>
            </CardContent>
         </Card>
         <Card>
            <CardContent className="p-6">
               <div className="bg-amber-50 w-10 h-10 rounded-lg flex items-center justify-center mb-4">
                  <ShoppingBag className="text-amber-600" size={20} />
               </div>
               <p className="text-slate-500 text-sm font-medium">Avg. Order Value</p>
               <h2 className="text-3xl font-bold mt-1 text-slate-800">₹842</h2>
               <p className="text-green-600 text-xs mt-2 font-bold flex items-center">
                  <TrendingUp size={12} className="mr-1" /> Higher than average
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
                  <AreaChart data={revenueData}>
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
            <CardHeader title="Revenue Breakdown by Category" />
            <CardContent>
               <div className="space-y-6">
                  {topItems.map((item, i) => (
                    <div key={i} className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="font-medium text-slate-700">{item.name}</span>
                        <span className="text-slate-500 font-bold">₹{(item.value * 250).toLocaleString()}</span>
                      </div>
                      <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                        <div 
                          className="h-full rounded-full transition-all duration-1000" 
                          style={{ width: `${(item.value / 400) * 100}%`, backgroundColor: COLORS[i] }}
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
