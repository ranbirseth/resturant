import React, { useContext, useState, useCallback } from 'react';
import { AppContext } from '../context/AppContext';
import { useNavigate } from 'react-router-dom';
import { Star, Plus } from 'lucide-react';
import UpsellModal from './UpsellModal';
import { findUpsellItem } from '../utils/upsellHelper';

const FoodCard = ({ item }) => {
  const { addToCart, menuItems } = useContext(AppContext);
  const navigate = useNavigate();
  const [showUpsell, setShowUpsell] = useState(false);
  const [targetUpsell, setTargetUpsell] = useState(null);

  const handleAddKey = (e) => {
    e.stopPropagation();
    
    const excludedCategories = ['BEVERAGE', 'DESSERT', 'ICE CREAM', 'ROLLS']; 
    const itemCat = item.category.toUpperCase();

    if (!excludedCategories.includes(itemCat)) {
        // Try to find upsell
        const upsell = findUpsellItem(item, menuItems);
        if (upsell) {
            setTargetUpsell(upsell);
            setShowUpsell(true);
        } else {
            addToCart(item);
        }
    } else {
      addToCart(item);
    }
  };

  const handleUpsellClose = useCallback(() => {
    setShowUpsell(false);
    addToCart(item);
  }, [addToCart, item]);

  const handleAddUpsellItem = (upsellItem) => {
    addToCart(upsellItem); // Add the upsell item
    addToCart(item);       // Add the original item
    setShowUpsell(false);  // Close modal
  };

  return (
    <>
      {showUpsell && targetUpsell && (
        <UpsellModal 
          onClose={handleUpsellClose} 
          onAddItem={handleAddUpsellItem}
          upsellItem={targetUpsell}
        />
      )}
      <div 
        onClick={() => navigate(`/food/${item._id}`)}
        className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden cursor-pointer hover:shadow-md transition-all active:scale-95 duration-200"
      >
        <div className="relative h-48 w-full">
          <img 
            src={item.image} 
            alt={item.name} 
            className={`w-full h-full object-cover ${!item.available ? 'grayscale opacity-60' : ''}`}
          />
          <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-lg text-xs font-bold shadow-sm flex items-center gap-1">
            <Star className="w-3 h-3 text-yellow-500 fill-yellow-500" />
            {item.rating}
          </div>
          {!item.available && (
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="bg-black/70 text-white px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
                Sold Out
              </span>
            </div>
          )}
        </div>
        <div className="p-4">
          <div className="flex justify-between items-start mb-2">
            <h3 className="font-bold text-gray-800 text-lg leading-tight line-clamp-1">{item.name}</h3>
          </div>
          <p className="text-gray-500 text-sm line-clamp-2 mb-3 h-10">{item.description}</p>
          <div className="flex items-center justify-between mt-2">
            <span className="text-lg font-bold text-gray-900">₹{item.price}</span>
            <button 
              onClick={handleAddKey}
              disabled={!item.available}
              className={`p-2 rounded-xl transition-colors ${
                item.available 
                  ? 'bg-orange-100 text-orange-600 hover:bg-orange-500 hover:text-white' 
                  : 'bg-gray-100 text-gray-400 cursor-not-allowed'
              }`}
            >
              <Plus className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default FoodCard;
