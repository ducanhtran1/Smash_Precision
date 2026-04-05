import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { signInWithGoogle } from '@/src/lib/firebase';
import { useAuth } from '@/src/contexts/AuthContext';
import { Mail, Lock, User as UserIcon } from 'lucide-react';

const Register = () => {
  const navigate = useNavigate();
  const { user, register: localRegister } = useAuth();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  React.useEffect(() => {
    if (user) navigate('/dashboard');
  }, [user, navigate]);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    try {
      await localRegister(email, password, displayName);
      navigate('/dashboard');
    } catch (error: any) {
      setErrorMsg(error.message || 'Registration failed');
    }
  };

  const handleGoogleLogin = async () => {
    try {
      await signInWithGoogle();
      navigate('/dashboard');
    } catch (error) {
      console.error("Login failed", error);
    }
  };

  return (
    <main className="flex min-h-screen w-full pt-24">
      <section className="hidden lg:flex lg:w-1/2 relative bg-black overflow-hidden items-center justify-center">
        <img 
          alt="Badminton court lines" 
          className="absolute inset-0 w-full h-full object-cover opacity-60 grayscale brightness-50" 
          src="https://lh3.googleusercontent.com/aida-public/AB6AXuCNG8SLJrdoGR_AztBz6MB5YLFyBzXQ4ZD9ZnDQ2g3BQJ4MUd5_U497jKHoap6coDh3AqXSxQ4J_dXX8nk4mEZucQtxzSswl9hqn9ozRCmxlTzIHruPdoKuMCGDneRUvnFsgBcsyM0mlBEvAsx4ZqSAppYDtlbYH-W5DCqoyxGAhZVbD5RK2qklpCLKOUCmgo-gKLP76iLXnNJBuMj_ON7rvtD7WuYwMI-e8aAkvIbVWc8vfkW_T3I5NR9Ub5DNTzWOFhlGvP71j-Q"
        />
        <div className="relative z-10 text-center px-12">
          <h1 className="text-white text-[80px] font-black leading-tight tracking-tighter mb-4">
            BEGIN THE ASCENT
          </h1>
          <p className="text-white/60 text-[11px] uppercase tracking-[0.1em] font-bold">
            NEW PROTOCOL / INITIATE
          </p>
        </div>
      </section>

      <section className="w-full lg:w-1/2 bg-white flex items-center justify-center px-8 md:px-24 py-12">
        <div className="w-full max-w-md">
          <div className="mb-12">
            <span className="text-2xl font-black tracking-tighter text-black uppercase">SMASH PRECISION</span>
          </div>
          <div className="space-y-8">
            <header>
              <h2 className="text-[12px] font-bold uppercase tracking-[0.1em] text-neutral-400 mb-2">Create Account</h2>
              <h3 className="text-3xl font-light tracking-tighter">Enter the laboratory</h3>
            </header>
            
            {errorMsg && (
               <div className="bg-red-500/10 text-red-500 p-4 border border-red-500/20 text-xs font-medium uppercase tracking-widest">
                 {errorMsg}
               </div>
            )}

            <form onSubmit={handleRegister} className="space-y-6">
              <div className="space-y-1">
                <label className="text-[10px] font-bold uppercase tracking-widest text-neutral-500">Display Name</label>
                <div className="relative">
                  <UserIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
                  <input
                    type="text"
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    required
                    className="w-full bg-neutral-50 border border-neutral-200 py-4 pl-12 pr-4 outline-none focus:border-black transition-colors rounded-none placeholder:text-neutral-400 text-sm"
                    placeholder="Jane Doe"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold uppercase tracking-widest text-neutral-500">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full bg-neutral-50 border border-neutral-200 py-4 pl-12 pr-4 outline-none focus:border-black transition-colors rounded-none placeholder:text-neutral-400 text-sm"
                    placeholder="jane@example.com"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold uppercase tracking-widest text-neutral-500">Password</label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="w-full bg-neutral-50 border border-neutral-200 py-4 pl-12 pr-4 outline-none focus:border-black transition-colors rounded-none placeholder:text-neutral-400 text-sm"
                    placeholder="••••••••"
                  />
                </div>
              </div>

              <button 
                type="submit"
                className="w-full bg-black text-white py-5 px-10 font-bold uppercase text-[11px] tracking-[0.1em] hover:bg-neutral-800 transition-all duration-300"
              >
                CREATE ACCOUNT
              </button>
            </form>

            <div className="relative flex items-center py-4">
               <div className="flex-grow border-t border-neutral-200"></div>
               <span className="flex-shrink-0 mx-4 text-neutral-400 text-[10px] tracking-widest uppercase">Or</span>
               <div className="flex-grow border-t border-neutral-200"></div>
            </div>

            <button 
              type="button"
              onClick={handleGoogleLogin}
              className="w-full border-2 border-black bg-white text-black py-5 px-10 font-bold uppercase text-[11px] tracking-[0.1em] hover:bg-neutral-50 transition-all duration-300 flex items-center justify-center gap-4"
            >
              <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google" className="w-5 h-5 bg-black" />
              SIGN UP WITH GOOGLE
            </button>

            <footer className="pt-8 border-t border-neutral-100">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <span className="text-[11px] text-neutral-400 uppercase tracking-[0.1em]">Already in the archive?</span>
                <Link to="/login" className="text-[11px] font-black uppercase tracking-[0.1em] text-black border-b-2 border-black pb-1 hover:border-transparent transition-all">
                  Sign In
                </Link>
              </div>
            </footer>
          </div>
        </div>
      </section>
    </main>
  );
};

export default Register;
