import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { signInWithGoogle } from '@/src/lib/firebase';
import { useAuth } from '@/src/contexts/AuthContext';
import { Mail, Lock } from 'lucide-react';
import { Button } from '@/src/components/ui/Button';
import { Input } from '@/src/components/ui/Input';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';
const ADMIN_URL = import.meta.env.VITE_ADMIN_URL || 'http://localhost:3002';

const Login = () => {
  const navigate = useNavigate();
  const { user, login: localLogin } = useAuth();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  React.useEffect(() => {
    if (user) navigate('/dashboard');
  }, [user, navigate]);

  const handleLocalLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    try {
      await localLogin(email, password);
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/dashboard');
        return;
      }

      const profileRes = await fetch(`${API_URL}/api/auth/profile`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (profileRes.ok) {
        const profile = await profileRes.json();
        if (profile?.role === 'admin') {
          const redirectUrl = `${ADMIN_URL}/login?token=${encodeURIComponent(token)}`;
          window.location.href = redirectUrl;
          return;
        }
      }

      navigate('/dashboard');
    } catch (error: any) {
      setErrorMsg(error.message || "Invalid email or password");
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
            JOIN THE ELITE
          </h1>
          <p className="text-white/60 text-[11px] uppercase tracking-[0.1em] font-bold">
            SMASH PRECISION / ARCHIVE ACCESS 01
          </p>
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-40"></div>
      </section>

      <section className="w-full lg:w-1/2 bg-white flex items-center justify-center px-8 md:px-24">
        <div className="w-full max-w-md">
          <div className="mb-12">
            <span className="text-2xl font-black tracking-tighter text-black uppercase">SMASH PRECISION</span>
          </div>
          <div className="space-y-8">
            <header>
              <h2 className="text-[12px] font-bold uppercase tracking-[0.1em] text-neutral-400 mb-2">Authentication</h2>
              <h3 className="text-3xl font-light tracking-tighter">Access the technical archive</h3>
            </header>
            
            {errorMsg && (
               <div className="bg-red-500/10 text-red-500 p-4 border border-red-500/20 text-xs font-medium uppercase tracking-widest">
                 {errorMsg}
               </div>
            )}
            
            <form onSubmit={handleLocalLogin} className="space-y-6">
              <Input
                label="Email Address"
                type="email"
                icon={<Mail className="w-4 h-4" />}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="name@example.com"
              />

              <div className="space-y-1">
                 <div className="flex justify-between">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-neutral-500">Password</label>
                  <Link to="#" className="text-[10px] font-bold uppercase tracking-widest text-neutral-400 hover:text-black">Forgot?</Link>
                 </div>
                 <Input
                   type="password"
                   icon={<Lock className="w-4 h-4" />}
                   value={password}
                   onChange={(e) => setPassword(e.target.value)}
                   required
                   placeholder="••••••••"
                 />
              </div>

              <Button type="submit" fullWidth size="lg">
                SIGN IN
              </Button>
            </form>

            <div className="relative flex items-center py-4">
               <div className="flex-grow border-t border-neutral-200"></div>
               <span className="flex-shrink-0 mx-4 text-neutral-400 text-[10px] tracking-widest uppercase">Or</span>
               <div className="flex-grow border-t border-neutral-200"></div>
            </div>

            <Button 
              type="button" 
              variant="outline" 
              fullWidth 
              size="lg" 
              onClick={handleGoogleLogin}
              className="gap-4 font-bold border-2"
            >
              <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google" className="w-5 h-5 bg-black" />
              SIGN IN WITH GOOGLE
            </Button>

            <footer className="pt-8 border-t border-neutral-100">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <span className="text-[11px] text-neutral-400 uppercase tracking-[0.1em]">New to the archive?</span>
                <Link to="/register" className="text-[11px] font-black uppercase tracking-[0.1em] text-black border-b-2 border-black pb-1 hover:border-transparent transition-all">
                  Create Account
                </Link>
              </div>
            </footer>
          </div>

          <div className="mt-24">
            <p className="text-[9px] text-neutral-300 leading-relaxed font-medium uppercase tracking-[0.1em]">
              ENGINEERED SILENCE / SYSTEM VER 2.4.0<br/>
              SECURED VIA END-TO-END PRECISION PROTOCOLS
            </p>
          </div>
        </div>
      </section>
    </main>
  );
};

export default Login;
