import React, { useState, useContext } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { AppContext } from '../context/AppContext';
import { ArrowLeft, PlayCircle, Utensils, ShoppingBag } from 'lucide-react';
import CouponInput from '../components/CouponInput';
import CouponCard from '../components/CouponCard';
import axios from 'axios';
import API_URL from '../config';

const OrderType = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { placeOrder, user, cart, getCartTotal, applyCoupon, removeCoupon, coupon, getFinalTotal } = useContext(AppContext);
  const [orderType, setOrderType] = useState(null); // 'Dine-in' | 'Takeaway'
  const [tableNumber, setTableNumber] = useState('');
  const [loading, setLoading] = useState(false);
  const [coupons, setCoupons] = useState([]);

  React.useEffect(() => {
    // Fetch available coupons
    axios.get(`${API_URL}/coupons`)
        .then(res => setCoupons(res.data))
        .catch(err => console.error(err));
  }, []);

  const handleApplyCoupon = async (code) => {
    setLoading(true);
    const result = await applyCoupon(code);
    setLoading(false);
    if (!result.success) {
        alert(result.message);
    }
  };

  const addons = location.state?.addons || {};

  const handlePlaceOrder = async () => {
    if (!orderType) return;
    if (orderType === 'Dine-in' && !tableNumber) return;

    setLoading(true);
    // Construct Order Data
    const orderData = {
        userId: user._id,
        items: cart.map(item => ({
            itemId: item._id, // assuming item has _id
            name: item.name,
            quantity: item.quantity,
            price: item.price,
            customizations: Object.keys(addons).filter(k => addons[k]) // simplified
        })),
        totalAmount: getFinalTotal(), 
        grossTotal: getCartTotal(),
        couponCode: coupon?.code,
        discountAmount: coupon?.discountAmount,
        orderType,
        tableNumber: orderType === 'Dine-in' ? tableNumber : undefined
    };

    try {
        await placeOrder(orderData);
        navigate('/countdown');
    } catch (error) {
        alert("Failed to place order");
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <div className="sticky top-0 bg-white/80 backdrop-blur-md p-4 flex items-center gap-4 border-b border-gray-100 z-10">
        <button onClick={() => navigate(-1)} className="p-2 hover:bg-gray-100 rounded-full">
            <ArrowLeft className="w-6 h-6 text-gray-800" />
        </button>
        <h1 className="text-xl font-bold text-gray-900">Dining Option</h1>
      </div>

      <div className="p-6">
        <h2 className="text-lg font-bold text-gray-800 mb-6">How would you like to eat?</h2>

        <div className="grid grid-cols-2 gap-4 mb-8">
            <div 
                onClick={() => setOrderType('Dine-in')}
                className={`p-6 rounded-2xl border-2 flex flex-col items-center gap-3 cursor-pointer transition-all ${
                    orderType === 'Dine-in' 
                    ? 'border-orange-500 bg-orange-50' 
                    : 'border-gray-100 bg-white hover:border-orange-200'
                }`}
            >
                <div className={`p-3 rounded-full ${orderType === 'Dine-in' ? 'bg-orange-500 text-white' : 'bg-gray-100 text-gray-600'}`}>
                    <Utensils className="w-8 h-8" />
                </div>
                <span className={`font-bold ${orderType === 'Dine-in' ? 'text-orange-700' : 'text-gray-600'}`}>Dine-in</span>
            </div>

            <div 
                onClick={() => setOrderType('Takeaway')}
                className={`p-6 rounded-2xl border-2 flex flex-col items-center gap-3 cursor-pointer transition-all ${
                    orderType === 'Takeaway' 
                    ? 'border-orange-500 bg-orange-50' 
                    : 'border-gray-100 bg-white hover:border-orange-200'
                }`}
            >
                <div className={`p-3 rounded-full ${orderType === 'Takeaway' ? 'bg-orange-500 text-white' : 'bg-gray-100 text-gray-600'}`}>
                    <ShoppingBag className="w-8 h-8" />
                </div>
                <span className={`font-bold ${orderType === 'Takeaway' ? 'text-orange-700' : 'text-gray-600'}`}>Takeaway</span>
            </div>
        </div>

        {orderType === 'Dine-in' && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-300">
                <label className="block text-sm font-bold text-gray-700 mb-2">Table Number</label>
                <input 
                    type="number" 
                    value={tableNumber}
                    onChange={(e) => setTableNumber(e.target.value)}
                    placeholder="Enter table number (e.g. 5)" 
                    className="w-full p-4 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-orange-500 text-lg"
                />
            </div>
        )}

        {/* Coupon Section */}
        <div className="mt-8">
            <h3 className="text-lg font-bold text-gray-800 mb-4">Offers & Coupons</h3>
            
            <div className="mb-6">
                <CouponInput 
                    onApply={handleApplyCoupon} 
                    onRemove={removeCoupon}
                    appliedCoupon={coupon}
                    loading={loading}
                />
            </div>

            {!coupon && coupons.length > 0 && (
                <div className="flex gap-4 overflow-x-auto pb-4 hide-scrollbar">
                    {coupons.map(c => (
                        <div key={c._id} className="min-w-[200px]">
                            <CouponCard coupon={c} onSelect={handleApplyCoupon} />
                        </div>
                    ))}
                </div>
            )}
        </div>

        {/* Bill Details */}
        <div className="mt-6 bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
            <h3 className="font-bold text-gray-800 mb-4">Bill Details</h3>
            <div className="flex justify-between text-gray-600 mb-2">
                <span>Subtotal</span>
                <span>₹{getCartTotal().toFixed(2)}</span>
            </div>
            {coupon && (
                <div className="flex justify-between text-green-600 mb-2">
                    <span>Coupon Discount ({coupon.code})</span>
                    <span>- ₹{coupon.discountAmount.toFixed(2)}</span>
                </div>
            )}
             <div className="flex justify-between text-gray-600 mb-2">
                <span>Taxes & Charges</span>
                <span>₹0.00</span>
            </div>
            <div className="border-t border-dashed border-gray-200 my-2 pt-2 flex justify-between font-bold text-lg text-gray-900">
                <span>Grand Total</span>
                <span>₹{getFinalTotal().toFixed(2)}</span>
            </div>
        </div>
      </div>

      <div className="fixed bottom-0 left-0 w-full bg-white border-t border-gray-100 p-4 z-20">
        <button 
            onClick={handlePlaceOrder}
            disabled={!orderType || (orderType === 'Dine-in' && !tableNumber) || loading}
            className={`w-full py-4 rounded-xl font-bold text-lg flex items-center justify-center gap-2 transition-all ${
                !orderType || (orderType === 'Dine-in' && !tableNumber) || loading
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed' 
                : 'bg-green-600 text-white shadow-lg shadow-green-200 hover:bg-green-700 active:scale-95'
            }`}
        >
            {loading ? 'Placing Order...' : 'Confirm Order'}
        </button>
      </div>
    </div>
  );
};

export default OrderType;
