
import React, { useState } from 'react';
import { subscribeEmail } from '../services/storageService';

const EmailSignup: React.FC = () => {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'success'>('idle');

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    subscribeEmail(email);
    setStatus('success');
    setEmail('');
  };

  return (
    <section className="px-6 py-24 bg-white border-y border-neutral-100">
      <div className="max-w-4xl mx-auto text-center space-y-12">
        <div className="space-y-4">
          <span className="text-[10px] font-black tracking-[0.5em] text-neutral-400 uppercase">Proprietary Insight Loop</span>
          <h2 className="text-4xl md:text-6xl font-black tracking-tighter uppercase">Join the <span className="serif italic font-light">Intelligence</span> Dispatch.</h2>
          <p className="text-neutral-500 text-lg font-light max-w-xl mx-auto">Receive weekly high-reasoning orchestration notes and secret vault access codes directly from the Oracle.</p>
        </div>

        {status === 'success' ? (
          <div className="p-8 bg-neutral-50 rounded-[2rem] border border-neutral-100 animate-in zoom-in-95">
            <p className="text-sm font-black tracking-widest uppercase">Node Synchronized. Welcome to the Network.</p>
          </div>
        ) : (
          <form onSubmit={handleSubscribe} className="flex flex-col md:flex-row gap-4 max-w-2xl mx-auto">
            <input 
              type="email" 
              required
              placeholder="IDENTITY@PROTOCOL.COM"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="flex-1 px-8 py-5 rounded-2xl bg-neutral-50 border border-neutral-100 focus:border-black focus:outline-none transition-all text-xs font-black tracking-widest uppercase"
            />
            <button type="submit" className="px-12 py-5 bg-black text-white rounded-2xl font-black text-xs tracking-[0.2em] uppercase hover:bg-neutral-800 transition-all shadow-xl">
              Authorize
            </button>
          </form>
        )}
        <p className="text-[9px] font-bold text-neutral-300 uppercase tracking-widest">End-to-End Encrypted Intelligence Transmission</p>
      </div>
    </section>
  );
};

export default EmailSignup;
