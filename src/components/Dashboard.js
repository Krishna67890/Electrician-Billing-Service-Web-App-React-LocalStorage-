import React, { useState } from 'react';
import { TrendingUp, Users, DollarSign, Clock, AlertCircle, CheckCircle2, Key } from 'lucide-react';

const Dashboard = ({ invoices }) => {
  const [showPasswordChange, setShowPasswordChange] = useState(false);
  const [passwords, setPasswords] = useState({ current: '', new: '', confirm: '' });
  const [msg, setMsg] = useState({ type: '', text: '' });

  const handlePasswordChange = (e) => {
    e.preventDefault();
    const storedPassword = localStorage.getItem('admin_password');
    if (passwords.current !== storedPassword) {
      setMsg({ type: 'error', text: 'Current password incorrect' });
      return;
    }
    if (passwords.new !== passwords.confirm) {
      setMsg({ type: 'error', text: 'New passwords do not match' });
      return;
    }
    localStorage.setItem('admin_password', passwords.new);
    setMsg({ type: 'success', text: 'Password updated successfully!' });
    setPasswords({ current: '', new: '', confirm: '' });
    setTimeout(() => {
      setShowPasswordChange(false);
      setMsg({ type: '', text: '' });
    }, 2000);
  };

  const totalRevenue = invoices.reduce((sum, inv) => sum + (parseFloat(inv.finalTotal) || 0), 0);
  const totalInvoices = invoices.length;
  const pendingInvoices = invoices.filter(inv => inv.status === 'Pending').length;
  const paidInvoices = invoices.filter(inv => inv.status === 'Paid').length;
  const pendingAmount = invoices
    .filter(inv => inv.status === 'Pending')
    .reduce((sum, inv) => sum + (parseFloat(inv.finalTotal) || 0), 0);

  // Get last 5 invoices
  const recentInvoices = [...invoices].slice(0, 5);

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <div className="flex flex-col md:flex-row justify-between items-end gap-4">
        <div>
          <h2 className="text-4xl font-black gold-text-gradient uppercase tracking-tighter">Business Overview</h2>
          <p className="text-gray-400 mt-1 font-medium">Real-time statistics for Surname Electricians</p>
        </div>

        {/* FOR SALE BANNER - ADMIN PANEL SPECIAL */}
        <div className="flex-1 max-w-xl w-full">
          <div className="bg-blue-600 rounded-3xl p-6 border-2 border-white/20 shadow-xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-2">
              <span className="bg-yellow-400 text-black text-[8px] font-black px-2 py-0.5 rounded-full uppercase">Developer Direct</span>
            </div>
            <div className="flex items-center justify-between gap-6">
              <div>
                <h3 className="text-2xl font-black text-white uppercase tracking-tighter">THIS SITE IS FOR SALE</h3>
                <p className="text-blue-100 text-[10px] font-bold uppercase tracking-widest mt-1">Full Ownership & Branding Transfer</p>
              </div>
              <div className="text-right">
                <p className="text-3xl font-black text-white">₹1,000</p>
                <a
                  href="https://www.instagram.com/krish_root_labs?igsh=YWczM2t3amUyZ3lp"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-yellow-400 text-xs font-black uppercase hover:underline"
                >
                  @krish_root_labs
                </a>
              </div>
            </div>
          </div>
        </div>

        <div className="flex gap-4">
          <button
            onClick={() => setShowPasswordChange(!showPasswordChange)}
            className="bg-white/5 border border-white/10 px-4 py-2 rounded-xl flex items-center gap-2 hover:bg-white/10 transition-all text-sm font-bold"
          >
            <Key size={18} className="text-yellow-500" />
            Security Settings
          </button>
          <div className="bg-yellow-500/10 border border-yellow-500/20 px-4 py-2 rounded-xl flex items-center gap-2">
             <TrendingUp className="text-yellow-500" size={20} />
             <span className="text-yellow-500 font-bold">Growth: +12% this month</span>
          </div>
        </div>
      </div>

      {showPasswordChange && (
        <div className="glass p-8 rounded-3xl border border-yellow-500/30 animate-in slide-in-from-top duration-500">
          <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
            <Key className="text-yellow-500" size={20} /> Change Admin Password
          </h3>
          <form onSubmit={handlePasswordChange} className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">Current Password</label>
              <input
                type="password"
                required
                className="w-full bg-black/40 border border-white/10 rounded-xl p-3 focus:border-yellow-500 outline-none"
                value={passwords.current}
                onChange={(e) => setPasswords({...passwords, current: e.target.value})}
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">New Password</label>
              <input
                type="password"
                required
                className="w-full bg-black/40 border border-white/10 rounded-xl p-3 focus:border-yellow-500 outline-none"
                value={passwords.new}
                onChange={(e) => setPasswords({...passwords, new: e.target.value})}
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">Confirm New Password</label>
              <div className="flex gap-2">
                <input
                  type="password"
                  required
                  className="w-full bg-black/40 border border-white/10 rounded-xl p-3 focus:border-yellow-500 outline-none"
                  value={passwords.confirm}
                  onChange={(e) => setPasswords({...passwords, confirm: e.target.value})}
                />
                <button type="submit" className="bg-yellow-500 text-black px-6 rounded-xl font-black hover:bg-yellow-600 transition-all">
                  UPDATE
                </button>
              </div>
            </div>
          </form>
          {msg.text && (
            <p className={`mt-4 text-sm font-bold ${msg.type === 'error' ? 'text-red-500' : 'text-green-500'}`}>
              {msg.text}
            </p>
          )}
        </div>
      )}

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          icon={<DollarSign className="text-green-500" />}
          label="Total Revenue"
          value={`₹${totalRevenue.toLocaleString()}`}
          color="bg-green-500/10"
        />
        <StatCard
          icon={<Users className="text-blue-500" />}
          label="Total Customers"
          value={totalInvoices}
          color="bg-blue-500/10"
        />
        <StatCard
          icon={<AlertCircle className="text-red-500" />}
          label="Pending Payment"
          value={`₹${pendingAmount.toLocaleString()}`}
          subValue={`${pendingInvoices} Bills`}
          color="bg-red-500/10"
        />
        <StatCard
          icon={<CheckCircle2 className="text-yellow-500" />}
          label="Paid Bills"
          value={paidInvoices}
          color="bg-yellow-500/10"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Pending Work Analysis */}
        <div className="glass rounded-3xl p-8 border border-white/5">
          <h3 className="text-xl font-bold mb-6 flex items-center gap-2 text-red-500">
            <AlertCircle size={20} /> Pending Work Details
          </h3>
          <div className="space-y-4">
            {invoices.filter(inv => inv.status === 'Pending').length > 0 ? (
              invoices
                .filter(inv => inv.status === 'Pending')
                .flatMap(inv => inv.items)
                .reduce((acc, item) => {
                  const existing = acc.find(a => a.name === item.name);
                  if (existing) existing.amount += parseFloat(item.amount);
                  else acc.push({ name: item.name, amount: parseFloat(item.amount) });
                  return acc;
                }, [])
                .slice(0, 5)
                .map((work, i) => (
                  <div key={i} className="flex justify-between items-center p-3 bg-white/5 rounded-xl border border-white/5">
                    <span className="text-sm font-medium text-gray-300">{work.name}</span>
                    <span className="text-sm font-black text-red-500">₹{work.amount}</span>
                  </div>
                ))
            ) : (
              <p className="text-gray-500 italic text-center py-4">All accounts are clear! 🎉</p>
            )}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="lg:col-span-2 glass rounded-3xl p-8 border border-white/5">
          <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
            <Clock className="text-yellow-500" size={20} /> Recent Invoices
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="text-gray-500 text-sm border-b border-gray-800">
                  <th className="pb-4 font-medium">Customer</th>
                  <th className="pb-4 font-medium">Date</th>
                  <th className="pb-4 font-medium">Amount</th>
                  <th className="pb-4 font-medium">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800">
                {recentInvoices.map((inv) => (
                  <tr key={inv.id} className="group hover:bg-white/5 transition-colors">
                    <td className="py-4 font-bold">{inv.customerName}</td>
                    <td className="py-4 text-gray-400">{inv.date}</td>
                    <td className="py-4 text-yellow-500 font-bold">₹{inv.finalTotal}</td>
                    <td className="py-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                        inv.status === 'Paid' ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'
                      }`}>
                        {inv.status}
                      </span>
                    </td>
                  </tr>
                ))}
                {recentInvoices.length === 0 && (
                  <tr>
                    <td colSpan="4" className="py-10 text-center text-gray-500 italic">No recent activity</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Quick Actions / Tips */}
        <div className="glass rounded-3xl p-8 border border-white/5 flex flex-col justify-between">
          <div>
            <h3 className="text-xl font-bold mb-6">Service Performance</h3>
            <div className="space-y-6">
              <PerformanceBar label="House Wiring" percentage={85} color="bg-yellow-500" />
              <PerformanceBar label="Appliance Repair" percentage={60} color="bg-blue-500" />
              <PerformanceBar label="Maintenance" percentage={40} color="bg-green-500" />
            </div>
          </div>
          <div className="mt-10 p-4 bg-yellow-500/5 rounded-2xl border border-yellow-500/10">
            <p className="text-sm text-yellow-500/80 italic font-medium">
              "Surname Electricians is growing! Keep up the professional service."
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

const StatCard = ({ icon, label, value, subValue, color }) => (
  <div className="glass p-6 rounded-3xl border border-white/5 hover:border-yellow-500/30 transition-all duration-300 group">
    <div className={`w-14 h-14 rounded-2xl ${color} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
      {React.cloneElement(icon, { size: 28 })}
    </div>
    <p className="text-gray-400 text-sm font-medium uppercase tracking-wider mb-1">{label}</p>
    <div className="flex items-baseline gap-2">
      <h4 className="text-3xl font-black text-white">{value}</h4>
      {subValue && <span className="text-xs text-gray-500 font-bold">{subValue}</span>}
    </div>
  </div>
);

const PerformanceBar = ({ label, percentage, color }) => (
  <div className="space-y-2">
    <div className="flex justify-between text-sm">
      <span className="text-gray-300 font-medium">{label}</span>
      <span className="text-gray-500 font-bold">{percentage}%</span>
    </div>
    <div className="w-full h-2 bg-gray-800 rounded-full overflow-hidden">
      <div
        className={`h-full ${color} rounded-full transition-all duration-1000`}
        style={{ width: `${percentage}%` }}
      ></div>
    </div>
  </div>
);

export default Dashboard;
