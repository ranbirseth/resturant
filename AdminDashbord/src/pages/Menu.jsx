import React, { useState, useRef } from 'react';
import { SOCKET_URL } from '../config';
import { 
  Plus, 
  Search, 
  Edit2, 
  Trash2, 
  Image as ImageIcon,
  ChevronRight,
  Filter,
  Check,
  X
} from 'lucide-react';
import Card, { CardContent } from '../components/ui/Card';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';
import Input from '../components/ui/Input';
import Modal from '../components/ui/Modal';
import { getItems, createItem, updateItem, deleteItem } from '../services/itemService';

const categories = ['All', 'Main Course', 'Starters', 'Breads', 'Beverages', 'Desserts', 'Veg', 'Non-Veg'];

export default function Menu() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  
  // Form State
  const [formData, setFormData] = useState({
    name: '',
    category: 'Main Course',
    price: '',
    description: '',
    isVeg: true,
    available: true,
    image: null
  });

  const fileInputRef = useRef(null);

  const getImageUrl = (imagePath) => {
    if (!imagePath) return null;
    if (typeof imagePath === 'string' && imagePath.startsWith('http')) return imagePath;
    if (typeof imagePath === 'string') return `${SOCKET_URL}${imagePath}`;
    if (imagePath instanceof File) return URL.createObjectURL(imagePath);
    return null;
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData({ ...formData, image: file });
    }
  };

  React.useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    try {
      setLoading(true);
      const data = await getItems();
      setItems(data);
    } catch (error) {
      console.error('Failed to fetch items:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredItems = items.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === 'All' || item.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const handleEdit = (item) => {
    setEditingItem(item);
    setFormData({ ...item });
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this item?')) {
      try {
        await deleteItem(id);
        setItems(items.filter(item => item._id !== id));
      } catch (error) {
        alert('Failed to delete item');
      }
    }
  };

  const handleToggleAvailability = async (item) => {
    try {
      const updated = await updateItem(item._id, { ...item, available: !item.available });
      setItems(items.map(i => i._id === item._id ? updated : i));
    } catch (error) {
      alert('Failed to update availability');
    }
  };

  const handleSave = async () => {
    try {
      const data = new FormData();
      Object.keys(formData).forEach(key => {
        if (key === 'image') {
           if (formData[key]) data.append(key, formData[key]);
        } else {
           data.append(key, formData[key]);
        }
      });

      if (editingItem) {
        const updated = await updateItem(editingItem._id, data);
        setItems(items.map(item => item._id === editingItem._id ? updated : item));
      } else {
        const created = await createItem(data);
        setItems([...items, created]);
      }
      setIsModalOpen(false);
      setEditingItem(null);
    } catch (error) {
      alert('Failed to save item');
      console.error(error);
    }
  };

  const openAddModal = () => {
    setEditingItem(null);
    setFormData({
      name: '',
      category: 'Main Course',
      price: '',
      description: '',
      isVeg: true,
      available: true,
      image: null
    });
    setIsModalOpen(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Menu Management</h1>
          <p className="text-slate-500 text-sm mt-1">Add, edit or remove food items from your menu.</p>
        </div>
        <Button onClick={openAddModal} className="w-full sm:w-auto">
          <Plus className="w-4 h-4 mr-2" />
          Add New Item
        </Button>
      </div>

      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Search food items..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-red-100 focus:border-red-400"
          />
        </div>
        <div className="flex items-center space-x-2 overflow-x-auto pb-2 md:pb-0">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setCategoryFilter(cat)}
              className={`px-4 py-2 text-sm font-medium rounded-xl whitespace-nowrap transition-all ${
                categoryFilter === cat 
                  ? 'bg-slate-900 text-white' 
                  : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {loading ? (
           <div className="col-span-full py-20 text-center text-slate-400">Loading menu...</div>
        ) : filteredItems.length === 0 ? (
           <div className="col-span-full py-20 text-center text-slate-400">No items found.</div>
        ) : filteredItems.map((item) => (
          <Card key={item._id} className="overflow-hidden group">
            <div className="aspect-video bg-slate-100 relative">
              {item.image ? (
                <img src={getImageUrl(item.image)} alt={item.name} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center text-slate-400">
                  <ImageIcon size={40} strokeWidth={1} />
                  <p className="text-xs mt-2">No image available</p>
                </div>
              )}
              <div className="absolute top-3 left-3 flex space-x-2">
                <Badge variant={item.isVeg ? 'green' : 'red'}>
                  {item.isVeg ? 'Veg' : 'Non-Veg'}
                </Badge>
                {!item.available && (
                   <Badge variant="amber">Unavailable</Badge>
                )}
              </div>
            </div>
            <CardContent className="p-5">
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-bold text-slate-800">{item.name}</h3>
                <span className="text-lg font-bold text-red-600">₹{item.price}</span>
              </div>
              <p className="text-sm text-slate-500 line-clamp-2 mb-4 h-10">{item.description}</p>
              
              <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                <div className="flex space-x-2">
                  <Button variant="ghost" size="icon" onClick={() => handleEdit(item)}>
                    <Edit2 size={16} className="text-slate-600" />
                  </Button>
                  <Button variant="ghost" size="icon" onClick={() => handleDelete(item._id)}>
                    <Trash2 size={16} className="text-rose-500" />
                  </Button>
                </div>
                <div className="flex items-center space-x-2">
                   <span className="text-xs text-slate-500 font-medium">Availability</span>
                   <button 
                    onClick={() => handleToggleAvailability(item)}
                    className={`w-10 h-5 rounded-full transition-colors relative ${item.available ? 'bg-green-500' : 'bg-slate-300'}`}
                   >
                     <div className={`absolute top-1 w-3 h-3 bg-white rounded-full transition-all ${item.available ? 'left-6' : 'left-1'}`} />
                   </button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingItem ? 'Edit Menu Item' : 'Add New Menu Item'}
        footer={
          <div className="flex space-x-3 w-full">
            <Button variant="secondary" className="flex-1" onClick={() => setIsModalOpen(false)}>Cancel</Button>
            <Button className="flex-1" onClick={handleSave}>Save Item</Button>
          </div>
        }
      >
        <div className="space-y-4">
          <div 
             className="flex flex-col items-center justify-center border-2 border-dashed border-slate-200 rounded-2xl p-8 hover:border-red-300 transition-colors cursor-pointer bg-slate-50 relative overflow-hidden"
             onClick={() => fileInputRef.current.click()}
          >
             <input 
               type="file" 
               ref={fileInputRef} 
               className="hidden" 
               onChange={handleFileChange} 
               accept="image/*"
             />
             {formData.image ? (
               <img src={getImageUrl(formData.image)} alt="Preview" className="absolute inset-0 w-full h-full object-cover" />
             ) : (
               <>
                 <ImageIcon size={32} className="text-slate-400 mb-2" />
                 <p className="text-sm font-medium text-slate-600">Click to upload product image</p>
                 <p className="text-xs text-slate-400 mt-1">Max size 2MB, JPG/PNG</p>
               </>
             )}
          </div>

          <Input 
            label="Item Name" 
            placeholder="e.g. Butter Chicken" 
            value={formData.name}
            onChange={(e) => setFormData({...formData, name: e.target.value})}
          />
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-slate-700">Category</label>
              <select 
                className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-red-100 focus:border-red-400"
                value={formData.category}
                onChange={(e) => setFormData({...formData, category: e.target.value})}
              >
                {categories.slice(1).map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <Input 
              label="Price (₹)" 
              type="number" 
              placeholder="0.00" 
              value={formData.price}
              onChange={(e) => setFormData({...formData, price: e.target.value})}
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-medium text-slate-700">Description</label>
            <textarea 
              className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-red-100 focus:border-red-400 min-h-[100px]"
              placeholder="Describe the dish..."
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
            />
          </div>

          <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl">
             <div className="flex items-center space-x-3">
                <button 
                  onClick={() => setFormData({...formData, isVeg: true})}
                  className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-all ${formData.isVeg ? 'bg-green-600 border-green-600 text-white' : 'border-slate-300'}`}
                >
                  {formData.isVeg && <Check size={14} strokeWidth={4} />}
                </button>
                <span className="text-sm font-medium text-slate-700">Vegetarian</span>
             </div>
             <div className="flex items-center space-x-3">
                <button 
                  onClick={() => setFormData({...formData, isVeg: false})}
                  className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-all ${!formData.isVeg ? 'bg-red-600 border-red-600 text-white' : 'border-slate-300'}`}
                >
                  {!formData.isVeg && <Check size={14} strokeWidth={4} />}
                </button>
                <span className="text-sm font-medium text-slate-700">Non-Veg</span>
             </div>
          </div>
        </div>
      </Modal>
    </div>
  );
}
