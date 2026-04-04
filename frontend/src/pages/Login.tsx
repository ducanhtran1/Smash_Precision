import React from 'react';
import { useNavigate } from 'react-router-dom';
import { signInWithGoogle } from '@/src/lib/firebase';
import { useAuth } from '@/src/contexts/AuthContext';

const Login = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  React.useEffect(() => {
    if (user) navigate('/dashboard');
  }, [user, navigate]);

  const handleLogin = async () => {
    try {
      await signInWithGoogle();
      navigate('/dashboard');
    } catch (error) {
      console.error("Login failed", error);
    }
  };

  return (
    <main className="flex min-h-screen w-full pt-24">
      {/* Left Side: Editorial Court Visual */}
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

      {/* Right Side: Minimalist Login Form */}
      <section className="w-full lg:w-1/2 bg-white flex items-center justify-center px-8 md:px-24">
        <div className="w-full max-w-md">
          <div className="mb-20">
            <span className="text-2xl font-black tracking-tighter text-black uppercase">SMASH PRECISION</span>
          </div>
          <div className="space-y-12">
            <header>
              <h2 className="text-[12px] font-bold uppercase tracking-[0.1em] text-neutral-400 mb-2">Authentication</h2>
              <h3 className="text-3xl font-light tracking-tighter">Access the technical archive</h3>
            </header>
            
            <div className="space-y-10">
              <button 
                onClick={handleLogin}
                className="w-full bg-black text-white py-5 px-10 font-bold uppercase text-[11px] tracking-[0.1em] hover:bg-neutral-800 transition-all duration-300 flex items-center justify-center gap-4"
              >
                <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google" className="w-5 h-5" />
                SIGN IN WITH GOOGLE
              </button>
            </div>

            <footer className="pt-8 border-t border-neutral-100">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <span className="text-[11px] text-neutral-400 uppercase tracking-[0.1em]">New to the archive?</span>
                <button onClick={handleLogin} className="text-[11px] font-black uppercase tracking-[0.1em] text-black border-b-2 border-black pb-1 hover:border-transparent transition-all">
                  Create Account
                </button>
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
