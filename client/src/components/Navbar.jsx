import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppContext } from '../context/AppContext';
import { ShoppingBag, Search } from 'lucide-react';

const Navbar = ({ showSearch = false, searchTerm = '', setSearchTerm }) => {
  const { cart } = useContext(AppContext);
  const navigate = useNavigate();

  const cartCount = cart.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <div className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100 pb-2">
       <div className="flex items-center justify-between p-4">
            <h1 className="text-2xl font-black text-orange-500 tracking-tighter cursor-pointer" onClick={() => navigate('/home')}>
                Zink<span className="text-gray-800">Zaika</span>.
            </h1>
            <div className="relative cursor-pointer" onClick={() => navigate('/cart')}>
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
  );
};

export default Navbar;
