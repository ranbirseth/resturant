import React, { useContext, useState } from 'react';
import { AppContext } from '../context/AppContext';
import FoodCard from '../components/FoodCard';
import Navbar from '../components/Navbar';
import { Filter } from 'lucide-react';

const Home = () => {
  const { menuItems, loading } = useContext(AppContext);
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('All'); // All, Veg, Non-Veg

  const filteredItems = menuItems.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          item.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filter === 'All' ? true : item.category === filter;
    
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <Navbar showSearch={true} searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
      
      <div className="px-4 py-4">
        {/* Filters */}
        <div className="flex gap-2 overflow-x-auto pb-4 no-scrollbar">
            {['All', 'Veg', 'Non-Veg'].map(cat => (
                <button
                    key={cat}
                    onClick={() => setFilter(cat)}
                    className={`px-5 py-2 rounded-full font-semibold text-sm whitespace-nowrap transition-colors border ${
                        filter === cat 
                        ? 'bg-gray-800 text-white border-gray-800' 
                        : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-100'
                    }`}
                >
                    {cat}
                </button>
            ))}
        </div>

        {/* Menu Grid */}
        {loading ? (
            <div className="flex justify-center py-20 text-gray-400">Loading menu...</div>
        ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredItems.map(item => (
                    <FoodCard key={item._id} item={item} />
                ))}
                {filteredItems.length === 0 && (
                    <div className="col-span-full text-center py-10 text-gray-400">
                        No items found
                    </div>
                )}
            </div>
        )}
      </div>
    </div>
  );
};

export default Home;
