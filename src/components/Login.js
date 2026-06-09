import React, { useState } from 'react';
import { Lock, User, Zap, Mail, ArrowRight, ShieldCheck } from 'lucide-react';

const Login = ({ onLogin }) => {
  const [loginMode, setLoginMode] = useState('user'); // 'user' or 'admin'
  const [isRegister, setIsRegister] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (loginMode === 'admin') {
      // Prioritize the requested admin credentials
      const adminEmail = 'admin@gmail.com';
      const adminPass = 'ADMIN';

      if (email.toLowerCase() === adminEmail.toLowerCase() && password === adminPass) {
        onLogin({ name: 'Surname Electricians Admin', email: adminEmail, role: 'admin', id: 'admin-001' });
      } else {
        setError('Invalid Admin Credentials');
      }
      return;
    }

    if (isRegister) {
      const users = JSON.parse(localStorage.getItem('surname_users') || '[]');
      if (users.find(u => u.email === email)) {
        setError('User already exists with this email');
        return;
      }

      const newUser = {
        name,
        email,
        password,
        role: 'user',
        id: Date.now().toString()
      };

      users.push(newUser);
      localStorage.setItem('surname_users', JSON.stringify(users));
      onLogin(newUser);
    } else {
      const users = JSON.parse(localStorage.getItem('surname_users') || '[]');
      const user = users.find(u => u.email === email && u.password === password);

      if (user) {
        onLogin(user);
      } else {
        setError('Invalid email or password');
      }
    }
  };

  return (
    <div className="max-w-lg mx-auto mt-4 mb-20 animate-in fade-in zoom-in-95 duration-500">
      {/* Role Selector */}
      <div className="flex bg-white/5 p-1 rounded-2xl mb-6 border border-white/10">
        <button
          onClick={() => { setLoginMode('user'); setIsRegister(false); setError(''); }}
          className={`flex-1 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${loginMode === 'user' ? 'bg-yellow-500 text-black' : 'text-gray-500 hover:text-white'}`}
        >
          User Portal
        </button>
        <button
          onClick={() => { setLoginMode('admin'); setIsRegister(false); setError(''); }}
          className={`flex-1 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${loginMode === 'admin' ? 'bg-blue-600 text-white' : 'text-gray-500 hover:text-white'}`}
        >
          Admin Access
        </button>
      </div>

      <div className="glass p-10 md:p-14 rounded-[3.5rem] border border-white/10 shadow-2xl relative overflow-hidden">
        <div className={`absolute top-0 left-0 w-full h-2 ${loginMode === 'admin' ? 'bg-blue-600' : 'gold-gradient'}`}></div>

        <div className="flex flex-col items-center mb-10">
          <div className={`${loginMode === 'admin' ? 'bg-blue-600 shadow-[0_0_30px_rgba(37,99,235,0.4)]' : 'bg-yellow-500 shadow-[0_0_30px_rgba(234,179,8,0.4)]'} p-4 rounded-2xl mb-6 rotate-3 transition-colors`}>
            {loginMode === 'admin' ? <ShieldCheck className="text-white" size={32} /> : <Zap className="text-black" size={32} fill="currentColor" />}
          </div>
          <h2 className="text-4xl font-black gold-text-gradient uppercase tracking-tighter text-center">
            {loginMode === 'admin' ? 'Admin Login' : (isRegister ? 'Create Account' : 'User Login')}
          </h2>
          <p className="text-gray-500 mt-2 text-sm font-bold uppercase tracking-widest">
             {loginMode === 'admin' ? 'System Management' : 'Surname Electricians Services'}
          </p>

          {/* MASSIVE SALE BANNER ON LOGIN */}
          <div className="mt-8 w-full p-8 bg-blue-600 rounded-[2rem] border-2 border-white/20 shadow-[0_20px_50px_-10px_rgba(37,99,235,0.5)] text-center animate-pulse">
            <h3 className="text-2xl font-black text-white uppercase tracking-tighter mb-2">
              THIS WEBSITE IS FOR SALE
            </h3>
            <p className="text-blue-100 font-bold text-xs uppercase tracking-widest mb-4">
              Get this complete billing platform
            </p>
            <div className="bg-black/20 p-4 rounded-xl mb-4">
              <p className="text-white text-[10px] font-black uppercase tracking-widest mb-1">Contact Developer</p>
              <a href="https://www.instagram.com/krish_root_labs?igsh=YWczM2t3amUyZ3lp" target="_blank" rel="noopener noreferrer" className="text-xl font-black text-yellow-400 hover:scale-105 transition-transform inline-block">
                @krish_root_labs
              </a>
            </div>
            <p className="text-white font-black text-2xl">₹1,000 ONLY</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {isRegister && loginMode === 'user' && (
            <div className="space-y-2">
              <label className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] ml-2">Full Name</label>
              <div className="relative group">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-yellow-500 transition-colors" size={18} />
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 focus:border-yellow-500 outline-none transition-all font-medium text-white"
                  placeholder="Enter your name"
                  required
                />
              </div>
            </div>
          )}

          <div className="space-y-2">
            <label className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] ml-2">Email Address</label>
            <div className="relative group">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-yellow-500 transition-colors" size={18} />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 focus:border-yellow-500 outline-none transition-all font-medium text-white"
                placeholder={loginMode === 'admin' ? 'admin@gmail.com' : 'your@email.com'}
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] ml-2">Secure Password</label>
            <div className="relative group">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-yellow-500 transition-colors" size={18} />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 focus:border-yellow-500 outline-none transition-all font-medium text-white"
                placeholder="••••••••"
                required
              />
            </div>
          </div>

          {error && (
            <div className="bg-red-500/10 border border-red-500/20 text-red-500 text-xs font-bold p-4 rounded-xl text-center animate-shake">
              {error}
            </div>
          )}

          <button
            type="submit"
            className={`w-full py-5 rounded-[1.5rem] text-white font-black text-sm uppercase tracking-widest transition-all flex items-center justify-center gap-2 group mt-4 ${loginMode === 'admin' ? 'bg-blue-600 hover:bg-blue-700 shadow-[0_20px_40px_-10px_rgba(37,99,235,0.4)]' : 'gold-gradient !text-black hover:shadow-[0_20px_40px_-10px_rgba(234,179,8,0.4)]'}`}
          >
            {loginMode === 'admin' ? 'Authenticate Admin' : (isRegister ? 'Register Now' : 'Sign In')}
            <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
          </button>
        </form>

        {loginMode === 'user' && (
          <div className="mt-10 pt-8 border-t border-white/5 text-center">
            <p className="text-gray-500 text-xs font-bold">
              {isRegister ? 'Already have an account?' : "Don't have an account?"}
              <button
                onClick={() => { setIsRegister(!isRegister); setError(''); }}
                className="text-yellow-500 hover:text-white transition-colors ml-2 uppercase tracking-widest"
              >
                {isRegister ? 'Login Here' : 'Create Account'}
              </button>
            </p>
          </div>
        )}

        <div className="mt-8 flex items-center justify-center gap-2 text-[10px] text-gray-600 font-black uppercase tracking-widest">
          <ShieldCheck size={12} /> {loginMode === 'admin' ? 'Admin Verification Protocol' : 'Standard Secure Login'}
        </div>
      </div>
    </div>
  );
};

export default Login;
