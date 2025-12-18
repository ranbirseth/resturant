import React, { useState } from 'react';
import { Plus, Search, Edit2, Trash2, Ticket, Calendar, CheckCircle2, XCircle } from 'lucide-react';
import Card, { CardContent, CardHeader } from '../components/ui/Card';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';
import Input from '../components/ui/Input';
import Modal from '../components/ui/Modal';
import Table, { TableRow, TableCell } from '../components/ui/Table';

const initialCoupons = [
  { id: 1, code: 'ZINK20', type: 'Percentage', value: 20, minOrder: 500, expiry: '2024-12-31', status: 'Active', usageCount: 45 },
  { id: 2, code: 'FLAT100', type: 'Flat', value: 100, minOrder: 800, expiry: '2024-12-15', status: 'Active', usageCount: 12 },
  { id: 3, code: 'WELCOME50', type: 'Percentage', value: 50, minOrder: 200, expiry: '2024-11-30', status: 'Expired', usageCount: 89 },
];

export default function Coupons() {
  const [coupons, setCoupons] = useState(initialCoupons);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    code: '',
    type: 'Percentage',
    value: '',
    minOrder: '',
    expiry: '',
    status: 'Active'
  });

  const handleSave = () => {
    setCoupons([...coupons, { ...formData, id: Date.now(), usageCount: 0 }]);
    setIsModalOpen(false);
  };

  const toggleStatus = (id) => {
    setCoupons(coupons.map(c => c.id === id ? { ...c, status: c.status === 'Active' ? 'Disabled' : 'Active' } : c));
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Coupons Management</h1>
          <p className="text-slate-500 text-sm mt-1">Create and manage discount offers for customers.</p>
        </div>
        <Button onClick={() => setIsModalOpen(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Create Coupon
        </Button>
      </div>

      <Card>
        <CardContent className="p-0">
          <Table headers={['Coupon Code', 'Discount', 'Min. Order', 'Expiry', 'Usage', 'Status', 'Actions']}>
            {coupons.map((coupon) => (
              <TableRow key={coupon.id}>
                <TableCell>
                  <div className="flex items-center">
                    <div className="w-8 h-8 rounded-lg bg-red-50 text-red-600 flex items-center justify-center mr-3">
                      <Ticket size={16} />
                    </div>
                    <span className="font-bold text-slate-900 tracking-wider">{coupon.code}</span>
                  </div>
                </TableCell>
                <TableCell>
                  <span className="font-medium text-slate-700">
                    {coupon.type === 'Percentage' ? `${coupon.value}% OFF` : `₹${coupon.value} OFF`}
                  </span>
                </TableCell>
                <TableCell>₹{coupon.minOrder}</TableCell>
                <TableCell>
                  <div className="flex items-center text-slate-600">
                    <Calendar size={14} className="mr-1.5" />
                    {coupon.expiry}
                  </div>
                </TableCell>
                <TableCell>
                   <span className="text-slate-600">{coupon.usageCount} times Used</span>
                </TableCell>
                <TableCell>
                  <Badge variant={coupon.status === 'Active' ? 'green' : coupon.status === 'Expired' ? 'red' : 'gray'}>
                    {coupon.status}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="flex items-center space-x-2">
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      onClick={() => toggleStatus(coupon.id)}
                      disabled={coupon.status === 'Expired'}
                    >
                      {coupon.status === 'Active' ? <XCircle size={18} className="text-slate-400" /> : <CheckCircle2 size={18} className="text-green-600" />}
                    </Button>
                    <Button variant="ghost" size="icon">
                      <Trash2 size={18} className="text-rose-500" />
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
        title="Create New Coupon"
        footer={
          <div className="flex space-x-3 w-full">
            <Button variant="secondary" className="flex-1" onClick={() => setIsModalOpen(false)}>Cancel</Button>
            <Button className="flex-1" onClick={handleSave}>Create Coupon</Button>
          </div>
        }
      >
        <div className="space-y-4">
          <Input 
            label="Coupon Code" 
            placeholder="e.g. SAVE30" 
            value={formData.code} 
            onChange={e => setFormData({...formData, code: e.target.value.toUpperCase()})}
          />
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-slate-700">Type</label>
              <select 
                className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-red-100 focus:border-red-400"
                value={formData.type}
                onChange={e => setFormData({...formData, type: e.target.value})}
              >
                <option value="Percentage">Percentage (%)</option>
                <option value="Flat">Flat Amount (₹)</option>
              </select>
            </div>
            <Input 
              label="Value" 
              type="number" 
              placeholder="e.g. 20" 
              value={formData.value}
              onChange={e => setFormData({...formData, value: e.target.value})}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Input 
              label="Min Order Value (₹)" 
              type="number" 
              placeholder="e.g. 500" 
              value={formData.minOrder}
              onChange={e => setFormData({...formData, minOrder: e.target.value})}
            />
            <Input 
              label="Expiry Date" 
              type="date" 
              value={formData.expiry}
              onChange={e => setFormData({...formData, expiry: e.target.value})}
            />
          </div>
        </div>
      </Modal>
    </div>
  );
}
