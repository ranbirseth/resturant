import React from 'react';
import { X, Plus } from 'lucide-react';

const UpsellModal = ({ onClose, onAddItem, upsellItem }) => {
    if (!upsellItem) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white rounded-3xl w-full max-w-sm overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200 relative">
                 <button 
                    onClick={() => onClose()} 
                    className="absolute top-4 right-4 z-10 bg-black/10 hover:bg-black/20 p-2 rounded-full backdrop-blur-sm transition-all text-gray-700"
                >
                    <X size={20} />
                </button>

                <div className="relative h-48 bg-orange-50">
                     <img 
                        src={upsellItem.image} 
                        alt={upsellItem.name} 
                        className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                    <div className="absolute bottom-4 left-4 text-white">
                        <p className="text-sm font-medium opacity-90">Best with your order</p>
                        <h3 className="text-2xl font-bold leading-tight">{upsellItem.name}</h3>
                    </div>
                </div>

                <div className="p-6 pt-4">
                    <div className="flex items-center justify-between mb-6">
                        <div>
                             <p className="text-gray-500 text-sm">Add this for just</p>
                             <p className="text-3xl font-black text-gray-900">₹{upsellItem.price}</p>
                        </div>
                        <div className="h-12 w-12 bg-orange-100 rounded-full flex items-center justify-center">
                            <Plus className="text-orange-600 w-6 h-6" />
                        </div>
                    </div>

                    <div className="space-y-3">
                        <button 
                            onClick={() => onAddItem(upsellItem)}
                            className="w-full py-3.5 bg-orange-600 text-white rounded-xl font-bold text-lg shadow-lg shadow-orange-200 hover:bg-orange-700 active:scale-95 transition-all flex items-center justify-center gap-2"
                        >
                            <span>Add to Order</span>
                        </button>
                        
                        <button 
                            onClick={() => onClose()} 
                            className="w-full py-3 text-gray-400 font-medium text-sm hover:text-gray-600 transition-colors"
                        >
                            No thanks, skip
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UpsellModal;
