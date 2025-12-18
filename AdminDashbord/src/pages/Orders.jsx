import React, { useState } from 'react';
import { 
  Eye, 
  MoreVertical, 
  Search, 
  Filter, 
  Clock, 
  CheckCircle2, 
  XCircle,
  Package,
  ChevronRight
} from 'lucide-react';
import Card, { CardContent, CardHeader } from '../components/ui/Card';
import Badge from '../components/ui/Badge';
import Button from '../components/ui/Button';
import Table, { TableRow, TableCell } from '../components/ui/Table';
import Modal from '../components/ui/Modal';
import { getOrders, updateOrderStatus } from '../services/orderService';

const initialOrders = [
  { 
    id: '#ORD-7829', 
    customer: 'Rahul Sharma', 
    type: 'Dine-in', 
    total: 1250, 
    status: 'Preparing', 
    time: '5 mins ago',
    items: [
      { name: 'Butter Chicken', qty: 1, price: 450 },
      { name: 'Garlic Naan', qty: 3, price: 150 },
      { name: 'Dal Makhani', qty: 1, price: 350 },
    ]
  },
  { 
    id: '#ORD-7830', 
    customer: 'Priya Patel', 
    type: 'Takeaway', 
    total: 820, 
    status: 'Pending', 
    time: '12 mins ago',
    items: [
      { name: 'Paneer Tikka', qty: 1, price: 320 },
      { name: 'Butter Naan', qty: 2, price: 100 },
      { name: 'Mango Lassi', qty: 2, price: 400 },
    ]
  },
  { 
    id: '#ORD-7831', 
    customer: 'Amit Verma', 
    type: 'Dine-in', 
    total: 2150, 
    status: 'Ready', 
    time: '20 mins ago',
    items: [
      { name: 'Mutton Rogan Josh', qty: 2, price: 1200 },
      { name: 'Pulao', qty: 1, price: 250 },
    ]
  },
  { 
    id: '#ORD-7832', 
    customer: 'Sneha Gupta', 
    type: 'Delivery', 
    total: 550, 
    status: 'Completed', 
    time: '45 mins ago',
    items: [
      { name: 'Veg Biryani', qty: 2, price: 550 },
    ]
  },
];

const statusVariants = {
  'Pending': 'amber',
  'Preparing': 'blue',
  'Ready': 'indigo',
  'Completed': 'green',
  'Cancelled': 'red'
};

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [filter, setFilter] = useState('All');

  React.useEffect(() => {
    fetchOrders();
    // Set up polling for real-time updates
    const interval = setInterval(fetchOrders, 30000); // every 30s
    return () => clearInterval(interval);
  }, []);

  const fetchOrders = async () => {
    try {
      const data = await getOrders();
      setOrders(data);
    } catch (error) {
      console.error('Failed to fetch orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredOrders = filter === 'All' 
    ? orders 
    : orders.filter(o => o.status === filter);

  const handleStatusUpdate = async (id, newStatus) => {
    try {
      const updated = await updateOrderStatus(id, { status: newStatus });
      setOrders(orders.map(o => o._id === id ? { ...o, status: newStatus } : o));
      if (selectedOrder?._id === id) {
        setSelectedOrder({ ...selectedOrder, status: newStatus });
      }
    } catch (error) {
      alert('Failed to update status');
    }
  };

  const openOrderDetails = (order) => {
    setSelectedOrder(order);
    setIsModalOpen(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Orders Management</h1>
          <p className="text-slate-500 text-sm mt-1">Manage and track all incoming and past orders.</p>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="secondary" className="hidden sm:flex items-center">
            <Package className="w-4 h-4 mr-2" />
            Export CSV
          </Button>
        </div>
      </div>

      <Card>
        <div className="p-4 border-b border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center space-x-2">
            {['All', 'Pending', 'Preparing', 'Ready', 'Completed'].map((s) => (
              <button
                key={s}
                onClick={() => setFilter(s)}
                className={`px-4 py-2 text-sm font-medium rounded-xl transition-all ${
                  filter === s 
                    ? 'bg-red-50 text-red-600' 
                    : 'text-slate-500 hover:bg-slate-50'
                }`}
              >
                {s}
              </button>
            ))}
          </div>
          <div className="relative w-full md:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search order ID or name..."
              className="w-full pl-9 pr-4 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-red-100 focus:border-red-400"
            />
          </div>
        </div>

        <CardContent className="p-0">
          <Table headers={['Order ID', 'Customer', 'Type', 'Table', 'Total', 'Status', 'Time', 'Actions']}>
            {loading ? (
               <TableRow><TableCell colSpan={8} className="py-10 text-center text-slate-400">Loading orders...</TableCell></TableRow>
            ) : filteredOrders.map((order) => (
              <TableRow key={order._id}>
                <TableCell className="font-bold text-slate-900 text-xs">#{order._id.slice(-6).toUpperCase()}</TableCell>
                <TableCell>{order.userId?.name || 'Guest'}</TableCell>
                <TableCell>{order.orderType}</TableCell>
                <TableCell className="font-medium text-slate-600">{order.tableNumber || '-'}</TableCell>
                <TableCell className="font-semibold">₹{order.totalAmount}</TableCell>
                <TableCell>
                  <Badge variant={statusVariants[order.status]}>{order.status}</Badge>
                </TableCell>
                <TableCell className="text-slate-400 flex items-center">
                  <Clock className="w-3 h-3 mr-1.5" />
                  {new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </TableCell>
                <TableCell>
                  <div className="flex items-center space-x-2">
                    <Button 
                      variant="ghost" 
                      size="icon"
                      onClick={() => openOrderDetails(order)}
                    >
                      <Eye size={18} />
                    </Button>
                    <div className="relative group">
                      <Button variant="ghost" size="icon">
                        <MoreVertical size={18} />
                      </Button>
                      <div className="absolute right-0 top-full mt-1 w-40 bg-white rounded-xl shadow-xl border border-slate-100 py-2 hidden group-hover:block z-50 transition-all opacity-0 group-hover:opacity-100 scale-95 group-hover:scale-100 origin-top-right">
                        {order.status === 'Pending' && (
                          <button 
                            className="w-full text-left px-4 py-2 text-sm hover:bg-slate-50 text-blue-600"
                            onClick={() => handleStatusUpdate(order._id, 'Preparing')}
                          >
                            Accept & Prepare
                          </button>
                        )}
                        {order.status === 'Preparing' && (
                          <button 
                            className="w-full text-left px-4 py-2 text-sm hover:bg-slate-50 text-indigo-600"
                            onClick={() => handleStatusUpdate(order._id, 'Ready')}
                          >
                            Mark as Ready
                          </button>
                        )}
                        {order.status === 'Ready' && (
                          <button 
                            className="w-full text-left px-4 py-2 text-sm hover:bg-slate-50 text-green-600"
                            onClick={() => handleStatusUpdate(order._id, 'Completed')}
                          >
                            Complete Order
                          </button>
                        )}
                        <button 
                          className="w-full text-left px-4 py-2 text-sm hover:bg-slate-100 text-rose-500"
                          onClick={() => handleStatusUpdate(order._id, 'Cancelled')}
                        >
                          Cancel Order
                        </button>
                      </div>
                    </div>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </Table>
          
          {filteredOrders.length === 0 && (
            <div className="py-20 text-center">
              <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
                <Search className="text-slate-300" size={32} />
              </div>
              <h3 className="text-slate-800 font-bold text-lg">No orders found</h3>
              <p className="text-slate-500">Try adjusting your filters or search query.</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Order Details Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={`Order Details - #${selectedOrder?._id.slice(-6).toUpperCase()}`}
        footer={
          <div className="flex space-x-3 w-full">
            <Button variant="secondary" className="flex-1" onClick={() => setIsModalOpen(false)}>Close</Button>
            {selectedOrder?.status === 'Pending' && (
               <Button className="flex-1" onClick={() => handleStatusUpdate(selectedOrder._id, 'Preparing')}>Accept Order</Button>
            )}
            {selectedOrder?.status === 'Preparing' && (
               <Button className="flex-1" onClick={() => handleStatusUpdate(selectedOrder._id, 'Ready')}>Ready for Pickup</Button>
            )}
          </div>
        }
      >
        {selectedOrder && (
          <div className="space-y-6">
            <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl">
              <div className="flex items-center">
                <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center text-red-600 mr-3">
                  <Package size={20} />
                </div>
                <div>
                  <p className="text-sm font-bold text-slate-800">{selectedOrder.userId?.name || 'Guest'}</p>
                  <p className="text-xs text-slate-500">
                    {selectedOrder.orderType} 
                    {selectedOrder.tableNumber && ` • Table ${selectedOrder.tableNumber}`} 
                    • {new Date(selectedOrder.createdAt).toLocaleTimeString()}
                  </p>
                </div>
              </div>
              <Badge variant={statusVariants[selectedOrder.status]}>{selectedOrder.status}</Badge>
            </div>

            <div className="space-y-4">
              <h4 className="text-sm font-bold text-slate-800 flex items-center uppercase tracking-wider">
                Order Items
                <span className="ml-2 h-px flex-1 bg-slate-100"></span>
              </h4>
              <div className="space-y-3">
                {selectedOrder.items.map((item, i) => (
                  <div key={i} className="flex justify-between items-center text-sm">
                    <div className="flex flex-col">
                      <div className="flex items-center">
                        <span className="w-6 h-6 rounded bg-slate-100 text-slate-600 flex items-center justify-center text-[10px] font-bold mr-3">{item.quantity}x</span>
                        <span className="text-slate-700 font-medium">{item.name}</span>
                      </div>
                      {item.customizations && item.customizations.length > 0 && (
                        <div className="flex flex-wrap gap-1 ml-9 mt-1">
                          {item.customizations.map((c, ci) => (
                            <span key={ci} className="text-[10px] bg-red-50 text-red-600 px-1.5 py-0.5 rounded-md border border-red-100">{c}</span>
                          ))}
                        </div>
                      )}
                    </div>
                    <span className="font-medium text-slate-900">₹{item.price * item.quantity}</span>
                  </div>
                ))}
              </div>
              <div className="pt-4 border-t border-slate-100 flex justify-between items-center">
                <span className="text-sm font-bold text-slate-800 text-lg">Total Amount</span>
                <span className="text-xl font-bold text-red-600">₹{selectedOrder.totalAmount}</span>
              </div>
            </div>
            
            {selectedOrder.orderType === 'Takeaway' && (
              <div className="space-y-2">
                <h4 className="text-sm font-bold text-slate-800 uppercase tracking-wider">Delivery Notes</h4>
                <p className="text-sm text-slate-500 bg-slate-50 p-3 rounded-xl italic">Ready for pickup in approx. 15 mins.</p>
              </div>
            )}
          </div>
        )}
      </Modal>
    </div>
  );
}
