import React, { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppContext } from '../context/AppContext';
import { ShoppingBag, Search, Menu, X } from 'lucide-react';

const Navbar = ({ showSearch = false, searchTerm = '', setSearchTerm }) => {
  const { cart, categories, selectedCategory, setSelectedCategory } = useContext(AppContext);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();

  const cartCount = cart.reduce((acc, item) => acc + item.quantity, 0);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  const handleCategorySelect = (categoryName) => {
    setSelectedCategory(categoryName);
    setIsMenuOpen(false);
    navigate('/home');
  };

  return (
    <>
      <div className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100 pb-2">
        <div className="flex items-center justify-between p-4 relative">
          {/* Hamburger Menu Icon */}
          <div className="cursor-pointer p-1" onClick={toggleMenu}>
            <Menu className="w-6 h-6 text-gray-700" />
          </div>

          {/* Centered Logo */}
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-center">
            <h1 className="text-2xl font-black text-orange-500 tracking-tighter cursor-pointer" onClick={() => navigate('/home')}>
              Zink<span className="text-gray-800">Zaika</span>.
            </h1>
          </div>

          {/* Cart Icon */}
          <div className="relative cursor-pointer p-1" onClick={() => navigate('/cart')}>
            <ShoppingBag className="w-6 h-6 text-gray-700" />
            {cartCount > 0 && (
              <div className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold w-4 h-4 rounded-full flex items-center justify-center">
                {cartCount}
              </div>
            )}
          </div>
        </div>

        {showSearch && (
          <div className="px-4 pb-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input 
                type="text" 
                placeholder="Search for food..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-gray-100 pl-10 pr-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 transition-all font-medium"
              />
            </div>
          </div>
        )}
      </div>

      {/* Category Menu Popup */}
      {isMenuOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
          {/* Backdrop Blur Overlay */}
          <div 
            className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-all duration-300"
            onClick={toggleMenu}
          ></div>

          {/* Popup Content */}
          <div className="relative bg-white w-full max-w-sm rounded-[2.5rem] p-8 shadow-2xl transform scale-100 transition-transform duration-300 overflow-hidden">
            <button 
              onClick={toggleMenu}
              className="absolute top-6 right-6 p-2 rounded-full bg-gray-100 text-gray-500 hover:bg-gray-200 transition-colors"
            >
              <X size={20} />
            </button>

            <div className="mb-8">
              <h2 className="text-2xl font-black text-gray-800 tracking-tight mb-2">Explore</h2>
              <p className="text-gray-500 font-medium">Choose your favorite category</p>
            </div>

            <div className="space-y-3 max-h-[60vh] overflow-y-auto no-scrollbar pr-1">
              <button
                onClick={() => handleCategorySelect('All')}
                className={`w-full flex items-center justify-between p-5 rounded-3xl transition-all duration-200 border-2 ${
                  selectedCategory === 'All' 
                  ? 'bg-orange-50 border-orange-500 text-orange-600' 
                  : 'bg-gray-50 border-transparent text-gray-700 hover:border-gray-200'
                }`}
              >
                <span className="font-bold text-lg">All Items</span>
                {selectedCategory === 'All' && <div className="w-2 h-2 bg-orange-500 rounded-full"></div>}
              </button>

              {categories.map((cat) => (
                <button
                  key={cat._id}
                  onClick={() => handleCategorySelect(cat.name)}
                  className={`w-full flex items-center justify-between p-5 rounded-3xl transition-all duration-200 border-2 ${
                    selectedCategory === cat.name 
                    ? 'bg-orange-50 border-orange-500 text-orange-600' 
                    : 'bg-gray-50 border-transparent text-gray-700 hover:border-gray-200'
                  }`}
                >
                  <span className="font-bold text-lg">{cat.name}</span>
                  {selectedCategory === cat.name && <div className="w-2 h-2 bg-orange-500 rounded-full"></div>}
                </button>
              ))}
            </div>
            
            <div className="mt-8 pt-6 border-t border-gray-100 flex justify-center">
              <p className="text-sm font-bold text-gray-400">ZINK ZAIKA MENU</p>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;
