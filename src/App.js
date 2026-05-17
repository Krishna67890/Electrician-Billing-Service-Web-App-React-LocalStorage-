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
        src="/logo.jpg"
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
      return localStorage.getItem('mulani_voice_enabled') === 'true';
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
    const sessionUser = localStorage.getItem('mulani_current_user');
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
    localStorage.setItem('mulani_voice_enabled', isVoiceEnabled);
  }, [isVoiceEnabled]);

  // --- Tab Voice Logic ---
  useEffect(() => {
    if (isVoiceEnabled && currentUser && activeTab !== 'login') {
      const guidance = {
        home: "Welcome to Mulani Electricals Dashboard.",
        billing: "Generate a new invoice now.",
        history: "Reviewing your transaction records.",
        admin: "Website controls active.",
        about: "The story of Mulani Electricals."
      };
      speak(guidance[activeTab] || "");
    }
  }, [activeTab, isVoiceEnabled, currentUser, speak]);

  const handleLogin = (user) => {
    setCurrentUser(user);
    setIsAdmin(user.role === 'admin');
    localStorage.setItem('mulani_current_user', JSON.stringify(user));
    setActiveTab('home');
    if (isVoiceEnabled) speak(`Welcome ${user.name}`);
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setIsAdmin(false);
    localStorage.removeItem('mulani_current_user');
    setActiveTab('login');
  };

  if (!currentUser) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-black">
        <div className="mb-10 text-center animate-in fade-in zoom-in duration-700">
          <BrandLogo size={60} className="w-24 h-24 mx-auto mb-6 rotate-3" />
          <h1 className="text-4xl font-black gold-text-gradient uppercase tracking-tighter">Mulani Electricals</h1>
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
        {activeTab === 'home' && (
          <div className="space-y-12">
            <Hero setActiveTab={setActiveTab} invoices={savedInvoices} currentUser={currentUser} />
            <Services services={services} />
            <section className="glass p-8 rounded-[2.5rem] text-center border-yellow-500/20">
              <h2 className="text-3xl font-black mb-4 gold-text-gradient uppercase tracking-tighter">24/7 Emergency Support</h2>
              <a href="tel:7498045041" className="inline-flex bg-yellow-500 hover:bg-yellow-600 text-black font-black py-4 px-10 rounded-2xl transition-all items-center gap-3">
                <Phone size={20} /> CALL SOHAIL
              </a>
            </section>
          </div>
        )}

        {activeTab === 'dashboard' && isAdmin && <Dashboard invoices={savedInvoices} />}

        {activeTab === 'billing' && (
          <BillingForm
            onSave={(inv) => {
              const updated = [inv, ...savedInvoices];
              setSavedInvoices(updated);
              localStorage.setItem('electrician_invoices', JSON.stringify(updated));
              setSelectedInvoice(inv);
              setActiveTab('preview');
              speak("Bill saved.");
            }}
            catalog={products}
          />
        )}

        {activeTab === 'history' && (
          <SavedBills
            invoices={isAdmin ? savedInvoices : savedInvoices.filter(i => i.userId === currentUser.id)}
            onView={(inv) => { setSelectedInvoice(inv); setActiveTab('preview'); }}
            onDelete={(id) => {
              const updated = savedInvoices.filter(i => i.id !== id);
              setSavedInvoices(updated);
              localStorage.setItem('electrician_invoices', JSON.stringify(updated));
            }}
          />
        )}

        {activeTab === 'preview' && selectedInvoice && (
          <InvoicePreview invoice={selectedInvoice} setActiveTab={setActiveTab} />
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
        © {new Date().getFullYear()} Mulani Electricals | Nashik
      </footer>
    </div>
  );
}

export default App;
