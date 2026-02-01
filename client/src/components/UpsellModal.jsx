import React, { useState, useEffect, useContext } from 'react';
import { X, Plus, ShoppingBag } from 'lucide-react';
import { AppContext } from '../context/AppContext';

const UpsellModal = ({ onClose, onAddItem, originalItem }) => {
    const { menuItems } = useContext(AppContext);
    const [upsellItem, setUpsellItem] = useState(null);

    useEffect(() => {
        if (!menuItems || menuItems.length === 0) return;

        let targetItem = null;
        let headline = "Complete your meal?";

        const originalCategory = originalItem.category ? originalItem.category.toUpperCase() : '';
        const originalName = originalItem.name ? originalItem.name.toUpperCase() : '';

        // Helper to find item by exact name match (partial) case-insensitive
        const findByName = (namePart) => menuItems.find(i => i.name && i.name.toUpperCase().includes(namePart.toUpperCase()));
        // Helper to find item by category
        const findByCategory = (cat) => menuItems.find(i => i.category && i.category.toUpperCase() === cat.toUpperCase());
        // Helper to find by category excluding current ID
        const  findByCategoryExclude = (cat) => menuItems.find(i => i.category && i.category.toUpperCase() === cat.toUpperCase() && i._id !== originalItem._id);

        // --- EXTENSIVE MATCHING LOGIC ---

        // 1. PIZZA (or Starters as proxy) -> Cold Drink > Soup
        if (originalCategory.includes('PIZZA') || originalCategory.includes('STARTER')) {
             targetItem = findByName('COLD DRINK');
             if (!targetItem) targetItem = findByCategory('BEVERAGE');
             if (!targetItem) targetItem = findByCategory('SOUP');
             headline = "Perfect with your starter!";
        }

        // 2. RICE -> Manchurian > Soup > Gravy
        else if (originalCategory.includes('RICE')) {
             targetItem = findByName('MANCHURIAN'); // Prefers "Veg Manchurian Gravy" etc
             if (!targetItem) targetItem = findByCategory('SOUP');
             headline = "Gravy pairs best with rice!";
        }

        // 3. NOODLES -> Manchurian > Spring Roll > Soup
        else if (originalCategory.includes('NOODLES')) {
             targetItem = findByName('MANCHURIAN');
             if (!targetItem) targetItem = findByName('SPRING ROLL');
             if (!targetItem) targetItem = findByCategory('SOUP');
             headline = "Complete your Chinese combo!";
        }

        // 4. BURGER / SANDWICH -> Cold Drink > Soup
        else if (originalCategory.includes('BURGER') || originalCategory.includes('SANDWICH')) {
             targetItem = findByName('COLD DRINK');
             if (!targetItem) targetItem = findByCategory('SOUP');
             headline = "Add a refreshing drink!";
        }

        // 5. BIRYANI -> Soup (Onion salad not found in DB)
        else if (originalCategory.includes('BIRYANI')) {
             targetItem = findByCategory('SOUP');
             headline = "Start with a hot soup!";
        }

        // 6. MAIN COURSE (GRAVY) -> Rice > Noodles
        else if (originalCategory === 'MAIN COURSE' || originalName.includes('GRAVY')) {
             targetItem = findByCategory('RICE');
             if (!targetItem) targetItem = findByCategory('NOODLES');
             headline = "Need rice or noodles with that?";
        }

        // 7. SALAD -> Soup > Spring Roll
        else if (originalCategory === 'SALAD') {
             targetItem = findByCategory('SOUP');
             if (!targetItem) targetItem = findByName('SPRING ROLL');
             headline = "Light & Healthy combo!";
        }
        
        // 8. PASTA -> Soup (Cheese not found)
        else if (originalCategory.includes('PASTA')) {
            targetItem = findByCategory('SOUP');
            headline = "Make it a full meal!";
        }

        // Fallback: Random Beverage/Dessert
        if (!targetItem) {
             const candidates = menuItems.filter(i => {
                const cat = i.category ? i.category.toUpperCase() : '';
                return (cat === 'BEVERAGE' || cat === 'DESSERT') && i._id !== originalItem._id;
             });
            if (candidates.length > 0) {
                targetItem = candidates[Math.floor(Math.random() * candidates.length)];
            }
        }

        setUpsellItem(targetItem);
    }, [menuItems, originalItem]);

    if (!upsellItem) return null; // Don't show if no item found

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white rounded-3xl w-full max-w-sm overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200 relative">
                 <button 
                    onClick={() => onClose(false)} 
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
                            onClick={() => onClose(false)} 
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
