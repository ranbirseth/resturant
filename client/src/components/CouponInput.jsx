import React, { useState } from 'react';
import { Tag, X } from 'lucide-react';

const CouponInput = ({ onApply, onRemove, appliedCoupon, loading }) => {
  const [code, setCode] = useState('');

  const handleApply = () => {
    if (code.trim()) {
      onApply(code);
      setCode('');
    }
  };

  if (appliedCoupon) {
    return (
        <div className="bg-green-50 border border-green-200 rounded-xl p-4 flex items-center justify-between animate-in fade-in zoom-in duration-300">
            <div className="flex items-center gap-3">
                <div className="bg-green-100 p-2 rounded-full text-green-600">
                    <Tag size={20} />
                </div>
                <div>
                    <p className="font-bold text-green-800">'{appliedCoupon.code}' Applied</p>
                    <p className="text-sm text-green-600">
                         Saved ₹{appliedCoupon.discountAmount}
                    </p>
                </div>
            </div>
            <button 
                onClick={onRemove}
                className="p-2 hover:bg-green-100 rounded-full text-green-700 transition-colors"
            >
                <X size={20} />
            </button>
        </div>
    );
  }

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-1 flex items-center gap-2 shadow-sm focus-within:ring-2 focus-within:ring-orange-500 transition-all">
        <div className="pl-3 text-gray-400">
            <Tag size={20} />
        </div>
        <input 
            type="text" 
            placeholder="Enter coupon code"
            value={code}
            onChange={(e) => setCode(e.target.value.toUpperCase())}
            className="flex-1 p-2 bg-transparent text-gray-800 placeholder-gray-400 focus:outline-none font-medium"
        />
        <button 
            onClick={handleApply}
            disabled={!code || loading}
            className={`px-4 py-2 rounded-lg font-bold text-sm transition-all ${
                !code || loading
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                : 'bg-orange-600 text-white hover:bg-orange-700 active:scale-95'
            }`}
        >
            {loading ? '...' : 'APPLY'}
        </button>
    </div>
  );
};

export default CouponInput;
