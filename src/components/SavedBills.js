import React, { useState } from 'react';
import { Eye, Search, Calendar, IndianRupee, Trash2, Filter, CheckCircle2, Clock, Download } from 'lucide-react';

const SavedBills = ({ invoices, onView, onToggleStatus, onDelete, isAdmin }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('All'); // All, Paid, Pending, Request

  const filteredInvoices = invoices.filter(inv => {
    const matchesSearch = inv.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         inv.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filter === 'All' || inv.status === filter;
    return matchesSearch && matchesFilter;
  });

  const getStatusColor = (status) => {
    switch (status) {
      case 'Paid': return 'bg-green-500/20 text-green-500';
      case 'Pending': return 'bg-red-500/20 text-red-500';
      case 'Request': return 'bg-blue-500/20 text-blue-500';
      default: return 'bg-gray-500/20 text-gray-500';
    }
  };

  return (
    <div className="max-w-6xl mx-auto animate-in fade-in duration-700">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-6">
        <div>
          <h2 className="text-4xl font-black gold-text-gradient uppercase tracking-tighter">Billing History</h2>
          <p className="text-gray-400 mt-1 font-medium">Manage and track your issued invoices</p>
          <div className="mt-4 inline-flex items-center gap-2 bg-blue-600/10 border border-blue-500/20 px-4 py-2 rounded-xl text-[9px] font-black text-blue-400 uppercase tracking-widest animate-pulse sale-glow">
            PLATFORM FOR SALE: ₹1,000 |
            <a href="https://www.instagram.com/krish_root_labs?igsh=YWczM2t3amUyZ3lp" target="_blank" rel="noopener noreferrer" className="text-white underline ml-1 hover:text-blue-300 transition-colors">
              DM @krish_root_labs TO BUY
            </a>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
          <div className="relative flex-grow">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
            <input
              type="text"
              placeholder="Search by name or ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full md:w-64 bg-surface border border-white/10 rounded-2xl py-3 pl-12 pr-4 focus:border-yellow-500/50 outline-none transition-all font-medium"
            />
          </div>

          <div className="flex bg-surface p-1 rounded-2xl border border-white/5 overflow-x-auto no-scrollbar">
            {['All', 'Paid', 'Pending', 'Request'].map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-4 py-2 rounded-xl text-[10px] font-black transition-all whitespace-nowrap ${
                  filter === f ? 'bg-yellow-500 text-black shadow-lg' : 'text-gray-500 hover:text-white'
                }`}
              >
                {f.toUpperCase()}
              </button>
            ))}
          </div>
        </div>
      </div>

      {filteredInvoices.length === 0 ? (
        <div className="text-center py-24 glass rounded-[3rem] border border-dashed border-white/10">
          <div className="bg-white/5 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
            <Filter className="text-gray-600" size={32} />
          </div>
          <h3 className="text-xl font-bold text-gray-400">No matching records found</h3>
          <p className="text-gray-500 mt-2">Try adjusting your search or filters.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredInvoices.map((invoice) => (
            <div
              key={invoice.id}
              className="glass p-8 rounded-[2.5rem] border border-white/5 hover:border-yellow-500/30 transition-all group relative overflow-hidden"
            >
              {/* Status Badge */}
              <div className={`absolute top-0 right-0 px-6 py-2 rounded-bl-3xl text-[10px] font-black uppercase tracking-widest ${getStatusColor(invoice.status)}`}>
                {invoice.status}
              </div>

              <div className="flex justify-between items-start mb-6">
                <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest bg-white/5 px-3 py-1 rounded-full">
                  {invoice.id}
                </span>
                <span className="text-gray-500 text-xs font-bold flex items-center gap-1.5">
                  <Calendar size={14} /> {invoice.date}
                </span>
              </div>

              <h3 className="text-2xl font-black mb-1 flex items-center gap-3 group-hover:text-yellow-500 transition-colors">
                 {invoice.customerName}
              </h3>
              <p className="text-gray-500 text-sm font-medium mb-4">{invoice.customerPhone}</p>

              {/* Work Details - Full Details View */}
              <div className="bg-black/30 rounded-2xl p-4 mb-6 space-y-2 border border-white/5">
                <p className="text-[10px] font-black text-gray-600 uppercase tracking-widest border-b border-white/5 pb-2 mb-2">Work Details</p>
                {invoice.items.map((item, idx) => (
                  <div key={idx} className="flex justify-between text-xs">
                    <span className="text-gray-400 font-medium truncate max-w-[150px]">{item.name}</span>
                    <span className="text-yellow-500/80 font-bold">x{item.quantity}</span>
                  </div>
                ))}
                <div className="pt-2 mt-2 border-t border-white/5 flex justify-between text-[10px] font-bold uppercase tracking-tighter">
                  <span className="text-gray-600">Subtotal: ₹{invoice.subtotal}</span>
                  <span className="text-red-500/70">Disc: -₹{invoice.discount}</span>
                </div>
              </div>

              <div className="flex justify-between items-end pt-6 border-t border-white/5">
                <div>
                  <p className="text-[10px] text-gray-500 font-black uppercase tracking-widest mb-1">Total Amount</p>
                  <p className="text-2xl font-black text-white flex items-center">
                    <IndianRupee size={20} className="text-yellow-500" /> {invoice.finalTotal}
                  </p>
                </div>

                <div className="flex gap-2">
                  {isAdmin && (
                    <button
                      onClick={(e) => { e.stopPropagation(); onToggleStatus(invoice.id); }}
                      title={
                        invoice.status === 'Request' ? "Approve Request" :
                        invoice.status === 'Pending' ? "Mark as Paid" : "Mark as Pending"
                      }
                      className={`p-3 rounded-2xl transition-all ${
                        invoice.status === 'Paid' ? 'bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white' :
                        invoice.status === 'Request' ? 'bg-blue-500/10 text-blue-500 hover:bg-blue-500 hover:text-white' :
                        'bg-green-500/10 text-green-500 hover:bg-green-500 hover:text-white'
                      }`}
                    >
                      {invoice.status === 'Paid' ? <Clock size={20} /> : <CheckCircle2 size={20} />}
                    </button>
                  )}
                  <button
                    onClick={(e) => { e.stopPropagation(); onView(invoice); }}
                    className="bg-yellow-500/10 p-3 rounded-2xl text-yellow-500 hover:bg-yellow-500 hover:text-black transition-all"
                  >
                    <Eye size={20} />
                  </button>
                  <button
                    onClick={(e) => { e.stopPropagation(); onView(invoice); }}
                    className="bg-blue-500/10 p-3 rounded-2xl text-blue-500 hover:bg-blue-500 hover:text-white transition-all"
                    title="Download/Print PDF"
                  >
                    <Download size={20} />
                  </button>
                  {(isAdmin || invoice.status === 'Paid') && (
                    <button
                      onClick={(e) => { e.stopPropagation(); if(window.confirm('Delete this bill?')) onDelete(invoice.id); }}
                      className="bg-red-500/10 p-3 rounded-2xl text-red-500 hover:bg-red-500 hover:text-white transition-all"
                    >
                      <Trash2 size={20} />
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SavedBills;
