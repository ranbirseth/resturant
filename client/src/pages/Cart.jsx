import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppContext } from '../context/AppContext';
import { ArrowLeft, Trash2, ChevronRight } from 'lucide-react';

const Cart = () => {
    const { cart, removeFromCart, getCartTotal } = useContext(AppContext);
    const navigate = useNavigate();

    if (cart.length === 0) {
        return (
            <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
                <div className="w-20 h-20 bg-orange-100 rounded-full flex items-center justify-center mb-4">
                    <Trash2 className="w-8 h-8 text-orange-400" />
                </div>
                <h2 className="text-xl font-bold text-gray-800 mb-2">Your Cart is Empty</h2>
                <p className="text-gray-400 text-center mb-8 max-w-xs">Looks like you haven't added any food yet.</p>
                <button 
                    onClick={() => navigate('/home')}
                    className="bg-orange-500 text-white px-8 py-3 rounded-xl font-bold shadow-lg shadow-orange-200 hover:bg-orange-600 transition-all"
                >
                    Browse Menu
                </button>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 pb-28">
            <div className="sticky top-0 bg-white/80 backdrop-blur-md p-4 flex items-center gap-4 border-b border-gray-100 z-10">
                <button onClick={() => navigate(-1)} className="p-2 hover:bg-gray-100 rounded-full">
                    <ArrowLeft className="w-6 h-6 text-gray-800" />
                </button>
                <h1 className="text-xl font-bold text-gray-900">My Cart</h1>
            </div>

            <div className="p-4 space-y-4">
                {cart.map((item, index) => (
                    <div key={index} className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex gap-4">
                        <img src={item.image} alt={item.name} className="w-20 h-20 object-cover rounded-lg bg-gray-100" />
                        <div className="flex-1">
                            <div className="flex justify-between items-start">
                                <h3 className="font-bold text-gray-800 line-clamp-1">{item.name}</h3>
                                <button onClick={() => removeFromCart(index)} className="text-red-400 hover:text-red-600 p-1">
                                    <Trash2 className="w-4 h-4" />
                                </button>
                            </div>
                            <p className="text-xs text-gray-400 mb-2">₹{item.price} x {item.quantity}</p>
                            
                            {item.customizations && item.customizations.length > 0 && (
                                <div className="flex flex-wrap gap-1 mb-2">
                                    {item.customizations.map((cust, i) => (
                                        <span key={i} className="text-[10px] bg-gray-100 px-1.5 py-0.5 rounded text-gray-500">{cust}</span>
                                    ))}
                                </div>
                            )}

                             <div className="font-bold text-gray-900">₹{item.price * item.quantity}</div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Bill Details */}
            <div className="px-4 mt-4">
                <div className="bg-white p-4 rounded-xl border border-gray-100">
                    <h3 className="font-bold text-gray-800 mb-3 text-sm uppercase tracking-wide">Bill Details</h3>
                    <div className="flex justify-between text-sm text-gray-500 mb-2">
                        <span>Item Total</span>
                        <span>₹{getCartTotal()}</span>
                    </div>
                    <div className="flex justify-between text-sm text-gray-500 mb-2">
                        <span>Taxes & Charges</span>
                        <span>₹40</span>
                    </div>
                    <div className="h-px bg-gray-100 my-3" />
                    <div className="flex justify-between font-bold text-gray-900 text-lg">
                        <span>To Pay</span>
                        <span>₹{getCartTotal() + 40}</span>
                    </div>
                </div>
            </div>

            {/* Bottom Bar */}
            <div className="fixed bottom-0 left-0 w-full bg-white border-t border-gray-100 p-4 z-20">
                <button 
                    onClick={() => navigate('/customize/general')}
                    className="w-full bg-green-600 text-white py-4 rounded-xl font-bold text-lg shadow-lg shadow-green-200 flex items-center justify-center gap-2 hover:bg-green-700 active:scale-95 transition-all"
                >

                    <span>Proceed to Order</span>
                    <ChevronRight className="w-5 h-5" />
                </button>
            </div>
        </div>
    );
};

export default Cart;
