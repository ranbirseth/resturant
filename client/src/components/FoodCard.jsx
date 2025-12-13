import React, { useContext } from 'react';
import { AppContext } from '../context/AppContext';
import { useNavigate } from 'react-router-dom';
import { Star, Plus } from 'lucide-react';

const FoodCard = ({ item }) => {
  const { addToCart } = useContext(AppContext);
  const navigate = useNavigate();

  const handleAddKey = (e) => {
    e.stopPropagation();
    addToCart(item);
  };

  return (
    <div 
      onClick={() => navigate(`/food/${item._id}`)}
      className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden cursor-pointer hover:shadow-md transition-all active:scale-95 duration-200"
    >
      <div className="relative h-48 w-full">
        <img 
          src={item.image} 
          alt={item.name} 
          className="w-full h-full object-cover"
        />
        <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-lg text-xs font-bold shadow-sm flex items-center gap-1">
          <Star className="w-3 h-3 text-yellow-500 fill-yellow-500" />
          {item.rating}
        </div>
        <div className={`absolute top-3 left-3 px-2 py-1 rounded-lg text-xs font-bold text-white shadow-sm ${item.category === 'Veg' ? 'bg-green-500' : 'bg-red-500'}`}>
          {item.category === 'Veg' ? 'VEG' : 'NON-VEG'}
        </div>
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
            className="bg-orange-100 text-orange-600 p-2 rounded-xl hover:bg-orange-500 hover:text-white transition-colors"
          >
            <Plus className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default FoodCard;
