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
import { DEFAULT_SERVICES, DEFAULT_PRODUCTS } from './constants';
import { Phone, Volume2, VolumeX, ShieldCheck, Zap } from 'lucide-react';

// Define Logo Utility outside the component to ensure it's always ready
const BrandLogo = ({ size = 40, className = "" }) => (
  <div className={`relative ${className}`}>
    <div className="w-full h-full bg-yellow-500 rounded-2xl flex items-center justify-center shadow-xl overflow-hidden">
      <img
        src="/website%20logo.jpeg"
        alt="Logo"
        className="w-full h-full object-cover"
        onError={(e) => {
          e.target.style.display='none';
          if(e.target.nextSibling) e.target.nextSibling.style.display='block';
        }}
      />
      <Zap className="text-black hidden" size={size * 0.6} fill="currentColor" />
    </div>
  </div>
);

function App() {
  const [activeTab, setActiveTab] = useState('home');
  const [savedInvoices, setSavedInvoices] = useState([]);
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [services, setServices] = useState(DEFAULT_SERVICES);
  const [products, setProducts] = useState(DEFAULT_PRODUCTS);
  const [isAdmin, setIsAdmin] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [isVoiceEnabled, setIsVoiceEnabled] = useState(() => {
    try {
      return localStorage.getItem('surname_voice_enabled') === 'true';
    } catch { return false; }
  });

  // --- Voice Assistant Core ---
  const speak = useCallback((text) => {
    if (!isVoiceEnabled || !text || !window.speechSynthesis) return;
    try {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.9;
      utterance.pitch = 1;
      window.speechSynthesis.speak(utterance);
    } catch (e) {
      console.warn("Voice suppressed");
    }
  }, [isVoiceEnabled]);

  // --- Authentication & Session Management ---
  useEffect(() => {
    const sessionUser = localStorage.getItem('surname_current_user');
    if (sessionUser) {
      const parsed = JSON.parse(sessionUser);
      setCurrentUser(parsed);
      setIsAdmin(parsed.role === 'admin');
    } else {
      setActiveTab('login');
    }

    // Load Data
    const storedInvoices = localStorage.getItem('electrician_invoices');
    if (storedInvoices) setSavedInvoices(JSON.parse(storedInvoices));

    const storedServices = localStorage.getItem('electrician_services');
    if (storedServices) setServices(JSON.parse(storedServices));

    const storedProducts = localStorage.getItem('electrician_products');
    if (storedProducts) setProducts(JSON.parse(storedProducts));
  }, []);

  // --- Voice State Persistence ---
  useEffect(() => {
    localStorage.setItem('surname_voice_enabled', isVoiceEnabled);
  }, [isVoiceEnabled]);

  // --- Tab Voice Logic ---
  useEffect(() => {
    if (isVoiceEnabled && currentUser && activeTab !== 'login') {
      const guidance = {
        home: "Welcome to Surname Electricians Dashboard.",
        billing: "Generate a new invoice now.",
        history: "Reviewing your transaction records.",
        admin: "Website controls active.",
        about: "The story of Surname Electricians."
      };
      speak(guidance[activeTab] || "");
    }
  }, [activeTab, isVoiceEnabled, currentUser, speak]);

  const handleLogin = (user) => {
    setCurrentUser(user);
    setIsAdmin(user.role === 'admin');
    localStorage.setItem('surname_current_user', JSON.stringify(user));
    setActiveTab('home');
    if (isVoiceEnabled) speak(`Welcome ${user.name}`);
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setIsAdmin(false);
    localStorage.removeItem('surname_current_user');
    setActiveTab('login');
  };

  if (!currentUser) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-black">
        <div className="mb-10 text-center animate-in fade-in zoom-in duration-700">
          <BrandLogo size={60} className="w-24 h-24 mx-auto mb-6 rotate-3" />
          <h1 className="text-4xl font-black gold-text-gradient uppercase tracking-tighter">Surname Electricians</h1>
          <p className="text-gray-500 text-[10px] font-black uppercase tracking-[0.3em] mt-2 italic">Secure Business Portal</p>
        </div>
        <Login onLogin={handleLogin} />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-black text-white selection:bg-yellow-500 selection:text-black">
      {/* Floating Voice Toggle */}
      <button
        onClick={() => setIsVoiceEnabled(!isVoiceEnabled)}
        className={`fixed bottom-8 left-8 z-[60] p-4 rounded-2xl shadow-2xl transition-all border border-white/10 ${isVoiceEnabled ? 'bg-yellow-500 text-black' : 'bg-white/5 text-white backdrop-blur-xl'}`}
      >
        {isVoiceEnabled ? <Volume2 size={24} /> : <VolumeX size={24} />}
      </button>

      <Navbar activeTab={activeTab} setActiveTab={setActiveTab} isAdmin={isAdmin} currentUser={currentUser} onLogout={handleLogout} />

      <main className="flex-grow container mx-auto px-4 py-8">
        {activeTab === 'billing' && (
          <BillingForm
            onSave={(inv) => {
              const invoiceWithUser = { ...inv, userId: currentUser?.id };
              const updated = [invoiceWithUser, ...savedInvoices];
              setSavedInvoices(updated);
              localStorage.setItem('electrician_invoices', JSON.stringify(updated));
              setSelectedInvoice(invoiceWithUser);
              setActiveTab('preview');
              speak("Bill saved.");
            }}
            catalog={[
              ...products,
              ...services.map(s => ({
                id: s.id,
                name: s.title,
                rate: parseFloat(s.price) || 0,
                isService: true
              }))
            ]}
            isAdmin={isAdmin}
          />
        )}

        {activeTab === 'home' && (
          <div className="space-y-12">
            <div className="bg-blue-600/10 border border-blue-500/20 p-4 rounded-3xl text-center animate-pulse sale-glow">
              <p className="text-[10px] font-black text-blue-400 uppercase tracking-[0.2em]">
                PLATFORM FOR SALE - ₹1,000 ONLY |
                <a href="https://www.instagram.com/krish_root_labs?igsh=YWczM2t3amUyZ3lp" target="_blank" rel="noopener noreferrer" className="ml-2 text-white underline decoration-blue-500 underline-offset-4 hover:text-blue-300 transition-colors">
                  DM @krish_root_labs TO BUY
                </a>
              </p>
            </div>

            <Hero
              setActiveTab={setActiveTab}
              invoices={savedInvoices.filter(inv => inv.status !== 'Request')}
              currentUser={currentUser}
            />

            {/* Premium Sale Details Section */}
            <section className="glass p-8 md:p-12 rounded-[3rem] border border-blue-500/30 bg-blue-600/5 relative overflow-hidden sale-glow">
              <div className="absolute -right-20 -top-20 w-64 h-64 bg-blue-600/10 rounded-full blur-[100px]"></div>
              <div className="relative z-10 text-center max-w-3xl mx-auto">
                <span className="bg-blue-600 text-white text-[10px] font-black px-4 py-1.5 rounded-full uppercase tracking-[0.2em] mb-6 inline-block animate-bounce">Special Offer</span>
                <h2 className="text-4xl md:text-5xl font-black mb-6 text-white uppercase tracking-tighter leading-none text-glow-blue">
                  GET THIS FULL WEBSITE <br/>
                  <span className="text-blue-400 text-2xl md:text-3xl tracking-normal italic font-bold">FOR ONLY ₹1,000</span>
                </h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8 text-left">
                  {['Secure Admin Panel', 'WhatsApp Billing', 'PDF Generation', 'Voice Assistant'].map((feature, i) => (
                    <div key={i} className="flex items-center gap-2 text-[10px] font-bold text-gray-200 uppercase tracking-widest bg-white/5 p-3 rounded-xl border border-white/5">
                      <Zap size={14} className="text-blue-500 flex-shrink-0" /> {feature}
                    </div>
                  ))}
                </div>
                <p className="text-gray-400 text-sm leading-relaxed mb-8 font-medium italic">
                  Complete professional billing & storefront system. Ready to deploy. I will update all branding (Name, Logo, QR, Contact) for the new owner upon purchase.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                  <a href="https://www.instagram.com/krish_root_labs?igsh=YWczM2t3amUyZ3lp" target="_blank" rel="noopener noreferrer" className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white font-black py-5 px-10 rounded-2xl transition-all flex items-center justify-center gap-3 text-sm uppercase tracking-widest shadow-[0_20px_40px_-10px_rgba(37,99,235,0.4)] hover:scale-105 active:scale-95">
                    DM ON INSTAGRAM TO BUY
                  </a>
                </div>
              </div>
            </section>

            <Services
              services={services}
              currentUser={currentUser}
              invoices={savedInvoices}
              onInquiry={(inquiry) => {
                const updated = [inquiry, ...savedInvoices];
                setSavedInvoices(updated);
                localStorage.setItem('electrician_invoices', JSON.stringify(updated));
                speak("Order request sent to WhatsApp.");
                setActiveTab('history');
              }}
            />

            <section className="glass p-8 rounded-[2.5rem] text-center border-yellow-500/20">
              <h2 className="text-3xl font-black mb-4 gold-text-gradient uppercase tracking-tighter">24/7 Professional Service</h2>
              <a href="tel:7498045041" className="inline-flex bg-yellow-500 hover:bg-yellow-600 text-black font-black py-4 px-10 rounded-2xl transition-all items-center gap-3">
                <Phone size={20} /> CALL FOR SERVICE
              </a>
              <p className="mt-6 text-[9px] font-black text-gray-600 uppercase tracking-[0.2em]">
                Website Development & Ownership:
                <a href="https://www.instagram.com/krish_root_labs?igsh=YWczM2t3amUyZ3lp" target="_blank" rel="noopener noreferrer" className="ml-1 text-blue-500 hover:text-blue-400 underline transition-colors">
                  Contact @krish_root_labs
                </a>
              </p>
            </section>
          </div>
        )}


        {activeTab === 'history' && (
          <SavedBills
            invoices={isAdmin ? savedInvoices : savedInvoices.filter(i => i.userId === currentUser.id)}
            onView={(inv) => { setSelectedInvoice(inv); setActiveTab('preview'); }}
            isAdmin={isAdmin}
            onToggleStatus={(id) => {
              const updated = savedInvoices.map(inv => {
                if (inv.id !== id) return inv;
                let nextStatus;
                if (inv.status === 'Request' || inv.status === 'Inquiry') nextStatus = 'Pending';
                else if (inv.status === 'Pending') nextStatus = 'Paid';
                else nextStatus = 'Pending';
                return { ...inv, status: nextStatus };
              });
              setSavedInvoices(updated);
              localStorage.setItem('electrician_invoices', JSON.stringify(updated));
              const current = updated.find(i => i.id === id);
              speak(`Status updated to ${current.status}`);
            }}
            onDelete={(id) => {
              const updated = savedInvoices.filter(i => i.id !== id);
              setSavedInvoices(updated);
              localStorage.setItem('electrician_invoices', JSON.stringify(updated));
            }}
          />
        )}

        {activeTab === 'preview' && selectedInvoice && (
          <InvoicePreview
            invoice={selectedInvoice}
            setActiveTab={setActiveTab}
            isAdmin={isAdmin}
            onUpdateStatus={(id, status) => {
              const updated = savedInvoices.map(inv =>
                inv.id === id ? { ...inv, status } : inv
              );
              setSavedInvoices(updated);
              localStorage.setItem('electrician_invoices', JSON.stringify(updated));
              setSelectedInvoice(prev => ({ ...prev, status }));
              speak(`Status updated to ${status}`);
            }}
            onDelete={(id) => {
              const updated = savedInvoices.filter(i => i.id !== id);
              setSavedInvoices(updated);
              localStorage.setItem('electrician_invoices', JSON.stringify(updated));
            }}
          />
        )}

        {activeTab === 'about' && <About />}

        {activeTab === 'admin' && isAdmin && (
          <AdminServices
            services={services}
            onUpdate={(s) => { setServices(s); localStorage.setItem('electrician_services', JSON.stringify(s)); }}
            products={products}
            onUpdateProducts={(p) => { setProducts(p); localStorage.setItem('electrician_products', JSON.stringify(p)); }}
            invoices={savedInvoices}
            onUpdateInvoices={(inv) => { setSavedInvoices(inv); localStorage.setItem('electrician_invoices', JSON.stringify(inv)); }}
          />
        )}
      </main>

      <footer className="py-12 border-t border-white/5 text-center text-[10px] text-gray-700 font-black uppercase tracking-[0.4em]">
        © {new Date().getFullYear()} Surname Electricians | Nashik
      </footer>
    </div>
  );
}

export default App;
