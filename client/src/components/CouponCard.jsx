import React from 'react';
import { Scissors } from 'lucide-react';

const CouponCard = ({ coupon, onSelect }) => {
  return (
    <div 
        onClick={() => onSelect(coupon.code)}
        className="relative bg-white border border-dashed border-gray-300 rounded-lg p-4 cursor-pointer hover:bg-orange-50 hover:border-orange-300 transition-all group overflow-hidden"
    >
        {/* Background Decorative Circles */}
        <div className="absolute -left-2 top-1/2 -translate-y-1/2 w-4 h-4 bg-gray-50 rounded-full border border-gray-200 group-hover:bg-white" />
        <div className="absolute -right-2 top-1/2 -translate-y-1/2 w-4 h-4 bg-gray-50 rounded-full border border-gray-200 group-hover:bg-white" />

        <div className="flex justify-between items-center pl-2">
            <div>
                <h3 className="font-bold text-gray-800 text-lg">{coupon.code}</h3>
                <p className="text-sm text-gray-500">
                    {coupon.discountType === 'PERCENT' ? `${coupon.value}% OFF` : `₹${coupon.value} OFF`}
                </p>
                {coupon.minOrderAmount > 0 && (
                     <p className="text-xs text-gray-400 mt-1">Min Order: ₹{coupon.minOrderAmount}</p>
                )}
            </div>
            <div className="text-orange-500 opacity-0 group-hover:opacity-100 transition-opacity transform group-hover:rotate-12">
                <Scissors size={20} />
            </div>
        </div>
    </div>
  );
};

export default CouponCard;
