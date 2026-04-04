import React, { useState, useEffect } from 'react';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '@/src/lib/firebase';
import { useAuth } from '@/src/contexts/AuthContext';
import { handleFirestoreError, OperationType } from '@/src/lib/error-handler';

const Account = () => {
  const { user, profile } = useAuth();
  const [formData, setFormData] = useState({
    displayName: '',
    bio: '',
    email: ''
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (profile) {
      setFormData({
        displayName: profile.displayName || '',
        bio: profile.bio || '',
        email: profile.email || ''
      });
    }
  }, [profile]);

  const handleUpdate = async () => {
    if (!user) return;
    setLoading(true);
    try {
      await updateDoc(doc(db, 'users', user.uid), {
        displayName: formData.displayName,
        bio: formData.bio
      });
      alert('Profile updated successfully.');
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, `users/${user.uid}`);
    } finally {
      setLoading(false);
    }
  };

  if (!user) return <div className="pt-40 text-center uppercase text-[10px] tracking-widest">Please sign in to access settings.</div>;

  return (
    <main className="pt-32 pb-32 px-6 max-w-screen-2xl mx-auto">
      <header className="mb-20">
        <h1 className="text-7xl font-black tracking-tighter uppercase mb-2">Account</h1>
        <p className="font-sans text-[10px] tracking-[0.2em] uppercase text-neutral-400">System Configuration / User: {user.uid.slice(0, 8).toUpperCase()}</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-20">
        <aside className="lg:col-span-3">
          <nav className="flex flex-col space-y-8 sticky top-32">
            <div>
              <span className="font-sans text-[10px] tracking-[0.15em] uppercase font-bold text-black mb-6 block">Sections</span>
              <ul className="space-y-4">
                <li><a className="font-sans text-[11px] tracking-widest uppercase font-bold text-black border-l-2 border-black pl-4 block" href="#identity">01. Identity</a></li>
              </ul>
            </div>
          </nav>
        </aside>

        <section className="lg:col-span-9 space-y-32">
          <div className="space-y-12" id="identity">
            <div className="flex justify-between items-end border-b border-neutral-100 pb-4">
              <h2 className="text-2xl font-black tracking-tight uppercase">01. Identity</h2>
              <span className="font-sans text-[10px] tracking-widest uppercase text-neutral-400">Public Profile Data</span>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-16">
              <div className="flex flex-col space-y-2">
                <label className="font-sans text-[10px] tracking-widest uppercase font-bold text-black">Display Name</label>
                <input 
                  className="bg-transparent border-0 border-b border-neutral-200 py-2 font-sans text-sm focus:border-black transition-colors uppercase tracking-tight" 
                  type="text" 
                  value={formData.displayName}
                  onChange={(e) => setFormData({...formData, displayName: e.target.value})}
                />
              </div>
              <div className="flex flex-col space-y-2 md:col-span-2">
                <label className="font-sans text-[10px] tracking-widest uppercase font-bold text-black">Email Address</label>
                <input 
                  className="bg-transparent border-0 border-b border-neutral-200 py-2 font-sans text-sm text-neutral-400 uppercase tracking-tight" 
                  type="email" 
                  value={formData.email}
                  disabled
                />
              </div>
              <div className="flex flex-col space-y-2 md:col-span-2">
                <label className="font-sans text-[10px] tracking-widest uppercase font-bold text-black">Bio / Technical Brief</label>
                <textarea 
                  className="bg-transparent border-0 border-b border-neutral-200 py-2 font-sans text-sm focus:border-black transition-colors uppercase tracking-tight resize-none" 
                  rows={3}
                  value={formData.bio}
                  onChange={(e) => setFormData({...formData, bio: e.target.value})}
                />
              </div>
            </div>

            <div className="flex justify-start">
              <button 
                onClick={handleUpdate}
                disabled={loading}
                className="bg-black text-white font-sans text-[10px] tracking-widest uppercase font-bold px-12 py-4 hover:bg-neutral-800 transition-colors disabled:opacity-50"
              >
                {loading ? 'UPDATING...' : 'Update Identity'}
              </button>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
};

export default Account;
