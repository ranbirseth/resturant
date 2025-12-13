import React, { useContext, useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { AppContext } from '../context/AppContext';

import { ArrowLeft, Star, Clock, Minus, Plus } from 'lucide-react';

const FoodDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { menuItems, addToCart } = useContext(AppContext);
    const [item, setItem] = useState(null);
    const [quantity, setQuantity] = useState(1);

    useEffect(() => {
        const found = menuItems.find(i => i._id === id);
        if (found) setItem(found);
    }, [id, menuItems]);

    if (!item) return <div className="p-10 text-center">Loading or Item not found...</div>;

    const handleAddToCart = () => {
        addToCart(item, quantity);
        navigate('/cart');
    };

    return (
        <div className="min-h-screen bg-gray-50 pb-24">
             {/* Header */}
             <div className="relative h-72 w-full">
                <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                <button 
                    onClick={() => navigate(-1)}
                    className="absolute top-4 left-4 bg-white/50 backdrop-blur-md p-2 rounded-full hover:bg-white"
                >
                    <ArrowLeft className="w-6 h-6 text-gray-800" />
                </button>
             </div>

             <div className="px-5 py-6 -mt-10 relative bg-white rounded-t-3xl min-h-[50vh]">
                <div className="w-12 h-1 bg-gray-300 rounded-full mx-auto mb-4" />
                
                <div className="flex justify-between items-start mb-2">
                    <h1 className="text-2xl font-bold text-gray-800">{item.name}</h1>
                    <div className="flex items-center gap-1 bg-green-50 px-2 py-1 rounded-lg">
                        <Star className="w-4 h-4 text-green-600 fill-green-600" />
                        <span className="font-bold text-green-700 text-sm">{item.rating}</span>
                    </div>
                </div>

                <div className="flex items-center gap-2 mb-6">
                    <span className={`px-2 py-0.5 rounded text-xs font-bold ${item.category === 'Veg' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                        {item.category.toUpperCase()}
                    </span>
                    <span className="text-gray-400 text-xs">•</span>
                    <div className="flex items-center gap-1 text-gray-500 text-xs">
                        <Clock className="w-3 h-3" />
                        <span>20-25 min</span>
                    </div>
                </div>

                <p className="text-gray-500 leading-relaxed mb-8">{item.description}</p>

                <div className="bg-gray-50 p-4 rounded-xl mb-20">
                    <div className="flex justify-between items-center">
                        <span className="font-bold text-gray-800">Quantity</span>
                        <div className="flex items-center gap-4 bg-white px-3 py-2 rounded-lg shadow-sm border border-gray-100">
                            <button 
                                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                className="p-1 hover:bg-gray-100 rounded"
                            >
                                <Minus className="w-4 h-4 text-gray-600" />
                            </button>
                            <span className="font-bold w-4 text-center">{quantity}</span>
                            <button 
                                onClick={() => setQuantity(quantity + 1)}
                                className="p-1 hover:bg-gray-100 rounded"
                            >
                                <Plus className="w-4 h-4 text-gray-600" />
                            </button>
                        </div>
                    </div>
                </div>

                {/* Bottom Action Bar */}
                <div className="fixed bottom-0 left-0 w-full bg-white border-t border-gray-100 p-4 px-6 flex items-center justify-between z-10">
                    <div>
                        <p className="text-xs text-gray-400 font-medium uppercase mb-0.5">Total Price</p>
                        <p className="text-2xl font-black text-gray-900">₹{item.price * quantity}</p>
                    </div>
                    <button 
                        onClick={handleAddToCart}
                        className="bg-gray-900 text-white px-8 py-3.5 rounded-xl font-bold hover:bg-gray-800 active:scale-95 transition-all shadow-lg shadow-gray-200"
                    >
                        Add to Cart
                    </button>
                </div>
             </div>
        </div>
    );
};

export default FoodDetails;
