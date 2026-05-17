import React, { useState, useRef } from 'react';
import { Plus, Trash2, Edit2, Check, X, Package, List, Download, Users, Upload, RefreshCw, AlertTriangle, DollarSign, CheckCircle2, AlertCircle } from 'lucide-react';

const AdminServices = ({ services, onUpdate, products, onUpdateProducts, invoices, onUpdateInvoices }) => {
  const [activeSubTab, setActiveSubTab] = useState('services'); // 'services', 'products', 'customers', 'finance', 'data'
  const fileInputRef = useRef(null);
  const [backupStatus, setBackupStatus] = useState(null);

  // Service State
  const [newService, setNewService] = useState({ title: '', description: '', price: '', image: '', features: '' });
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({ title: '', description: '', price: '', image: '', features: '' });

  // Product State
  const [newProduct, setNewProduct] = useState({ name: '', rate: 0 });
  const [editingProdId, setEditingProdId] = useState(null);
  const [editProdForm, setEditProdForm] = useState({ name: '', rate: 0 });

  // Export Logic
  const exportToCSV = () => {
    if (invoices.length === 0) return;
    const headers = ['Invoice ID', 'Date', 'Customer Name', 'Phone', 'Amount', 'Status'];
    const rows = invoices.map(inv => [
      inv.id, inv.date, inv.customerName, `"${inv.customerPhone}"`, inv.finalTotal, inv.status
    ]);

    let csvContent = "data:text/csv;charset=utf-8,"
      + headers.join(",") + "\n"
      + rows.map(e => e.join(",")).join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `mulani_electricals_report_${new Date().toLocaleDateString()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleAddService = (e) => {
    e.preventDefault();
    if (!newService.title) return;
    onUpdate([...services, { ...newService, id: Date.now() }]);
    setNewService({ title: '', description: '', price: '', image: '', features: '' });
  };

  const handleImageUpload = (e, isEditing = false) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert("Image too large. Please select a file under 5MB.");
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        const img = new Image();
        img.src = reader.result;
        img.onload = () => {
          const canvas = document.createElement('canvas');
          let width = img.width;
          let height = img.height;

          // Max dimensions for storefront images
          const MAX_WIDTH = 800;
          const MAX_HEIGHT = 600;

          if (width > height) {
            if (width > MAX_WIDTH) {
              height *= MAX_WIDTH / width;
              width = MAX_WIDTH;
            }
          } else {
            if (height > MAX_HEIGHT) {
              width *= MAX_HEIGHT / height;
              height = MAX_HEIGHT;
            }
          }

          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          ctx.drawImage(img, 0, 0, width, height);

          // Compress to JPEG with 0.7 quality
          const compressedBase64 = canvas.toDataURL('image/jpeg', 0.7);

          if (isEditing) {
            setEditForm({ ...editForm, image: compressedBase64 });
          } else {
            setNewService({ ...newService, image: compressedBase64 });
          }
        };
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddProduct = (e) => {
    e.preventDefault();
    if (!newProduct.name) return;
    onUpdateProducts([...products, { ...newProduct, id: Date.now() }]);
    setNewProduct({ name: '', rate: 0 });
  };

  // Group invoices by customer for 'Customers' tab
  const customerStats = invoices.reduce((acc, inv) => {
    const key = inv.customerPhone;
    if (!acc[key]) {
      acc[key] = { name: inv.customerName, phone: inv.customerPhone, totalBills: 0, totalAmount: 0 };
    }
    acc[key].totalBills += 1;
    acc[key].totalAmount += parseFloat(inv.finalTotal);
    return acc;
  }, {});

  return (
    <div className="max-w-6xl mx-auto py-10 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-6">
        <div>
          <h2 className="text-4xl font-black gold-text-gradient uppercase tracking-tighter">Business Control Center</h2>
          <p className="text-gray-400 mt-1 font-medium">Manage website content, pricing, and customer data</p>
        </div>
        <button
          onClick={exportToCSV}
          className="bg-yellow-500 hover:bg-yellow-600 text-black px-6 py-3 rounded-2xl transition-all flex items-center gap-2 font-black text-xs uppercase tracking-widest shadow-lg shadow-yellow-500/20"
        >
          <Download size={18} /> Export Sales Report
        </button>
      </div>

      {/* Admin Tabs */}
      <div className="flex flex-wrap gap-4 mb-8">
        {[
          { id: 'services', label: 'Storefront Items', icon: <List size={16} /> },
          { id: 'products', label: 'Billing Price List', icon: <Package size={16} /> },
          { id: 'customers', label: 'Customer Base', icon: <Users size={16} /> },
          { id: 'finance', label: 'Finance & Payments', icon: <DollarSign size={16} /> },
          { id: 'data', label: 'Data & Backup', icon: <RefreshCw size={16} /> }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveSubTab(tab.id)}
            className={`flex items-center gap-2 px-6 py-4 rounded-2xl font-black text-xs uppercase tracking-widest transition-all ${activeSubTab === tab.id ? 'bg-yellow-500 text-black shadow-lg shadow-yellow-500/20' : 'bg-white/5 text-gray-500 hover:text-white border border-white/5'}`}
          >
            {tab.icon} {tab.label}
          </button>
        ))}
      </div>

      {activeSubTab === 'services' && (
        <div className="space-y-8">
          <div className="glass p-8 rounded-[2.5rem] border border-white/5">
            <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
              <Plus className="text-yellow-500" /> Add Product/Service to Website
            </h3>
            <form onSubmit={handleAddService} className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Service Title</label>
                <input
                  type="text"
                  placeholder="e.g. Smart Home Automation"
                  className="w-full bg-black/30 border border-white/10 rounded-xl p-4 focus:border-yellow-500 outline-none transition font-bold"
                  value={newService.title}
                  onChange={(e) => setNewService({...newService, title: e.target.value})}
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Starting Price (₹)</label>
                <input
                  type="text"
                  placeholder="e.g. 500"
                  className="w-full bg-black/30 border border-white/10 rounded-xl p-4 focus:border-yellow-500 outline-none transition font-bold"
                  value={newService.price}
                  onChange={(e) => setNewService({...newService, price: e.target.value})}
                />
              </div>
              <div className="md:col-span-2 space-y-2">
                <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Service Image</label>
                <div className="flex flex-col md:flex-row gap-4 items-center">
                  <div className="w-full md:w-1/2">
                    <input
                      type="text"
                      placeholder="Paste Image URL..."
                      className="w-full bg-black/30 border border-white/10 rounded-xl p-4 focus:border-yellow-500 outline-none transition font-bold"
                      value={newService.image}
                      onChange={(e) => setNewService({...newService, image: e.target.value})}
                    />
                  </div>
                  <div className="text-gray-600 font-black text-[10px] uppercase">OR</div>
                  <div className="w-full md:w-1/2">
                    <label className="w-full bg-yellow-500/10 hover:bg-yellow-500/20 border border-dashed border-yellow-500/30 rounded-xl p-4 flex items-center justify-center gap-2 cursor-pointer transition-all">
                      <Upload size={18} className="text-yellow-500" />
                      <span className="text-yellow-500 font-bold text-sm">Upload from Device</span>
                      <input
                        type="file"
                        className="hidden"
                        accept="image/*"
                        onChange={(e) => handleImageUpload(e)}
                      />
                    </label>
                  </div>
                </div>
                {newService.image && (
                  <div className="mt-4 relative w-32 h-20 rounded-xl overflow-hidden border border-yellow-500/30">
                    <img src={newService.image} alt="Preview" className="w-full h-full object-cover" />
                    <button
                      type="button"
                      onClick={() => setNewService({...newService, image: ''})}
                      className="absolute top-1 right-1 bg-black/60 text-white p-1 rounded-full hover:bg-red-500 transition-colors"
                    >
                      <X size={12} />
                    </button>
                  </div>
                )}
              </div>
              <div className="md:col-span-2 space-y-2">
                <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Description</label>
                <textarea
                  placeholder="Brief explanation of service"
                  className="w-full bg-black/30 border border-white/10 rounded-xl p-4 focus:border-yellow-500 outline-none transition font-bold h-24"
                  value={newService.description}
                  onChange={(e) => setNewService({...newService, description: e.target.value})}
                />
              </div>
              <div className="md:col-span-2 space-y-2">
                <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Key Features (One per line)</label>
                <textarea
                  placeholder="• 2 Years Warranty&#10;• Original Parts&#10;• Same Day Service"
                  className="w-full bg-black/30 border border-white/10 rounded-xl p-4 focus:border-yellow-500 outline-none transition font-bold h-32"
                  value={newService.features}
                  onChange={(e) => setNewService({...newService, features: e.target.value})}
                />
              </div>
              <button type="submit" className="md:col-span-2 gold-gradient text-black font-black py-4 rounded-xl flex items-center justify-center gap-2 uppercase tracking-widest hover:scale-[1.01] transition-transform">
                <Check size={20} /> Publish to Home Page
              </button>
            </form>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((service) => (
              <div key={service.id} className="glass rounded-3xl flex flex-col justify-between border border-white/5 group hover:border-yellow-500/30 transition-all overflow-hidden">
                {editingId === service.id ? (
                  <div className="p-6 space-y-3">
                    <input
                      className="w-full bg-black/50 border border-yellow-500 rounded-lg p-3 font-bold text-sm"
                      value={editForm.title}
                      onChange={(e) => setEditForm({...editForm, title: e.target.value})}
                      placeholder="Title"
                    />
                    <input
                      className="w-full bg-black/50 border border-yellow-500 rounded-lg p-3 font-bold text-sm"
                      value={editForm.price}
                      onChange={(e) => setEditForm({...editForm, price: e.target.value})}
                      placeholder="Price"
                    />

                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-gray-500 uppercase">Change Image</label>
                      <div className="flex gap-2">
                        <input
                          className="flex-grow bg-black/50 border border-yellow-500 rounded-lg p-2 text-xs"
                          value={editForm.image}
                          onChange={(e) => setEditForm({...editForm, image: e.target.value})}
                          placeholder="Image URL"
                        />
                        <label className="bg-yellow-500 text-black p-2 rounded-lg cursor-pointer">
                          <Upload size={16} />
                          <input type="file" className="hidden" accept="image/*" onChange={(e) => handleImageUpload(e, true)} />
                        </label>
                      </div>
                    </div>

                    <textarea
                      className="w-full bg-black/50 border border-yellow-500 rounded-lg p-3 text-xs h-20"
                      value={editForm.description}
                      onChange={(e) => setEditForm({...editForm, description: e.target.value})}
                      placeholder="Description"
                    />
                    <textarea
                      className="w-full bg-black/50 border border-yellow-500 rounded-lg p-3 text-xs h-24"
                      value={editForm.features}
                      onChange={(e) => setEditForm({...editForm, features: e.target.value})}
                      placeholder="Features (One per line)"
                    />
                  </div>
                ) : (
                  <>
                    {service.image && (
                      <div className="h-40 overflow-hidden">
                        <img src={service.image} alt={service.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                      </div>
                    )}
                    <div className="p-6">
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="font-bold text-lg group-hover:text-yellow-500 transition-colors">{service.title}</h4>
                        {service.price && <span className="text-yellow-500 font-black">₹{service.price}</span>}
                      </div>
                      <p className="text-gray-500 text-sm leading-relaxed line-clamp-2">{service.description || 'Professional service.'}</p>
                    </div>
                  </>
                )}

                <div className="px-6 pb-6 flex gap-2 pt-4 border-t border-white/5">
                  {editingId === service.id ? (
                    <>
                      <button onClick={() => {
                        onUpdate(services.map(s => s.id === service.id ? { ...s, ...editForm } : s));
                        setEditingId(null);
                      }} className="flex-1 bg-green-500/20 text-green-500 py-2 rounded-xl font-bold flex items-center justify-center gap-1"><Check size={18} /> Save</button>
                      <button onClick={() => setEditingId(null)} className="flex-1 bg-white/5 text-gray-500 py-2 rounded-xl font-bold flex items-center justify-center gap-1"><X size={18} /> Cancel</button>
                    </>
                  ) : (
                    <>
                      <button onClick={() => {
                        setEditingId(service.id);
                        setEditForm({
                          title: service.title,
                          description: service.description,
                          price: service.price || '',
                          image: service.image || '',
                          features: service.features || ''
                        });
                      }} className="flex-1 bg-white/5 text-gray-400 hover:text-yellow-500 hover:bg-yellow-500/10 py-2 rounded-xl font-bold flex items-center justify-center gap-1 transition-all"><Edit2 size={16} /> Edit</button>
                      <button onClick={() => onUpdate(services.filter(s => s.id !== service.id))} className="bg-red-500/10 text-red-500 p-2 rounded-xl hover:bg-red-500 hover:text-white transition-all"><Trash2 size={18} /></button>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeSubTab === 'products' && (
        <div className="space-y-8">
          <div className="glass p-8 rounded-[2.5rem] border border-white/5">
            <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
              <Package className="text-yellow-500" /> Add Product to Billing Catalog
            </h3>
            <form onSubmit={handleAddProduct} className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Work Description</label>
                <input
                  type="text"
                  placeholder="e.g. 1.5 Sqmm Wire Point"
                  className="w-full bg-black/30 border border-white/10 rounded-xl p-4 focus:border-yellow-500 outline-none transition font-bold"
                  value={newProduct.name}
                  onChange={(e) => setNewProduct({...newProduct, name: e.target.value})}
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Rate (₹)</label>
                <input
                  type="number"
                  placeholder="0"
                  className="w-full bg-black/30 border border-white/10 rounded-xl p-4 focus:border-yellow-500 outline-none transition font-bold"
                  value={newProduct.rate}
                  onChange={(e) => setNewProduct({...newProduct, rate: e.target.value})}
                  required
                />
              </div>
              <button type="submit" className="md:col-span-2 gold-gradient text-black font-black py-4 rounded-xl flex items-center justify-center gap-2 uppercase tracking-widest hover:scale-[1.01] transition-transform">
                <Plus size={20} /> Add to Price List
              </button>
            </form>
          </div>

          <div className="overflow-hidden glass rounded-[2rem] border border-white/5">
            <table className="w-full text-left">
              <thead className="bg-white/5 text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 border-b border-white/5">
                <tr>
                  <th className="p-6">Work / Product Details</th>
                  <th className="p-6">Standard Rate</th>
                  <th className="p-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {products.map((product) => (
                  <tr key={product.id} className="group hover:bg-white/5 transition-colors">
                    <td className="p-6">
                      {editingProdId === product.id ? (
                        <input
                          className="w-full bg-black/50 border border-yellow-500 rounded-lg p-2 font-bold"
                          value={editProdForm.name}
                          onChange={(e) => setEditProdForm({...editProdForm, name: e.target.value})}
                        />
                      ) : (
                        <span className="font-bold group-hover:text-yellow-500 transition-colors">{product.name}</span>
                      )}
                    </td>
                    <td className="p-6">
                      {editingProdId === product.id ? (
                        <input
                          type="number"
                          className="bg-black/50 border border-yellow-500 rounded-lg p-2 w-32 font-bold"
                          value={editProdForm.rate}
                          onChange={(e) => setEditProdForm({...editProdForm, rate: e.target.value})}
                        />
                      ) : (
                        <span className="font-black text-yellow-500 text-lg">₹{product.rate}</span>
                      )}
                    </td>
                    <td className="p-6 text-right">
                      <div className="flex justify-end gap-2">
                        {editingProdId === product.id ? (
                          <button onClick={() => {
                            onUpdateProducts(products.map(p => p.id === product.id ? { ...p, ...editProdForm } : p));
                            setEditingProdId(null);
                          }} className="p-2 text-green-500 hover:bg-green-500/10 rounded-xl transition-colors"><Check size={20} /></button>
                        ) : (
                          <button onClick={() => {
                            setEditingProdId(product.id);
                            setEditProdForm({ name: product.name, rate: product.rate });
                          }} className="p-2 text-gray-500 hover:text-yellow-500 transition-colors"><Edit2 size={20} /></button>
                        )}
                        <button onClick={() => onUpdateProducts(products.filter(p => p.id !== product.id))} className="p-2 text-gray-500 hover:text-red-500 transition-colors"><Trash2 size={20} /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeSubTab === 'customers' && (
        <div className="space-y-8">
           <div className="overflow-hidden glass rounded-[2.5rem] border border-white/5">
            <table className="w-full text-left">
              <thead className="bg-white/5 text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 border-b border-white/5">
                <tr>
                  <th className="p-6">Customer Identity</th>
                  <th className="p-6">Contact Number</th>
                  <th className="p-6 text-center">Invoices</th>
                  <th className="p-6 text-right">Total Revenue</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {Object.values(customerStats).sort((a,b) => b.totalAmount - a.totalAmount).map((customer, idx) => (
                  <tr key={idx} className="group hover:bg-white/5 transition-colors">
                    <td className="p-6">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-yellow-500/10 flex items-center justify-center font-black text-yellow-500">
                          {customer.name.charAt(0)}
                        </div>
                        <span className="font-bold text-lg">{customer.name}</span>
                      </div>
                    </td>
                    <td className="p-6 font-medium text-gray-400">{customer.phone}</td>
                    <td className="p-6 text-center">
                      <span className="px-3 py-1 bg-white/5 rounded-full font-black text-xs text-yellow-500">{customer.totalBills} Bills</span>
                    </td>
                    <td className="p-6 text-right font-black text-xl text-white">₹{customer.totalAmount.toLocaleString()}</td>
                  </tr>
                ))}
                {Object.keys(customerStats).length === 0 && (
                  <tr>
                    <td colSpan="4" className="p-20 text-center text-gray-500 italic">No customer data available.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

        {activeSubTab === 'finance' && (
          <div className="space-y-8 animate-in slide-in-from-right duration-500">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="glass p-8 rounded-3xl border-l-4 border-green-500">
                <h3 className="text-xl font-black mb-4 flex items-center gap-2">
                  <CheckCircle2 className="text-green-500" /> Collected Payments
                </h3>
                <div className="text-4xl font-black text-white">
                  ₹{invoices.filter(inv => inv.status === 'Paid').reduce((sum, inv) => sum + (parseFloat(inv.finalTotal) || 0), 0).toLocaleString()}
                </div>
                <p className="text-gray-500 text-sm mt-2 font-bold uppercase tracking-widest">Total Cash in Hand</p>
              </div>

              <div className="glass p-8 rounded-3xl border-l-4 border-red-500">
                <h3 className="text-xl font-black mb-4 flex items-center gap-2">
                  <AlertCircle className="text-red-500" /> Outstanding Dues
                </h3>
                <div className="text-4xl font-black text-white">
                  ₹{invoices.filter(inv => inv.status === 'Pending').reduce((sum, inv) => sum + (parseFloat(inv.finalTotal) || 0), 0).toLocaleString()}
                </div>
                <p className="text-gray-500 text-sm mt-2 font-bold uppercase tracking-widest">Awaiting Collection</p>
              </div>
            </div>

            <div className="glass p-8 rounded-3xl border border-white/5">
              <h3 className="text-xl font-black mb-6">Payment Collection Analysis</h3>
              <div className="space-y-4">
                 {invoices.filter(inv => inv.status === 'Pending').length > 0 ? (
                   invoices.filter(inv => inv.status === 'Pending').map((inv, i) => (
                     <div key={i} className="flex justify-between items-center p-4 bg-white/5 rounded-2xl border border-white/5">
                        <div>
                          <p className="font-bold text-white">{inv.customerName}</p>
                          <p className="text-xs text-gray-500">{inv.date} • {inv.items.length} Items</p>
                        </div>
                        <div className="text-right flex flex-col items-end">
                          <p className="font-black text-red-500">₹{inv.finalTotal}</p>
                          <a href={`tel:${inv.customerPhone}`} className="text-[10px] font-black uppercase text-yellow-500 hover:underline">Call & Remind</a>
                        </div>
                     </div>
                   ))
                 ) : (
                   <div className="text-center py-12 border-2 border-dashed border-white/5 rounded-3xl">
                      <p className="text-gray-500 font-bold uppercase tracking-widest text-xs">No pending payments. Excellent work! 🎉</p>
                   </div>
                 )}
              </div>
            </div>
          </div>
        )}

      {activeSubTab === 'data' && (
        <div className="space-y-8">
          <div className="glass p-8 rounded-[2.5rem] border border-white/5">
            <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
              <RefreshCw className="text-yellow-500" /> Data Management & Backup
            </h3>
            <p className="text-gray-400 mb-8 text-sm">
              All your data (invoices, products, and services) is stored locally in your browser. Use these tools to back up your data or restore it on a different device.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-4">
                <h4 className="font-black text-xs uppercase tracking-widest text-gray-500">Backup Data</h4>
                <button
                  onClick={() => {
                    const data = {
                      invoices,
                      products,
                      services,
                      version: '1.0',
                      exportDate: new Date().toISOString()
                    };
                    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
                    const url = URL.createObjectURL(blob);
                    const link = document.createElement('a');
                    link.href = url;
                    link.download = `mulani_electricals_backup_${new Date().toISOString().split('T')[0]}.json`;
                    link.click();
                    URL.revokeObjectURL(url);
                  }}
                  className="w-full bg-white/5 hover:bg-white/10 border border-white/10 text-white font-black py-4 rounded-xl flex items-center justify-center gap-2 uppercase tracking-widest transition-all"
                >
                  <Download size={20} /> Download JSON Backup
                </button>
                <p className="text-[10px] text-gray-600 italic">Recommended: Back up your data once a week.</p>
              </div>

              <div className="space-y-4">
                <h4 className="font-black text-xs uppercase tracking-widest text-gray-500">Restore Data</h4>
                <input
                  type="file"
                  ref={fileInputRef}
                  className="hidden"
                  accept=".json"
                  onChange={(e) => {
                    const file = e.target.files[0];
                    if (!file) return;

                    const reader = new FileReader();
                    reader.onload = (event) => {
                      try {
                        const data = JSON.parse(event.target.result);
                        if (data.invoices && data.products && data.services) {
                          if (window.confirm("This will overwrite all current data. Are you sure you want to proceed?")) {
                            onUpdateInvoices(data.invoices);
                            onUpdateProducts(data.products);
                            onUpdate(data.services);
                            setBackupStatus({ type: 'success', message: 'Data restored successfully!' });
                          }
                        } else {
                          setBackupStatus({ type: 'error', message: 'Invalid backup file format.' });
                        }
                      } catch (err) {
                        setBackupStatus({ type: 'error', message: 'Error parsing backup file.' });
                      }
                    };
                    reader.readAsText(file);
                  }}
                />
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full bg-yellow-500/10 hover:bg-yellow-500/20 border border-yellow-500/30 text-yellow-500 font-black py-4 rounded-xl flex items-center justify-center gap-2 uppercase tracking-widest transition-all"
                >
                  <Upload size={20} /> Upload Backup File
                </button>
                <p className="text-[10px] text-red-500/70 italic flex items-center gap-1">
                  <AlertTriangle size={10} /> Warning: Restoring will overwrite existing data.
                </p>
              </div>
            </div>

            {backupStatus && (
              <div className={`mt-8 p-4 rounded-xl font-bold text-center ${backupStatus.type === 'success' ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'}`}>
                {backupStatus.message}
                <button onClick={() => setBackupStatus(null)} className="ml-4 text-xs underline">Dismiss</button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminServices;
