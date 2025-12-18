import React, { useState } from 'react';
import { Plus, Edit2, Trash2, Search, Eye, EyeOff } from 'lucide-react';
import Card, { CardContent } from '../components/ui/Card';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';
import Input from '../components/ui/Input';
import Modal from '../components/ui/Modal';
import Table, { TableRow, TableCell } from '../components/ui/Table';

const initialCategories = [
  { id: 1, name: 'Main Course', itemCount: 12, isVisible: true },
  { id: 2, name: 'Starters', itemCount: 8, isVisible: true },
  { id: 3, name: 'Breads', itemCount: 5, isVisible: true },
  { id: 4, name: 'Beverages', itemCount: 6, isVisible: false },
  { id: 5, name: 'Desserts', itemCount: 4, isVisible: true },
];

export default function Categories() {
  const [categories, setCategories] = useState(initialCategories);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [name, setName] = useState('');

  const handleEdit = (cat) => {
    setEditingCategory(cat);
    setName(cat.name);
    setIsModalOpen(true);
  };

  const handleSave = () => {
    if (editingCategory) {
      setCategories(categories.map(c => c.id === editingCategory.id ? { ...c, name } : c));
    } else {
      setCategories([...categories, { id: Date.now(), name, itemCount: 0, isVisible: true }]);
    }
    setIsModalOpen(false);
    setName('');
  };

  const toggleVisibility = (id) => {
    setCategories(categories.map(c => c.id === id ? { ...c, isVisible: !c.isVisible } : c));
  };

  const handleDelete = (id) => {
    if (window.confirm('Delete category? This might affect existing items.')) {
      setCategories(categories.filter(c => c.id !== id));
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Categories</h1>
          <p className="text-slate-500 text-sm mt-1">Organize your menu into logical sections.</p>
        </div>
        <Button onClick={() => { setEditingCategory(null); setName(''); setIsModalOpen(true); }}>
          <Plus className="w-4 h-4 mr-2" />
          Add Category
        </Button>
      </div>

      <Card>
        <CardContent className="p-0">
          <Table headers={['Category Name', 'Items Count', 'Visibility', 'Actions']}>
            {categories.map((cat) => (
              <TableRow key={cat.id}>
                <TableCell className="font-bold text-slate-900">{cat.name}</TableCell>
                <TableCell>{cat.itemCount} items</TableCell>
                <TableCell>
                  <Badge variant={cat.isVisible ? 'green' : 'gray'}>
                    {cat.isVisible ? 'Visible' : 'Hidden'}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="flex items-center space-x-2">
                    <Button variant="ghost" size="icon" onClick={() => handleEdit(cat)}>
                      <Edit2 size={16} />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => toggleVisibility(cat.id)}>
                      {cat.isVisible ? <EyeOff size={16} /> : <Eye size={16} />}
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => handleDelete(cat.id)}>
                      <Trash2 size={16} className="text-rose-500" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </Table>
        </CardContent>
      </Card>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingCategory ? 'Edit Category' : 'Add Category'}
        footer={
          <div className="flex space-x-3 w-full">
            <Button variant="secondary" className="flex-1" onClick={() => setIsModalOpen(false)}>Cancel</Button>
            <Button className="flex-1" onClick={handleSave}>Save</Button>
          </div>
        }
      >
        <Input 
          label="Category Name" 
          value={name} 
          onChange={(e) => setName(e.target.value)} 
          placeholder="e.g. Italian Specials"
        />
      </Modal>
    </div>
  );
}
