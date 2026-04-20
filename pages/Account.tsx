
import React from 'react';
import { AppRoute } from '../types';

const Account: React.FC<{ navigate: (r: AppRoute) => void }> = ({ navigate }) => {
  const orderId = localStorage.getItem('ARCHITECH_ORDER_ID');

  const insights = [
    { date: 'APR 16, 2026', text: 'MULTI-AGENT ORCHESTRATION NODES SEEING 40% EFFICIENCY GAINS IN LOW-LATENCY ENVS.' },
    { date: 'APR 12, 2026', text: 'STRATEGIC PIVOT DETECTED: SOVEREIGNTY OVER SUBSCRIPTION IS THE 2026 META.' },
    { date: 'APR 08, 2026', text: 'NEW PROMPT MATRIX REFINEMENT: SEMANTIC CLARITY > LENGTH.' },
  ];

  return (
    <div className="max-w-7xl mx-auto px-6 py-24">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-16 mb-32">
        <div className="space-y-6">
          <span className="text-green text-[10px] font-black tracking-[0.6em] uppercase">Status: Terminal Active</span>
          <h1 className="text-8xl md:text-[10rem] font-black tracking-tighter uppercase leading-[0.8]">Identity <br /> Node</h1>
        </div>
        <div className="text-right space-y-4">
           <p className="text-[10px] font-black text-white/40 uppercase tracking-widest">Operator Node: {orderId ? orderId.substring(0, 8) : 'ANONYMOUS'}</p>
           <button 
            onClick={() => { localStorage.removeItem('ARCHITECH_ORDER_ID'); window.location.reload(); }} 
            className="text-[10px] font-black uppercase tracking-[0.4em] text-white/20 hover:text-green transition-all"
           >
             [ PURGE_IDENTITY ]
           </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        <div className="lg:col-span-8 border border-white/5 p-12 space-y-16">
          <div className="space-y-8">
            <h2 className="text-4xl font-black tracking-tighter uppercase">Secured Protocols</h2>
            <div className="h-px w-full bg-white/5"></div>
          </div>

          {!orderId ? (
            <div className="py-24 text-center space-y-12">
              <p className="text-white/40 font-bold text-sm uppercase leading-relaxed max-w-sm mx-auto">
                Your library node is currently dormant. Access the Vault to begin orchestration.
              </p>
              <button 
                onClick={() => navigate(AppRoute.SHOP)} 
                className="bg-green text-black px-12 py-5 text-[10px] font-black tracking-widest uppercase hover:bg-white transition-all shadow-2xl"
              >
                Access The Vault
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
               <div className="p-8 border border-green/20 bg-green/5 space-y-6">
                  <div className="flex justify-between items-start">
                     <span className="text-[10px] font-bold text-green uppercase tracking-widest">Active_Node</span>
                     <span className="text-xs font-mono opacity-40">#01</span>
                  </div>
                  <h3 className="text-2xl font-black uppercase tracking-tighter">Acquired Intelligence</h3>
                  <button 
                    onClick={() => navigate(AppRoute.SUCCESS)}
                    className="w-full bg-green/10 border border-green/20 text-green py-3 text-[10px] font-black uppercase hover:bg-green hover:text-black"
                  >
                    Enter Vault Access
                  </button>
               </div>
            </div>
          )}
        </div>

        <div className="lg:col-span-4 space-y-12">
          <div className="p-12 border border-white/5 bg-white text-black space-y-12">
             <div className="flex justify-between items-center">
                <h3 className="text-xl font-black uppercase tracking-widest">Neural Feed</h3>
                <div className="w-2 h-2 bg-black animate-ping"></div>
             </div>
             <div className="space-y-8">
                {insights.map((insight, idx) => (
                  <div key={idx} className="space-y-2 pb-6 border-b border-black/10 last:border-0 last:pb-0">
                    <p className="text-[8px] font-black text-black/40 uppercase">{insight.date}</p>
                    <p className="text-xs font-bold leading-relaxed uppercase">{insight.text}</p>
                  </div>
                ))}
             </div>
          </div>

          <div className="p-12 border border-white/5 space-y-8">
             <h3 className="text-xl font-black uppercase tracking-widest">System_Log</h3>
             <div className="space-y-4 font-mono text-[10px] opacity-40">
                <p>[PING] // CLOUD_INSTANCE_STABLE</p>
                <p>[FIRESTORE] // SYNC_COMPLETE</p>
                <p>[AGENTS] // 3_ACTIVE_NODES</p>
                <p>[IDENTITY] // DECRYPTED</p>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Account;
