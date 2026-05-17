import React, { useState, useEffect, useCallback } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Services from './components/Services';
import BillingForm from './components/BillingForm';
import SavedBills from './components/SavedBills';
import InvoicePreview from './components/InvoicePreview';
import Login from './components/Login';
import AdminServices from './components/AdminServices';
import Dashboard from './components/Dashboard';
import About from './components/About';
import { Phone, MapPin, ShieldCheck, LogOut, Volume2, VolumeX, Info, Trash2 } from 'lucide-react';

const DEFAULT_SERVICES = [
  {
    id: 1,
    title: "House Wiring",
    description: "Complete house wiring for new and old constructions with premium finishing.",
    price: "15000",
    image: "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&q=80&w=800"
  },
  {
    id: 2,
    title: "Smart Home Setup",
    description: "Installation of smart switches, Alexa integration, and automated lighting.",
    price: "5000",
    image: "https://images.unsplash.com/photo-1558002038-1055907df827?auto=format&fit=crop&q=80&w=800"
  },
  {
    id: 3,
    title: "Inverter & Meter Work",
    description: "New inverter installation and official meter shifting services.",
    price: "1200",
    image: "https://images.unsplash.com/photo-1581092160562-40aa08e78837?auto=format&fit=crop&q=80&w=800"
  }
];

const DEFAULT_PRODUCTS = [
  { id: 1, name: "Fan Fitting", rate: 250 },
  { id: 2, name: "LED Panel Light Fitting", rate: 150 },
  { id: 3, name: "Switch Board Repairing", rate: 200 },
  { id: 4, name: "Inverter Service", rate: 500 },
  { id: 5, name: "Main Meter Fitting", rate: 1200 },
  { id: 6, name: "Kitchen Chimney Cleaning", rate: 800 },
];

function App() {
  const [activeTab, setActiveTab] = useState('home');
  const [savedInvoices, setSavedInvoices] = useState([]);
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [services, setServices] = useState(DEFAULT_SERVICES);
  const [products, setProducts] = useState(DEFAULT_PRODUCTS);
  const [isAdmin, setIsAdmin] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [isVoiceEnabled, setIsVoiceEnabled] = useState(() => {
    return localStorage.getItem('mulani_voice_enabled') === 'true';
  });

  // --- Voice Utility (Moved to top to fix Initialization Error) ---
  const speak = useCallback((text) => {
    if (!isVoiceEnabled) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.9;
    utterance.pitch = 1;
    window.speechSynthesis.speak(utterance);
  }, [isVoiceEnabled]);

  // --- Core Effects ---
  useEffect(() => {
    localStorage.setItem('mulani_voice_enabled', isVoiceEnabled);
    if (isVoiceEnabled) {
      speak("Voice assistant is now active.");
    } else {
      window.speechSynthesis.cancel();
    }
  }, [isVoiceEnabled, speak]);

  useEffect(() => {
    // Load User Session
    const loggedInUser = localStorage.getItem('mulani_current_user');
    if (loggedInUser) {
      const user = JSON.parse(loggedInUser);
      setCurrentUser(user);
      setIsAdmin(user.role === 'admin');
    } else {
      setActiveTab('login');
    }

    // Load Data
    const storedInvoices = localStorage.getItem('electrician_invoices');
    if (storedInvoices) setSavedInvoices(JSON.parse(storedInvoices));

    const storedServices = localStorage.getItem('electrician_services');
    if (storedServices) setServices(JSON.parse(storedServices));
    else localStorage.setItem('electrician_services', JSON.stringify(DEFAULT_SERVICES));

    const storedProducts = localStorage.getItem('electrician_products');
    if (storedProducts) setProducts(JSON.parse(storedProducts));
    else localStorage.setItem('electrician_products', JSON.stringify(DEFAULT_PRODUCTS));

    if (!localStorage.getItem('admin_email')) {
      localStorage.setItem('admin_email', 'mh15sohail@gmail.com');
      localStorage.setItem('admin_password', '16301003');
    }
  }, []);

  useEffect(() => {
    if (isVoiceEnabled) {
      const messages = {
        home: "I am your assistant of this Mulani Electricians website. Welcome to our premium electrical services hub in Nashik.",
        billing: "Welcome to the Billing Section. I am here to help you generate professional invoices.",
        history: "You are now viewing the Records. Here you can track all your past invoices.",
        about: "Meet our expert team. Sohail Mulani, our founder, and Krishna Patil Rajput, our lead developer.",
        dashboard: "Admin Dashboard Access. Providing you with a high-level overview of your business performance.",
        admin: "Website Management Portal. Here you can update your service listings and product prices.",
        login: "Secure Access Portal. Please identify yourself to enter the Mulani Electricians management system."
      };
      speak(messages[activeTab] || "");
    }
  }, [activeTab, isVoiceEnabled, speak]);

  // --- Handlers ---
  const handleLogin = (user) => {
    setCurrentUser(user);
    setIsAdmin(user.role === 'admin');
    localStorage.setItem('mulani_current_user', JSON.stringify(user));
    setActiveTab('home');
    if (isVoiceEnabled) speak(`Welcome back ${user.name || 'User'}.`);
  };

  const handleLogout = () => {
    if (isVoiceEnabled) speak("Logging out. Thank you for using Mulani Electricians.");
    setCurrentUser(null);
    setIsAdmin(false);
    localStorage.removeItem('mulani_current_user');
    setActiveTab('login');
  };

  const updateServices = (newServices) => {
    setServices(newServices);
    localStorage.setItem('electrician_services', JSON.stringify(newServices));
  };

  const updateProducts = (newProducts) => {
    setProducts(newProducts);
    localStorage.setItem('electrician_products', JSON.stringify(newProducts));
  };

  const saveInvoice = (invoice) => {
    const invoiceWithUser = { ...invoice, userId: currentUser?.id || 'guest' };
    const updated = [invoiceWithUser, ...savedInvoices];
    setSavedInvoices(updated);
    localStorage.setItem('electrician_invoices', JSON.stringify(updated));
    setSelectedInvoice(invoiceWithUser);
    setActiveTab('preview');
    if (isVoiceEnabled) speak("Invoice saved successfully.");
  };

  const toggleInvoiceStatus = (id) => {
    const updated = savedInvoices.map(inv =>
      inv.id === id ? { ...inv, status: inv.status === 'Paid' ? 'Pending' : 'Paid' } : inv
    );
    setSavedInvoices(updated);
    localStorage.setItem('electrician_invoices', JSON.stringify(updated));
  };

  const deleteInvoice = (id) => {
    const updated = savedInvoices.filter(inv => inv.id !== id);
    setSavedInvoices(updated);
    localStorage.setItem('electrician_invoices', JSON.stringify(updated));
  };

  const updateInvoices = (newInvoices) => {
    setSavedInvoices(newInvoices);
    localStorage.setItem('electrician_invoices', JSON.stringify(newInvoices));
  };

  const viewInvoice = (invoice) => {
    setSelectedInvoice(invoice);
    setActiveTab('preview');
  };

  if (!currentUser) {
    return (
      <div className="min-h-screen flex flex-col selection:bg-yellow-500 selection:text-black">
        <header className="py-12 text-center">
           <div className="flex justify-center mb-4">
              <div className="bg-yellow-500 p-4 rounded-3xl rotate-3 shadow-2xl">
                <ShieldCheck className="text-black" size={40} strokeWidth={3} />
              </div>
           </div>
           <h1 className="text-5xl font-black gold-text-gradient tracking-tighter uppercase">Mulani Electricals</h1>
           <p className="text-gray-500 font-bold uppercase tracking-[0.3em] text-xs mt-2">Professional Business Portal</p>
        </header>
        <Login onLogin={handleLogin} />
        <footer className="mt-auto py-10 text-center text-gray-700 text-[10px] font-black uppercase tracking-[0.4em]">
          © {new Date().getFullYear()} Sohail Mulani | Secure Management System
        </footer>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col selection:bg-yellow-500 selection:text-black">
      {/* Voice Control Floating Button */}
      <button
        onClick={() => setIsVoiceEnabled(!isVoiceEnabled)}
        className={`fixed bottom-8 left-8 z-[60] p-4 rounded-2xl transition-all shadow-2xl flex items-center gap-2 group ${isVoiceEnabled ? 'bg-yellow-500 text-black scale-110' : 'bg-white/10 text-white backdrop-blur-xl'}`}
        title={isVoiceEnabled ? "Disable Voice Assistant" : "Enable Voice Assistant"}
      >
        {isVoiceEnabled ? <Volume2 size={24} /> : <VolumeX size={24} />}
        <span className="max-w-0 overflow-hidden group-hover:max-w-xs transition-all duration-500 text-xs font-black uppercase tracking-widest whitespace-nowrap">
          {isVoiceEnabled ? 'Voice On' : 'Voice Off'}
        </span>
      </button>

      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        isAdmin={isAdmin}
        currentUser={currentUser}
        onLogout={handleLogout}
      />

      <main className="flex-grow container mx-auto px-4 py-8">
        {activeTab === 'home' && (
          <>
            <Hero setActiveTab={setActiveTab} invoices={savedInvoices} currentUser={currentUser} />
            <Services services={services} />

            {/* Live Portfolio */}
            <section className="py-20 border-t border-white/5">
              <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
                <div>
                  <h2 className="text-4xl font-black uppercase tracking-tighter">
                    Recent <span className="gold-text-gradient">Project Success</span>
                  </h2>
                  <p className="text-gray-500 mt-2 font-medium">Real-time updates of recently completed works across Nashik</p>
                </div>
                <div className="bg-green-500/10 text-green-500 px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest border border-green-500/20 flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-green-500 animate-ping"></div>
                  Live Updates
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {savedInvoices.filter(inv => inv.status === 'Paid').slice(0, 4).map((inv, i) => (
                  <div key={i} className="glass p-6 rounded-3xl border border-white/5 hover:border-yellow-500/30 transition-all group relative">
                    <p className="text-[10px] font-black text-yellow-500 uppercase tracking-widest mb-2">Completed</p>
                    <h4 className="font-bold text-white group-hover:text-yellow-500 transition-colors truncate">
                      {inv.items[0]?.name || "Electrical Work"}
                    </h4>
                    <p className="text-gray-500 text-xs mt-1">{inv.date}</p>
                  </div>
                ))}
              </div>
            </section>

            <section className="mt-16 glass p-8 rounded-[2.5rem] text-center border-yellow-500/20 relative overflow-hidden group">
              <h2 className="text-3xl font-black mb-4 gold-text-gradient uppercase tracking-tighter">24/7 Emergency Service Available</h2>
              <div className="flex flex-wrap justify-center gap-6">
                <a href="tel:7498045041" className="bg-yellow-500 hover:bg-yellow-600 text-black font-black py-4 px-10 rounded-2xl transition-all flex items-center gap-3">
                  <Phone size={20} /> CALL SOHAIL
                </a>
              </div>
            </section>
          </>
        )}

        {activeTab === 'dashboard' && isAdmin && <Dashboard invoices={savedInvoices} />}
        {activeTab === 'billing' && <BillingForm onSave={saveInvoice} catalog={products} />}
        {activeTab === 'history' && (
          <SavedBills
            invoices={isAdmin ? savedInvoices : savedInvoices.filter(inv => inv.userId === currentUser?.id)}
            onView={viewInvoice}
            onToggleStatus={toggleInvoiceStatus}
            onDelete={deleteInvoice}
          />
        )}
        {activeTab === 'preview' && selectedInvoice && (
          <div className="max-w-4xl mx-auto">
             <button onClick={() => setActiveTab('history')} className="mb-6 text-yellow-500 hover:text-white flex items-center gap-2 font-bold transition-all">
              ← BACK TO HISTORY
            </button>
            <InvoicePreview invoice={selectedInvoice} onDelete={deleteInvoice} setActiveTab={setActiveTab} />
          </div>
        )}
        {activeTab === 'about' && <About />}
        {activeTab === 'login' && <Login onLogin={handleLogin} />}
        {activeTab === 'admin' && isAdmin && (
          <AdminServices
            services={services}
            onUpdate={updateServices}
            products={products}
            onUpdateProducts={updateProducts}
            invoices={savedInvoices}
            onUpdateInvoices={updateInvoices}
          />
        )}
      </main>

      <footer className="mt-auto py-12 border-t border-gray-900 bg-black/40 no-print backdrop-blur-sm">
        <div className="container mx-auto px-4 text-center">
          <h3 className="text-2xl font-black text-yellow-500 mb-2 tracking-tighter uppercase">Mulani Electricals</h3>
          <p className="text-gray-700 text-[10px] font-black uppercase tracking-[0.4em]">
            © {new Date().getFullYear()} Sohail Mulani | Developed for Premium Business Operations
          </p>
        </div>
      </footer>
    </div>
  );
}

export default App;
