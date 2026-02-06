import React, { useContext, useState } from 'react';
import { AppContext } from '../context/AppContext';
import FoodCard from '../components/FoodCard';
import Navbar from '../components/Navbar';
import { Filter, X } from 'lucide-react';

const Home = () => {
  const { menuItems, loading, selectedCategory, setSelectedCategory } = useContext(AppContext);
  const [searchTerm, setSearchTerm] = useState('');

  const filteredItems = menuItems.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          item.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = selectedCategory === 'All' || item.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <Navbar showSearch={true} searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
      
      <div className="px-4 py-4">
        {/* Selected Category Indicator */}
        {selectedCategory !== 'All' && (
            <div className="flex items-center justify-between bg-orange-50 border border-orange-100 rounded-2xl px-5 py-3 mb-6">
                <div className="flex items-center">
                    <span className="text-sm font-medium text-gray-500 mr-2">Category:</span>
                    <span className="font-bold text-orange-600">{selectedCategory}</span>
                </div>
                <button 
                    onClick={() => setSelectedCategory('All')}
                    className="p-1 rounded-full bg-white text-orange-500 shadow-sm border border-orange-100"
                >
                    <X size={16} />
                </button>
            </div>
        )}

        {/* Menu Grid */}
        {loading ? (
            <div className="flex justify-center py-20 text-gray-400">
                <div className="animate-pulse flex flex-col items-center">
                    <div className="w-12 h-12 bg-gray-200 rounded-full mb-4"></div>
                    <div className="h-4 w-24 bg-gray-200 rounded"></div>
                </div>
            </div>
        ) : (
            <div className="space-y-10">
                {Object.keys(filteredItems.reduce((acc, item) => {
                    if (!acc[item.category]) acc[item.category] = [];
                    acc[item.category].push(item);
                    return acc;
                }, {})).length === 0 ? (
                    <div className="text-center py-20">
                        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Filter className="text-gray-300" size={32} />
                        </div>
                        <h3 className="text-gray-800 font-bold text-lg">No items found</h3>
                        <p className="text-gray-500">Try changing your search or category.</p>
                    </div>
                ) : (
                    Object.entries(filteredItems.reduce((acc, item) => {
                        if (!acc[item.category]) acc[item.category] = [];
                        acc[item.category].push(item);
                        return acc;
                    }, {})).map(([category, items]) => (
                        <div key={category}>
                            <div className="flex items-center mb-5">
                                <h2 className="text-2xl font-black text-gray-800 tracking-tight">{category}</h2>
                                <div className="ml-4 h-0.5 flex-1 bg-gradient-to-r from-gray-200 to-transparent"></div>
                                <span className="ml-4 text-xs font-bold text-gray-400 uppercase tracking-widest">{items.length} items</span>
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                                {items.map(item => (
                                    <FoodCard key={item._id} item={item} />
                                ))}
                            </div>
                        </div>
                    ))
                )}
            </div>
        )}
      </div>
    </div>
  );
};

export default Home;
