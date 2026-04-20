
import React, { useState } from 'react';
import { AppRoute, DigitalProduct } from '../types';
import { motion, AnimatePresence } from 'framer-motion';

export const PRODUCTS: DigitalProduct[] = [
  { 
    id: '1', 
    name: 'THE OMNI PROTOCOL', 
    price: 149, 
    description: 'A holistic framework for multi-agent orchestration and low-latency infrastructure.', 
    category: 'SYSTEMS', 
    image: 'https://images.unsplash.com/photo-1614850523296-d8c1af93d400?auto=format&fit=crop&q=80&w=800', 
    fileUrl: 'architech_omni_protocol_v1.zip' 
  },
  { 
    id: '2', 
    name: 'STRATEGIC ALIGNMENT', 
    price: 89, 
    description: 'Advanced prompt libraries and reasoning chains for proprietary intelligence.', 
    category: 'ASSETS', 
    image: 'https://images.unsplash.com/photo-1605810230434-7631ac76ec81?auto=format&fit=crop&q=80&w=800', 
    fileUrl: 'strategic_alignment_v2.zip' 
  },
  { 
    id: '3', 
    name: 'THE AGENTIC STACK', 
    price: 199, 
    description: 'Masterclass: Deployment blueprints for autonomous growth loops and automated sales funnels.', 
    category: 'COURSES', 
    image: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&q=80&w=800', 
    fileUrl: 'agentic_stack_v1.zip' 
  },
];

const Shop: React.FC<{ navigate: (route: AppRoute) => void }> = ({ navigate }) => {
  const [selectedProduct, setSelectedProduct] = useState<DigitalProduct | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [email, setEmail] = useState('');

  const handleAcquire = async () => {
    if (!email) return alert("Identification required.");
    setIsProcessing(true);
    
    try {
      const response = await fetch('/api/orders/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId: selectedProduct?.id, email })
      });
      const data = await response.json();
      
      // Simulate redirection to "Success" or wait for webhook
      // For this high-fidelity flow, we show the "Accessing" state
      setTimeout(() => {
        localStorage.setItem('ARCHITECH_ORDER_ID', data.orderId);
        navigate(AppRoute.SUCCESS);
      }, 2000);
    } catch (error) {
       console.error(error);
       setIsProcessing(false);
    }
  };

  return (
    <div className="pb-24 pt-12">
      <div className="px-6 mb-24 max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-end gap-12">
        <div className="space-y-6">
          <span className="text-red text-[10px] font-black tracking-[0.6em] uppercase">Security Level: Clear</span>
          <h1 className="text-8xl md:text-[10rem] font-black tracking-tighter uppercase leading-[0.8]">The Vault</h1>
        </div>
        <p className="text-white/40 max-w-xs text-xs font-bold leading-relaxed uppercase">
          Precision-engineered digital assets. 
          No redirects. 
          Immediate fulfillment.
        </p>
      </div>

      <div className="border-y border-white/5 divide-y md:divide-y-0 md:divide-x border-white/5 grid grid-cols-1 md:grid-cols-3">
        {PRODUCTS.map((product) => (
          <div 
            key={product.id} 
            className="p-12 hover:bg-white/5 transition-all group flex flex-col justify-between"
          >
            <div className="space-y-8">
               <div className="aspect-square bg-white/5 overflow-hidden border border-white/5 group-hover:border-red/20 transition-colors">
                  <img src={product.image} className="w-full h-full object-cover grayscale opacity-50 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-700" alt={product.name} />
               </div>
               <div className="flex justify-between items-baseline">
                  <h3 className="text-3xl font-black tracking-tighter uppercase">{product.name}</h3>
                  <span className="text-red font-bold text-sm">${product.price}</span>
               </div>
               <p className="text-white/40 text-[10px] uppercase font-bold leading-relaxed">{product.description}</p>
            </div>
            <button 
              onClick={() => setSelectedProduct(product)}
              className="mt-12 w-full border border-white/20 py-4 hover:bg-red hover:text-black hover:border-red transition-all uppercase font-black tracking-widest text-[10px]"
            >
              Acquire Protocol
            </button>
          </div>
        ))}
      </div>

      <AnimatePresence>
        {selectedProduct && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-xl flex items-center justify-center p-6"
          >
            <div className="w-full max-w-md border border-white/10 p-12 space-y-8 relative">
              <button 
                onClick={() => setSelectedProduct(null)} 
                className="absolute top-6 right-6 text-white/40 hover:text-white"
              >
                [ESC]
              </button>

              <div className="space-y-2">
                <span className="text-[10px] text-red font-black tracking-widest uppercase">ID_VERIFICATION</span>
                <h2 className="text-4xl font-black tracking-tighter uppercase">Initialize Access</h2>
              </div>

              <div className="space-y-6">
                <div className="space-y-2">
                  <label className="text-[8px] font-black uppercase text-white/40">Identification Node (Email)</label>
                  <input 
                    type="email" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-transparent border-b border-white/20 py-3 outline-none focus:border-red transition-colors text-sm"
                    placeholder="OPERATOR@ARCHITECH.COM"
                  />
                </div>

                <div className="bg-white/5 p-6 space-y-4 border border-white/5">
                  <div className="flex justify-between text-[10px] uppercase font-bold">
                    <span className="text-white/40 line-clamp-1">{selectedProduct.name}</span>
                    <span>${selectedProduct.price}</span>
                  </div>
                  <div className="h-px bg-white/5"></div>
                  <div className="flex justify-between text-xs font-black uppercase">
                    <span className="text-red">Total</span>
                    <span>${selectedProduct.price}.00</span>
                  </div>
                </div>

                <button 
                  disabled={isProcessing}
                  onClick={handleAcquire}
                  className="w-full bg-red text-black py-4 font-black tracking-[0.2em] uppercase hover:bg-white transition-colors disabled:opacity-50"
                >
                  {isProcessing ? "ENCRYPTING_TRANSACTION..." : "Initialize Order"}
                </button>
                
                <p className="text-[8px] text-center text-white/20 uppercase font-black">
                  Secure wise bridge initialized // No external redirects
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Shop;
