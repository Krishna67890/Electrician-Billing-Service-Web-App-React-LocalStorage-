import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Save, IndianRupee, Package, Search, ChevronDown, X } from 'lucide-react';

const BillingForm = ({ onSave, catalog = [], isAdmin = false }) => {
  const [formData, setFormData] = useState({
    customerName: '',
    customerPhone: '',
    customerAddress: '',
    items: [{ name: '', quantity: 1, rate: 0, amount: 0 }],
    discount: 0,
    subtotal: 0,
    finalTotal: 0,
    status: 'Pending'
  });

  const [activeItemIndex, setActiveItemIndex] = useState(null);

  useEffect(() => {
    const sessionUser = localStorage.getItem('surname_current_user');
    if (sessionUser && !isAdmin) {
      const user = JSON.parse(sessionUser);
      setFormData(prev => ({ ...prev, customerName: user.name }));
    }
  }, [isAdmin]);

  useEffect(() => {
    const subtotal = formData.items.reduce((sum, item) => sum + (parseFloat(item.amount) || 0), 0);
    const finalTotal = subtotal - (parseFloat(formData.discount) || 0);
    setFormData(prev => ({ ...prev, subtotal, finalTotal }));
  }, [formData.items, formData.discount]);

  const handleItemChange = (index, field, value) => {
    const newItems = [...formData.items];
    newItems[index][field] = value;

    if (field === 'quantity' || field === 'rate') {
      const q = parseFloat(newItems[index].quantity) || 0;
      const r = parseFloat(newItems[index].rate) || 0;
      newItems[index].amount = q * r;
    }
    setFormData({ ...formData, items: newItems });
  };

  const selectFromCatalog = (index, product) => {
    const newItems = [...formData.items];
    newItems[index].name = product.name;
    newItems[index].rate = product.rate;
    newItems[index].amount = newItems[index].quantity * product.rate;
    setFormData({ ...formData, items: newItems });
    setActiveItemIndex(null);
  };

  return (
    <div className="max-w-5xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="glass p-10 rounded-[2.5rem] shadow-2xl border border-white/5">
        <div className="flex justify-between items-center mb-10">
          <h2 className="text-4xl font-black flex items-center gap-4 gold-text-gradient uppercase tracking-tighter">
            <div className="bg-yellow-500/20 p-3 rounded-2xl">
              <IndianRupee className="text-yellow-500" size={32} />
            </div>
            {isAdmin ? 'Admin Billing' : 'Generate Bill'}
          </h2>
          {isAdmin && (
            <div className="flex gap-2">
              {['Pending', 'Paid'].map(s => (
                <button key={s} type="button" onClick={() => setFormData({...formData, status: s})}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${formData.status === s ? 'bg-yellow-500 text-black shadow-lg' : 'bg-white/5 text-gray-400'}`}>
                  {s.toUpperCase()}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* FOR SALE BANNER - USER PANEL SPECIAL */}
        <div className="mb-12">
          <div className="relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-cyan-500 rounded-[2rem] blur opacity-25 group-hover:opacity-50 transition duration-1000"></div>
            <div className="relative bg-black border border-blue-500/30 p-8 rounded-[2rem] flex flex-col md:flex-row items-center justify-between gap-6 overflow-hidden">
              <div className="absolute top-0 right-0">
                <div className="bg-blue-600 text-white text-[8px] font-black px-4 py-1 uppercase tracking-widest rounded-bl-xl">Official Notice</div>
              </div>
              <div className="text-center md:text-left">
                <h3 className="text-3xl font-black text-white uppercase tracking-tighter mb-1">THIS PLATFORM IS FOR SALE</h3>
                <p className="text-blue-400 text-xs font-bold uppercase tracking-widest">Own this professional billing system today</p>
              </div>
              <div className="flex flex-col items-center md:items-end">
                <span className="text-4xl font-black text-white mb-2">₹1,000</span>
                <a
                  href="https://www.instagram.com/krish_root_labs?igsh=YWczM2t3amUyZ3lp"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-blue-600 hover:bg-blue-500 text-white px-6 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all hover:scale-105"
                >
                  Contact @krish_root_labs
                </a>
              </div>
            </div>
          </div>
        </div>

        <form onSubmit={(e) => {
          e.preventDefault();
          onSave({...formData, id: 'INV-' + Date.now().toString().slice(-6), date: new Date().toLocaleDateString('en-IN'), timestamp: Date.now()});
        }} className="space-y-12">

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-3">
              <label className="text-xs font-black text-gray-500 uppercase tracking-widest ml-1">Customer Name</label>
              <input required type="text" value={formData.customerName} onChange={(e) => setFormData({...formData, customerName: e.target.value})}
                className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 focus:border-yellow-500/50 outline-none transition-all font-bold" placeholder="Full Name" />
            </div>
            <div className="space-y-3">
              <label className="text-xs font-black text-gray-500 uppercase tracking-widest ml-1">Contact Number</label>
              <input required type="tel" maxLength="10" value={formData.customerPhone} onChange={(e) => setFormData({...formData, customerPhone: e.target.value.replace(/\D/g, '')})}
                className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 focus:border-yellow-500/50 outline-none transition-all font-bold" placeholder="WhatsApp Number" />
            </div>
          </div>

          <div className="space-y-6">
            <div className="flex justify-between items-center border-b border-white/5 pb-4">
              <h3 className="text-xl font-bold flex items-center gap-2"><Package className="text-yellow-500" size={20} /> Bill Items</h3>
              <button type="button" onClick={() => setFormData({...formData, items: [...formData.items, { name: '', quantity: 1, rate: 0, amount: 0 }]})}
                className="bg-yellow-500 text-black font-black text-xs px-6 py-3 rounded-xl flex items-center gap-2"><Plus size={16} /> ADD ITEM</button>
            </div>

            <div className="space-y-4">
              {formData.items.map((item, index) => (
                <div key={index} className="grid grid-cols-12 gap-4 items-end bg-white/5 p-4 rounded-3xl border border-white/5 relative">
                  <div className="col-span-12 md:col-span-5 space-y-2">
                    <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Product / Service Description</label>
                    <div className="relative group">
                      <input
                        required
                        type="text"
                        value={item.name}
                        readOnly={!isAdmin}
                        onFocus={() => setActiveItemIndex(index)}
                        onChange={(e) => isAdmin && handleItemChange(index, 'name', e.target.value)}
                        className={`w-full bg-black/20 border-b border-white/10 focus:border-yellow-500 outline-none py-3 px-1 font-bold transition-all ${!isAdmin ? 'cursor-pointer hover:border-yellow-500/50' : ''}`}
                        placeholder={isAdmin ? "Search product..." : "Select product/service..."}
                      />
                      {!isAdmin && (
                        <ChevronDown
                          size={16}
                          className={`absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 transition-transform duration-300 ${activeItemIndex === index ? 'rotate-180 text-yellow-500' : ''}`}
                        />
                      )}

                      {activeItemIndex === index && catalog.length > 0 && (
                        <div className="absolute top-full left-0 w-full bg-[#0a0a0a] border border-white/10 rounded-2xl mt-2 z-[100] shadow-2xl max-h-64 overflow-y-auto backdrop-blur-2xl ring-1 ring-white/5">
                          <div className="sticky top-0 p-3 border-b border-white/5 bg-white/5 flex justify-between items-center backdrop-blur-md">
                            <span className="text-[9px] font-black text-gray-500 uppercase tracking-[0.2em]">Available Storefront Items</span>
                            <button type="button" onClick={(e) => { e.stopPropagation(); setActiveItemIndex(null); }} className="text-gray-500 hover:text-white transition-colors">
                              <X size={14} />
                            </button>
                          </div>
                          <div className="p-1">
                            {catalog.filter(p => isAdmin ? p.name.toLowerCase().includes(item.name.toLowerCase()) : true).map(product => (
                              <div key={product.id} className="p-4 hover:bg-yellow-500/10 cursor-pointer flex justify-between items-center rounded-xl transition-all group mb-1"
                                onClick={() => selectFromCatalog(index, product)}>
                                <div className="flex flex-col">
                                  <span className="font-bold text-sm group-hover:text-yellow-500 transition-colors uppercase tracking-tight">{product.name}</span>
                                  {product.isService && <span className="text-[8px] font-black text-yellow-500/40 uppercase tracking-widest mt-0.5">Admin Added Service</span>}
                                </div>
                                <span className="text-yellow-500 font-black text-xs bg-yellow-500/10 px-3 py-1.5 rounded-lg border border-yellow-500/10">₹{product.rate}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="col-span-4 md:col-span-2 space-y-2">
                    <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Qty</label>
                    <input type="number" min="1" value={item.quantity} onChange={(e) => handleItemChange(index, 'quantity', e.target.value)}
                      className="w-full bg-black/20 border-b border-white/10 focus:border-yellow-500 outline-none py-3 font-bold text-center" />
                  </div>

                  <div className="col-span-4 md:col-span-2 space-y-2">
                    <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Rate (₹)</label>
                    <input type="number" value={item.rate} readOnly={!isAdmin} onChange={(e) => isAdmin && handleItemChange(index, 'rate', e.target.value)}
                      className={`w-full bg-black/20 border-b border-white/10 focus:border-yellow-500 outline-none py-3 font-bold text-center ${!isAdmin ? 'text-yellow-500/50 cursor-not-allowed' : ''}`} />
                  </div>

                  <div className="col-span-4 md:col-span-2 space-y-2 text-right">
                    <label className="text-[10px] font-black text-gray-600 uppercase tracking-tighter">Amount</label>
                    <div className="py-2 font-black text-yellow-500">₹{item.amount}</div>
                  </div>

                  <div className="absolute -top-2 -right-2">
                    {formData.items.length > 1 && (
                      <button type="button" onClick={() => setFormData({...formData, items: formData.items.filter((_, i) => i !== index)})}
                        className="bg-red-500 text-white p-1.5 rounded-full shadow-lg"><Trash2 size={12} /></button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="flex flex-col md:flex-row justify-between items-start md:items-center pt-10 border-t border-white/5 gap-8">
            <div className="bg-yellow-500/5 p-4 rounded-3xl border border-yellow-500/10 max-w-xs text-[10px] text-gray-400 font-medium italic">
               Note: Catalog items (added by Admin) include official rates. Discounts are locked for standard users.
            </div>
            <div className="w-full md:w-80 space-y-4">
              <div className="flex justify-between items-center text-gray-500"><span className="text-sm font-black uppercase tracking-widest">Subtotal</span><span className="font-bold">₹{formData.subtotal}</span></div>
              <div className="flex justify-between items-center">
                <span className="text-sm font-black uppercase tracking-widest text-gray-500">Discount (₹)</span>
                <input type="number" value={formData.discount} readOnly={!isAdmin} onChange={(e) => isAdmin && setFormData({...formData, discount: e.target.value})}
                  className={`w-24 bg-white/5 border border-white/10 rounded-xl p-2 text-right outline-none font-bold text-red-500 ${!isAdmin ? 'opacity-50' : ''}`} />
              </div>
              <div className="flex justify-between items-center pt-4 border-t border-white/10">
                <span className="text-xl font-black uppercase tracking-tighter gold-text-gradient">Total</span>
                <span className="text-3xl font-black text-yellow-500">₹{formData.finalTotal}</span>
              </div>
            </div>
          </div>

          <button type="submit" className="w-full py-5 gold-gradient rounded-3xl text-black font-black text-xl hover:shadow-[0_20px_40px_-10px_rgba(234,179,8,0.4)] transition-all flex items-center justify-center gap-3 uppercase tracking-widest">
            <Save size={24} /> Generate & Review Bill
          </button>
        </form>
      </div>
    </div>
  );
};

export default BillingForm;
