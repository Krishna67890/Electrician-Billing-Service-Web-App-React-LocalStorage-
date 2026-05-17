import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Save, IndianRupee, Search, Package } from 'lucide-react';

const BillingForm = ({ onSave, catalog = [] }) => {
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

  const [searchTerm, setSearchTerm] = useState('');
  const [activeItemIndex, setActiveItemIndex] = useState(null);

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

  const addItem = () => {
    setFormData({
      ...formData,
      items: [...formData.items, { name: '', quantity: 1, rate: 0, amount: 0 }]
    });
  };

  const removeItem = (index) => {
    const newItems = formData.items.filter((_, i) => i !== index);
    setFormData({ ...formData, items: newItems });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const invoice = {
      ...formData,
      id: 'INV-' + Date.now().toString().slice(-6),
      date: new Date().toLocaleDateString('en-IN'),
      timestamp: Date.now()
    };
    onSave(invoice);
  };

  return (
    <div className="max-w-5xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="glass p-10 rounded-[2.5rem] shadow-2xl border border-white/5">
        <div className="flex justify-between items-center mb-10">
          <h2 className="text-4xl font-black flex items-center gap-4 gold-text-gradient uppercase tracking-tighter">
            <div className="bg-yellow-500/20 p-3 rounded-2xl">
              <IndianRupee className="text-yellow-500" size={32} />
            </div>
            Generate Invoice
          </h2>
          <div className="flex gap-2">
            {['Pending', 'Paid'].map(s => (
              <button
                key={s}
                type="button"
                onClick={() => setFormData({...formData, status: s})}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                  formData.status === s
                  ? 'bg-yellow-500 text-black shadow-[0_5px_15px_-5px_rgba(234,179,8,0.4)]'
                  : 'bg-white/5 text-gray-400 hover:bg-white/10'
                }`}
              >
                {s.toUpperCase()}
              </button>
            ))}
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-12">
          {/* Customer Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-3">
              <label className="text-xs font-black text-gray-500 uppercase tracking-widest ml-1">Customer Name</label>
              <input
                required
                type="text"
                value={formData.customerName}
                onChange={(e) => setFormData({...formData, customerName: e.target.value})}
                className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 focus:border-yellow-500/50 focus:ring-4 focus:ring-yellow-500/10 outline-none transition-all font-bold placeholder:text-gray-700"
                placeholder="Full Name"
              />
            </div>
            <div className="space-y-3">
              <label className="text-xs font-black text-gray-500 uppercase tracking-widest ml-1">Contact Number</label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 font-bold">+91</span>
                <input
                  required
                  type="tel"
                  maxLength="10"
                  value={formData.customerPhone}
                  onChange={(e) => setFormData({...formData, customerPhone: e.target.value.replace(/\D/g, '')})}
                  className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 pl-14 focus:border-yellow-500/50 focus:ring-4 focus:ring-yellow-500/10 outline-none transition-all font-bold placeholder:text-gray-700"
                  placeholder="00000 00000"
                />
              </div>
            </div>
            <div className="md:col-span-2 space-y-3">
              <label className="text-xs font-black text-gray-500 uppercase tracking-widest ml-1">Service Address</label>
              <textarea
                value={formData.customerAddress}
                onChange={(e) => setFormData({...formData, customerAddress: e.target.value})}
                className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 focus:border-yellow-500/50 focus:ring-4 focus:ring-yellow-500/10 outline-none transition-all font-bold h-24 placeholder:text-gray-700 resize-none"
                placeholder="Complete Address"
              ></textarea>
            </div>
          </div>

          {/* Items Table */}
          <div className="space-y-6">
            <div className="flex justify-between items-center border-b border-white/5 pb-4">
              <h3 className="text-xl font-bold flex items-center gap-2">
                <Package className="text-yellow-500" size={20} /> Bill Items
              </h3>
              <button
                type="button"
                onClick={addItem}
                className="bg-yellow-500 text-black font-black text-xs px-6 py-3 rounded-xl hover:scale-105 transition-all flex items-center gap-2"
              >
                <Plus size={16} /> ADD LINE
              </button>
            </div>

            <div className="space-y-4">
              {formData.items.map((item, index) => (
                <div key={index} className="grid grid-cols-12 gap-4 items-end bg-white/5 p-4 rounded-3xl border border-white/5 hover:border-white/10 transition-all relative">
                  <div className="col-span-12 md:col-span-5 space-y-2 relative">
                    <label className="text-[10px] font-black text-gray-600 uppercase tracking-tighter">Description</label>
                    <input
                      required
                      type="text"
                      value={item.name}
                      onFocus={() => setActiveItemIndex(index)}
                      onChange={(e) => handleItemChange(index, 'name', e.target.value)}
                      className="w-full bg-transparent border-b border-gray-800 focus:border-yellow-500 outline-none py-2 font-bold"
                      placeholder="Service/Product name"
                    />

                    {/* Catalog Dropdown */}
                    {activeItemIndex === index && catalog.length > 0 && (
                      <div className="absolute top-full left-0 w-full bg-surface border border-gray-800 rounded-2xl mt-2 z-50 shadow-2xl max-h-48 overflow-y-auto overflow-x-hidden">
                        {catalog.filter(p => p.name.toLowerCase().includes(item.name.toLowerCase())).map(product => (
                          <div
                            key={product.id}
                            className="p-3 hover:bg-white/10 cursor-pointer flex justify-between items-center border-b border-gray-800 last:border-0"
                            onClick={() => selectFromCatalog(index, product)}
                          >
                            <span className="font-bold text-sm">{product.name}</span>
                            <span className="text-yellow-500 text-xs font-black">₹{product.rate}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="col-span-4 md:col-span-2 space-y-2">
                    <label className="text-[10px] font-black text-gray-600 uppercase tracking-tighter">Qty</label>
                    <input
                      type="number"
                      value={item.quantity}
                      onChange={(e) => handleItemChange(index, 'quantity', e.target.value)}
                      className="w-full bg-transparent border-b border-gray-800 focus:border-yellow-500 outline-none py-2 font-bold text-center"
                    />
                  </div>

                  <div className="col-span-4 md:col-span-2 space-y-2">
                    <label className="text-[10px] font-black text-gray-600 uppercase tracking-tighter">Rate</label>
                    <input
                      type="number"
                      value={item.rate}
                      onChange={(e) => handleItemChange(index, 'rate', e.target.value)}
                      className="w-full bg-transparent border-b border-gray-800 focus:border-yellow-500 outline-none py-2 font-bold text-center"
                    />
                  </div>

                  <div className="col-span-4 md:col-span-2 space-y-2 text-right">
                    <label className="text-[10px] font-black text-gray-600 uppercase tracking-tighter">Amount</label>
                    <div className="py-2 font-black text-yellow-500">₹{item.amount}</div>
                  </div>

                  <div className="absolute -top-2 -right-2">
                    {formData.items.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeItem(index)}
                        className="bg-red-500 text-white p-1.5 rounded-full hover:scale-110 transition-all shadow-lg"
                      >
                        <Trash2 size={12} />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Totals Section */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center pt-10 border-t border-white/5 gap-8">
            <div className="flex items-center gap-4">
               <div className="bg-yellow-500/5 p-4 rounded-3xl border border-yellow-500/10 max-w-xs">
                 <p className="text-[10px] font-black text-yellow-500 uppercase tracking-widest mb-1">Quick Note</p>
                 <p className="text-xs text-gray-500 italic">Bill will be saved locally and can be shared via WhatsApp instantly.</p>
               </div>
            </div>

            <div className="w-full md:w-80 space-y-4">
              <div className="flex justify-between items-center text-gray-500">
                <span className="text-sm font-black uppercase tracking-widest">Subtotal</span>
                <span className="font-bold">₹{formData.subtotal}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm font-black uppercase tracking-widest text-gray-500">Discount (₹)</span>
                <input
                  type="number"
                  value={formData.discount}
                  onChange={(e) => setFormData({...formData, discount: e.target.value})}
                  className="w-24 bg-white/5 border border-white/10 rounded-xl p-2 text-right focus:border-yellow-500 outline-none font-bold text-red-500"
                />
              </div>
              <div className="flex justify-between items-center pt-4 border-t border-white/10">
                <span className="text-xl font-black uppercase tracking-tighter gold-text-gradient">Total</span>
                <span className="text-3xl font-black text-yellow-500">₹{formData.finalTotal}</span>
              </div>
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-5 gold-gradient rounded-3xl text-black font-black text-xl hover:shadow-[0_20px_40px_-10px_rgba(234,179,8,0.4)] transition-all flex items-center justify-center gap-3 uppercase tracking-widest hover:-translate-y-1 active:translate-y-0"
          >
            <Save size={24} /> Generate & Review Bill
          </button>
        </form>
      </div>
    </div>
  );
};

export default BillingForm;
