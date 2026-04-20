
import React, { useEffect, useState } from 'react';
import { AppRoute } from '../types';
import { motion } from 'framer-motion';

const Success: React.FC<{ navigate: (route: AppRoute) => void }> = ({ navigate }) => {
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const orderId = localStorage.getItem('ARCHITECH_ORDER_ID');
    if (!orderId) {
      setLoading(false);
      return;
    }

    const pollOrder = async () => {
      try {
        const response = await fetch(`/api/orders/${orderId}`);
        const data = await response.json();
        setOrder(data);
        if (data.status === 'FULFILLED') {
           setLoading(false);
           clearInterval(interval);
        }
      } catch (error) {
        console.error(error);
      }
    };

    const interval = setInterval(pollOrder, 3000);
    pollOrder();

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="pb-24 pt-32 px-6">
      <div className="max-w-4xl mx-auto space-y-24">
        <div className="space-y-8">
           <motion.div 
             initial={{ scale: 0.9, opacity: 0 }}
             animate={{ scale: 1, opacity: 1 }}
             className="w-24 h-24 bg-red text-black flex items-center justify-center font-black text-4xl"
           >
             [+]
           </motion.div>
           <div className="space-y-4">
              <span className="text-red text-[10px] font-black tracking-[0.6em] uppercase">Status: Finalizing Fulfillment</span>
              <h1 className="text-7xl md:text-[8rem] font-black tracking-tighter uppercase leading-[0.8]">Protocol <br /> Secured.</h1>
           </div>
        </div>

        <div className="border border-white/5 p-12 space-y-12">
           <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              <div className="space-y-4">
                 <span className="text-[10px] text-white/40 font-black uppercase">Identity Node</span>
                 <p className="text-sm font-bold">{order?.email || 'ANONYMOUS_OPERATOR'}</p>
              </div>
              <div className="space-y-4 text-right">
                 <span className="text-[10px] text-white/40 font-black uppercase">Security Tier</span>
                 <p className="text-sm font-bold text-red uppercase">Enterprise_High</p>
              </div>
           </div>

           <div className="h-px bg-white/5"></div>

           <div className="space-y-8">
              {loading ? (
                <div className="flex flex-col items-center gap-6 py-12">
                   <div className="w-12 h-12 border-2 border-red border-t-transparent animate-spin"></div>
                   <p className="text-[10px] font-black text-red tracking-widest uppercase animate-pulse">Syncing with Wise Bridge...</p>
                </div>
              ) : order?.vaultUrl ? (
                <div className="space-y-8 animate-in fade-in duration-1000">
                   <div className="bg-white/5 p-8 border border-red/20">
                      <p className="text-[10px] font-bold text-red uppercase mb-4">Encryption complete. Access granted.</p>
                      <h4 className="text-2xl font-black tracking-tight uppercase mb-8">{order.productId.replace(/_/g, ' ')}</h4>
                      <a 
                        href={order.vaultUrl} 
                        download
                        className="inline-block w-full bg-red text-black py-6 text-center font-black tracking-widest uppercase hover:bg-white transition-colors"
                      >
                        Initialize Download
                      </a>
                   </div>
                   <p className="text-[8px] text-white/20 uppercase font-black text-center">
                     Link expires in 60 minutes // 256-bit RSA override active
                   </p>
                </div>
              ) : (
                <div className="py-12 text-center text-white/40 uppercase font-black tracking-widest">
                   Order instance not found in local cache.
                </div>
              )}
           </div>
        </div>

        <div className="flex justify-between items-center text-[10px] font-black tracking-widest uppercase">
           <button onClick={() => navigate(AppRoute.HOME)} className="hover:text-red transition-colors">[ Return Home ]</button>
           <button onClick={() => navigate(AppRoute.ACCOUNT)} className="hover:text-red transition-colors">[ Consult Identity ]</button>
        </div>
      </div>
    </div>
  );
};

export default Success;
